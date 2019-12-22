import Axios from "axios";
import { JSDOM } from "jsdom";

export async function createDomFromURL(url: string) {
  const response = await Axios.get(url);
  const html = response.data;
  return new JSDOM(html);
}

export function qsAll(dom: JSDOM, query: string) {
  return dom.window.document.querySelectorAll(query);
}
