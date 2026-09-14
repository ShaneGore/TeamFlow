/**
 * Central place for all backend calls.
 *
 * All data flows through this module to the FastAPI backend over HTTP/JSON.
 * No mock or hardcoded board data remains in the UI path: every method below
 * issues a real request to /api/* on the backend base URL.
 */
import { httpRequest } from './httpClient.js';

function queryString(query = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;
    params.set(key, String(value));
  }
  const text = params.toString();
  return text ? `?${text}` : '';
}

export const apiMode = 'http';

export const api = {
  health() {
    return httpRequest('/api/health');
  },
  listTasks(query) {
    return httpRequest(`/api/tasks${queryString(query)}`);
  },
  getTask(id) {
    return httpRequest(`/api/tasks/${id}`);
  },
  createTask(payload) {
    return httpRequest('/api/tasks', { method: 'POST', body: payload });
  },
  updateTask(id, payload) {
    return httpRequest(`/api/tasks/${id}`, { method: 'PUT', body: payload });
  },
  updateTaskStatus(id, status) {
    return httpRequest(`/api/tasks/${id}/status`, { method: 'PATCH', body: { status } });
  },
  deleteTask(id) {
    return httpRequest(`/api/tasks/${id}`, { method: 'DELETE' });
  },
  listMembers() {
    return httpRequest('/api/team-members');
  },
  createMember(payload) {
    return httpRequest('/api/team-members', { method: 'POST', body: payload });
  },
  deleteMember(id) {
    return httpRequest(`/api/team-members/${id}`, { method: 'DELETE' });
  },
};

