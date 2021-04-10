import dtl from "@testing-library/dom";
import { enhanceQueries } from "./enhance-queries.js";
import * as bySelectorQueries from "./by-selector-queries.js";

const { getQueriesForElement, screen: dtlScreen } = dtl;

const enhancedScreen = getQueriesForElement(document.body, bySelectorQueries);

export const screen = enhanceQueries({
  ...dtlScreen,
  ...enhancedScreen,
});
