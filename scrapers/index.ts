export interface IScraperResult {
  gallery: string;
  links: string[];
}

export interface IScraper {
  // Returns URLs to full-size images
  scrape: (url: string) => Promise<IScraperResult>;
}
