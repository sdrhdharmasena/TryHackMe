// JWT LocalStorage Utility Functions

/**
 * Store JWT token in localStorage
 * @param {string} token - JWT token to store
 */
function storeJWT(token) {
  localStorage.setItem('jwt_token', token);
  console.log('JWT stored in localStorage');
}

/**
 * Get JWT token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
function getJWT() {
  return localStorage.getItem('jwt_token');
}

/**
 * Remove JWT token from localStorage
 */
function removeJWT() {
  localStorage.removeItem('jwt_token');
  console.log('JWT removed from localStorage');
}

/**
 * Decode JWT payload (without verification - for display purposes only)
 * @param {string} token - JWT token to decode
 * @returns {object|null} Decoded payload or null if invalid
 */
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Check if JWT token exists and is not expired
 * @returns {boolean} True if valid token exists
 */
function isJWTValid() {
  const token = getJWT();
  if (!token) return false;

  const decoded = decodeJWT(token);
  if (!decoded) return false;

  // Check if token is expired
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp > now;
}

/**
 * Make authenticated API request with JWT from localStorage
 * @param {string} url - API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
function authenticatedFetch(url, options = {}) {
  const token = getJWT();

  if (!options.headers) {
    options.headers = {};
  }

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, options);
}

/**
 * Login with credentials and store JWT in localStorage
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<boolean>} Success status
 */
async function loginWithJWT(username, password) {
  try {
    const response = await fetch('/auth/login-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success && data.token) {
      storeJWT(data.token);
      return true;
    } else {
      console.error('Login failed:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}

/**
 * Logout and remove JWT from localStorage
 */
function logoutJWT() {
  removeJWT();
  window.location.href = '/';
}

// Auto-include JWT token in all AJAX requests
$(document).ajaxSend(function (event, xhr, settings) {
  const token = getJWT();
  if (token) {
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  }
});

// Check token validity on page load
document.addEventListener('DOMContentLoaded', function () {
  const token = getJWT();
  if (token) {
    const decoded = decodeJWT(token);
    if (decoded) {
      console.log('Current user from localStorage JWT:', decoded.username);
      console.log('Token expires:', new Date(decoded.exp * 1000));

      if (!isJWTValid()) {
        console.log('JWT token has expired, removing...');
        removeJWT();
      }
    }
  }
});