'use client';
import AUTH from '@/lib/auth';
import { useEffect } from 'react';

function Page() {
  useEffect(() => {
    AUTH.logout();
    window.location = '/';
  }, []);
  return <div>page</div>;
}

export default Page;
