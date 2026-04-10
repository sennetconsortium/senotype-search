'use client';
import AUTH from '@/lib/auth';
import { useEffect } from 'react';

function page() {
  useEffect(() => {
    AUTH.logout();
    window.location = '/';
  }, []);
  return <div>page</div>;
}

export default page;
