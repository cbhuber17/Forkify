import icons from 'url:../../img/icons.svg';
import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  // -------------------------------------------------------------------

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  // -------------------------------------------------------------------

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // -------------------------------------------------------------------

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // Don't want this to attach to button, want it to attach to querySelector object
  }

  // -------------------------------------------------------------------

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this)); // Close upon clicking 'X'
    this._overlay.addEventListener('click', this.toggleWindow.bind(this)); // Close upon clicking outside modal
  }

  // -------------------------------------------------------------------

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }

  // -------------------------------------------------------------------

  _generateMarkup() {}
}

// -------------------------------------------------------------------

export default new AddRecipeView();
