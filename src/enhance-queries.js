const { within: dtlWithin } = require("@testing-library/dom");

const capitalize = (s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

const required = (name) => {
  throw new TypeError(`${name} parameter is required`);
};

module.exports = {
  enhanceQueries: (queries) => {
    const buildApiAccessor = (api) => ({
      filter = required("filter"),
      params = [],
      within,
    } = {}) => {
      const fnName = `${api}By${capitalize(filter)}`;

      const fn = queries[fnName];
      if (!fn) {
        throw new Error(`Unsupported filter: ${filter}`);
      }

      if (within) {
        // use the same query descriptor API to fetch the scoping element
        const scopedElement = buildApiAccessor("get")(within);
        return dtlWithin(scopedElement)[fnName](...params);
      } else {
        return queries[fnName](...params);
      }
    };

    return {
      ...queries,
      get: buildApiAccessor("get"),
      getAll: buildApiAccessor("getAll"),
      query: buildApiAccessor("query"),
      queryAll: buildApiAccessor("queryAll"),
      find: buildApiAccessor("find"),
      findAll: buildApiAccessor("findAll"),
    };
  },
};
