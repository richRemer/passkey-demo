import {randomBytes} from "crypto";

const reserved = Symbol("UserRepository.reserved");

export class UserRepository {
  constructor(User) {
    this.User = User;
    this.nameIndex = new Map();
    this.idIndex = new Map();
    this.timeout = 5*60*1000; // 5 minutes
  }

  static reserved = reserved;

  async load(id) {
    return this.idIndex.get(id);
  }

  async delete(id) {
    const user = this.idIndex.get(id);
    this.idIndex.delete(id);
    this.nameIndex.delete(user?.name);
  }

  async reserve(username) {
    const id = randomBytes(64).toString("base64url");
    const user = new this.User(id, username);
    const reservation = Symbol();

    if (this.nameIndex.has(user.name)) {
      throw new Error("username already registered");
    } else if (this.idIndex.has(user.id)) {
      throw new Error("temporary problem registering user");
    }

    this.idIndex.set(user.id, user);
    this.nameIndex.set(user.name, user);

    setTimeout(async () => {
      const user = await this.load(id);
      if (user && user.isRegistered()) await this.delete(id);
    }, this.timeout);

    return user;
  }

  async store(user) {
    if (!user.isRegistered()) {
      this.idIndex.set(user.id, user);
      this.nameIndex.set(user.name, user);
    }

    return user.id;
  }
}
