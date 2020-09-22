const { getQueriesForElement, screen } = require("@testing-library/dom");
const { enhanceQueries } = require("./enhance-queries");
const bySelectorQueries = require("./by-selector-queries");

const enhancedScreen = getQueriesForElement(document.body, bySelectorQueries);

module.exports = {
  screen: enhanceQueries({
    ...screen,
    ...enhancedScreen,
  }),
};
