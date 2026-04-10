const URLS = {
  login: process.env.NEXT_PUBLIC_LOGIN_URL,
  edit: '/edit',
  search: '/search',
  api: {
    local: (path) => `/api/${path}`,
    ingest: {
      base: process.env.NEXT_PUBLIC_INGEST_API_BASE,
      privs: {
        admin: process.env.NEXT_PUBLIC_INGEST_API_BASE + 'privs/has-data-admin',
        groups:
          process.env.NEXT_PUBLIC_INGEST_API_BASE + 'privs/user-write-groups',
      },
    },
    search: process.env.NEXT_PUBLIC_SEARCH_API_BASE,
    ontology: process.env.NEXT_PUBLIC_ONTOLOGY_API_BASE,
  },
  portal: process.env.NEXT_PUBLIC_PORTAL_URL,
  ontologyClasses: {
    home: process.env.NEXT_PUBLIC_CL_HOME_URL,
  },
  doid: {
    home: process.env.NEXT_PUBLIC_DOID_HOME_URL,
  },
  uniprotkb: process.env.NEXT_PUBLIC_UNIPROTKB_BASE_URL,
  obo: process.env.NEXT_PUBLIC_OBO_BASE_URL,
  hgnc: {
    base: process.env.NEXT_PUBLIC_HGNC_BASE_URL,
    home: process.env.NEXT_PUBLIC_HGNC_HOME_URL,
  },
  sciCrunch: {
    base: process.env.NEXT_PUBLIC_SCICRUNCH_BASE_URL,
    explore: process.env.NEXT_PUBLIC_SCICRUNCH_EXPLORE_URL,
    higher: process.env.NEXT_PUBLIC_SCICRUNCH_HIGHER_URL,
  },
  organIcon: (o) => {
    let imgName = o.toDashedCase();
    imgName =
      imgName[imgName.length - 1] === '-'
        ? imgName.substr(0, imgName.length - 1)
        : imgName;
    if (imgName === 'lung') {
      imgName = 'lungs';
    }
    if (imgName === 'bone') {
      imgName = 'bone-marrow';
    }
    return `${process.env.NEXT_PUBLIC_ORGAN_ICON_PREFIX}${imgName}.svg`;
  },
  getSciCrunchUrl: (searchTerm) => {
    let baseUrl = '';
    if (searchTerm.includes('-')) {
      baseUrl = URLS.sciCrunch.higher;
      let lowerParam = searchTerm.split('-')[0];
      searchTerm = `${lowerParam}?i=rrid%3A${searchTerm}`;
    } else {
      baseUrl = URLS.sciCrunch.base;
    }
    return `${baseUrl}${searchTerm}`;
  },
  getOboDetailsUrl: (id) => {
    return URLS.getBioDetailUrl('OBO', id);
  },
  getMarkerDetailsUrl: (id) => {
    if (id.toUpperCase().includes('HGNC'))
      return URLS.getBioDetailUrl('HGNC', id);
    else return URLS.getBioDetailUrl('UNIPROTKB', id);
  },
  getBioDetailUrl: (sab, id = '') => {
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
  },
};

export default URLS;
