if (process.env.NODE_ENV == "production") {
  module.exports = require("./prodIndex");
} else {
  module.exports = require("./devIndex");
}
