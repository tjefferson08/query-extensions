const { screen, within } = require("../index");
const { renderIntoDocument } = require("../../test/utils");

test("enhanced queries can reuse data for any of get/query/find query types", async () => {
  const { unmount } = renderIntoDocument(
    '<img src="/path/to/logo.png" alt="logo"/>'
  );

  const logoData = { filter: "role", params: ["img", { name: "logo" }] };

  await expect(screen.find(logoData)).resolves.toBeTruthy();
  expect(screen.get(logoData)).toBeTruthy();
  expect(screen.query(logoData)).toBeTruthy();

  unmount();

  await expect(screen.find(logoData)).rejects.toThrow(/unable to find/i);
  expect(() => screen.get(logoData)).toThrow(/unable to find/i);
  expect(screen.query(logoData)).toBeNull();
});

test("enhanced queries can reuse data for any of getAll/queryAll/findAll query types", async () => {
  const { unmount } = renderIntoDocument(
    `<ul>
       <li>one</li>
       <li>two</li>
       <li>three</li>
     </ul>`
  );

  const liData = { filter: "role", params: ["listitem"] };

  await expect(screen.findAll(liData)).resolves.toHaveLength(3);
  expect(screen.getAll(liData)).toHaveLength(3);
  expect(screen.queryAll(liData)).toHaveLength(3);

  unmount();

  await expect(screen.findAll(liData)).rejects.toThrow(/unable to find/i);
  expect(() => screen.getAll(liData)).toThrow(/unable to find/i);
  expect(screen.queryAll(liData)).toEqual([]);
});

test("higher-level API should be able to leverage custom queries", async () => {
  const { unmount } = renderIntoDocument(
    '<img class="company-logo" src="/path/to/logo.png" alt="logo"/>'
  );

  const logoData = { filter: "selector", params: [".company-logo"] };

  await expect(screen.find(logoData)).resolves.toBeTruthy();
  expect(screen.get(logoData)).toBeTruthy();
  expect(screen.query(logoData)).toBeTruthy();

  unmount();

  await expect(screen.find(logoData)).rejects.toThrow(/unable to find/i);
  expect(() => screen.get(logoData)).toThrow(/unable to find/i);
  expect(screen.query(logoData)).toBeNull();
});

test("within is extended to return enhanced query bundle", async () => {
  const { unmount } = renderIntoDocument(
    `<form>
       <button>OK</button>
     </form>
     <div role="dialog">
       <button>OK</button>
     </div>`
  );

  const okBtnData = { filter: "role", params: ["button", { name: "OK" }] };
  const dialogData = { filter: "role", params: ["dialog"] };

  // querying for OK button should yield two results
  expect(screen.getAll(okBtnData)).toHaveLength(2);

  // scoping with `within` should limit to single result
  expect(within(screen.get(dialogData)).get(okBtnData)).toBeTruthy();
});

test("using unsupported filter / API will throw", () => {
  expect(() => screen.get({ filter: "unavailable thing" })).toThrow(
    /unsupported filter: unavailable thing/i
  );
});
