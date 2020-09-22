const { buildQueries } = require("@testing-library/dom");

const getMultipleError = (c, selector) =>
  `Found multiple elements with the selector text: ${selector}`;

const getMissingError = (c, selector) =>
  `Unable to find an element with the selector text: ${selector}`;

const queryAllBySelector = (container, selector) => [
  ...container.querySelectorAll(selector),
];

const [
  queryBySelector,
  getAllBySelector,
  getBySelector,
  findAllBySelector,
  findBySelector,
] = buildQueries(queryAllBySelector, getMultipleError, getMissingError);

module.exports = {
  queryBySelector,
  queryAllBySelector,
  getBySelector,
  getAllBySelector,
  findBySelector,
  findAllBySelector,
};
