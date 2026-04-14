import SearchAPIConnector from 'search-ui/packages/search-api-connector';
import SEARCH from '@/lib/search';
import URLS from '@/lib/urls';
import ENVS from '@/lib/envs';
import AUTH from '@/lib/auth';

export const assertionPredicates = [
  { alias: 'source_type', name: 'Taxon', field: 'in_taxon', ui: { w: 100 } },
  { alias: 'organ', field: 'located_in', ui: { w: 250 } },
  { alias: 'cell_type', field: 'has_cell_type', ui: { w: 300 } },
  { alias: 'dataset_type', field: 'has_assay', ui: { w: 200 } },
];

const {
  doesAggregationHaveBuckets,
  bucketsTransform,
  submitterTransform,
  organBucketsTransform,
} = SEARCH;
const connector = new SearchAPIConnector({
  indexName: ENVS.index.senotype,
  indexUrl: URLS.api.search,
  accessToken: AUTH.token(),
  beforeSearchCall: (queryOptions, next) => {
    const aggs = queryOptions.aggs || {};

    aggs.created_by_user_email.aggs = {
      meta: {
        top_hits: {
          size: 1,
          _source: ['created_by_user_displayname'],
        },
      },
    };

    queryOptions.aggs = aggs;

    return next(queryOptions);
  },
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
      source_type: {
        label: 'Source Type',
        type: 'value',
        field: 'in_taxon.term.keyword',
        filterType: 'any',
        isExpanded: false,
        isFilterable: false,
        facetType: 'term',
        bucketsTransform: bucketsTransform,
        isAggregationActive: true,
        isFacetVisible: doesAggregationHaveBuckets('source_type'),
      },
      organ: {
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
        isFacetVisible: doesAggregationHaveBuckets('organ'),
      },
      cell_type: {
        label: 'Cell Type',
        type: 'value',
        field: 'has_cell_type.term.keyword',
        isExpanded: false,
        filterType: 'any',
        isFilterable: false,
        facetType: 'term',
        bucketsTransform: bucketsTransform,
        isAggregationActive: true,
        isFacetVisible: doesAggregationHaveBuckets('cell_type'),
      },
      dataset_type: {
        label: 'Dataset Type',
        type: 'value',
        field: 'assertions.objects.term.keyword',
        isExpanded: false,
        filterType: 'any',
        isFilterable: false,
        facetType: 'term',
        bucketsTransform: bucketsTransform,
        isAggregationActive: true,
        isFacetVisible: doesAggregationHaveBuckets('dataset_type'),
      },
      affiliation_group: {
        label: 'Affiliation',
        facetType: 'group',
        isExpanded: false,
        isFacetVisible: (filters, aggregations, auth, visibleChildren) => {
          return visibleChildren.length > 0;
        },
        facets: {
          created_by_user_email: {
            label: 'Registered By',
            type: 'value',
            field: 'created_by_user_email.keyword',
            isExpanded: false,
            filterType: 'any',
            isFilterable: false,
            facetType: 'term',
            isAggregationActive: true,
            transformFunction: submitterTransform,
            isFacetVisible: doesAggregationHaveBuckets('created_by_user_email'),
          },
        },
      },
    },
    disjunctiveFacets: [],
    conditionalFacets: {},
    search_fields: {
      'senotype.id^4': { type: 'value' },
      'senotype.name^4': { type: 'value' },
      all_text: { type: 'value' },
    },
    source_fields: [
      ...assertionPredicates.map((a) => a.field),
      'has_hallmark', 
      'inconclusively_regulates',
      'definition',
      'sennet_id',
      'title',
      'created_by_user_email',
    ],
    // Moving this configuration into `searchQuery` so the config inside search-tools can read this
    trackTotalHits: true,
  },
  initialState: {
    current: 1,
    resultsPerPage: 20,
    // sortList: [{
    //     field: 'senotype.id.keyword',
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
