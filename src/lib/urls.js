import log from 'xac-loglevel';

const URLS = {
  login: process.env.NEXT_PUBLIC_LOGIN_URL,
  edit: '/edit',
  search: '/search',
  senotypeLibrary: process.env.NEXT_PUBLIC_SENOTYPE_LIB_BASE_URL,
  api: {
    local: (path) => `/api/${path}`,
    entity: {
      base: process.env.NEXT_PUBLIC_ENTITY_API_BASE_URL,
    },
    ingest: {
      base: process.env.NEXT_PUBLIC_INGEST_API_BASE_URL,
      privs: {
        admin:
          process.env.NEXT_PUBLIC_INGEST_API_BASE_URL + 'privs/has-data-admin',
        senotypeEdit:
          process.env.NEXT_PUBLIC_INGEST_API_BASE_URL +
          'privs/has-senotype-edit',
        groups:
          process.env.NEXT_PUBLIC_INGEST_API_BASE_URL +
          'privs/user-write-groups',
      },
    },
    senotype: {
      base: process.env.NEXT_PUBLIC_SENOTYPE_API_BASE_URL,
      createEdit: `${process.env.NEXT_PUBLIC_SENOTYPE_API_BASE_URL}/sentotypes`,
    },
    search: process.env.NEXT_PUBLIC_SEARCH_API_BASE_URL,
    ontology: process.env.NEXT_PUBLIC_ONTOLOGY_API_BASE_URL,
  },
  nih: {
    base: process.env.NEXT_PUBLIC_NIH_EUTILS_BASE_URL,
    pubMed: `${process.env.NEXT_PUBLIC_NIH_EUTILS_BASE_URL}entrez/eutils/esummary.fcgi?db=pubmed&retmode=json`,
  },
  senotypeEditor: process.env.NEXT_PUBLIC_EDITOR_BASE_URL,
  portal: process.env.NEXT_PUBLIC_PORTAL_BASE_URL,
  ontologyClasses: {
    home: `${process.env.NEXT_PUBLIC_CL_BASE_URL}ols4/ontologies/cl?tab=classes`,
  },
  doid: {
    base: process.env.NEXT_PUBLIC_DOID_BASE_URL,
  },
  uniprotkb: process.env.NEXT_PUBLIC_UNIPROTKB_BASE_URL,
  obo: process.env.NEXT_PUBLIC_OBO_BASE_URL,
  hgnc: {
    base: process.env.NEXT_PUBLIC_HGNC_BASE_URL,
    symbolReport: `${process.env.NEXT_PUBLIC_HGNC_BASE_URL}data/gene-symbol-report/#!/hgnc_id/`,
  },
  rrid: {
    base: process.env.NEXT_PUBLIC_RRID_BASE_URL,
  },
  sciCrunch: {
    base: process.env.NEXT_PUBLIC_SCICRUNCH_BASE_URL,
    resolver: `${process.env.NEXT_PUBLIC_SCICRUNCH_BASE_URL}resolver/`,
    higher: `${process.env.NEXT_PUBLIC_SCICRUNCH_BASE_URL}scicrunch/resolver/`,
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
      baseUrl = URLS.sciCrunch.resolver;
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
        baseURL = URLS.hgnc.base;
      } else {
        baseURL = URLS.hgnc.symbolReport;
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
