import Axios from "axios";
import { JSDOM } from "jsdom";

type Headers = { [key: string]: string };

export type Options = Partial<{
  headers: Headers;
}>;

export async function createDomFromURL(url: string, opts: Options = {}) {
  const response = await Axios.get(url, {
    headers: opts.headers || {}
  });
  const html = response.data;
  return new JSDOM(html);
}

export function qsAll(dom: JSDOM, query: string) {
  return dom.window.document.querySelectorAll(query);
}
