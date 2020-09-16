const { screen } = require("@testing-library/dom");
const { enhanceQueries } = require("../index");

const renderIntoDocument = html => {
  const container = document.createElement("div");
  container.id = "render-container";
  container.innerHTML = html;
  document.body.appendChild(container);
  return { unmount: () => document.body.removeChild(container) };
};

afterEach(() => {
  document.body.innerHTML = "";
});

test("enhanced queries can reuse data for any of get/query/find query types", async () => {
  const { unmount } = renderIntoDocument(
    '<img src="/path/to/logo.png" alt="logo"/>'
  );

  const enhancedQueries = enhanceQueries(screen);
  const logoData = { filter: "role", params: ["img", { name: "logo" }] };

  await expect(enhancedQueries.find(logoData)).resolves.toBeTruthy();
  expect(enhancedQueries.get(logoData)).toBeTruthy();
  expect(enhancedQueries.query(logoData)).toBeTruthy();

  unmount();

  await expect(enhancedQueries.find(logoData)).rejects.toThrow(
    /unable to find/i
  );
  expect(() => enhancedQueries.get(logoData)).toThrow(/unable to find/i);
  expect(enhancedQueries.query(logoData)).toBeNull();
});

test("enhanced queries can reuse data for any of getAll/queryAll/findAll query types", async () => {
  const { unmount } = renderIntoDocument(
    `<ul>
       <li>one</li>
       <li>two</li>
       <li>three</li>
     </ul>`
  );

  const enhancedQueries = enhanceQueries(screen);
  const liData = { filter: "role", params: ["listitem"] };

  await expect(enhancedQueries.findAll(liData)).resolves.toHaveLength(3);
  expect(enhancedQueries.getAll(liData)).toHaveLength(3);
  expect(enhancedQueries.queryAll(liData)).toHaveLength(3);

  unmount();

  await expect(enhancedQueries.findAll(liData)).rejects.toThrow(
    /unable to find/i
  );
  expect(() => enhancedQueries.getAll(liData)).toThrow(/unable to find/i);
  expect(enhancedQueries.queryAll(liData)).toEqual([]);
});

test("using unsupported filter / API will throw", () => {
  const enhancedQueries = enhanceQueries(screen);

  expect(() => enhancedQueries.get({ filter: "unavailable thing" })).toThrow(
    /unsupported filter: unavailable thing/i
  );
});
