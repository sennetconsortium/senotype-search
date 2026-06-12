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
        const errMsg = res.statusText ? res.statusText : await res.text();
        return { error: errMsg, status: res.status };
      }
      return res.json();
    } catch (error) {
      log.error('API.fetch', error);
    }
  },
  search: async (body, index = 'entities', token) => {
    return await API.fetch({
      url: URLS.api.search.byIndex(index),
      body,
      token,
    });
  },
  fetchReferences: async (senotype) => {
    if (senotype.has_dataset) {
        const uuids = senotype.has_dataset
          .map((d) => d.uuid)
          .filter((x) => x !== null);
        const datasets = await API.fetchSearchApiByField(uuids);
        const items = [];
        for (const d of datasets) {
          let url = `${URLS.portal}dataset?uuid=${d.uuid}`;
          if (d.doi_url) {
            const datacite = {title: await API.fetchDataCite(d.doi_url), url:  URLS.getCitationUrl(d)};
            items.push({ ...d, datacite, url});
          } else {
            items.push({
              ...d,
              url,
            });
          }
        }
        if (items.length) {
          senotype.has_dataset = items;
        }
    }
    return senotype;
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
          senotype = await API.fetchReferences(senotype);
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
      has_origin: `${URLS.sciCrunch.resolver}<query>`,
      has_dataset: URLS.api.search.byIndex(),
      has_cell_type: `${URLS.api.ontology}celltypes/<query>`,
      has_diagnosis: {
        byCode: `${URLS.api.ontology}codes/<query>/terms`,
        byTerm: `${URLS.api.ontology}terms/<query>/codes`,
      },
      has_characterizing_marker_set: {
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
          isMarker,
          isRegulatingMarker,
          isDiagnosis,
          isCitation,
          isOrigin,
          isDataset,
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
          _source: [
            'title',
            'description',
            'sennet_id',
            'dataset_type',
            'uuid',
          ],
        };
        log.debug('API.fetchForForm.isDataset', url);
        const result = await API.fetch({ url, body });
        return result
      }

      // Handle api param requirements per predicate

      if (
        isCellType(predicate) ||
        isCitation(predicate) ||
        isMarker(predicate) ||
        (isRegulatingMarker(predicate) && hasCode)
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
      } else if (isMarker(predicate) || isRegulatingMarker(predicate)) {
        if (query.toUpperCase().includes(PREDICATE.prefixIds.protein)) {
          url = urls.has_characterizing_marker_set.proteins;
        } else {
          url = urls.has_characterizing_marker_set.genes;
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
  },
  fetchDataCite: async (protocolUrl) => {
    let headers = new Headers();
    headers.append(
      'Accept',
      'text/x-bibliography; style=american-medical-association',
    );
    let requestOptions = {
      method: 'GET',
      headers: headers,
    };
    const result = await fetch(protocolUrl, requestOptions);
    if (result.ok) {
      return await result.text();
    }
    return null;
  },
  fetchSearchApiByField: async (
    values,
    field = 'uuid',
    _source = ['status', 'creation_action', 'doi_url', 'title', 'uuid'],
    index = 'entities',
  ) => {
    const body = {
      query: {
        bool: {
          filter: [
            {
              terms: {
                [field]: values,
              },
            },
          ],
        },
      },
      _source,
    };
    const url = URLS.api.search.byIndex(index);
    const result = await API.fetch({ url, body });
    const hits = result?.hits.hits.map((h) => h._source);
    return hits;
  },
};
export default API;
