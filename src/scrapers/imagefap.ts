import { IScraper } from "./interface";
import { JSDOM } from "jsdom";
import { qsAll, createDomFromURL } from "../dom";

export class ImagefapScraper implements IScraper {
  domain = "imagefap.com";

  getImageLinks(dom: JSDOM) {
    return Array.from(qsAll(dom, "#gallery .expp-extended")).map((el) => {
      return el.getAttribute("href");
    });
  }

  async scrape(url: string) {
    const urlSegments = url.split("/").filter(Boolean);
    const gallery = urlSegments.pop();

    const dom = await createDomFromURL(url);
    const links = this.getImageLinks(dom);

    return {
      gallery,
      links,
    };
  }
}
