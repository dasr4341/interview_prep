export interface NewsItemXML<T = NewsItem> {
  rss: {
    $: {
      version: string;
    };
    channel: [
      {
        link: [string];
        title: [string];
        description: [string];
        language: [string];
        pubDate: [string];
        lastBuildDate: [string];
        item: T[];
      }
    ];
  };
}

export interface NewsItem {
  title: [string];
  link: [string];
  guid: [string];
  pubDate: [string];
  description: [string];
  "prn:industry"?: string[];
  "prn:subject"?: string[];
  "dc:subject"?: string[];
  "dc:contributor"?: string[];
  "dc:language"?: string[];
  "dc:publisher"?: string[];
}

export interface FundingNewsItem {
  title: [string];
  link: [string];
  pubDate: [string];
  description: [string];
  source: [{
    _: string;
    url: string;
  }];
}
