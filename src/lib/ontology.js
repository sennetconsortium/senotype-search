import log from 'xac-loglevel'
import ENVS from './envs'
import path from 'path'
import { promises as fs } from 'fs'
import URLS from './urls'
import { flipObj } from './general'

const ONTOLOGY_CACHE_PATH = path.join(process.cwd(), 'src/cache')
const IMPORT_PATH = './../cache/ontology.js'
const delay = (ms) => new Promise(res => setTimeout(res, ms));
const exportString = 'export const ontology='

const ONTOLOGY = {
  fetch: async (codes, code) => {
    const path = codes[code].path || ENVS.ontology.valueset.replaceAll('{code}', codes[code])
    log.debug('ONTOLOGY.fetch', path)
    const url = URLS.api.ontology + path
    const response = await fetch(url)
    if (response.ok) {
      return {
        [code]: await response.json()
      }
    }
    return null
  },
  fetchAll: async () => {
    try {
      log.info('Ontology.fetchAll', '...')
      const codes = JSON.parse(ENVS.ontology.codes)
      const results = await Promise.all(
        Object.keys(codes).map((code) => ONTOLOGY.fetch(codes, code))
      )
      return results
    } catch (e) {
      log.error('Error.Ontology.fetch', e)
    }
  },
  structureData: (key, data) => {
    const terms = {}
    let termsFlipped = {}
    const hierarchy = {}
    let valueKey = 'term'
    let keyKey = 'term'
    const isOrgans = 'organ_types' === key
    if (isOrgans) {
      valueKey = 'organ_uberon'
    }
    if ('dataset_types' === key) {
      keyKey = valueKey = 'dataset_type'
    }
    for (const d of data) {
      terms[d[keyKey]] = d[valueKey]
      if (isOrgans) {
        hierarchy[d[keyKey]] = d.category?.term || d[keyKey]
      }
    }
    if (isOrgans) {
      termsFlipped = flipObj(terms)
    }
    //log.info('Ontology.structureData', terms)
    return { terms, termsFlipped, hierarchy }
  },
  createImport: async () => {
    const filePath = ONTOLOGY_CACHE_PATH + '/ontology.js';
    
    try {
      log.info('Ontology.createImport', 'Creating ...', filePath)
      const results = await ONTOLOGY.fetchAll();
      let ontologyResults = {}
      let structuredData = {}
      for (const r of results) {
        for (const c in r) {
          structuredData = ONTOLOGY.structureData(c, r[c])
          ontologyResults[c] = {
            raw: r[c],
            ...structuredData
          }
        }
      }
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, exportString + JSON.stringify(ontologyResults), 'utf8');
      let ontology = await fs.readFile(filePath, 'utf8')
      return JSON.parse(ontology.replace(exportString, ''))
    } catch (e) {
      log.error('Error.Ontology.createImport.catch', e)
    }
  },
  getImport: async () => {
    try {
      log.info('Ontology.getImport', '...')
      let ontology = await fs.readFile(filePath, 'utf8')
      ontology = JSON.parse(ontology.replace(exportString, ''))
      log.info('Ontology.getImport', '...', module.ontology)
      
      if (!ontology || !Object.values(ontology).length) {
        return await ONTOLOGY.createImport()
      }
      return ontology
    } catch (e) {
      log.error('Error.Ontology.getImport', e)
      return await ONTOLOGY.createImport()
    }
  }
}

export default ONTOLOGY