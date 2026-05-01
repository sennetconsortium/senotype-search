'use client';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import AppContext from '@/context/AppContext';

export default function NotFound({
  subTitle = 'Sorry, the page you visited does not exist.',
}) {
  const router = useRouter();
  const { auth } = useContext(AppContext);

  return (
    <Result
      status="404"
      title={404}
      subTitle={subTitle}
      extra={[
        <Button
          type={'primary'}
          key="home"
          onClick={() => router.push('/search')}
        >
          Back Home
        </Button>,
      ]}
    />
  );
}
