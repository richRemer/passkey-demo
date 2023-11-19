import {HTTPError} from "./http-error.js";

export async function get(url) {
  const method = "GET";
  const headers = {Accept: "application/json"};
  const res = await fetch(url, {method, headers});
  const type = res.headers.get("Content-Type");

  if (!res.ok) {
    throw new HTTPError(res.status, message);
  } else if (type && type.startsWith("application/json")) {
    return res.json();
  }
}

export async function post(url, data) {
  const method = "POST";
  const headers = {"Content-Type": "application/json"};
  const body = data ? JSON.stringify(data) : undefined;
  const res = await fetch(url, {method, headers, body});
  const type = res.headers.get("Content-Type");

  if (!res.ok) {
    throw new HTTPError(res.status, message);
  } else if (type && type.startsWith("application/json")) {
    return res.json();
  }
}
