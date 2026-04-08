import {useEffect, useState} from 'react'
import {fetchSenotype} from '@/lib/senotype'

export function useSenotype(senotype_id, auth) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!senotype_id) return

        fetchSenotype(senotype_id)
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [senotype_id])

    return {data, loading, error}
}
