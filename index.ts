import { IScraperResult } from "./scrapers/index";
import { PornStarScraper } from "./scrapers/pornstar";
import { BabesourceScraper } from "./scrapers/babesource";
import { downloadImages } from "./download";

async function scrapeLink(url: string) {
  console.log(`Getting ${url}...`);

  let result = null as IScraperResult | null;
  if (url.includes("porn-star.com")) {
    result = await new PornStarScraper().scrape(url);
  } else if (url.includes("babesource.com")) {
    result = await new BabesourceScraper().scrape(url);
  } else {
    console.error("Unsupported site: " + url);
  }
  if (result) await downloadImages(result.gallery, result.links);
}

(async () => {
  const urls = process.argv.slice(2);

  if (!urls.length) {
    console.error("(ts-)node . url0 url1 ...");
    process.exit(1);
  }

  for (const url of urls) {
    await scrapeLink(url);
  }

  process.exit(0);
})();
