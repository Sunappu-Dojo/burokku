// First-time written in https://github.com/DCMLab/reductive_analysis_app/commits/0e93a8b651c77e87786342b5152a47f65cc58c5c/src/js/new/utils/cache.js

/**
 * An extension of Map to use it as a cache.
 */
export class CacheMap extends Map {

  /**
   * Adds a cache entry if the specified key is new in the cache.
   *
   * @param {string} key
   * @param {*} value
   * @returns {CacheMap}
   */
  add = (key, value) => this.has(key) ? this : this.set(key, value)

  /**
   * Adds a cache entry if the key is new in the cache, then returns the value.
   *
   * The provided value can be of any type, and can also be a function that
   * will only be executed if the key is new in the cache.
   *
   * @param {string} key
   * @param {*|function():*} value Value to cache or a function returning it.
   * @returns {*} Returns the (computed) `value` parameter.
   */
  remember = (key, value) => {
    if (!this.has(key)) {
      this.set(key, typeof value == 'function' ? value() : value)
    }

    return this.get(key)
  }
}
