import log from 'xac-loglevel'

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
        senotypeEdit:
          process.env.NEXT_PUBLIC_INGEST_API_BASE + 'privs/has-senotype-edit',
        groups:
          process.env.NEXT_PUBLIC_INGEST_API_BASE + 'privs/user-write-groups',
      },
    },
    search: process.env.NEXT_PUBLIC_SEARCH_API_BASE,
    ontology: process.env.NEXT_PUBLIC_ONTOLOGY_API_BASE,
  },
  senotypeEditor: process.env.NEXT_PUBLIC_EDITOR_URL,
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
  /**
   * Takes the organ hierarchy term and returns a src img url.
   * @param {string} o
   * @returns
   */
  organIcon: (o) => {
    let imgName = o.toDashedCase();
    imgName =
      imgName[imgName.length - 1] === '-'
        ? imgName.substr(0, imgName.length - 1)
        : imgName;

    if (['muscle', 'other', 'unknown'].indexOf(imgName) !== -1) {
      return process.env.NEXT_PUBLIC_OTHER_ORGAN_ICON_URL;
    }

    switch (imgName) {
      case 'lung':
        imgName = 'lungs';
        break;
      case 'kidney':
        imgName = 'kidneys';
        break;
      case 'lymph-node':
        imgName = 'lungs';
        break;
      case 'lung':
        imgName = 'lymph-nodes';
        break;
      case 'ovary':
        imgName = 'ovaries';
        break;
      case 'bone':
        imgName = 'bone-marrow';
        break;
      case 'mammary-gland':
        imgName = 'breast';
        break;
      case 'tonsil':
        imgName = 'palatine-tonsil';
        break;
      case 'intervertebral-disc':
        imgName = 'spinal-cord';
        break;
      case 'adipose-tissue':
        imgName = 'skin';
        break;
      default:
        log.info('URLS.organIcon', imgName);
    }

    return `https://cdn.humanatlas.io/hra-design-system/icons/organs/organ-icon-${imgName}.svg`;
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
