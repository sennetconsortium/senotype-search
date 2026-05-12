'use client';
import { useContext } from 'react';
import BasicLayout from '@/components/layout/BasicLayout';
import { EditProvider } from '@/context/EditContext';
import AppSpinner from '@/components/AppSpinner';
import Unauthorized from '@/components/errors/Unauthorized';
import AppContext from '@/context/AppContext';
import CreateEditSenotype from '@/components/senotype/CreateEditSenotype';

function Page() {
  const { auth, hasCreatorAccess } = useContext(AppContext);
  return (
    <EditProvider>
      <BasicLayout>
        {auth.isAuthenticated === undefined && (
          <>
            <AppSpinner />
          </>
        )}
        {auth.isAuthenticated === false ||
          (!hasCreatorAccess() && <Unauthorized />)}

        {auth.isAuthenticated && hasCreatorAccess() && (
          <>
            <CreateEditSenotype />
          </>
        )}
      </BasicLayout>
    </EditProvider>
  );
}

export default Page;
