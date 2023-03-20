import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage =
    'No recipes found for your your query!  Please try another one :)';
  _message = '';

  // -------------------------------------------------------------------
  /**
   * Generates markup for displaying search results in the UI.
   * @returns {string} HTML markup string to display search results.
   */
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

// -------------------------------------------------------------------

export default new ResultsView();
