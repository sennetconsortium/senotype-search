const PREDICATE = {
  isTaxon: (p) => p === 'in_taxon',
  isOrgan: (p) => p === 'located_in',
  isAssay: (p) => p === 'has_assay',
  isHallmark: (p) => p === 'has_hallmark',
  isSex: (p) => p === 'has_sex',
  isInducer: (p) => p === 'has_inducer',
  isMircoEnv: (p) => p === 'has_microenvironment',
  isCellType: (p) => p === 'has_cell_type',
  isDiagnosis: (p) => p === 'has_diagnosis',
  isCitation: (p) => p === 'has_citation',
  isOrigin: (p) => p === 'has_origin',
  isDataset: (p) => p === 'has_dataset',
  regulatingActions: {
    up_regulates: '1',
    down_regulates: '-1',
    inconclusively_regulates: '0',
  },
  prefixIds: {
    diagnosis: 'DOID:',
    gene: 'HGNC:',
    protein: 'UNIPROTKB:',
  },
  isRegulatingMarker: (p) => p === 'has_characterizing_regulating_marker_set',
  isMarker: (p) => p === 'has_characterizing_marker_set',
  isExternalSource: (p) =>
    PREDICATE.isCellType(p) ||
    PREDICATE.isDiagnosis(p) ||
    PREDICATE.isCitation(p) ||
    PREDICATE.isOrigin(p) ||
    PREDICATE.isMarker(p) ||
    PREDICATE.isRegulatingMarker(p) ||
    PREDICATE.isDataset(p),
  isPredicate: (p) =>
    PREDICATE.isTaxon(p) ||
    PREDICATE.isOrgan(p) ||
    PREDICATE.isAssay(p) ||
    PREDICATE.isHallmark(p) ||
    PREDICATE.isSex(p) ||
    PREDICATE.isInducer(p) ||
    PREDICATE.isMircoEnv(p) ||
    PREDICATE.isExternalSource(p),
};

export default PREDICATE