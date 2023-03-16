import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  // -------------------------------------------------------------------

  // Add publisher to handle clicking pagination buttons
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto; // data-goto= in button HTML below
      handler(goToPage);
    });
  }

  // -------------------------------------------------------------------

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
