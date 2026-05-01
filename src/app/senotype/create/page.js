'use client';
import { useContext } from 'react';
import BasicLayout from '@/components/layout/BasicLayout';
import { EditProvider } from '@/context/EditContext';
import AppSpinner from '@/components/AppSpinner';
import Unauthorized from '@/components/errors/Unauthorized';
import AppContext from '@/context/AppContext';
import CreateEditSenotype from '@/components/senotype/CreateEditSenotype';

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
            <CreateEditSenotype />
          </>
        )}
      </BasicLayout>
    </EditProvider>
  );
}

export default Page;
