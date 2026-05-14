import { API_BASE_URL, AUTH_BASE_URL } from "../constants/index.js";

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json") ? response.json() : null;
}

export async function authRequest(path, options = {}) {
  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(
      payload?.message ?? payload?.error ?? "Authentication request failed.",
    );
  }

  return payload;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new Error(payload?.message ?? "API request failed.");
  }

  return payload;
}
