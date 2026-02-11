import { ShoppingCart } from 'lucide-react'
import React from 'react'

export default function BuyBtn({ productId, styles }: { productId?: string, styles?: string }) {
  return (
    <>


      <button className={`bg-brand-primary-foreground text-primary px-6 py-2 border-2 rounded-md hover:bg-brand-primary-dark transition-colors duration-300   gap-2 ${styles} text-center`} >

        Buy
      </button>

    </>
  )
}
