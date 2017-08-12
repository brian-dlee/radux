/**
 * Filter base class
 * Only allows globally registered state and action dispatchers
 */
class BaseFilter {
  /**
   * Constructor calls registerTests
   * @param keys Array of top-level state keys to apply filter to
   */
  constructor(keys = []) {
    this.keys = keys || [];
    this.tests = [];
    this.registerTests();

    return this;
  }

  /**
   * Register tests for filter
   * This should be extended in all other filter classes
   */
  registerTests() {}

  /**
   * Perform test on top-level state key
   * @param k top level state key
   * @returns {boolean} True if key should be passed through to connected Component's state
   */
  test(k) {
    return this.tests.filter(t => t(k)).length > 0;
  }

  /**
   * The meat of the filter.
   * Runs through top-level object keys and runs tests on it
   * @param object
   * @returns {{}}
   */
  apply(object) {
    const result = {};
    Object.keys(object).forEach(k => {
      if (this.test(k)) result[k] = object[k];
    });
    return result;
  }
}

/**
 * Filter which keeps all keys provided
 */
class IncludeFilter extends BaseFilter {
  registerTests() {
    this.tests.push(k => this.keys.includes(k));
    return this;
  }
}

/**
 * Allows all state keys
 */
class PermissiveFilter extends BaseFilter {
  registerTests() {
    this.tests.push(k => true);
    return this;
  }
}

/**
 * Allow only the global and set reducer state key
 */
class RestrictiveFilter extends BaseFilter {
  registerTests() {
    this.tests.push(k => false);
    return this;
  }
}

/**
 * Allows customization of keys
 * @callback testFunc Performs filter on state
 * @param {String} key State key being examined
 * @return {boolean} A result of true means the key should be kept in the resulting state
 */
class CustomFilter extends BaseFilter {
  registerTests(testFunc) {
    this.tests.push(k => testFunc(k));
    return this;
  }
}

/**
 * Funcational adapters for include and exclude filters
 * @param keys
 */
const include = keys => new IncludeFilter(keys);
const custom = func => new CustomFilter().registerTests(func);

export default {
  custom,
  include
};

export {
  BaseFilter,
  CustomFilter,
  IncludeFilter,
  PermissiveFilter,
  RestrictiveFilter
};
