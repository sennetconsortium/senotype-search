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
  fetch: async ({ url, token, body, cookies, method = 'POST' }) => {
    token = token === undefined ? AUTH.token(cookies) : token;
    const headers = API.jsonHeader();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    try {
      //log.debug('API.fetch', url, token)
      const res = await fetch(url, {
        method,
        headers: headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const errMsg = res.statusText ? res.statusText : 'An error occurred.';
        const description = await res.json();
        return { error: errMsg, description, status: res.status };
      }
      return res.json();
    } catch (error) {
      log.error('API.fetch', error);
    }
  },
  search: async (body, index = 'entities', token) => {
    return await API.fetch({ url: `${URLS.api.search}${index}/search`, body, token });
  },
  fetchSenotype: async (senotypeUuid, token) => {
    let data = {};

    const body = simple_query_builder('uuid', senotypeUuid);

    let jsonData = await API.search(body, ENVS.index.senotype, token);
    if (jsonData.hasOwnProperty('error')) {
      log.error(jsonData.error);
      return jsonData;
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
    log.debug('API.fetchForForm', predicate, query);
    const urls = {
      citation: {
        byCode: `${URLS.nih.pubMed}&id=<query>`,
        byTerm: `${URLS.nih.pubMed}&term=<query>`,
      },
      origin: `${URLS.sciCrunch.resolver}<query>`,
      dataset: `${URLS.api.search}entities/search`,
      cell_type: `${URLS.api.ontology}celltypes/<query>`,
      diagnosis: {
        byCode: `${URLS.api.ontology}codes/<query>/terms`,
        byTerm: `${URLS.api.ontology}terms/<query>/codes`,
      },
      specified_marker_set: {
        genes: `${URLS.api.ontology}genes/<query>`,
        proteins: `${URLS.api.ontology}proteins/<query>`,
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
          isCellType,
          isSpecifiedMarker,
          isRegulatedMarker,
          isDiagnosis,
          isCitation,
          isOrigin,
          isDataset,
          isExternalSource,
        } = PREDICATE;

      if (isDataset(predicate)) {
        url = urls[predicate];
        const body = {
          query: {
            multi_match: {
              query: `${query}*`,
              fields: ['title', 'description', 'sennet_id', 'dataset_type'],
            },
          },
          _source: ['title', 'description', 'sennet_id', 'dataset_type', 'uuid'],
        };
        log.debug('API.fetchForForm.isDataset', url);
        const result = await API.fetch({ url, body });
        return result
      }

      // Handle api param requirements per predicate

      if (
        (isCellType(predicate) ||
        isCitation(predicate) ||
        isSpecifiedMarker(predicate) ||
        isRegulatedMarker(predicate)) && hasCode
      ) {
        // Remove the preceeding CL: from query
        _query = query.split(':')[1];
      }
      
      if (isDiagnosis(predicate) || isCitation(predicate)) {
        url = byCode ? urls[predicate].byCode : urls[predicate].byTerm;
        if (isDiagnosis(predicate)) {
          // ADD required DOID: to query
          _query = isNum && !hasCode ? `${PREDICATE.prefixIds.diagnosis}${query}` : query;
        }
      } else if (isSpecifiedMarker(predicate) || isRegulatedMarker(predicate)) {
        if (query.toUpperCase().includes(PREDICATE.prefixIds.protein)) {
          url = urls.specified_marker_set.proteins;
        } else {
          url = urls.specified_marker_set.genes;
        }
      } else {
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
        const doids = result.filter((r) =>
          r.code.includes(PREDICATE.prefixIds.diagnosis),
        );
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
