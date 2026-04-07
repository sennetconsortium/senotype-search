'use client'
import BasicLayout from '@/components/layout/BasicLayout'
import Senotype from '@/components/Senotype/Senotype'
import { EditProvider } from '@/context/EditContext'


function page() {
  return (
    <EditProvider>
      <BasicLayout>
        <Senotype />
      </BasicLayout>
    </EditProvider>
  )
}

export default page