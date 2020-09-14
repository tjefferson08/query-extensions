const { screen } = require("@testing-library/dom");
const { enhanceQueries } = require("./enhance-queries");

const enhancedScreen = enhanceQueries(screen);

module.exports = { enhanceQueries, screen: enhancedScreen };
