const ENVS = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME,
  },
  logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || 'error',
  ontology: {
    codes: process.env.NEXT_PUBLIC_ONTOLOGY_CODES,
    valueset: process.env.NEXT_PUBLIC_ONTOLOGY_VALUESET_PATH,
  },
  index: {
    senotype: process.env.NEXT_PUBLIC_INDEX_SENOTYPE,
  },
};

export default ENVS;
