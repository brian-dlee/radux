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

const include = keys => new IncludeFilter(keys);
const exclude = keys => new ExcludeFilter(keys);

export default {
  include,
  exclude
};

export { BaseFilter, IncludeFilter, ExcludeFilter };
