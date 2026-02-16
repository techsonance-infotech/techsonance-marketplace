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
      <section className={`flex lg:flex-row flex-col  gap-12 justify-center xl:pt-10 pb-8 xl:px-32   lg:px-8 md:px-4 px-4 py-4 w-full bg-brand-secondary  ${styles}`} >
        <img className='lg:w-64 lg:h-86 lg:mx-0 mx-auto    object-cover rounded-2xl' src={product?.url} alt={product?.title} />
        <div className='text-primary lg:w-[70%] md:w-[40%] w-full flex flex-col justify-center gap-4' >
          <h2 className='text-primary lg:text-2xl text-xl font-bold'>{product?.title}</h2>
          <p className="lg:mb-4 mb-2">{product?.description}</p>

          <span className=" h-[1px] w-[60%] bg-gray-400 lg:my-4 my-2" ></span>
          <p>{product?.satisfaction}
            <br />
            Customer Satisfaction
          </p>
        </div>
      </section>
    </>
  )
}
