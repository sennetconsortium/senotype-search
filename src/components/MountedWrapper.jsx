'use client';
import { AppProvider } from '@/context/AppContext';
import useGoogleTagManager from '@/hooks/useGoogleTagManager';
import '@/lib/general';
import { App } from 'antd';

function MountedWrapper({ gtmId, children }) {
  useGoogleTagManager(gtmId);

  return (
    <App>
      <AppProvider>{children}</AppProvider>
    </App>
  );
}

export default MountedWrapper;
