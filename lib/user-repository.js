import {generateId, createRegistration} from "passkey-demo";

const reserved = Symbol("UserRepository.reserved");

export class UserRepository {
  constructor(User) {
    this.User = User;
    this.names = new Map();
    this.ids = new Map();
    this.timeout = 5*60*1000; // 5 minutes
  }

  static reserved = reserved;

  async register(username) {
    const id = generateId();
    const user = new this.User(id, username);

    if (this.names.has(user.name)) {
      throw new Error("username already registered");
    } else if (this.ids.has(user.id)) {
      throw new Error("temporary problem registering user");
    }

    this.names.set(user.name, reserved);
    this.ids.set(user.id, user.name);

    return createRegistration(user);
  }
}
