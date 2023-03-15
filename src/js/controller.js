import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

// Poly-filling
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// -------------------------------------------------------------------

const controlRecipes = async function () {
  try {
    // Get hash part of the url
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 1) Loading recipe
    await model.loadRecipe(id);

    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

// -------------------------------------------------------------------

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.state.search.results);
  } catch (err) {}
};

// -------------------------------------------------------------------

// Subscriber asks for data in view module
const init = function () {
  recipeView.addHandleRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

// -------------------------------------------------------------------

init();

// -------------------------------------------------------------------
