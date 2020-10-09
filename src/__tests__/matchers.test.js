const { within } = require("../within");
const { screen } = require("../within");
const { renderIntoDocument } = require("../../test/utils");

function toHaveDescriptor(element, descriptor) {
  if (this.isNot) {
    return {
      pass: !!within(element).query(descriptor),
    };
  }

  return {
    pass: !!within(element).get(descriptor),
  };
}

expect.extend({
  toHaveDescriptor,
});

test("should be able to test presence and absence", async () => {
  const logo = { filter: "role", params: ["img", { name: "logo" }] };

  const { unmount } = renderIntoDocument('<img src="/logo.png" alt="logo"/>');

  expect(document).toHaveDescriptor(logo);

  unmount();

  expect(document).not.toHaveDescriptor(logo);
});
