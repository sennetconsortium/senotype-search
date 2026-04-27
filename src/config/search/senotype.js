import SearchAPIConnector from 'search-ui/packages/search-api-connector';
import SEARCH from '@/lib/search';
import URLS from '@/lib/urls';
import ENVS from '@/lib/envs';
import AUTH from '@/lib/auth';

export const ubkgPredicates = [
  {
    field: 'in_taxon',
    ui: { w: 100, required: true },
  },
  {
    ontologyKey: 'organ_types',
    field: 'located_in',
    ui: {
      w: 250,
      required: true,
    },
  },
  {
    field: 'has_cell_type',
    ui: {
      w: 300,
      required: true,
      tooltip:
        'Enter either a string that is in the name of the cell type or the Cell Ontology ID (e.g., CL:0020011; 0020011)',
    },
  },
  { field: 'has_assay', ui: { w: 200 } },
];

const {
  doesAggregationHaveBuckets,
  bucketsTransform,
  organBucketsTransform,
} = SEARCH;
const connector = new SearchAPIConnector({
  indexName: ENVS.index.senotype,
  indexUrl: URLS.api.search,
  accessToken: AUTH.token()
});

export const SEARCH_SENOTYPE = {
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    excludeFilters: [],
    facets: {
      sennet_id: {
        label: 'SenNet ID',
        type: 'value',
        field: 'sennet_id.keyword',
        isExpanded: false,
        filterType: 'any',
        isFilterable: false,
        facetType: 'term',
        facetChipType: 'bulk',
        isAggregationActive: true,
        isFacetVisible: false,
      },
      in_taxon: {
        label: 'Taxon',
        type: 'value',
        field: 'in_taxon.term.keyword',
        filterType: 'any',
        isExpanded: false,
        isFilterable: false,
        facetType: 'term',
        bucketsTransform: bucketsTransform,
        isAggregationActive: true,
        isFacetVisible: doesAggregationHaveBuckets('in_taxon'),
      },
      located_in: {
        label: 'Organ',
        type: 'value',
        field: 'located_in.term.keyword',
        isExpanded: false,
        filterType: 'any',
        isFilterable: false,
        facetType: 'hierarchy',
        bucketsTransform: organBucketsTransform,
        groupByField: 'located_in.term.keyword',
        isHierarchyOption: (option) => {
          return ONTOLOGY_CACHE.organ_types.laterals.includes(option);
        },
        filterSubValues: (value, subValues) => {
          return subValues.filter((subValue) => {
            return subValue.key.toLowerCase().startsWith(value.toLowerCase());
          });
        },
        isAggregationActive: true,
        isFacetVisible: doesAggregationHaveBuckets('located_in'),
      },
      has_cell_type: {
        label: 'Cell Type',
        type: 'value',
        field: 'has_cell_type.term.keyword',
        isExpanded: false,
        filterType: 'any',
        isFilterable: false,
        facetType: 'term',
        bucketsTransform: bucketsTransform,
        isAggregationActive: true,
        isFacetVisible: doesAggregationHaveBuckets('has_cell_type'),
      },
      has_assay: {
        label: 'Dataset Type',
        type: 'value',
        field: 'has_assay.term.keyword',
        isExpanded: false,
        filterType: 'any',
        isFilterable: false,
        facetType: 'term',
        bucketsTransform: bucketsTransform,
        isAggregationActive: true,
        isFacetVisible: doesAggregationHaveBuckets('has_assay'),
      },
      affiliation_group: {
        label: 'Affiliation',
        facetType: 'group',
        isExpanded: false,
        isFacetVisible: (filters, aggregations, auth, visibleChildren) => {
          return visibleChildren.length > 0;
        },
        facets: {
          created_by_user_displayname: {
            label: 'Registered By',
            type: 'value',
            field: 'created_by_user_displayname.keyword',
            isExpanded: false,
            filterType: 'any',
            isFilterable: false,
            facetType: 'term',
            isAggregationActive: true,
            isFacetVisible: doesAggregationHaveBuckets('created_by_user_displayname'),
          },
        },
      },
    },
    disjunctiveFacets: [],
    conditionalFacets: {},
    search_fields: {
      'sennet_id^4': { type: 'value' },
      'title^4': { type: 'value' },
      all_text: { type: 'value' },
    },
    source_fields: [
      ...ubkgPredicates.map((a) => a.field),
      'has_hallmark',
      'inconclusively_regulates',
      'definition',
      'sennet_id',
      'title',
      'created_by_user_displayname',
      'uuid'
    ],
    // Moving this configuration into `searchQuery` so the config inside search-tools can read this
    trackTotalHits: true,
  },
  initialState: {
    current: 1,
    resultsPerPage: 20,
    // sortList: [{
    //     field: 'sennet_id.keyword',
    //     direction: 'desc'
    // }]
  },
  urlPushDebounceLength: 100,
  trackUrlState: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  a11yNotificationMessages: {
    searchResults: ({ start, end, totalResults, searchTerm }) =>
      `Searching for '${searchTerm}'. Showing ${start} to ${end} results out of ${totalResults}.`,
  },
};
