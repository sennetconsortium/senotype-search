'use client';

import { useContext } from 'react';
import BasicLayout from '@/components/layout/BasicLayout';
import { useSenotype } from '@/hooks/useFetchSenotype';
import ViewSenotype from '@/components/senotype/ViewSenotype';
import AppSpinner from '@/components/AppSpinner';
import AppContext from '@/context/AppContext';
import NotFound from '@/components/errors/NotFound';
import Unauthorized from '@/components/errors/Unauthorized';

export default function SenotypeClientComponent({ senotype_id }) {
  const { auth } = useContext(AppContext);
  const { data, loading, error } = useSenotype(senotype_id);

  if (!loading && error) {
    throw error;
  }

  return (
    <BasicLayout classNameMain='c-main--senotype'>
      {loading && <AppSpinner />}

      {!loading && !data && (
        <>
          {auth.isAuthenticated && auth.hasSenotypeEdit ? (
            <NotFound />
          ) : (
            <Unauthorized />
          )}
        </>
      )}

      {data && <ViewSenotype senotype={data} />}
    </BasicLayout>
  );
}
