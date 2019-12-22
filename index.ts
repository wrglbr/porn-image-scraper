import Axios from "axios";
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { JSDOM } from "jsdom";
import { join, basename } from "path";

const baseFolder = "images";
if (!existsSync(baseFolder)) mkdirSync(baseFolder);

async function createDomFromURL(url: string) {
  const response = await Axios.get(url);
  const html = response.data;
  return new JSDOM(html);
}

interface IScraperResult {
  gallery: string;
  links: string[];
}

interface IScraper {
  // Returns URLs to full-size images
  scrape: (url: string) => Promise<IScraperResult>;
}

class PornStarScraper implements IScraper {
  getImageLinks(gallery: string, dom: JSDOM) {
    return Array.from(qsAll(dom, ".thumbnails-gallery img"))
      .map(el => {
        return el.getAttribute("src");
      })
      .map(
        url => `https://porn-star.com/${gallery}/${url.replace("thumbs/", "")}`
      );
  }

  async scrape(url: string) {
    const urlSegments = url.split("/");
    const gallery = urlSegments[urlSegments.length - 2];

    const dom = await createDomFromURL(url);
    const links = this.getImageLinks(gallery, dom);

    return {
      gallery,
      links
    };
  }
}

class BabesourceScraper implements IScraper {
  getImageLinks(dom: JSDOM) {
    return Array.from(qsAll(dom, ".thumbs.cf a")).map(el => {
      return el.getAttribute("href");
    });
  }

  async scrape(url: string) {
    const urlSegments = url.split("/");
    const gallery = urlSegments.pop().replace(".html", "");

    const dom = await createDomFromURL(url);
    const links = this.getImageLinks(dom);

    return {
      gallery,
      links
    };
  }
}

async function downloadImages(gallery: string, urls: string[]) {
  const galleryFolder = join(baseFolder, gallery);

  if (!existsSync(galleryFolder)) {
    try {
      mkdirSync(galleryFolder);
    } catch (err) {
      console.error("Could not create gallery folder");
      process.exit(1);
    }
  }

  for (const url of urls) {
    const path = join(galleryFolder, basename(url));
    await downloadImage(url, path);
  }
}

async function downloadImage(url: string, path: string) {
  if (existsSync(path)) {
    console.warn(`\t${url} already exists, skipping...`);
    return;
  }

  const writer = createWriteStream(path);

  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  console.log(`\tDownloading ${url}...`);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

function qsAll(dom: JSDOM, query: string) {
  return dom.window.document.querySelectorAll(query);
}

async function scrapeLink(url: string) {
  console.log(`Getting ${url}...`);

  let result = null as IScraperResult | null;
  if (url.includes("porn-star.com")) {
    result = await new PornStarScraper().scrape(url);
  } else if (url.includes("babesource.com")) {
    result = await new BabesourceScraper().scrape(url);
  }
  if (result) await downloadImages(result.gallery, result.links);
}

(async () => {
  const urls = process.argv.slice(2);

  if (!urls.length) {
    console.error("ts-node . url0 url1 ...");
    process.exit(1);
  }

  for (const url of urls) {
    await scrapeLink(url);
  }

  process.exit(0);
})();
