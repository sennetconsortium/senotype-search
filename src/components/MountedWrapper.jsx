'use client';
import { AppProvider } from '@/context/AppContext';
import '@/lib/general';

function MountedWrapper({ children }) {
  return <AppProvider>{children}</AppProvider>;
}

export default MountedWrapper;
