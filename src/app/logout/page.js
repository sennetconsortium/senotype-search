'use client';
import AUTH from '@/lib/auth';
import { useEffect } from 'react';

function Page() {
  useEffect(() => {
    AUTH.logout();
    window.location = '/';
  }, []);
  return <div>Logging you out, one moment ...</div>;
}

export default Page;
