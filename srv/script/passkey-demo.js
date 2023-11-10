import {detect, createOptions} from "./lib/passkey.js";

document.addEventListener("DOMContentLoaded", async () => {
  const authenticate = document.getElementById("authenticate");
  const showRegister = document.getElementById("show-register");
  const register = document.getElementById("register");
  const name = document.getElementById("register-name");

  showRegister.addEventListener("click", () => {
    authenticate.classList.remove("supported");
    authenticate.classList.add("register");
  });

  register.addEventListener("submit", async evt => {
    evt.preventDefault();

    const uri = evt.target.action;
    const headers = {"Content-Type": "application/json"};
    const body = JSON.stringify({name: name.value});
    const res = await fetch(uri, {method: "POST", headers, body});
    const reply = await res.json();

    if (res.ok) {
      const opts = createOptions(reply, "Local Dev");
      const cred = await navigator.credentials.create(opts);

      window.cred = cred;
      console.info(cred);
    } else {
      console.error(reply);
    }
  });

  if (await detect()) {
    authenticate.classList.add("supported");
  }
});
