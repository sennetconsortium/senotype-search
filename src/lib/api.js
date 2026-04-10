import URLS from './urls';
import log from 'xac-loglevel';
import AUTH from './auth';

const API = {
  jsonHeader: (headers) => {
    headers = headers || new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  },
  fetch: async ({ url, token, body, method = 'POST' }) => {
    token = token || AUTH.token();
    const headers = API.jsonHeader();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    try {
      const res = await fetch(url, {
        method,
        headers: headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        return null;
      }
      return res.json();
    } catch (error) {
      log.error(error);
    }
    return null;
  },
  search: async (body, index = 'entities') => {
    return await API.fetch({ url: `${URLS.api.search}${index}/search`, body });
  },
};
export default API;
