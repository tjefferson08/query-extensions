# query-extensions
Extensions for core @testing-library queries

# Install
```sh
npm install query-extensions

# or
yarn add query-extensions
```

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
