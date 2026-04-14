'use client';

import { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';
import BasicLayout from '../components/layout/BasicLayout';

export default function Error({ error, reset }) {
  const router = useRouter();

  useEffect(() => {
    console.error('App error:', error);

    if (error?.digest) {
      console.error('Error digest:', error.digest);
    }
  }, [error]);

  return (
    <BasicLayout classNameMain="mt-2">
      <Result
        status="500"
        title="Something went wrong"
        subTitle={error?.message || 'Sorry, something went wrong.'}
        extra={[
          <Button key="retry" type="primary" onClick={() => reset()}>
            Try again
          </Button>,
          <Button key="home" onClick={() => router.push('/')}>
            Back Home
          </Button>,
        ]}
      />
    </BasicLayout>
  );
}
