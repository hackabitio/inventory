const base = 'http://localhost:8000';

export function api(method, resource, data) {
  return fetch(`${base}/${resource}`, {
    method,
    headers: {
      'content-type': 'application/json'
    },
    body: data && JSON.stringify(data)
  });
}
