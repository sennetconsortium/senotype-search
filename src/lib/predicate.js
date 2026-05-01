import { flipObj } from "./general";

const PREDICATE = {
  isTaxon: (p) => p === 'taxon',
  isOrgan: (p) => p === 'organ',
  isAssay: (p) => p === 'assay',
  isHallmark: (p) => p === 'hallmark',
  isSex: (p) => p === 'sex',
  isInducer: (p) => p === 'inducer',
  isMircoEnv: (p) => p === 'microenvironment',
  isCellType: (p) => p === 'cell_type',
  isDiagnosis: (p) => p === 'diagnosis',
  isCitation: (p) => p === 'citation',
  isOrigin: (p) => p === 'origin',
  isDataset: (p) => p === 'dataset',
  regulatedActions: {
    up_regulates: '1',
    down_regulates: '-1',
    inconclusively_regulates: '0',
  },
  regulatedActionsView: {
    up: '1',
    down: '-1',
    '?': '0',
  },
  prefixIds: {
    diagnosis: 'DOID:',
    gene: 'HGNC:',
    protein: 'UNIPROTKB:',
  },
  isRegulatedMarker: (p) => p === 'regulated_marker_set',
  isSpecifiedMarker: (p) => p === 'specified_marker_set',
  isExternalSource: (p) =>
    PREDICATE.isCellType(p) ||
    PREDICATE.isDiagnosis(p) ||
    PREDICATE.isCitation(p) ||
    PREDICATE.isOrigin(p) ||
    PREDICATE.isSpecifiedMarker(p) ||
    PREDICATE.isRegulatedMarker(p) ||
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
  markersExportColumns: () => {
    const names = ['type', 'id', 'action'];

    const columns = [];

    for (const n of names) {
      columns.push({
        title: n,
        dataIndex: n,
        key: n,
      });
    }

    return columns
  },
  markersExportData: (markers) => {
    const data = []
    const prefixIds = flipObj(PREDICATE.prefixIds)
    const regulatedActions = { ...PREDICATE.regulatedActions, ...PREDICATE.regulatedActionsView}; 
    let parts, code
    for (const m of markers) {
      code = m.key || m.code || m.marker.code
      parts = code.split(':')
      data.push({
        type: prefixIds[parts[0] + ':'],
        id: parts[1],
        action: regulatedActions[m.markerType || m.action],
      });
    }

    return data
  }
};

export default PREDICATE