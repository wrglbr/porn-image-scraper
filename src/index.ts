import { IScraper, IScraperResult } from "./scrapers/index";
import { PornStarScraper } from "./scrapers/pornstar";
import { BabesourceScraper } from "./scrapers/babesource";
import { downloadImages } from "./download";
import { TubsexerScraper } from "./scrapers/tubsexer";
import { CoedcherryScraper } from "./scrapers/coedcherry";
import { PornpicsScraper } from "./scrapers/pornpics";
import { SweetPornstarsScraper } from "./scrapers/sweet-pornstars";
import { EuropornstarScraper } from "./scrapers/europornstar";

let dry = false;

async function scrapeLink(url: string) {
  console.log(`Getting ${url}...`);

  const scrapers = [
    ["porn-star.com", new PornStarScraper()],
    ["babesource.com", new BabesourceScraper()],
    ["tubsexer.com", new TubsexerScraper()],
    ["coedcherry.com", new CoedcherryScraper()],
    ["pornpics.com", new PornpicsScraper()],
    ["sweet-pornstars.com", new SweetPornstarsScraper()],
    ["europornstar.com", new EuropornstarScraper()],
  ] as [string, IScraper][];

  const tuple = scrapers.find((t) => url.includes(t[0]));

  if (tuple) {
    const scraper = tuple[1];
    const result = await scraper.scrape(url);
    if (dry) {
      console.log(result);
    } else {
      await downloadImages(result.gallery, result.links.filter(Boolean));
    }
  } else {
    console.error("Unsupported site: " + url);
    process.exit(1);
  }
}

(async () => {
  const urls = process.argv.slice(2);

  if (!urls.length) {
    console.error("(ts-)node . url0 url1 ...");
    process.exit(1);
  }

  for (const url of urls) {
    if (url == "--dry") {
      dry = true;
      continue;
    }

    await scrapeLink(url);
  }

  process.exit(0);
})();
