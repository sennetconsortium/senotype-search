'use client';

import { useParams } from 'next/navigation';
import BasicLayout from '@/components/layout/BasicLayout';
import { useSenotype } from '@/hooks/useFetchSenotype';
import ViewSenotype from '@/components/Senotype/ViewSenotype';
import AppSpinner from '@/components/AppSpinner';
import Unauthorized from '@/components/errors/Unauthorized';

export default function Page() {
  const params = useParams();
  const senotype_id = params.senotype_id;

  const { data, loading, error } = useSenotype(senotype_id);

  if (error) {
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
        {!loading && !data && <Unauthorized />}
        {data && (
          <>
            <ViewSenotype senotype={data} />
          </>
        )}
      </>
    </BasicLayout>
  );
}
