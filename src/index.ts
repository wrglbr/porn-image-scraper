import { scrapeLink, setDryMode } from "./scrapers";

(async () => {
  let urls = process.argv.slice(2);

  if (!urls.length) {
    console.error("(ts-)node . url0 url1 ...");
    process.exit(1);
  }

  if (urls.some((url) => url === "--dry")) {
    setDryMode(true);
    urls = urls.filter((url) => url !== "--dry");
  }

  for (const url of urls) {
    await scrapeLink(url);
  }

  process.exit(0);
})();
