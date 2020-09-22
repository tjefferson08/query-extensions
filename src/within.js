// Remember that `within` is simply an alias for `getQueriesForElement`
const { within: dtlWithin } = require("@testing-library/dom");
const { enhanceQueries } = require("./enhance-queries");
const bySelectorQueries = require("./by-selector-queries");

module.exports = {
  within: (element, ...rest) =>
    enhanceQueries({
      ...dtlWithin(element, ...rest),
      ...dtlWithin(element, { ...bySelectorQueries }),
    }),
};
