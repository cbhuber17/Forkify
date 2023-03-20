import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  // -------------------------------------------------------------------

  /**
   * Renders the view with the provided data.
   *
   * @param {Object|Array} data - The data used to generate the view's markup.
   * @param {boolean} [render=true] - Whether to render the generated markup or not.
   * @returns {string|undefined} If `render` is false, returns the generated markup as a string.
   * Otherwise, inserts the generated markup into the DOM and returns undefined.
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // -------------------------------------------------------------------

  // Update only changed parts of the DOM based on the incoming data
  /**
   * Updates the view with new data, by comparing the new markup with the old markup and updating only the changed elements.
   *
   * @param {Object|Array} data - The new data used to generate the updated view's markup.
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); // Compare new HTML with old HTML

    // Convert new markup string to DOM objects (create virtual DOM - one that is not on the real page)
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    // Get all new and current elements in a list to compare
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Go through each and check for differences
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // If nodes are not equal, and the child of the node (if it exists, denoted by '?') is text, update
      // First update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUTE
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  // -------------------------------------------------------------------

  /**
   * Clears the content of the parent element.
   *
   * @private
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }

  // -------------------------------------------------------------------

  /**
   * Renders a spinner in the parent element.
   */
  renderSpinner() {
    const markup = `
                      <div class="spinner">
                        <svg>
                          <use href="${icons}#icon-loader"></use>
                        </svg>
                      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // -------------------------------------------------------------------

  /**
   * Renders an error message in the parent element.
   *
   * @param {string} [message=this._errorMessage] - The error message to display. Defaults to the `_errorMessage` property of the view.
   */
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <div>
              <svg>
               <use href="${icons}#icon-alert-triangle"></use>
              </svg>
          </div>
          <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // -------------------------------------------------------------------

  /**
   * Renders a message in the parent element.
   *
   * @param {string} [message=this._message] - The message to display. Defaults to the `_message` property of the view.
   */
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
          <div>
              <svg>
                  <use href="${icons}#icon-smile"></use>
              </svg>
          </div>
          <p>${message}</p>
      </div>
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
