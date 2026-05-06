import AUTH from './auth';
import log from 'xac-loglevel';
import ontology from '@/cache/ontology.json' with { type: 'json' };

const SEARCH = {
  organBucketsTransform: (ops) => {
    const { aggregations, field, component } = ops;
    const buckets = SEARCH.bucketsTransform(ops);
    log.debug(
      'SEARCH.organBucketsTransform',
      component,
      field,
      aggregations[field],
    );

    let organs = {};
    let h;
    for (const b of buckets) {
      h = ontology.organ_types.hierarchy[b.key] || 'Unknown';
      organs[h] = organs[h] || {
        doc_count: 0,
        key: h,
        subagg: { buckets: [] },
      };
      organs[h].doc_count += b.doc_count;
      organs[h].subagg.buckets.push(b);
    }

    return Object.values(organs);
  },
  bucketsTransform: (ops) => {
    const { aggregations, field } = ops;
    log.debug('SEARCH.bucketsTransform', field, aggregations[field]);

    return (
      aggregations[field]?.buckets ||
      aggregations[field]?.filtered_terms?.buckets?.buckets?.buckets ||
      []
    );
  },
  doesAggregationHaveBuckets: (field, values) => {
    return (filters, aggregations, auth) => {
      try {
        return (
          aggregations[field] !== undefined &&
          SEARCH.bucketsTransform({ aggregations, field }).length > 0
        );
      } catch {
        return false;
      }
    };
  },
  getAuthState: () => {
    const authState = {
      isAuthenticated: AUTH.isAuthorized,
      isAuthorized: AUTH.isAuthorized,
      isAdmin: AUTH.isAdmin,
    };
    return authState;
  },
};

export default SEARCH;
