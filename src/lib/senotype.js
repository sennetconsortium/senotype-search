import { simple_query_builder } from '@/search-ui/lib/search-tools';
import log from 'xac-loglevel';
import URLS from './urls';
import ENVS from './envs';
import API from './api';

export async function fetchSenotype(senotypeId, auth = null) {
  let data = {};

  let url = URLS.api.search + ENVS.index.senotype + '/search';
  const body = simple_query_builder('senotype.id', senotypeId);

  let jsonData = API.fetch({url, body});
  if (jsonData.hasOwnProperty('error')) {
    log.error(jsonData.error);
    return data;
  } else {
    let total = jsonData['hits']['total']['value'];
    if (total !== 0) {
      let senotype; //result["hits"]["hits"][0]["_source"]
      jsonData['hits']['hits'].forEach((hit) => {
        if (hit['_source']['senotype']['id'] === senotypeId) {
          senotype = hit['_source'];
        }
      });
      if (senotype) {
        return senotype;
      }
    }
  }

  return data;
}

export function getSciCrunchUrl(searchTerm) {
  let baseUrl = '';
  if (searchTerm.includes('-')) {
    baseUrl =  URLS.sciCrunch.higher;
    let lowerParam = searchTerm.split('-')[0];
    searchTerm = `${lowerParam}?i=rrid%3A${searchTerm}`;
  } else {
    baseUrl = URLS.sciCrunch.base;
  }
  return `${baseUrl}${searchTerm}`;
}

export function getOboDetailsUrl(id) {
  return getBioDetailUrl('OBO', id);
}

export function getMarkerDetailsUrl(id) {
  if (id.toUpperCase().includes('HGNC')) return getBioDetailUrl('HGNC', id);
  else return getBioDetailUrl('UNIPROTKB', id);
}

export function getBioDetailUrl(sab, id = '') {
  let idSubmit = id;
  let baseURL = '';
  if (sab.toUpperCase() === 'OBO') {
    baseURL = URLS.obo;
  } else if (sab.toUpperCase() === 'HGNC') {
    if (id === '') {
      baseURL = URLS.hgnc.home;
    } else {
      baseURL = URLS.hgnc.base;
    }
  } else if (sab.toUpperCase() === 'UNIPROTKB') {
    // Strip the SAB from the code.
    baseURL = URLS.uniprotkb;
    idSubmit = id.split(':')[1];
  } else {
    return null;
  }

  return `${baseURL}${idSubmit}`;
}
