'use client';

import { useParams } from 'next/navigation';
import BasicLayout from '@/components/layout/BasicLayout';
import { useSenotype } from '@/hooks/useFetchSenotype';
import ViewSenotype from '@/components/senotype/ViewSenotype';
import AppSpinner from '@/components/AppSpinner';
import { useContext } from 'react';
import AppContext from '@/context/AppContext';
import NotFound from '@/components/errors/NotFound';
import Unauthorized from '@/components/errors/Unauthorized';

export default function Page() {
  const { auth } = useContext(AppContext);

  const params = useParams();
  const senotype_id = params.senotype_id;

  const { data, loading, error } = useSenotype(senotype_id);

  if (!loading && error) {
    throw error;
  }

  return (
    <BasicLayout>
      <>
        {loading && (
          <>
            <AppSpinner />
          </>
        )}
        {/*If not data is returned from Search API and user is not logged in assume 401 otherwise 404*/}
        {!loading && !data && (
          <>
            {auth.isAuthenticated && auth.hasSenotypeEdit ? (
              <NotFound />
            ) : (
              <Unauthorized />
            )}
          </>
        )}
        {data && (
          <>
            <ViewSenotype senotype={data} />
          </>
        )}
      </>
    </BasicLayout>
  );
}
