class SearchView {
  _parentEl = document.querySelector('.search');

  // -------------------------------------------------------------------

  /**
   * Returns the current value of the search input field and clears the input field.
   * @returns {string} The value of the search input field.
   */
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // -------------------------------------------------------------------

  /**
   * Clears the search input field.
   * @returns {void}
   */
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  // -------------------------------------------------------------------

  // Publisher
  /**
   * Add a handler function for the search event
   * @param {Function} handler - The handler function for the search event
   */
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();

      handler();
    });
  }
}

// -------------------------------------------------------------------

export default new SearchView();
