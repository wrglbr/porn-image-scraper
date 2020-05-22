import { IScraper } from "./index";
import { JSDOM } from "jsdom";
import { qsAll, createDomFromURL } from "../dom";

export class CoedcherryScraper implements IScraper {
  getImageLinks(dom: JSDOM) {
    return Array.from(qsAll(dom, "figure a")).map((el) => {
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
