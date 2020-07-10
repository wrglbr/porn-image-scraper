import { scrapeLink, dryRun } from "./scrapers";
import argv from "./args";

(async () => {
  let urls = argv._;

  if (!urls.length) {
    console.error("(ts-)node . url0 url1 ...");
    console.error("Run with --help for details");
    process.exit(1);
  }

  if (argv.dry) {
    console.log(await dryRun(urls));
  } else {
    for (const url of urls) {
      await scrapeLink(url);
    }
  }

  process.exit();
})();
