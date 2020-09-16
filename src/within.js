const { within } = require("@testing-library/dom");
const { enhanceQueries } = require("./enhance-queries");

module.exports = {
  within: (...args) => enhanceQueries(within(...args))
};
