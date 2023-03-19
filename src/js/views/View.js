import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  // -------------------------------------------------------------------

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // -------------------------------------------------------------------

  // Update only changed parts of the DOM based on the incoming data
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

  #clear() {
    this._parentElement.innerHTML = '';
  }

  // -------------------------------------------------------------------

  renderSpinner() {
    const markup = `
                      <div class="spinner">
                        <svg>
                          <use href="${icons}#icon-loader"></use>
                        </svg>
                      </div>
      `;

    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // -------------------------------------------------------------------

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

    this.#clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  // -------------------------------------------------------------------

  renderMessage(message = this._message) {
    markup = `
      <div class="message">
          <div>
              <svg>
                  <use href="${icons}#icon-smile"></use>
              </svg>
          </div>
          <p>${message}</p>
      </div>
      `;
  }
}
