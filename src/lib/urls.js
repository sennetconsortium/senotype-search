import '@/lib/general'

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
  obo: process.env.NEXT_PUBLIC_OBO_BASE_URL,
  organIcon: (o) => {
    let imgName = o.toDashedCase();
    imgName = imgName[imgName.length - 1] === '-' ? imgName.substr(0, imgName.length - 1) : imgName;
    if (imgName === 'lung') {
      imgName = 'lungs';
    }
    if (imgName === 'bone') {
      imgName = 'bone-marrow';
    }
    return `${process.env.NEXT_PUBLIC_ORGAN_ICON_PREFIX}${imgName}.svg`;
  },
};

export default URLS;
