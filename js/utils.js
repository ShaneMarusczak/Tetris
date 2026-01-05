/**
 * Utility functions
 */

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Sleep for a specified number of milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after the delay
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Set a cookie
 * @param {string} name - Cookie name
 * @param {string|number} value - Cookie value
 * @param {number} expirationDays - Days until expiration
 */
export function setCookie(name, value, expirationDays) {
  const date = new Date();
  date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + date.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/;SameSite=Lax';
}

/**
 * Get a cookie value
 * @param {string} name - Cookie name
 * @returns {string} Cookie value or empty string
 */
export function getCookie(name) {
  const searchName = name + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(searchName) === 0) {
      return cookie.substring(searchName.length);
    }
  }
  return '';
}

/**
 * Generate cell ID from column and row
 * @param {number} col - Column
 * @param {number} row - Row
 * @returns {string} Cell ID
 */
export function getCellId(col, row) {
  return col + '-' + row;
}

/**
 * Parse cell ID to get column and row
 * @param {string} id - Cell ID
 * @returns {number[]} [col, row]
 */
export function parseId(id) {
  const parts = id.split('-');
  return [Number(parts[0]), Number(parts[1])];
}

/**
 * Create and display a closable modal
 * @param {string} message - Message to display
 */
export function closableModal(message) {
  const modalBox = document.createElement('div');
  modalBox.id = 'modal-box';

  const innerModalBox = document.createElement('div');
  innerModalBox.id = 'inner-modal-box';

  const modalMessage = document.createElement('span');
  modalMessage.id = 'modal-message';
  modalMessage.innerText = message;

  const closeButton = document.createElement('span');
  closeButton.id = 'close-button';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => modalBox.remove());

  innerModalBox.appendChild(modalMessage);
  innerModalBox.appendChild(closeButton);
  modalBox.appendChild(innerModalBox);

  document.documentElement.appendChild(modalBox);
}
