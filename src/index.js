const capitalize = s => `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

module.exports = {
  enhanceQueries: queries => {
    const buildApiAccessor = api => ({ filter, params } = {}) => {
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
      query: buildApiAccessor("query"),
      find: buildApiAccessor("find")
    };
  }
};
