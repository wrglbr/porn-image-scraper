import { IScraperResult } from "./scrapers/index";
import { PornStarScraper } from "./scrapers/pornstar";
import { BabesourceScraper } from "./scrapers/babesource";
import { downloadImages } from "./download";
import { TubsexerScraper } from "./scrapers/tubsexer";
import { CoedcherryScraper } from "./scrapers/coedcherry";
import { PornpicsScraper } from "./scrapers/pornpics";
import { SweetPornstarsScraper } from "./scrapers/sweet-pornstars";

let dry = false;

async function scrapeLink(url: string) {
  console.log(`Getting ${url}...`);

  let result = null as IScraperResult | null;
  if (url.includes("porn-star.com")) {
    result = await new PornStarScraper().scrape(url);
  } else if (url.includes("babesource.com")) {
    result = await new BabesourceScraper().scrape(url);
  } else if (url.includes("tubsexer.com")) {
    result = await new TubsexerScraper().scrape(url);
  } else if (url.includes("coedcherry.com")) {
    result = await new CoedcherryScraper().scrape(url);
  } else if (url.includes("pornpics.com")) {
    result = await new PornpicsScraper().scrape(url);
  } else if (url.includes("sweet-pornstars.com")) {
    result = await new SweetPornstarsScraper().scrape(url);
  } else {
    console.error("Unsupported site: " + url);
  }

  if (result) {
    if (dry) {
      console.log(result);
    } else await downloadImages(result.gallery, result.links.filter(Boolean));
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
