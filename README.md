# query-extensions
Extensions for core @testing-library queries

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
    loading: { filter: "text", params: ["Loading..."] }
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

1) A UI element goes from rendering sync to async (or vice versa)
2) A UI element has a text/markup/label change which requires a different query

# Usage

There's a handy, pre-built `screen` object available for direct use
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
