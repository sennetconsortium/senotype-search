import URLS from './urls';
import log from 'xac-loglevel';
import AUTH from './auth';
import { simple_query_builder } from '@/search-ui/lib/search-tools';
import ENVS from './envs';

const API = {
  jsonHeader: (headers) => {
    headers = headers || new Headers();
    headers.append('Content-Type', 'application/json');
    return headers;
  },
  fetch: async ({ url, token, body, method = 'POST' }) => {
    token = token === undefined ? AUTH.token() : token;
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
        const errMsg = res.statusText ? res.statusText : await res.text()
        return { error: errMsg, status: res.status };
      }
      return res.json();
    } catch (error) {
      log.error('API.fetch', error);
    }
  },
  search: async (body, index = 'entities') => {
    return await API.fetch({ url: `${URLS.api.search}${index}/search`, body });
  },
  fetchSenotype: async (senotypeUuid) => {
    let data = {};

    const body = simple_query_builder('uuid', senotypeUuid);

    let jsonData = await API.search(body, ENVS.index.senotype);
    if (jsonData.hasOwnProperty('error')) {
      log.error(jsonData.error);
      return data;
    } else {
      let total = jsonData['hits']['total']['value'];
      if (total !== 0) {
        let senotype; //result["hits"]["hits"][0]["_source"]
        jsonData['hits']['hits'].forEach((hit) => {
          if (hit['_source']['uuid'] === senotypeUuid) {
            senotype = hit['_source'];
          }
        });
        if (senotype) {
          return senotype;
        }
      }
    }
  },
  fetchUBKG: (endpoint) => {
    console.log(`${URLS.api.ontology}${endpoint}`);
    return API.fetch({ url: `${URLS.api.ontology}${endpoint}`, method: 'GET' });
  },
};
export default API;
