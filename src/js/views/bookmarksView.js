import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet.  Find a nice recipe and bookmark it :)';
  _message = '';

  // -------------------------------------------------------------------

  /**
  Registers a handler to be called when the load event fires on the window.
  @param {Function} handler - The function to be called when the load event fires.
  */
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  // -------------------------------------------------------------------
  /**

  Generates markup for each bookmark in the _data array using the previewView and concatenates them into a single string.
  @returns {string} A string containing the markup for all bookmarks in the _data array.
  */
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

// -------------------------------------------------------------------

export default new BookmarksView();
