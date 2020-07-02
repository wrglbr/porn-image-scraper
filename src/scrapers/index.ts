import { PornStarScraper } from "./pornstar";
import { BabesourceScraper } from "./babesource";
import { downloadImages } from "../download";
import { TubsexerScraper } from "./tubsexer";
import { CoedcherryScraper } from "./coedcherry";
import { PornpicsScraper } from "./pornpics";
import { SweetPornstarsScraper } from "./sweet-pornstars";
import { EuropornstarScraper } from "./europornstar";

export let dryMode = false;

export function setDryMode(val: boolean) {
  console.error("Dry mode ON");
  dryMode = val;
}

export interface IScraperResult {
  gallery: string;
  links: string[];
}

export interface IScraper {
  domain: string;
  // Returns URLs to full-size images
  scrape: (url: string) => Promise<IScraperResult>;
}

export async function scrapeLink(url: string) {
  console.error(`Getting ${url}...`);

  const scrapers = [
    new BabesourceScraper(),
    new PornStarScraper(),
    new TubsexerScraper(),
    new CoedcherryScraper(),
    new PornpicsScraper(),
    new SweetPornstarsScraper(),
    new EuropornstarScraper(),
  ];

  const scraper = scrapers.find((t) => url.includes(t.domain));

  if (scraper) {
    const result = await scraper.scrape(url);
    if (dryMode) {
      console.log(result);
    } else {
      await downloadImages(result.gallery, result.links.filter(Boolean));
    }
  } else {
    console.error("Unsupported site: " + url);
    process.exit(1);
  }
}
