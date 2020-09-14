import { PornStarScraper } from "./pornstar";
import { BabesourceScraper } from "./babesource";
import { ImagefapScraper } from "./imagefap";
import { downloadImages } from "../download";
import { TubsexerScraper } from "./tubsexer";
import { CoedcherryScraper } from "./coedcherry";
import { PornpicsScraper } from "./pornpics";
import { SweetPornstarsScraper } from "./sweet-pornstars";
import { EuropornstarScraper } from "./europornstar";
import argv from "../args";
import { IScraperResult } from "./interface";

const scrapers = [
  new BabesourceScraper(),
  new PornStarScraper(),
  new ImagefapScraper(),
  new TubsexerScraper(),
  new CoedcherryScraper(),
  new PornpicsScraper(),
  new SweetPornstarsScraper(),
  new EuropornstarScraper(),
];

export async function scrapeLink(url: string) {
  console.error(`Getting ${url}...`);

  const scraper = scrapers.find((t) => url.includes(t.domain));

  if (scraper) {
    const result = await scraper.scrape(url);
    await downloadImages(result.gallery, result.links.filter(Boolean));
  } else {
    console.error("Unsupported site: " + url);
    process.exit(1);
  }
}

export async function dryRun(urls: string[]) {
  console.error("Dry run...");
  const result = {} as Record<string, IScraperResult>;

  for (const url of urls) {
    const scraper = scrapers.find((t) => url.includes(t.domain));

    if (scraper) {
      try {
        const scraperResult = await scraper.scrape(url);
        result[url] = scraperResult;
      } catch (error) {
        console.error(error.message);
      }
    } else {
      console.error("Unsupported site: " + url);
      process.exit(1);
    }
  }

  return result;
}
