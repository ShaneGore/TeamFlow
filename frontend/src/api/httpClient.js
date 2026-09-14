import { ApiError } from './constants.js';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function parseBody(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function toMessage(body, fallback) {
  if (!body) return fallback;
  if (typeof body === 'string') return body;
  if (typeof body.detail === 'string') return body.detail;
  if (Array.isArray(body.detail)) {
    const first = body.detail[0];
    if (typeof first === 'string') return first;
    if (first?.msg) return String(first.msg);
  }
  if (typeof body.message === 'string') return body.message;
  if (typeof body.error === 'string') return body.error;
  return fallback;
}

export async function httpRequest(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the backend. Check that it is running.', { status: 0 });
  }

  const data = await parseBody(response);
  if (!response.ok) {
    throw new ApiError(toMessage(data, `Request failed (${response.status}).`), {
      status: response.status,
      details: data?.details ?? data?.errors ?? null,
    });
  }
  return data;
}
