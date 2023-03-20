import { API_URL, RESULTS_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';

// -------------------------------------------------------------------

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

// -------------------------------------------------------------------

/**
Loads recipe data from API using recipe ID.
@param {string} id - The ID of the recipe to load.
@returns {Promise} A Promise that resolves with the recipe data or rejects with an error.
*/
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    // When jumping between recipes in the search preview, the bookmark
    // will disappear.  The code below checks the array if it is bookmarked
    // so the icon is filled properly.
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

// -------------------------------------------------------------------

/**
 * Loads search results from the API and updates the application state with the
 * retrieved data.
 *
 * @async
 * @function loadSearchResults
 * @param {string} query - The search query to send to the API.
 * @throws {Error} When the API request fails or returns an error.
 * @returns {Promise<void>}
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // Reset for new search; start on pg 1
    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// -------------------------------------------------------------------

/**
 * Retrieves a slice of the search results array based on the provided page number and number of results per page.
 * @param {number} [page=state.search.page] - The page number to retrieve.
 * @returns {Object[]} An array of search result objects representing a single page of results.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

// -------------------------------------------------------------------

/**
 * Updates the number of servings in the current recipe and adjusts the ingredient quantities accordingly.
 *
 * @param {number} newServings - The new number of servings for the recipe.
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity *= newServings / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

// -------------------------------------------------------------------

/**
Persists the bookmarks array to local storage.
*/
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// -------------------------------------------------------------------

/**
 * Add a bookmark to the state and persist it to local storage.
 *
 * @param {Object} recipe - The recipe to bookmark.
 * @param {string} recipe.id - The ID of the recipe.
 * @param {string} recipe.title - The title of the recipe.
 * @param {string} recipe.publisher - The publisher of the recipe.
 * @param {string} recipe.image - The URL of the image for the recipe.
 * @param {number} recipe.servings - The number of servings for the recipe.
 * @param {Array<Object>} recipe.ingredients - An array of objects representing the ingredients for the recipe.
 * @param {string} recipe.ingredients.quantity - The quantity of the ingredient.
 * @param {string} recipe.ingredients.unit - The unit of measurement for the ingredient.
 * @param {string} recipe.ingredients.description - The description of the ingredient.
 */
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

// -------------------------------------------------------------------

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// -------------------------------------------------------------------

/**
 * Deletes a bookmark from the state.bookmarks array.
 *
 * @param {string} id - The ID of the bookmark to be deleted.
 *
 * @returns {void}
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};

// -------------------------------------------------------------------

init();

// -------------------------------------------------------------------

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// For debugging, comment out init() above as well
// clearBookmarks();

// -------------------------------------------------------------------

/**
 * Creates a recipe object from the API response data.
 *
 * @param {Object} data - The recipe data object returned from the API.
 * @returns {Object} A recipe object with properties id, title, publisher, sourceUrl,
 * image, servings, cookingTime, ingredients, and key (if present in data object).
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //Nothing happens if recipe.key is falsy, otherwise it becomes - key: recipe.key
  };
};

// -------------------------------------------------------------------
/**
 * Uploads a new recipe to the server and updates the state.
 *
 * @async
 * @param {Object} newRecipe - The new recipe object to upload, with properties for title, sourceUrl, image, publisher, cookingTime, servings, and ingredients.
 * @returns {Promise<void>} A Promise that resolves after the new recipe has been uploaded and the state has been updated.
 * @throws {Error} If the ingredients array is empty or if an ingredient is not formatted correctly.
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
