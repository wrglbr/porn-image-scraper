import { IScraper } from "./interface";
import { qsAll, createDomFromURL } from "../dom";
import { JSDOM } from "jsdom";

export class BabesourceScraper implements IScraper {
  domain = "babesource.com";

  getImageLinks(dom: JSDOM) {
    return Array.from(
      qsAll(dom, ".thumbs.cf a:not(#startSlideshowAnchor)")
    ).map((el) => {
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
