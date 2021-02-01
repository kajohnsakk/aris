import * as elasticsearch from "elasticsearch";
import rp from "request-promise-native";
import { Log } from "../ts-utils/Log";

const INDEX: string = process.env.db_index;
const ELASTICSEARCH_ENDPOINT = process.env.nes;
const ENDPOINT_URL: string = "https://" + ELASTICSEARCH_ENDPOINT + "/" + INDEX;

// const updateIdCache = {};
export interface ElasticsearchQueryResultDocument {
  _id: string;
  _score: number;
  _source: any;
}
export class ElasticsearchClient {
  private static mInstance: ElasticsearchClient;

  public static getInstance(): ElasticsearchClient {
    if (!this.mInstance) this.mInstance = new ElasticsearchClient();
    return this.mInstance;
  }

  private client: elasticsearch.Client;

  constructor() {
    this.client = new elasticsearch.Client({
      host: "https://" + ELASTICSEARCH_ENDPOINT,
      httpAuth: process.env.nuser + ":" + process.env.npwd,
      // log: 'debug'
    });
    // setTimeout(()=>{
    //      require("../flow").ensureSearchTerm();
    // }, 5000);
    this.initMapping();
    Log.debug("Elasticsearch client created with index ", INDEX);
  }

  private initMapping() {
    Log.debug("initing elasticsearch mapping");
    this.client.indices.putSettings(
      {
        index: INDEX,
        body: {
          "index.mapping.total_fields.limit": 5000,
        },
      },
      (err, response) => {
        if (err) {
          Log.error("Error while initing setting for index ", err);
        } else {
          Log.debug("Index setting successfully inited");
        }
      }
    );
  }

  aggregate(type: string, query: any, aggregate: any, option?: any) {
    return new Promise((resolve) => {
      if (!option) option = {};
      if (!query) query = { match_all: {} };
      const body = {
        query: query,
        aggs: {
          aggregatelist: aggregate,
        },
      };
      Log.debug("elastic aggregate type ", type, " with body ", body);
      this.client.search(
        {
          index: INDEX,
          type: type,
          size: option.size || 30,
          body: body,
        },
        (err, res) => {
          if (
            err ||
            !res ||
            !res.aggregations ||
            !res.aggregations.aggregatelist ||
            !res.aggregations.aggregatelist.buckets
          ) {
            Log.error(
              "Error ",
              err,
              " while aggregating with type ",
              type,
              " body ",
              aggregate,
              " with res ",
              res
            );
            resolve();
          } else {
            resolve(res.aggregations.aggregatelist.buckets);
          }
        }
      );
    });
  }

  search(
    type: string,
    body: any,
    option?: any
  ): Promise<ElasticsearchQueryResultDocument[]> {
    return new Promise((resolve, reject) => {
      if (!option) option = {};
      if (!option._retryCount) option._retryCount = 0;
      if (!option.isDocs) option.isDocs = false;
      if (option.autoScroll === undefined) option.autoScroll = true;
      // Log.debug("elastic search type ",type," body ",body, " option ",option);
      const size =
        option && option.size ? option.size : body.size ? body.size : 10000;
      const from = option && option.from ? option.from : 0;
      this.client.search(
        {
          index: option.isDocs ? INDEX + "-docs" : INDEX,
          type: type,
          size: size,
          scroll: from == 0 ? "3m" : null,
          from: from,
          body: body,
        },
        (err, resp) => {
          if (err || !resp.hits || !resp.hits.hits) {
            if (
              err.message == "No Living connections" &&
              option._retryCount < 6
            ) {
              option._retryCount++;
              Log.error(
                "Error " +
                  err.message +
                  ", retrying in 500ms for the " +
                  option._retryCount +
                  " times"
              );
              setTimeout(() => {
                this.search(type, body, option).then(resolve).catch(reject);
              }, 500);
            } else {
              Log.error(
                "error ",
                err,
                " while querying type ",
                type,
                " with body ",
                body,
                " resp is ",
                resp
              );
              resolve([]);
            }
          } else {
            if (resp._scroll_id && resp.hits.hits.length == 10000) {
              if (option.autoScroll) {
                this.scroll(resp._scroll_id, resp.hits.hits, option).then(
                  resolve
                );
              } else {
                // put scroll id into option for future scrolling
                option.scroll_id = resp._scroll_id;
                resolve(resp.hits.hits);
              }
            } else resolve(resp.hits.hits);
          }
        }
      );
    });
  }
  scroll(
    scrollId: string,
    array: ElasticsearchQueryResultDocument[],
    option: any
  ): Promise<ElasticsearchQueryResultDocument[]> {
    if (!option) {
      option = {};
    }
    Log.debug("scrolling on scrollId " + scrollId);
    if (option.autoScroll === undefined) {
      option.autoScroll = true;
    }
    return this.client
      .scroll({
        scrollId: scrollId,
        scroll: "5m",
      })
      .then((resp: any) => {
        if (!resp || !resp.hits || !resp.hits.hits) {
          Log.error("error while scrolling resp is ", resp);
          return Promise.reject("error while scrolling");
        } else if (resp.hits.hits.length == 0) {
          Log.debug("scrolling finished with total length " + array.length);
          return Promise.resolve(array);
        } else if (option.autoScroll) {
          array.push(...resp.hits.hits);
          return this.scroll(scrollId, array, option);
        } else {
          array.push(...resp.hits.hits);
          return Promise.resolve(resp.hits.hits);
        }
      });
  }

