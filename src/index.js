const domTestingLib = require("@testing-library/dom");
const { enhanceQueries } = require("./enhance-queries");

domTestingLib.screen = enhanceQueries(screen);

const install = () => {
  domTestingLib.screen = enhanceQueries(screen);
};

module.exports = { enhanceQueries, install };
