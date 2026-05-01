'use client';
import { useContext } from 'react';
import { useParams } from 'next/navigation';
import { useSenotype } from '@/hooks/useFetchSenotype';
import BasicLayout from '@/components/layout/BasicLayout';
import { EditProvider } from '@/context/EditContext';
import AppSpinner from '@/components/AppSpinner';
import Unauthorized from '@/components/errors/Unauthorized';
import AppContext from '@/context/AppContext';
import CreateEditSenotype from '@/components/senotype/CreateEditSenotype';
import { Alert } from 'react-bootstrap';
import NotFound from '@/components/errors/NotFound';

function Page() {
  const params = useParams();
  const senotype_id = params.senotype_id;
  const { auth } = useContext(AppContext);
  const { data, loading, error } = useSenotype(senotype_id);

  if (error) {
    throw error;
  }

  return (
    <EditProvider data={data}>
      <BasicLayout>
        {loading ||
          (auth.isAuthenticated === undefined && (
            <>
              <AppSpinner />
            </>
          ))}
        {(!loading && !data) ||
          (auth.isAuthenticated === false && <Unauthorized />)}
        {data && auth.isAuthenticated && (
          <>
            <CreateEditSenotype isEdit={true} />
          </>
        )}
        {!loading && !data && (
          <NotFound
            subTitle={
              <span>
                The <strong>Senotype</strong> with uuid{' '}
                <code>{senotype_id}</code> could not be found.
              </span>
            }
          />
        )}
      </BasicLayout>
    </EditProvider>
  );
}

export default Page;