  count(type: string, body: any): Promise<number> {
    return new Promise((resolve) => {
      Log.debug("elastic count type ", type, " body ", body);
      this.client.search(
        {
          index: INDEX,
          type: type,
          size: 0,
          body: body,
        },
        (err, resp) => {
          if (err || !resp.hits) {
            Log.error(
              "error ",
              err,
              " while querying type ",
              type,
              " with body ",
              body,
              " resp is ",
              resp
            );
            resolve(0);
          } else {
            // Log.debug("flow query result is ", resp.hits.hits);
            resolve(resp.hits.total);
          }
        }
      );
    });
  }

  update(type: string, id: string, body: any, upsert: boolean, option?: any) {
    if (!option) option = {};
    if (!option.isDocs) option.isDocs = false;
    return new Promise((resolve) => {
      if (!this.client) {
        Log.debug("elasticsearch is not enabled, not updating ", type);
        return;
      }
      body = JSON.parse(JSON.stringify(body));
      delete body._id;
      this.client.update(
        {
          index: option.isDocs ? INDEX + "-docs" : INDEX,
          type: type,
          retryOnConflict: 3,
          id: id,
          _source: "true",
          body: {
            doc: body,
            doc_as_upsert: upsert,
          },
        },
        (err, response) => {
          if (err)
            Log.error(
              "Error while inserting ",
              id,
              " of type ",
              type,
              " to elasticsearch ",
              err
            );
          // else
          //     Log.debug('Elasticsearch type ', type, ' upserted with id ', id);
          resolve(response.get._source);
        }
      );
    });
  }

  get(type: string, id: string, option?: any) {
    if (!option) option = {};
    if (!option.isDocs) option.isDocs = false;
    return new Promise((resolve, reject) => {
      if (!this.client) {
        Log.debug("elasticsearch is not enabled, not getting ", type);
        return;
      }
      this.client.get(
        {
          index: option.isDocs ? INDEX + "-docs" : INDEX,
          type: type,
          id: id,
        },
        (err, response: any) => {
          if (err && !response) {
            Log.error(
              "Fatal error while getting id: ",
              id,
              " of type ",
              type,
              " from elasticsearch ",
              err,
              " response ",
              response
            );
            reject(err);
          } else if (!response._source) {
            Log.error(
              "Error while getting id: ",
              id,
              " of type ",
              type,
              " from elasticsearch ",
              err,
              " response ",
              response
            );
            resolve(null);
          } else {
            // Log.debug('Elasticsearch get type ', type, ' with id ', id, ' success');
            if (response._type === "account") {
              response._source.version = response._version;
            }
            resolve(response._source);
          }
        }
      );
    });
  }

