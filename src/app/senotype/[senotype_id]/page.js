'use client'

import {useParams} from 'next/navigation'
import BasicLayout from "@/components/layout/BasicLayout";
import {useSenotype} from "@/hooks/useFetchSenotype";
import ViewSenotype from "@/components/Senotype/ViewSenotype";

export default function Page() {
    const params = useParams()
    const senotype_id = params.senotype_id

    const {data, loading, error} = useSenotype(senotype_id)

    return (
        <BasicLayout>
            <>
                {loading &&
                    <p>Loading...</p>
                }
                {error &&
                    <p>{error.message}</p>
                }
                {data &&
                    <>
                        <ViewSenotype senotype={data}/>

                        <p>{JSON.stringify(data, null, 2)}</p>
                    </>

                }
            </>
        </BasicLayout>
    )
}
