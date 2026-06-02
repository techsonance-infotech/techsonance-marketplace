'use client'
import { InnerSideBar } from '@/components/vendor/InnerSideBar'
import { useParams } from 'next/navigation';
import React from 'react'

export default  function FinancesLayout({ children }: { children: React.ReactNode }) {
    const {vendorId} = useParams<{ vendorId: string }>();
    return (
               <main className='pl-[120px]'>
            <InnerSideBar vendorId={vendorId} selectedMenu="Finances" />
            {children}
        </main>
    )
}
