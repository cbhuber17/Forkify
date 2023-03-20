import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // -------------------------------------------------------------------

  // Add publisher to handle clicking pagination buttons
  /**
  Adds an event listener to the pagination element to handle clicking on pagination buttons.
  @param {Function} handler - The function that handles the click event on the pagination buttons.
  */
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto; // data-goto= in button HTML below
      handler(goToPage);
    });
  }

  // -------------------------------------------------------------------

  /**
   * Generates HTML markup for the pagination buttons based on the current page number
   * and the total number of pages in the model's data.
   * @returns {string} The HTML markup string representing the pagination buttons.
   */
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and there are other pages, render next button
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupButton(curPage, 1);
    }

    // Last page, render previous button
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupButton(curPage, -1);
    }

    // Other page number, render both buttons
    if (curPage < numPages) {
      return `${this._generateMarkupButton(curPage, -1)}
              ${this._generateMarkupButton(curPage, 1)}`;
    }

    // Page 1 and there are NO other pages
    // Don't render any button
    return '';
  }

  // -------------------------------------------------------------------
  /**
   * Returns the HTML markup for a pagination button, given the current page and offset.
   *
   * @private
   * @param {number} curPage - The current page number.
   * @param {number} offset - The offset by which to change the current page number.
   * @returns {string} The HTML markup for the pagination button.
   */
  _generateMarkupButton(curPage, offset) {
    let btnLocation = '';
    let arrowDirection = '';

    if (offset === 1) {
      btnLocation = 'next';
      arrowDirection = 'right';
    }

    if (offset === -1) {
      btnLocation = 'prev';
      arrowDirection = 'left';
    }

    return `
        <button data-goto="${curPage + offset}"
        class="btn--inline pagination__btn--${btnLocation}">
            <span>Page ${curPage + offset}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-${arrowDirection}"></use>
          </svg>
      </button>
    `;
  }
}

// -------------------------------------------------------------------

export default new PaginationView();
