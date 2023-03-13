import * as model from './model.js';
import recipeView from './views/recipeView.js';

// Poly-filling
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
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
    console.error(err);
  }
};

controlRecipe();

// Show recipe upon page load or URL hash (ID) change
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipe)
);
