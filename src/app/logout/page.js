'use client';
import AUTH from '@/lib/auth';
import URLS from '@/lib/urls';
import { useEffect } from 'react';

function Page() {
  useEffect(() => {
    AUTH.logout();
    window.location = URLS.api.ingest.base + 'logout';
  }, []);
  return <div className='alert alert-info'>Logging you out, one moment ...</div>;
}

export default Page;
