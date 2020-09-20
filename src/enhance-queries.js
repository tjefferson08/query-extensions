const capitalize = (s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

const required = (name) => {
  throw new TypeError(`${name} parameter is required`);
};

module.exports = {
  enhanceQueries: (queries) => {
    const buildApiAccessor = (api) => ({
      filter = required("filter"),
      params = [],
    } = {}) => {
      const fnName = `${api}By${capitalize(filter)}`;

      const fn = queries[fnName];
      if (!fn) {
        throw new Error(`Unsupported filter: ${filter}`);
      }

      return queries[fnName](...params);
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
