import AUTH from "./auth"

const SEARCH = {
  submitterTransform: (value, facet) => {
    let name = facet.data.meta.hits.hits[0]._source.submitter.name
    return <span title={value}>{`${name.first} ${name.last}`}</span>
  },
  bucketsTransform: (ops) => {
    const {aggregations, field} = ops
  
    return aggregations[field]?.buckets || aggregations[field]?.filtered_terms?.buckets?.buckets?.buckets || []
  },
  doesAggregationHaveBuckets: (field, values) => {
    return (filters, aggregations, auth) => {
      try {
        return aggregations[field] !== undefined && SEARCH.bucketsTransform({aggregations, field}).length > 0
      } catch {
        return false
      }
    }
  },
  getAuthState: () => {
    const authState = {
      isAuthenticated: AUTH.isAuthorized,
      isAuthorized: AUTH.isAuthorized,
      isAdmin: AUTH.isAdmin
    }
    return authState
  }
}

export default SEARCH