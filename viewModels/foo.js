var services = require('../services');

class FooVM {
  constructor() {
    this.data = {
      user:{},
      something:{}
    };
  }

  async create() {
    var user = await services.foo.getById();
    var something = await services.foo.getSomething();

    this.data.user = user;
    this.data.something = something;

    return this.data;
  }
}

module.exports = new FooVM();