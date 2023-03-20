import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

// Poly-filling
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// -------------------------------------------------------------------

/**
 * Control recipe rendering based on URL hash changes
 * @async
 * @function controlRecipes
 * @returns {undefined}
 * @throws {Error} If an error occurs during the execution of the function
 */
const controlRecipes = async function () {
  try {
    // Get hash part of the url
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) In the bookmarks view dropdown, highlight the current
    // book mark if the same as the recipe viewed
    // Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

// -------------------------------------------------------------------

/**
 * Controller function that handles search results.
 *
 * @async
 * @function controlSearchResults
 * @returns {Promise<void>} - A Promise that resolves when search results are loaded and rendered.
 */
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {}
};

// -------------------------------------------------------------------

/**
 * Updates the search results and pagination buttons when a new page is clicked
 *
 * @param {number} goToPage - The page number to go to
 */
const controlPagination = function (goToPage) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

// -------------------------------------------------------------------

/**
 * Updates the recipe servings in the state and updates the view.
 *
 * @param {number} newServings - The new number of servings for the recipe.
 */
const controlServings = function (newServings) {
  // Update the recipe servings (in the state)
  model.updateServings(newServings);

  // Update the view
  recipeView.update(model.state.recipe); // Update rather than render, as render will do the entire DOM, putting unnecessary work on the browser
};

// -------------------------------------------------------------------

/**
 * Controller function to add or remove a bookmark to/from the current recipe.
 * Updates the model and view accordingly.
 *
 * @function
 * @returns {undefined}
 */
const controlAddBookmark = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Fill in the bookmark icon
  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// -------------------------------------------------------------------

/**
 * Controller function for rendering bookmarks on page load.
 */
const controlBookmarks = function () {
  // Ensure the bookmarks from local storage are loaded on page render
  bookmarksView.render(model.state.bookmarks);
};

// -------------------------------------------------------------------

/**
 * Controller function for adding a new recipe.
 *
 * @async
 * @param {Object} newRecipe - The new recipe data.
 * @param {string} newRecipe.title - The title of the new recipe.
 * @param {string} newRecipe.sourceUrl - The URL of the source for the new recipe.
 * @param {string} newRecipe.image - The URL of the image for the new recipe.
 * @param {string} newRecipe.publisher - The publisher of the new recipe.
 * @param {number} newRecipe.cookingTime - The cooking time of the new recipe in minutes.
 * @param {number} newRecipe.servings - The number of servings the new recipe makes.
 * @param {string[]} newRecipe.ingredients - The ingredients needed for the new recipe.
 * @returns {Promise<void>}
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    // Change URL without reloading page
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

// -------------------------------------------------------------------

// Subscriber asks for data in view module(s)
const init = function () {
  // Register handler functions
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

// -------------------------------------------------------------------

init();

// -------------------------------------------------------------------
