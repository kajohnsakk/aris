const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

// https://medium.com/@rodolfo.marcos07/how-to-generate-beautifull-pdf-using-nodejs-puppeteers-and-handlebars-7e3a1ef7cfb7

export class PdfGenerator {
  private TEMPLATE: string = "";
  private HTML_CONTENT: string = "";
  private SAVE_FILE_NAME: string = "";
  private SAVE_FILE: string = "";
  private BUFFER: any;

  static getInstance(): PdfGenerator {
    return new PdfGenerator();
  }

  public setTemplate(template: string) {
    this.TEMPLATE = template;
  }

  public setContent(data: any) {
    var templateHtml = fs.readFileSync(
      path.join(process.cwd(), "views", this.TEMPLATE),
      "utf8"
    );
    var template = handlebars.compile(templateHtml);
    this.HTML_CONTENT = template(data);
  }

  public setSaveFileName(fileName: string) {
    this.SAVE_FILE_NAME = fileName;
  }

  public getSaveFilePath() {
    return this.SAVE_FILE;
  }

  public checkDirectorySync(directory: string) {
    try {
      fs.statSync(directory);
    } catch (e) {
      fs.mkdirSync(directory);
    }
  }

  public async createPDF() {
    let options = {
      format: "A4",
      printBackground: true,
      path: "",
    };

    if (this.SAVE_FILE_NAME.length > 0) {
      this.checkDirectorySync(process.cwd() + `/saved`);
      this.SAVE_FILE = path.join(process.cwd(), "saved", this.SAVE_FILE_NAME);
      options["path"] = this.SAVE_FILE;
    }

    const browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      pipe: true,
      headless: true,
    });

    var page = await browser.newPage();
    await page.goto(`data:text/html;charset=UTF-8,${this.HTML_CONTENT}`, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf(options);
    await browser.close();

    this.BUFFER = pdfBuffer;
    return pdfBuffer;
  }
}
