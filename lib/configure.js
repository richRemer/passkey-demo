export default function configure(env) {
  const port = Number(env.PASSKEY_PORT) || undefined;
  const root = new URL("..", import.meta.url).pathname;

  return {root, port};
}
