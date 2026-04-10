'use client';
import { AppProvider } from '@/context/AppContext';

function MountedWrapper({ children }) {
  return <AppProvider>{children}</AppProvider>;
}

export default MountedWrapper;
