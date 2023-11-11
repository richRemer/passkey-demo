import {createOptions, detect, encodeCredential} from "./lib/passkey.js";
import post from "./lib/post.js";

document.addEventListener("DOMContentLoaded", async () => {
  const {auth, passkey, register, name} = bindUI(document);

  passkey.addEventListener("click", () => {
    auth.classList.remove("detected");
    auth.classList.add("register");
  });

  register.addEventListener("click", async evt => {
    const registration = await post("/registration", {name: name.value});
    const options = createOptions(registration, "Local Dev");
    const cred = await navigator.credentials.create(options);
    const credential = encodeCredential(cred);

    console.info(credential);
  });

  if (await detect()) {
    auth.classList.add("detected");
  }
});

function bindUI(document) {
  const auth = document.getElementById("auth");
  const passkey = document.getElementById("passkey");
  const register = document.getElementById("register");
  const name = document.getElementById("name");

  return {auth, passkey, register, name};
}
