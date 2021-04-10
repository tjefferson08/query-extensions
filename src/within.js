// Remember that `within` is simply an alias for `getQueriesForElement`
import { within as dtlWithin } from "@testing-library/dom";
import { enhanceQueries } from "./enhance-queries.js";
import * as bySelectorQueries from "./by-selector-queries.js";

const within = (element, ...rest) =>
  enhanceQueries({
    ...dtlWithin(element, ...rest),
    ...dtlWithin(element, { ...bySelectorQueries }),
  });

export { within };