  mget(type: string, id: Array<string>, option?: any) {
    if (!option) option = {};
    if (!option.isDocs) option.isDocs = false;
    return new Promise((resolve, reject) => {
      if (!this.client) {
        Log.debug("elasticsearch is not enabled, not getting ", type);
        return;
      }
      this.client.mget(
        {
          index: option.isDocs ? INDEX + "-docs" : INDEX,
          type: type,
          body: {
            ids: id,
          },
        },
        (err, response: any) => {
          if (err && !response) {
            Log.error(
              "Fatal error while getting id: ",
              id,
              " of type ",
              type,
              " from elasticsearch ",
              err,
              " response ",
              response
            );
            reject(err);
          } else if (!response.docs) {
            Log.error(
              "Error while getting id: ",
              id,
              " of type ",
              type,
              " from elasticsearch ",
              err,
              " response ",
              response
            );
            resolve(null);
          } else {
            // Log.debug('Elasticsearch get type ', type, ' with id ', id, ' success');
            resolve(response.docs);
          }
        }
      );
    });
  }

  delete(type: string, id: string, option?: any) {
    if (!option) option = {};
    if (!option.isDocs) option.isDocs = false;
    return new Promise((resolve) => {
      if (!this.client) {
        Log.debug("elasticsearch is not enabled, not getting ", type);
        return;
      }
      this.client.delete(
        {
          index: option.isDocs ? INDEX + "-docs" : INDEX,
          type: type,
          id: id,
        },
        (err, response) => {
          if (err)
            Log.error(
              "Error while deleting ",
              id,
              " of type ",
              type,
              " from elasticsearch ",
              err,
              " response ",
              response
            );
          else
            Log.debug(
              "Elasticsearch delete type ",
              type,
              " with id ",
              id,
              " result ",
              response
            );
          resolve();
        }
      );
    });
  }

  request(path: string, option: any) {
    option.uri = ENDPOINT_URL + path;
    Log.debug("requesting elasticsearch with option ", option);
    return rp(option);
  }

  bulkIndex(type: string, bulkData: any[], option?: any) {
    if (!option) option = {};
    if (!option.isDocs) option.isDocs = false;
    let body: any = [];
    bulkData.forEach((datum) => {
      if (datum.id) {
        body.push({
          index: {
            _index: option.isDocs ? INDEX + "-docs" : INDEX,
            _type: type,
            _id: datum.id,
          },
        });
      } else {
        body.push({
          index: {
            _index: option.isDocs ? INDEX + "-docs" : INDEX,
            _type: type,
          },
        });
      }
      body.push(datum);
    });
    return new Promise((resolve, reject) => {
      if (!this.client) {
        Log.debug("elasticsearch is not enabled, not getting ", type);
        return;
      }
      this.client.bulk(
        {
          body: body,
        },
        function (err, resp) {
          if (err) throw err;
          resolve(resp);
        }
      );
    });
  }

  /**
   *
   * @param {string} type - type of data
   * @param {object} body - search query
   * @param {object} option - isDocs, waitForCompletion, timeout, conflicts
   * @return {promise} return data from elastic as Promise
   */
  updateByQuery(
    type: string,
    body: { script: { source: string }; query?: any },
    option?: {
      isDocs?: boolean;
      waitForCompletion?: boolean;
      timeout?: string;
      conflicts?: string;
    }
  ) {
    if (!option) option = {};
    if (!option.isDocs) option.isDocs = false;
    return new Promise((resolve, reject) => {
      if (!this.client) {
        Log.debug("elasticsearch is not enabled, not updating ", type);
        return;
      }
      let waitForCompletion: boolean = true;
      if (option.waitForCompletion !== undefined) {
        waitForCompletion = option.waitForCompletion;
      }
      let timeout: string = `30s`;
      if (option.timeout !== undefined) {
        timeout = option.timeout;
      }
      let conflicts: any = `abort`;
      if (option.conflicts !== undefined) {
        conflicts = option.conflicts;
      }
      body = JSON.parse(JSON.stringify(body));
      this.client
        .updateByQuery({
          index: option.isDocs ? INDEX + "-docs" : INDEX,
          type: type,
          body: body,
          waitForCompletion: waitForCompletion,
          timeout: timeout,
          conflicts: conflicts,
        })
        .then((json: any) => {
          Log.debug("Update by query for " + type + " result: ", json);
          resolve({ status: "updated" });
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
