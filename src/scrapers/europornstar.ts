import { IScraper } from "./index";
import { qsAll, createDomFromURL } from "../dom";
import { JSDOM } from "jsdom";

export class EuropornstarScraper implements IScraper {
  domain = "europornstar.com";

  getImageLinks(dom: JSDOM, url: string) {
    return Array.from(qsAll(dom, ".thumbs .th a")).map((el) => {
      return url + el.getAttribute("href");
    });
  }

  async scrape(url: string) {
    const urlSegments = url.split("/").filter(Boolean);
    const gallery = urlSegments.pop().replace(".html", "");

    const dom = await createDomFromURL(url);
    const links = this.getImageLinks(dom, url);

    return {
      gallery,
      links,
    };
  }
}
