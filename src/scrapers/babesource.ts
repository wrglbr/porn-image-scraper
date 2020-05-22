import { IScraper } from "./index";
import { qsAll, createDomFromURL } from "../dom";
import { JSDOM } from "jsdom";

export class BabesourceScraper implements IScraper {
  getImageLinks(dom: JSDOM) {
    return Array.from(qsAll(dom, ".thumbs.cf a")).map((el) => {
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
      links,
    };
  }
}
