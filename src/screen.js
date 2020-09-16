const { screen } = require("@testing-library/dom");
const { enhanceQueries } = require("./enhance-queries");

module.exports = {
  screen: enhanceQueries(screen)
};
