import { IScraper } from "./interface";
import { JSDOM } from "jsdom";
import { qsAll, createDomFromURL } from "../dom";

export class SweetPornstarsScraper implements IScraper {
  domain = "sweet-pornstars.com";

  getImageLinks(gallery: string, dom: JSDOM) {
    return Array.from(qsAll(dom, ".gallery .card-image a"))
      .map((el) => {
        return el.getAttribute("href");
      })
      .map((url) => `https://sweet-pornstars.com${url}`);
  }

  async scrape(url: string) {
    const urlSegments = url.split("/").filter(Boolean);
    const gallery = urlSegments[urlSegments.length - 1];

    const dom = await createDomFromURL(url);
    const links = this.getImageLinks(gallery, dom);

    return {
      gallery,
      links,
    };
  }
}
