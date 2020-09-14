const domTestingLib = require("@testing-library/dom");
const { enhanceQueries } = require("./enhance-queries");

const install = () => {
  domTestingLib.screen = enhanceQueries(screen);
};

module.exports = { install };
