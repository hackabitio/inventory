const url = 'http://localhost:8000/products';

export function api() {
  return fetch(url, {
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  });
}
