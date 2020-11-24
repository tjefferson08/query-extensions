# query-extensions

Extensions for core @testing-library queries

[Kent & Travis briefly discuss](https://youtu.be/FdO2cphSH9Y?t=772) during one
of Kent's helpful office hours sessions

# Install

```sh
npm install query-extensions

# or
yarn add query-extensions
```

# Motivation

Here's the reason this package exists:

```js
import { screen } from "query-extensions";
import { fireEvent } from "@testing-library/react";
// ... more imports

test("the standard screen queries work nicely for the majority of cases", async () => {
  render(<YourComponent />);

  // standard queries are available
  // component starts in loading state
  const loadingEl = screen.getByText("Loading...");
  expect(loadingEl).toBeInTheDocument();

  // loads up an email input, loading disappears
  const emailInput = await screen.findByLabelText("Your email");
  expect(screen.queryByText("Loading...")).toBeNull();

  // fill out email and click to sign up
  fireEvent.change(emailInput, { target: { value: "email@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

  // success modal pops up and takes over component (hiding other content)
  await screen.findByRole("img", { name: "celebration" });
  expect(screen.queryByLabelText("Your email")).toBeNull();
  expect(screen.queryByRole("button", { name: /sign up/i })).toBeNull();
});

test("the query extensions API can help us write something more readable and maintainable", async () => {
  const ui = {
    successIcon: { filter: "role", params: ["img", { name: "celebration" }] },
    signUpBtn: { filter: "role", params: ["button", { name: /sign up/i }] },
    emailInput: { filter: "labelText", params: ["Your email"] },
    loading: { filter: "text", params: ["Loading..."] },
  };

  render(<YourComponent />);

  // component starts in loading state
  expect(screen.get(ui.loading)).toBeInTheDocument();

  // loads up an email input, loading disappears
  const emailInput = await screen.find(ui.emailInput);
  expect(screen.query(ui.loading)).toBeNull();

  // fill out email and click to sign up
  fireEvent.change(emailInput, { target: { value: "email@example.com" } });
  fireEvent.click(screen.get(ui.signUpBtn));

  // success modal pops up and takes over component (hiding other content)
  await screen.find(ui.successIcon);
  expect(screen.query(ui.emailInput)).toBeNull();
  expect(screen.query(ui.signUpBtn)).toBeNull();
});
```

TL;DR wouldn't it be nice to reuse your querying configs without coupling to a
particular flavor of get/query/find?

If that (contrived) example doesn't sell you outright, consider a couple of
"maintenance" scenarios. What happens to each test (or a _much_ bigger, more
hypothetical test suite) if:

1. A UI element goes from rendering sync to async (or vice versa)
2. A UI element has a text/markup/label change which requires a different query

# Usage

## `screen`

There's a handy, pre-built `screen` object available for direct use. This is
probably the most common way you'll interact with `query-extensions`

```js
import { screen } from 'query-extensions';
import { render } from '@testing-library/react';
// ... more imports

test('your actual test', () => {
  render(<YourComponent />);

  // standard screen query
  expect(screen.queryByText('Expected text')).toBeTruthy();

  // equivalent _enhanced_ query!
  expect(screen.query({ filter: 'text', params: ['Expected text'] }).toBeTruthy();
})
```

## `within`

Similarly, `query-extensions` provides its own version of the `within` API which
makes the extended queries available on the resulting query object.

```js
import { within, screen } from "query-extensions";
import { render } from "@testing-library/react";
// ... more imports

test("your actual test", () => {
  render(<YourComponent />);

  // standard within-scoped query
  expect(
    within(screen.getByTestId("container-id")).queryByText("Expected text")
  ).toBeTruthy();

  // equivalent _enhanced_ query! OK it's actually _longer_ but you'll have to
  // make your own conclusions about tradeoffs ;)
  const containerConfig = { filter: "testId", params: ["container-id"] };
  const targetConfig = { filter: "text", params: ["Expected text"] };
  expect(within(screen.get(containerConfig)).query(targetConfig)).toBeTruthy();
});
```

Scoping with `within` is also possible via the `within` property of the query
descriptor object (this can nest/compose with itself as well as the top-level
`within` API)

```js
import { screen } from "query-extensions";
import { render } from "@testing-library/react";
// ... more imports

test("your actual test", () => {
  render(<YourComponent />);

  // standard within-scoped query
  expect(
    within(screen.getByTestId("container-id")).queryByText("Expected text")
  ).toBeTruthy();

  // equivalent _enhanced_ query!
  const containerConfig = { filter: "testId", params: ["container-id"] };
  expect(
    query({
      filter: "text",
      params: ["Expected text"],
      within: containerConfig,
    })
  ).toBeTruthy();
});
```

## `enhanceQueries`

You can also enhance any query objects you like using `enhanceQueries`

```js
import { render } from '@testing-library/react';
import { enhanceQueries } from 'query-extensions';
// ... more imports

test('your actual test', () => {
  const queries = render(<YourComponent />);

  // standard query
  expect(queries.queryByText('Expected text')).toBeTruthy();

  // equivalent _enhanced_ query!
  const enhanced = enhanceQueries(queries);
  expect(enhanced.query({ filter: 'text', params: ['Expected text'] }).toBeTruthy();
})
```

## `queryBySelector` (and the whole \*BySelector family)

OK, you _really_ should do everything in your power to keep your tests following
the [guiding principles](https://testing-library.com/docs/guiding-principles) of
@testing-library

_BUT_ sometimes your application code is just a bit of a mess and your tests
really need to drop down and do a standard `querySelector`-style interaction.

This has always been possible with a bit of manual intervention, but
`query-extensions` offers a simple wrapper for API consistency.

```js
import { render } from "@testing-library/react";
import { screen } from "query-extensions";
// ... more imports

test("sometimes you just have to use a selector", async () => {
  const { unmount } = render(<YourComponent />);

  // maybe your logo is just a styled div with a background-image, I dunno
  const logoData = { filter: "selector", params: [".company-logo"] };

  const logo = screen.get(logoData);
  expect(logo).toHaveStyle({ backgroundImage: "/some/image.png" }); // maybe!?

  // the long-form query API is available as well, of course!
  const logo2 = screen.getBySelector(".company-logo");
  expect(logo2).toHaveStyle({ backgroundImage: "/some/image.png" });

  unmount();

  expect(screen.query(logoData)).toBeNull();
  expect(screen.queryBySelector(".company-logo")).toBeNull();
});
```
