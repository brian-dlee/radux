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
  }

  /**
   * Register tests for filter
   * This should be extended in all other filter classes
   */
  registerTests() {
    this.tests.push(k => /^globals?$/i.test(k));
  }

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
    super.registerTests();
    this.tests.push(k => this.keys.includes(k));
  }
}

/**
 * Filter which excludes all keys provided
 */
class ExcludeFilter extends BaseFilter {
  registerTests() {
    super.registerTests();
    this.tests.push(k => !this.keys.includes(k));
  }
}

/**
 * Funcational adapters for include and exclude filters
 * @param keys
 */
const include = keys => new IncludeFilter(keys);
const exclude = keys => new ExcludeFilter(keys);

export default {
  include,
  exclude
};

export { BaseFilter, IncludeFilter, ExcludeFilter };
