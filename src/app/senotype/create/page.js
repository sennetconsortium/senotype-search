'use client';
import { useContext } from 'react';
import BasicLayout from '@/components/layout/BasicLayout';
import { EditProvider } from '@/context/EditContext';
import AppSpinner from '@/components/AppSpinner';
import Unauthorized from '@/components/errors/Unauthorized';
import AppContext from '@/context/AppContext';
import CreateEditSenotype from '@/components/senotype/CreateEditSenotype';

function Page() {
  const { auth, hasCreatorAccess, isAuthenticating } = useContext(AppContext);
  
  return (
    <EditProvider>
      <BasicLayout>
        {isAuthenticating && (
          <>
            <AppSpinner />
          </>
        )}
        
        {isAuthenticating === false &&
          (auth.isAuthenticated === false || !hasCreatorAccess()) && (
            <Unauthorized />
          )}

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
