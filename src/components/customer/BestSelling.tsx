import React from 'react'
import type { BestSellingProductType } from '../../utils/customer/constants'

export function BestSelling({
  product, styles
}: {
  product?: BestSellingProductType,
  styles?: string
}) {
  return (
    <>
      <section className={`flex gap-12 justify-center xl:pt-10 pb-8 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1 w-full bg-brand-secondary  ${styles}`} >
        <img className='w-64 h-86 object-cover rounded-2xl' src={product?.url} alt={product?.title} />
        <div className='text-primary w-[70%] lg:w-[40%] sm:w-full flex flex-col justify-center gap-4' >
          <h2 className='text-primary text-2xl font-bold'>{product?.title}</h2>
          <p className="mb-4">{product?.description}</p>

          <span className=" h-[1px] w-[60%] bg-gray-400 my-4" ></span>
          <p>{product?.satisfaction}
            <br />
            Customer Satisfaction
          </p>
        </div>
      </section>
    </>
  )
}
