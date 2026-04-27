const PREDICATE = {
  isTaxon: (p) => p === 'taxon',
  isOrgan: (p) => p === 'organ',
  isAssay: (p) => p === 'assay',
  isHallmark: (p) => p === 'hallmark',
  isSex: (p) => p === 'sex',
  isInducer: (p) => p === 'inducer',
  isMircoEnv: (p) => p === 'microenvironment',
  isCellType: (p) => p === 'cell_type',
  isDiagnosis: (p) => p === 'iagnosis',
  isCitation: (p) => p === 'citation',
  isOrigin: (p) => p === 'origin',
  isDataset: (p) => p === 'dataset',
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
  isRegulatingMarker: (p) => p === 'characterizing_regulating_marker_set',
  isMarker: (p) => p === 'characterizing_marker_set',
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