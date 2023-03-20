import { TIMEOUT_SEC } from './config';

// -------------------------------------------------------------------

/**
 * Returns a promise that rejects after the specified number of seconds with an error message indicating a timeout.
 *
 * @param {number} s - The number of seconds before the promise should reject.
 * @returns {Promise<Error>} A promise that rejects with an error indicating a timeout.
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second(s).`));
    }, s * 1000);
  });
};

// -------------------------------------------------------------------

/**
 * Performs an AJAX request to the specified URL using the Fetch API and returns the parsed response data as a Promise.
 *
 * @param {string} url - The URL to send the AJAX request to.
 * @param {Object} [uploadData] - Optional data to include in the request body when performing a POST request.
 * @returns {Promise<Object>} A Promise that resolves with the parsed response data, or rejects with an error.
 * @throws {Error} If the response status is not OK, an error is thrown with the response status and message.
 */
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // 2 promises - whichever happens first gets returned
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err; // Rethrow to propagate error message in MVC chain
  }
};

// -------------------------------------------------------------------
