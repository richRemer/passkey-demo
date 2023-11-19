import {detect, encodeCredential} from "./lib/passkey.js";
import {decodeCreationOptions, decodeRequestOptions} from "./lib/passkey.js";
import {get, post} from "./lib/http.js";

document.addEventListener("DOMContentLoaded", async () => {
  const {auth, name, login, logout, passkey, register} = bindUI(document);

  login.addEventListener("click", async () => {
    const requestOptions = await get("/challenge");
    const options = decodeRequestOptions(requestOptions);
    const credential = await navigator.credentials.get(options);
    const user = await post("/login", encodeCredential(credential));

    auth.classList.remove("detected");
    auth.classList.add("authenticated");
  });

  logout.addEventListener("click", async () => {
    await post("/logout");

    auth.classList.remove("authenticated");
    auth.classList.add("detected");
  });

  register.addEventListener("click", async () => {
    auth.classList.remove("detected");
    auth.classList.add("register");
  });

  passkey.addEventListener("click", async evt => {
    const {value: username} = name;
    const creationOptions = await post("/registration", {username});
    const options = decodeCreationOptions(creationOptions);
    const credential = await navigator.credentials.create(options);
    const user = await post("/register", encodeCredential(credential));

    auth.classList.remove("register");
    auth.classList.add("authenticated");
  });

  if (await detect()) {
    auth.classList.add("detected");
  }
});

function bindUI(document) {
  const auth = document.getElementById("auth");
  const name = document.getElementById("name");
  const login = document.getElementById("login");
  const logout = document.getElementById("logout");
  const passkey = document.getElementById("passkey");
  const register = document.getElementById("register");

  return {auth, login, logout, name, passkey, register};
}
