class BaseFilter {
  constructor(keys = []) {
    this.keys = keys || [];
    this.tests = [];
    this.registerTests();
  }

  registerTests() {
    this.tests.push(k => /^globals?$/i.test(k));
  }

  test(k) {
    return this.tests.filter(t => t(k)).length > 0;
  }

  apply(object) {
    const result = {};
    Object.keys(object).forEach(k => {
      if (this.test(k)) result[k] = object[k];
    });
    return result;
  }
}

class IncludeFilter extends BaseFilter {
  registerTests() {
    super.registerTests();
    this.tests.push(k => this.keys.includes(k));
  }
}

class ExcludeFilter extends BaseFilter {
  registerTests() {
    super.registerTests();
    this.tests.push(k => !this.keys.includes(k));
  }
}

const include = keys => new IncludeFilter(keys);
const exclude = keys => new ExcludeFilter(keys);

export default {
  include,
  exclude
};

export { BaseFilter, IncludeFilter, ExcludeFilter };
