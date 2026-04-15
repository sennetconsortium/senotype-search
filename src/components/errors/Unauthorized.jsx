'use client';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import AppContext from '@/context/AppContext';

export default function Unauthorized() {
  const router = useRouter();
  const { auth } = useContext(AppContext);

  return (
    <Result
      status="403"
      title={auth.isAuthenticated ? '403' : '401'}
      subTitle={'Sorry, you are not authorized to access this page.'}
      extra={[
        <Button key="retry" type="primary" onClick={() => router.push('/')}>
          Login
        </Button>,
        <Button key="home" onClick={() => router.push('/search')}>
          Back Home
        </Button>,
      ]}
    />
  );
}
