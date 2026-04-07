const URLS = {
  login: process.env.NEXT_PUBLIC_LOGIN_URL,
  edit: '/edit',
  search: '/search',
  api: {
    local: (path) => `/api/${path}`,
    ingest:  {
      base: process.env.NEXT_PUBLIC_INGEST_API_BASE,
      privs: {
        admin: process.env.NEXT_PUBLIC_INGEST_API_BASE + 'privs/has-data-admin',
        groups: process.env.NEXT_PUBLIC_INGEST_API_BASE + 'privs/user-write-groups',
      }
    },
    search: process.env.NEXT_PUBLIC_SEARCH_API_BASE,
    ontology: process.env.NEXT_PUBLIC_ONTOLOGY_API_BASE,
  },

}

export default URLS