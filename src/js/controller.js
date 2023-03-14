import * as model from './model.js';
import recipeView from './views/recipeView.js';

// Poly-filling
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// -------------------------------------------------------------------

const controlRecipes = async function () {
  try {
    // Get hash part of the url
    // const id = window.location.hash.slice(1);
    const id = '5ed6604591c37cdc054bcc40'; // TODO: Remove

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

// Subscriber asks for data in view module
const init = function () {
  recipeView.addHandleRender(controlRecipes);
};

// -------------------------------------------------------------------

init();

// -------------------------------------------------------------------
