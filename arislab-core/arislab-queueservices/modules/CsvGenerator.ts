const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

export class CsvGenerator {
  private CSV_HEADER: Array<string>;
  private CSV_DATA: Array<{ [key: string]: any }>;
  private SAVE_FILE_NAME: string = "";
  private SAVE_FILE: string = "";
  private BUFFER: any;

  static getInstance(): CsvGenerator {
    return new CsvGenerator();
  }

  public setCsvHeader(header: Array<string>) {
    this.CSV_HEADER = header;
  }

  public setCsvData(data: Array<{ [key: string]: any }>) {
    this.CSV_DATA = data;
  }

  public checkDirectorySync(directory: string) {
    try {
      fs.statSync(directory);
    } catch (e) {
      fs.mkdirSync(directory);
    }
  }

  public setSaveFileName(fileName: string) {
    this.SAVE_FILE_NAME = fileName;
    this.checkDirectorySync(process.cwd() + `/saved`);
    this.SAVE_FILE = path.join(process.cwd(), "saved", fileName);
  }

  public getSaveFilePath() {
    return this.SAVE_FILE;
  }

  public createCsv() {
    let json2csvParser = new Parser({ fields: this.CSV_HEADER, withBOM: true });
    let csv = json2csvParser.parse(this.CSV_DATA);
    fs.writeFile(this.SAVE_FILE, csv, "utf8");
    return Promise.resolve({ status: "SUCCESS", error: "" });
  }
}
