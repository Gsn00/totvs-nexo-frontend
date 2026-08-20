export async function apiFetch(endpoint, options = {}) {
  const baseUrl = import.meta.env.VITE_API_URL;
  const url = `${baseUrl}${endpoint}`;

  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !(options.body instanceof URLSearchParams)
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
  }

  return response;
}
