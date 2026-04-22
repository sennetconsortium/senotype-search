import URLS from './urls';
import log from 'xac-loglevel';
import AUTH from './auth';
import { simple_query_builder } from '@/search-ui/lib/search-tools';
import ENVS from './envs';
import PREDICATE from '@/lib/predicate';

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
    log.info('API.fetchUBKG', `${URLS.api.ontology}${endpoint}`);
    return API.fetch({ url: `${URLS.api.ontology}${endpoint}`, method: 'GET' });
  },
  fetchForForm: async (predicate, query) => {
    
    const urls = {
      has_citation: {
        byCode: `${URLS.nih.pubMed}&id=<query>`,
        byTerm: `${URLS.nih.pubMed}&term=<query>`,
      },
      has_origin: `${URLS.sciCrunch.base}<query>`,
      has_dataset: `${URLS.api.entity.base}entities/<query>`,
      has_cell_type: `${URLS.api.ontology}celltypes/<query>`,
      has_diagnosis: {
        byCode: `${URLS.api.ontology}codes/<query>/terms`,
        byTerm: `${URLS.api.ontology}terms/<query>/codes`,
      },
    };
    try {
      const formatUrl = (url, q) => url.replace('<query>', q);
      let _query = query;
      let url;
      const hasCode = query.includes(':');
      const isNum = Number(query) > 0;
      const byCode = hasCode || isNum;
      const {
          isAssay,
          isCellType,
          isHallmark,
          isDiagnosis,
          isCitation,
          isOrigin,
          isDataset,
          isExternalSource,
        } = PREDICATE;

      // Handle api param requirements per predicate

      if ((isCellType(predicate) || isCitation(predicate)) && hasCode) {
        // Remove the preceeding CL: from query
        _query = query.split(':')[1];
      }

      if (isDiagnosis(predicate) || isCitation(predicate)) {
        url = byCode ? urls[predicate].byCode : urls[predicate].byTerm;
        if (isDiagnosis()) {
          // ADD required DOID: to query
          _query = isNum && !hasCode ? `DOID:${query}` : query;
        }
      }  else {
         if (isOrigin(predicate)) {
           // API needs .json extension
           _query = `${query}.json`;
         }
        url = urls[predicate];
      }

      url = formatUrl(url, _query);
      log.debug('API.fetchForForm', url);
      const result = await API.fetch({ url, method: 'GET' });

      if (isDiagnosis(predicate) && !byCode) {
        // Get the DOID from results
        const doids = result.filter((r) => r.code.includes('DOID:'));
        // Use DOID list to return diagnosis list and terms
        const doidPromises = doids.map((r) =>
          API.fetch({
            url: formatUrl(urls[predicate].byCode, r.code),
            method: 'GET',
          }),
        );
        log.debug('API.fetchForForm.isDiagnosis.!byCode', doids);
        const promises = await Promise.all(doidPromises);
        // Flatten array of arrays
        return promises.flat();
      } else {
        return result;
      }
    } catch (e) {
      log.error('API.fetchForForm.catch', predicate, query, e);
    }
  }
};
export default API;
