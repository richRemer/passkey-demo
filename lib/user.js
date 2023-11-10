export class User {
  id;
  name;
  displayName;

  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.displayName = "";
  }
}
