import Axios from "axios";
import { createWriteStream, mkdirSync, existsSync } from "fs";
import { JSDOM } from "jsdom";
import { join } from "path";

const baseFolder = "images";
if (!existsSync(baseFolder)) mkdirSync(baseFolder);

async function downloadImage(url: string, path: string) {
  const writer = createWriteStream(path);

  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream"
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

function qs(dom: JSDOM, query: string) {
  return dom.window.document.querySelector(query);
}

function qsAll(dom: JSDOM, query: string) {
  return dom.window.document.querySelectorAll(query);
}

function getImageLinks(dom: JSDOM) {
  return Array.from(qsAll(dom, ".thumbnails-gallery > a")).map(el => {
    return el.getAttribute("href");
  });
}

async function createDomFromURL(url: string) {
  const response = await Axios.get(url);
  const html = response.data;
  return new JSDOM(html);
}

async function scrapeImagePage(url: string) {
  console.log(`\tGetting ${url}...`);
  const dom = await createDomFromURL(url);
  const fullSizeImageSrc = qs(dom, ".fullsize-image").getAttribute("src");

  const urlSegments = url.split("/");
  const galleryName = urlSegments[urlSegments.length - 2];
  const galleryFolder = join(baseFolder, galleryName);

  if (!existsSync(galleryFolder)) {
    try {
      mkdirSync(galleryFolder);
    } catch (err) {
      console.error("Could not create gallery folder");
      process.exit(1);
    }
  }

  const imageUrl = urlSegments.slice(0, -1).join("/") + "/" + fullSizeImageSrc;

  const imageFile = join(
    galleryFolder,
    fullSizeImageSrc.replace(".html", ".jpg")
  );

  if (!existsSync(imageFile)) {
    await downloadImage(imageUrl, imageFile);
  } else {
    console.log("\tImage " + imageFile + " already exists");
  }
}

async function scrapeLink(url: string) {
  console.log(`Getting ${url}...`);

  const dom = await createDomFromURL(url);
  const imageLinks = getImageLinks(dom);

  for (const imageLink of imageLinks) {
    const imagePage = url.replace("index.html", imageLink);
    await scrapeImagePage(imagePage);
  }
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
