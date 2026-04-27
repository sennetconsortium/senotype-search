'use client';
import { useContext } from 'react';
import BasicLayout from '@/components/layout/BasicLayout';
import { EditProvider } from '@/context/EditContext';
import AppSpinner from '@/components/AppSpinner';
import Unauthorized from '@/components/errors/Unauthorized';
import AppContext from '@/context/AppContext';
import EditSenotype from '@/components/senotype/EditSenotype';

function Page() {
  const { auth } = useContext(AppContext);
  return (
    <EditProvider>
      <BasicLayout>
        {auth.isAuthenticated === undefined && (
          <>
            <AppSpinner />
          </>
        )}
        {auth.isAuthenticated === false && <Unauthorized />}
        {auth.isAuthenticated && (
          <>
            <EditSenotype />
          </>
        )}
      </BasicLayout>
    </EditProvider>
  );
}

export default Page;
