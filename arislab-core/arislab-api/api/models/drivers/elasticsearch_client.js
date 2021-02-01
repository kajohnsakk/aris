const elasticsearch = require("elasticsearch");
let client = null;
const scrollToEnd = require("elasticsearch-scroll")(client);
const identity = require("lodash.identity");
const log = require("../../utils/log");
const md5 = require("md5");
const INDEX = "njoin-" + process.env.nuser;
const ELASTICSEARCH_ENDPOINT = process.env.DBRVP_HOST
  ? process.env.DBRVP_HOST + ":" + (process.env.DBRVP_PORT || "2080")
  : process.env.nes;
const ENDPOINT_URL = "http://" + ELASTICSEARCH_ENDPOINT + "/" + INDEX;
const rp = require("request-promise-native");
client = new elasticsearch.Client({
  host: ELASTICSEARCH_ENDPOINT,
  httpAuth: process.env.nuser + ":" + process.env.npwd,
  requestTimeout: 90000,
  // log: 'debug'
});
// setTimeout(()=>{
//      require("../flow").ensureSearchTerm();
// }, 5000);
Log.debug("Elasticsearch client created with index ", INDEX);
// const updateIdCache = {};
const esclient = {
  aggregate: (type, query, aggregate, cb, option) => {
    if (!option) option = {};
    if (!query) query = { match_all: {} };
    const body = {
      query: query,
      aggs: {
        aggregatelist: aggregate,
      },
    };
    Log.debug("elastic aggregate type ", type, " with body ", body);
    client.search(
      {
        index: INDEX,
        type: type,
        size:
          option.size === undefined || option.size === null ? 30 : option.size,
        body: body,
      },
      function (err, res) {
        if (
          err ||
          !res ||
          !res.aggregations ||
          !res.aggregations.aggregatelist
        ) {
          //|| !res.aggregations.aggregatelist.buckets){
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
          cb(null);
        } else {
          cb(
            res.aggregations.aggregatelist.buckets ||
              res.aggregations.aggregatelist
          );
        }
      }
    );
  },
  search: (type, body, callback, option) => {
    // Log.debug("elastic search type ",type," body ",body, " option ",option);
    if (!option) option = {};
    let size =
      option && option.size ? option.size : body.size ? body.size : 10000;
    if (size > 10000) size = 10000;
    if (option.autoScroll === undefined) option.autoScroll = true;
    const from = option && option.from ? option.from : 0;
    client
      .search({
        index: INDEX,
        type: type,
        size: size,
        from: from,
        body: body,
        scroll: size == 10000 ? "1m" : null,
      })
      .then((resp) => {
        if (!resp || !resp.hits || !resp.hits.hits) {
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
          callback(null);
        } else {
          // Log.debug("flow query result is ", resp.hits.hits);
          if (resp._scroll_id) {
            if (option.autoScroll) {
              esclient.scroll(resp._scroll_id, resp.hits.hits, () => {
                callback(resp.hits.hits);
              });
            } else {
              option.scroll_id = resp._scroll_id;
              callback(resp.hits.hits);
            }
          } else {
            callback(resp.hits.hits);
          }
        }
      })
      .catch((err) => {
        Log.error(
          "error while searching elasticsearch type " + type + " body ",
          body,
          " error:",
          err.stack || err
        );
        callback(null);
      });
  },
  scroll: (scrollId, array, callback, option) => {
    if (!option) {
      option = {};
    }
    Log.debug("scrolling on scrollId " + scrollId);
    if (option.autoScroll === undefined) {
      option.autoScroll = true;
    }
    client
      .scroll({
        scrollId: scrollId,
        scroll: "5m",
      })
      .then((resp) => {
        if (!resp || !resp.hits || !resp.hits.hits) {
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
          callback(null);
        } else if (resp.hits.hits.length == 0) {
          Log.debug("scrolling finished with total length " + array.length);
          callback();
        } else if (option.autoScroll) {
          array.push(...resp.hits.hits);
          esclient.scroll(scrollId, array, callback);
        } else {
          array.push(...resp.hits.hits);
          callback(resp.hits.hits);
        }
      })
      .catch((err) => {
        Log.error("error while searching elasticsearch ", err.stack || err);
        callback(null);
      });
  },
  count: (type, body, callback) => {
    Log.debug("elastic count type ", type, " body ", body);
    client.search(
      {
        index: INDEX,
        type: type,
        size: 0,
        body: body,
      },
      function (err, resp) {
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
          callback(null);
        } else {
          // Log.debug("flow query result is ", resp.hits.hits);
          callback(resp.hits.total);
        }
      }
    );
  },
  update: function (type, id, body, upsert, cb) {
    if (!client) {
      Log.error("elasticsearch is not enabled, not updating ", type);
      return;
    }
    body = JSON.parse(JSON.stringify(body));
    delete body._id;
    let version = body.version;
    delete body.version;
    client.update(
      {
        index: INDEX,
        type: type,
        retry_on_conflict: version ? null : 3,
        version: version ? version : null,
        id: id,
        body: {
          doc: body,
          doc_as_upsert: upsert ? true : false,
        },
      },
      (err, response) => {
        if (err)
          Log.error(
            "Error while inserting ",
            id,
            " of type ",
            type,
            " to elasticsearch " + err
          );
        else Log.debug("Elasticsearch tyoe ", type, " upserted with id ", id);
        if (cb) cb();
      }
    );
  },
  get: function (type, id, cb) {
    if (!client) {
      Log.error("elasticsearch is not enabled, not getting ", type);
      return;
    }
    client.get(
      {
        index: INDEX,
        type: type,
        id: id,
      },
      function (err, response) {
        if (err)
          Log.error(
            "Error while getting ",
            id,
            " of type ",
            type,
            " from elasticsearch ",
            err,
            " response ",
            response
          );
        else {
          // Log.debug("Elasticsearch get type ", type, " with id ", id, " result ", response);
          if (cb) cb(response._source);
        }
      }
    );
  },
  delete: function (type, id, cb) {
    if (!client) {
      Log.error("elasticsearch is not enabled, not getting ", type);
      return;
    }
    client.delete(
      {
        index: INDEX,
        type: type,
        id: id,
      },
      function (err, response) {
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
        if (cb) cb();
      }
    );
  },
  request: function (path, option) {
    const url = ENDPOINT_URL + path;
    option.uri = url;
    Log.debug("requesting elasticsearch with option ", option);
    return rp(option);
  },
};
module.exports = esclient;
