'use client';
import { AppProvider } from '@/context/AppContext';
import '@/lib/general';
import { App } from 'antd';

function MountedWrapper({ children }) {
  return (
    <App>
      <AppProvider>{children}</AppProvider>
    </App>
  );
}

export default MountedWrapper;
