// Dotenv allows .env files to hide API keys
const dotenv = require('dotenv');

// Path for prod
dotenv.config();

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
export const TIMEOUT_SEC = 10;
export const RESULTS_PER_PAGE = 10;
export const MODAL_CLOSE_SEC = 2.5;

// API keys hidden in .env file
export const KEY = process.env.KEY;
