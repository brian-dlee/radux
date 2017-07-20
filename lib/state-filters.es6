class BaseFilter {
  constructor(keys = []) {
    this.keys = keys || [];
  }
}

class IncludeFilter extends BaseFilter {
  apply(object) {
    const result = {};
    Object.keys(object).forEach(k => {
      if (this.keys.includes(k)) result[k] = object[k];
    });
    return result;
  }
}

class ExcludeFilter extends BaseFilter {
  apply(object) {
    const result = {};
    Object.keys(object).forEach(k => {
      if (!this.keys.includes(k)) result[k] = object[k];
    });
    return result;
  }
}

export {
    IncludeFilter,
    ExcludeFilter
};