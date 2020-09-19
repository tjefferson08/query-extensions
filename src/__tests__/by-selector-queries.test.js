const { renderIntoDocument } = require("../../test/utils");
const {
  queryBySelector,
  queryAllBySelector,
  getBySelector,
  getAllBySelector,
  findBySelector,
  findAllBySelector
} = require("../by-selector-queries");

test("should support all queries by standard css selectors", async () => {
  const { unmount } = renderIntoDocument(
    `<div class="wrapper">
       <span class="child">Item 1</span>
       <span class="child">Item 2</span>
       <span class="child">Item 3</span>
     </div>`
  );

  const container = document.body;
  const ERR_MESSAGE = /unable to find/i;

  expect(queryBySelector(container, ".wrapper")).toBeTruthy();
  expect(queryAllBySelector(container, ".child")).toHaveLength(3);

  expect(getBySelector(container, ".wrapper")).toBeTruthy();
  expect(getAllBySelector(container, ".child")).toHaveLength(3);

  await expect(findBySelector(container, ".wrapper")).resolves.toBeTruthy();
  await expect(findAllBySelector(container, ".child")).resolves.toHaveLength(3);

  unmount();

  expect(queryBySelector(container, ".wrapper")).toBeNull();
  expect(queryAllBySelector(container, ".child")).toHaveLength(0);

  expect(() => getBySelector(container, ".wrapper")).toThrow(ERR_MESSAGE);
  expect(() => getAllBySelector(container, ".child")).toThrow(ERR_MESSAGE);

  await expect(findBySelector(container, ".wrapper")).rejects.toThrow(
    ERR_MESSAGE
  );
  await expect(findAllBySelector(container, ".child")).rejects.toThrow(
    ERR_MESSAGE
  );
});

test("should support standard @testing-library multiple/missing errors", async () => {
  const { unmount } = renderIntoDocument(
    `<div class="wrapper">
       <span class="child">Item 1</span>
       <span class="child">Item 2</span>
       <span class="child">Item 3</span>
     </div>`
  );

  const container = document.body;
  const MULTIPLE_ERROR = /found multiple elements/i;
  const MISSING_ERROR = /unable to find/i;

  expect(() => getBySelector(container, ".child")).toThrow(MULTIPLE_ERROR);
  expect(() => getBySelector(container, ".not-found")).toThrow(MISSING_ERROR);

  await expect(findBySelector(container, ".child")).rejects.toThrow(
    MULTIPLE_ERROR
  );
  await expect(findBySelector(container, ".not-found")).rejects.toThrow(
    MISSING_ERROR
  );
});
