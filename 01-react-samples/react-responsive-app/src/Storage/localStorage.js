export function saveCustomToken(customToken) {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem('custom_token', customToken);
  }
}

export function loadCustomToken() {
  if (typeof Storage !== 'undefined') {
    const customToken = localStorage.getItem('custom_token');
    return customToken;
  }
  return '';
}

export function deleteCustomToken() {
  if (typeof Storage !== 'undefined') {
    localStorage.removeItem('custom_token');
  }
}
