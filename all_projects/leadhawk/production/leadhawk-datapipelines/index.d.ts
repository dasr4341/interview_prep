declare module "xml2js-cdata" {
  class Parser {
    constructor();
    parseStringPromise(data: string): Promise<{ [key: string]: any }>;
  }
}

declare module "puppeteer-real-browser" {
  function connect(options: {}): any;
}
