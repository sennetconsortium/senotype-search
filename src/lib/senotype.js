import { simple_query_builder } from '@/search-ui/lib/search-tools';
import log from 'xac-loglevel';
import AUTH from '@/lib/auth';

const SEARCH_API_URL = process.env.NEXT_PUBLIC_SEARCH_API_BASE;
const INDEX_SENOTYPE = process.env.NEXT_PUBLIC_INDEX_SENOTYPE;
const OBO_BASE_URL = process.env.NEXT_PUBLIC_OBO_BASE_URL;
const CL_HOME_URL = process.env.NEXT_PUBLIC_CL_HOME_URL;
const DOID_HOME_URL = process.env.NEXT_PUBLIC_DOID_HOME_URL;
const HGNC_BASE_URL = process.env.NEXT_PUBLIC_HGNC_BASE_URL;
const HGNC_HOME_URL = process.env.NEXT_PUBLIC_HGNC_HOME_URL;
const UNIPROTKB_BASE_URL = process.env.NEXT_PUBLIC_UNIPROTKB_BASE_URL;

const SCICRUNCH_BASE_URL = process.env.NEXT_PUBLIC_SCICRUNCH_BASE_URL;
const SCICRUNCH_EXPLORE_URL = process.env.NEXT_PUBLIC_SCICRUNCH_EXPLORE_URL;
const SCICRUNCH_HIGHER_URL = process.env.NEXT_PUBLIC_SCICRUNCH_HIGHER_URL;

export async function fetchSenotype(senotype_id, auth = null) {
  let data = {};

  let url = SEARCH_API_URL + INDEX_SENOTYPE + '/search';
  let queryBody = simple_query_builder('senotype.id', senotype_id);

  let myHeaders = new Headers();
  let authInfo = AUTH.info();
  if (authInfo) {
    myHeaders.append('Authorization', 'Bearer ' + authInfo.groups_token);
  }
  myHeaders.append('Content-Type', 'application/json');

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(queryBody),
  };

  const res = await fetch(url, requestOptions);

  if (!res.ok) {
    throw new Error(`Failed to fetch senotype: ${res.status}`);
  }

  let jsonData = await res.json();
  if (jsonData.hasOwnProperty('error')) {
    log.error(jsonData.error);
    return data;
  } else {
    log.info('Response', jsonData);
    let total = jsonData['hits']['total']['value'];
    if (total !== 0) {
      let senotype; //result["hits"]["hits"][0]["_source"]
      jsonData['hits']['hits'].forEach((hit) => {
        if (hit['_source']['senotype']['id'] === senotype_id) {
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
    baseUrl = SCICRUNCH_HIGHER_URL;
    let lowerParam = searchTerm.split('-')[0];
    searchTerm = `${lowerParam}?i=rrid%3A${searchTerm}`;
  } else {
    baseUrl = SCICRUNCH_BASE_URL;
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
    baseURL = OBO_BASE_URL;
  } else if (sab.toUpperCase() === 'HGNC') {
    if (id === '') {
      baseURL = HGNC_HOME_URL;
    } else {
      baseURL = HGNC_BASE_URL;
    }
  } else if (sab.toUpperCase() === 'UNIPROTKB') {
    // Strip the SAB from the code.
    baseURL = UNIPROTKB_BASE_URL;
    idSubmit = id.split(':')[1];
  } else {
    return null;
  }

  return `${baseURL}${idSubmit}`;
}
