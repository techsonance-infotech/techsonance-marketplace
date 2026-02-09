import React from 'react'

export default function BuyBtn({productId}: {productId?: string}) {
  return (
    <>
    <button className='bg-brand-primary-foreground text-primary px-4 py-2 rounded-md hover:bg-brand-primary-dark transition-colors duration-300 flex items-center gap-2 mt-4'>
        Buy
    </button>
    </>
  )
}
