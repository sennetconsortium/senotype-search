import {simple_query_builder} from "@/search-ui/lib/search-tools";
import log from "xac-loglevel";
import AUTH from '@/lib/auth';

const SEARCH_API_URL = process.env.NEXT_PUBLIC_SEARCH_API_BASE
const INDEX_SENOTYPE = process.env.NEXT_PUBLIC_INDEX_SENOTYPE

export async function fetchSenotype(senotype_id, auth = null) {
    let data = {}

    let url = SEARCH_API_URL + INDEX_SENOTYPE + "/search"
    let queryBody = simple_query_builder('senotype.id', senotype_id)

    let myHeaders = new Headers();
    let authInfo = AUTH.info()
    if (authInfo) {
        myHeaders.append('Authorization', "Bearer " + authInfo.groups_token);
    }
    myHeaders.append("Content-Type", "application/json");

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(queryBody)
    }

    const res = await fetch(
        url, requestOptions
    )

    if (!res.ok) {
        throw new Error(`Failed to fetch senotype: ${res.status}`)
    }

    let jsonData = await res.json()
    if (jsonData.hasOwnProperty("error")) {
        log.error(jsonData.error)
        return data
    } else {
        log.info("Response", jsonData)
        let total = jsonData["hits"]["total"]["value"]
        if (total !== 0) {
            let senotype //result["hits"]["hits"][0]["_source"]
            jsonData["hits"]["hits"].forEach((hit) => {
                if (hit["_source"]["senotype"]["id"] === senotype_id) {
                    senotype = hit["_source"]
                }
            })
            if (senotype) {
                return senotype
            }
        }
    }

    return data
}