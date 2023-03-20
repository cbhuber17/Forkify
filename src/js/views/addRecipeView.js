import icons from 'url:../../img/icons.svg';
import View from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  // -------------------------------------------------------------------

  /**
  Creates a new AddRecipeView object.
  @constructor
  @extends View
  @property {HTMLElement} _parentElement - The DOM element where the add recipe form will be rendered.
  @property {string} _message - The message to display when the recipe has been successfully uploaded.
  @property {HTMLElement} _window - The DOM element representing the add recipe modal window.
  @property {HTMLElement} _overlay - The DOM element representing the modal overlay.
  @property {HTMLElement} _btnOpen - The DOM element representing the button to open the add recipe modal window.
  @property {HTMLElement} _btnClose - The DOM element representing the button to close the add recipe modal window.
  @returns {AddRecipeView} The new AddRecipeView object.
  */
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  // -------------------------------------------------------------------

  /**
  Toggles the visibility of the add recipe window and overlay.
  */
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // -------------------------------------------------------------------

  /**
   * Adds an event listener to the "Add Recipe" button to show the add recipe window when clicked.
   */
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this)); // Don't want this to attach to button, want it to attach to querySelector object
  }

  // -------------------------------------------------------------------

  /**
   * Attaches event listeners to the close button and overlay to hide the modal window when clicked.
   *
   * @returns {void}
   */
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this)); // Close upon clicking 'X'
    this._overlay.addEventListener('click', this.toggleWindow.bind(this)); // Close upon clicking outside modal
  }

  // -------------------------------------------------------------------

  /**
   * Add a handler function to the form submission event for uploading a new recipe.
   * @param {Function} handler - The handler function to be executed on form submission.
   * The function should accept one argument, which is an object containing the data from the form.
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }
}

// -------------------------------------------------------------------

export default new AddRecipeView();
