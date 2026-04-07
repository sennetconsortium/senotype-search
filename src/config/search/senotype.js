import SearchAPIConnector from 'search-ui/packages/search-api-connector';
import SEARCH from '@/lib/search';
import URLS from '@/lib/urls';
import ENVS from '@/lib/envs';
import AUTH from '@/lib/auth';

const { doesAggregationHaveBuckets, bucketsTransform } = SEARCH
const connector = new SearchAPIConnector({
    indexName: ENVS.index.senotype,
    indexUrl: URLS.api.search,
    accessToken: AUTH.token(),
    beforeSearchCall: (queryOptions, next) => {
        const aggs = queryOptions.aggs || {};
        const nestedAggs = [
            { k: 'source_type', v: 'in_taxon' },
            {k: 'organ', v: 'located_in'}
        ]
        for (const x of nestedAggs) {
            aggs[x.k] = {
                    nested: {
                        path: "assertions"
                    },
                    aggs: {
                        filtered_terms: {
                            filter: {
                                term: {
                                    "assertions.predicate.term": x.v
                                }
                            },
                            aggs: {
                                buckets: {
                                    nested: {
                                        path: "assertions.objects"
                                    },
                                    aggs: {
                                        buckets: {
                                            terms: {
                                                field: "assertions.objects.term.keyword",
                                                size: 100
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

            delete aggs.source_type.terms
        }

        queryOptions.aggs = aggs;

        return next(queryOptions)
    }
})

export const SEARCH_SENOTYPE = {
    alwaysSearchOnInitialLoad: true,
    searchQuery: {
        excludeFilters: [

        ],
        facets: {
            sennet_id: {
                label: 'SenNet ID',
                type: 'value',
                field: 'senotype.id',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
                facetType: 'term',
                facetChipType: 'bulk',
                isAggregationActive: true,
                isFacetVisible: false
            },
            'source_type': {
                label: 'Source Type',
                type: 'value',
                field: 'assertions.objects.term.keyword',
                filterType: 'any',
                isExpanded: false,
                isFilterable: false,
                facetType: 'term',
                bucketsTransform: bucketsTransform,
                isAggregationActive: true,
                isFacetVisible: doesAggregationHaveBuckets('source_type')
            },
            'organ': {
                label: 'Organ',
                type: 'value',
                field: 'assertions.objects.term.keyword',
                isExpanded: false,
                filterType: 'any',
                isFilterable: false,
                facetType: 'term',
                bucketsTransform: bucketsTransform,
                isAggregationActive: true,
                isFacetVisible: doesAggregationHaveBuckets('organ')
            },
            affiliation_group: {
                label: 'Affiliation',
                facetType: 'group',
                isExpanded: false,
                isFacetVisible: (filters, aggregations, auth, visibleChildren) => {
                    return visibleChildren.length > 0
                },
                facets: {
                    submitter_name: {
                        label: 'Registered By',
                        type: 'value',
                        field: 'submitter.email',
                        isExpanded: false,
                        filterType: 'any',
                        isFilterable: false,
                        facetType: 'term',
                        isAggregationActive: true,
                        isFacetVisible: doesAggregationHaveBuckets('submitter_name')
                    }
                }
            },
        },
        disjunctiveFacets: [

        ],
        conditionalFacets: {},
        search_fields: {
            all_text: { type: 'value' },
        },
        source_fields: [
            'senotype',
            'submitter',
            'assertions',
            'assertions.objects.term',
            'assertions.predicate.term'

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
}
