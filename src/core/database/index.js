const SequelizeClient = require("./client");

class Database {
  constructor() {
    this.client = new SequelizeClient();
  }

  init() {
    return this.client.connect();
  }
}

module.exports = new Database();
