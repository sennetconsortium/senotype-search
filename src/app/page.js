
'use client'
import {useContext, useEffect } from 'react'
import BasicLayout from "@/components/layout/BasicLayout";
import Login from "@/components/Login";
import AppContext from "@/context/AppContext";
import URLS from '@/lib/urls';


export default function Home() {
  const { auth } = useContext(AppContext)

  useEffect(() => {
    if (auth.isAuthorized) {
      window.location = URLS.search
    }
  }, [auth])

  return (
    <div>
     <BasicLayout fluid={undefined}>
       <Login />
     </BasicLayout>
    </div>
  );
}
