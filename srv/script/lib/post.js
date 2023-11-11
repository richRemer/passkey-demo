import {HTTPError} from "./http-error.js";

export default async function post(url, data) {
  const method = "POST";
  const headers = {"Content-Type": "application/json"};
  const body = JSON.stringify(data);
  const res = await fetch(url, {method, headers, body});
  const message = await res.json();

  if (res.ok) {
    return message;
  } else {
    throw new HTTPError(res.status, message);
  }
}
