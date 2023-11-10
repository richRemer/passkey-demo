import {detect} from "./lib/passkey.js";

document.addEventListener("DOMContentLoaded", async () => {
  const authenticate = document.getElementById("authenticate");

  if (await detect()) {
    authenticate.classList.add("detected");
  }
});
