'use client';
import { useContext } from 'react';
import BasicLayout from '@/components/layout/BasicLayout';
import AppContext from '@/context/AppContext';
import AppSpinner from '@/components/AppSpinner';
import Unauthorized from '@/components/errors/Unauthorized';

import ClearCache from '@/components/admin/ClearCache';
import { AdminProvider } from '@/context/AdminContext';

export default function Page() {
  const { auth } = useContext(AppContext);
  return (
    <div>
      <BasicLayout fluid={undefined}>
        {auth.isAuthorized == null && <AppSpinner />}
        {auth.isAdmin === false && <Unauthorized />}
        {auth.isAdmin === true && (
          <>
            <AdminProvider>
              <h1>Admin</h1>
              <ClearCache />
            </AdminProvider>
          </>
        )}
      </BasicLayout>
    </div>
  );
}