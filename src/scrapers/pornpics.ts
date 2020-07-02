import { IScraper } from "./index";
import { JSDOM } from "jsdom";
import { qsAll, createDomFromURL } from "../dom";

export class PornpicsScraper implements IScraper {
  domain = "pornpics.com";

  getImageLinks(dom: JSDOM) {
    return Array.from(qsAll(dom, "#tiles .rel-link")).map((el) => {
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
