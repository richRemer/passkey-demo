const configurable = true;
const enumerable = true;

export class HTTPError extends Error {
  constructor(status, message) {
    super(`unexpected ${status} response`);

    Object.defineProperty(this, {
      status: {configurable, enumerable, value: status},
      message: {configurable, enumerable, value: message}
    });
  }
}
