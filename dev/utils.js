var debounceTimeout;

module.exports = {
  /**
   * Ensures a function doesn't run too often.
   *
   * @param {function} func - Function that shouldn't be called too often.
   * @param {number} delay - Time to wait between function calls in milliseconds.
   * @returns {function}
   * @example
   * debounce(callback);
   *
   * debounce(function(){
   *   // your code
   * }, 500);
   */
  debounce: function(func, delay){
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay || 100);
  }
};