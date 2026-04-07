import AUTH from "./auth"

const SEARCH = {
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