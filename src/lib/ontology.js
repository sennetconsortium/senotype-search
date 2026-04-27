import log from 'xac-loglevel';
import ENVS from './envs';
import path from 'path';
import { promises as fs } from 'fs';
import URLS from './urls';
import { flipObj } from './general';

const ONTOLOGY_CACHE_PATH = path.join(process.cwd(), 'src/cache');
const exportString = 'export const ontology=';
const filePath = ONTOLOGY_CACHE_PATH + '/ontology.js';

const ONTOLOGY = {
  fetch: async (codes, code) => {
    let isSenotypeValueset = false;
    let path = codes[code]?.path;
    if (!path) {
      isSenotypeValueset = codes[code].eq('SENOTYPE_VS');
      path = isSenotypeValueset
        ? ENVS.ontology.senotypeValueset.replaceAll('{predicate}', code)
        : ENVS.ontology.valueset.replaceAll('{code}', codes[code]);
    }
    
    const url = isSenotypeValueset
      ? `${URLS.senotypeLibrary}${path}` // TODO update base for isSenotypeValueset when obtained
      : `${URLS.api.ontology}${path}`; 

    log.debug('ONTOLOGY.fetch', url);
    const response = await fetch(url);
    if (response.ok) {
      return {
        [code]: await response.json(),
      };
    }
    return null;
  },
  fetchAll: async () => {
    try {
      log.info('ONTOLOGY.fetchAll', '...');
      const codes = JSON.parse(ENVS.ontology.codes);
      const results = await Promise.all(
        Object.keys(codes).map((code) => ONTOLOGY.fetch(codes, code)),
      );
      return results;
    } catch (e) {
      log.error('ONTOLOGY.fetch.catch', e);
    }
  },
  structureData: (key, data) => {
    try {
      const terms = {};
      let termsFlipped = {};
      const hierarchy = {};
      const laterals = new Set();
      let valueKey = 'term';
      let keyKey = 'term';
      const codes = JSON.parse(ENVS.ontology.codes);
      const isSenotypeValueset = (typeof codes[key]).eq('string') ? codes[key].eq('SENOTYPE_VS') : false;

      log.debug('Is organs', key);
      const isOrgans = 'organ_types' === key;
      if (isSenotypeValueset) {
        valueKey = 'valueset_code';
        keyKey = 'valueset_term';
      } else {
        if (isOrgans) {
          valueKey = 'organ_uberon';
        }
        if ('dataset_types' === key) {
          keyKey = valueKey = 'dataset_type';
        }
      }
      for (const d of data) {
        terms[d[keyKey]] = d[valueKey];
        if (isOrgans) {
          
          hierarchy[d[keyKey]] = d.category?.term || d[keyKey];
          if (d.category?.term) {
            laterals.add(d.category?.term);
          }
        }
      }
      if (isOrgans) {
        termsFlipped = flipObj(terms);
      }
      return { terms, termsFlipped, hierarchy, laterals: Array.from(laterals) };
    } catch(e) {
      log.error('ONTOLOGY.structureData.catch', e);
    }
  },
  createImport: async () => {
    try {
      log.info('ONTOLOGY.createImport', 'Creating ...', filePath);
      const results = await ONTOLOGY.fetchAll();
      let ontologyResults = {};
      let structuredData = {};
      for (const r of results) {
        for (const c in r) {
          structuredData = ONTOLOGY.structureData(c, r[c]);
          ontologyResults[c] = {
            raw: r[c],
            ...structuredData,
          };
        }
      }
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(
        filePath,
        exportString + JSON.stringify(ontologyResults),
        'utf8',
      );
      let ontology = await fs.readFile(filePath, 'utf8');
      return JSON.parse(ontology.replace(exportString, ''));
    } catch (e) {
      log.error('ONTOLOGY.createImport.catch', e);
    }
  },
  getImport: async () => {
    try {
      log.info('ONTOLOGY.getImport', '...');
      let ontology = await fs.readFile(filePath, 'utf8');
      ontology = JSON.parse(ontology.replace(exportString, ''));
      log.info('ONTOLOGY.getImport', '...', ontology);

      if (!ontology || !Object.values(ontology).length) {
        return await ONTOLOGY.createImport();
      }
      return ontology;
    } catch (e) {
      log.error('ONTOLOGY.getImport.catch', e);
      return await ONTOLOGY.createImport();
    }
  },
};

export default ONTOLOGY;
