import React from 'react'
import { useParams } from 'react-router'
import { CATEGORY_LIST, PRODUCT_LIST, type PRODUCT_LIST_TYPE } from '../../../utils/customer/constants'
import WishListBtn from '../../../components/customer/WishListBtn'
import { AddToCart } from '../../../components/customer/AddToCart'
import BuyBtn from '../../../components/customer/BuyBtn'
import { DynamicIcon } from 'lucide-react/dynamic'
import { ProductList } from '../../../components/customer/ProductList'
const productS = PRODUCT_LIST
const brandOffer = [
  {
    id: '1',
    title: '1 year warranty',
    description: 'Get 1 year warranty on this product',
    icon: 'shopping-bag'
  },
  {
    id: '2',
    title: 'Free delivery',
    description: 'Get free delivery on this product',
    icon: 'truck'
  },
  {
    id: '3',
    title: '7 days return',
    description: 'Get 7 days return on this product',
    icon: 'undo-2'
  },
  {
    id: '4',
    title: 'Cash on delivery',
    description: 'Get cash on delivery on this product',
    icon: 'banknote'
  },
  {
    id: '5',
    title: 'GST Billing',
    description: 'Get GST Bill on this product',
    icon: 'file-spreadsheet'
  }
]
export function Product() {
  const { id } = useParams()
  const product: PRODUCT_LIST_TYPE | undefined = productS.find(pro => pro.id === id)
  if (!product) {
    return (
      <>

        <h1 className='text-2xl font-bold text-gray-900'>Product not found</h1>
      </>
    )
  }
  return (
    <>
      <main className='  xl:pt-10 pb-8 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1'>
        <section className="flex justify-evenly gap-8">
          <span className='flex gap-4 w-full'>
            <div className=''>
              {
                product.specificationsImgUrl &&
                product.specificationsImgUrl.map((img, idx) => (
                  <img key={idx} src={img} alt={`${product.title} specifications ${idx + 1}`} className="aspect-square w-40 h-40 object-cover mb-4 rounded-2xl" />
                ))
              }
            </div>
            <div className='  relative  w-full ' >
              <WishListBtn styles=" absolute top-0 right-4 " />
              <img src={product.imgUrl} alt={product.title} className='aspect-square w-full object-cover rounded-2xl' />
            </div>
          </span>

          <div className='flex flex-col gap-4 w-full' >
            <p>
              {product.rating && (
                <span className='flex my-2'>
                  {Array.from({ length: 5 }, (_, i) => (
                    <DynamicIcon
                      key={i}
                      name='star'
                      fill='yellow' 
                      className={i < product.rating ? 'text-yellow-500' : 'text-gray-800'}
                    />
                  ))}
                </span>
              )}
            </p>
            <h1 className='text-2xl font-bold text-gray-900' >{product.title}</h1>
            <p className='text-lg text-gray-700 font-semibold' >{product.description}</p>
            <p className='text-2xl font-bold text-gray-900' >₹{product.price} {product.discount > 0 && <span className='text-sm line-through text-gray-500 ml-2' >₹{Math.floor(product.price / (1 - product.discount))}</span>} {product.discount > 0 && <span className='text-sm text-green-500 ml-2' >{Math.round(product.discount * 100)}% off</span>}</p>
            <p className='text-gray-600'>MRP (Inclusive of all taxes)</p>
            <span className='flex  gap-8'>
              <AddToCart productId={product.id} />
              <BuyBtn productId={product.id} />
            </span>
            <div className='flex gap-4 mt-8   w-full justify-between items-center  '>
              {
                brandOffer.map(offer => (
                  <div key={offer.id} className='flex flex-col items-center gap-4 '>
                    <DynamicIcon name={offer.icon} strokeWidth={2}
                      size={32} />

                    <h3 className='text-lg font-medium text-balance text-gray-900'>{offer.title}</h3>
                  </div>
                ))
              }
            </div>

          </div>
        </section>
        <section className='flex items-start  mt-12' >
          <div className='w-[50%] pr-8' >
            <h2 className='text-2xl font-bold text-gray-900 mt-8 mb-4' >Description</h2>
            {product.description.split('\n').map((line, idx) => (
              <p key={idx} className='text-gray-700 mb-2' >{line}</p>
            ))}
          </div>
          <div className='w-[50%] pl-8 '>
            <h1 className='font-bold text-2xl mb-6'>
              Product Information
            </h1>
            <div className='bg-gray-100 rounded-lg p-4'>

              <table >
                <tbody>
                  {
                    product.productDetails?.specifications &&
                    Object.entries(product.productDetails.specifications).map(([key, value]) => (
                      <tr key={key} className='flex justify-between  ' >
                        <td className='py-2 w-full pl-4 pr-8 font-bold text-gray-900'>{key}</td>
                        <td className='  w-full py-2 pl-8 pr-4 text-gray-700'>{value}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

          </div>
        </section>
        <section className='flex justify-between flex-wrap gap-8 mt-12' >
          {
            product.specificationsImgUrl &&
            product.specificationsImgUrl.map((img, idx) => (
              <img key={idx} src={img} alt={`${product.title} specifications ${idx + 1}`} className="  h-auto object-cover mb-4 rounded-2xl" />
            ))
          }
        </section>
        <section className='my-8'>
          <h1 className='font-bold text-2xl'>
            Related Products
          </h1>
          <ProductList products={CATEGORY_LIST} />
        </section>
        <section className='my-8'>
          <span>
            <h1 className='font-bold text-2xl'>
              All reviews
            </h1>

          </span>
          {product.reviews && product.reviews.length > 0 ? (
            <div className='mt-4 grid grid-cols-2 gap-4'>
              {product.reviews.map((review, idx) => (
                <div key={idx} className=' border-2 border-gray-300 py-4   px-4 rounded-lg mb-4'>
                  <div className='flex items-center gap-4 mb-2'>

                    <div>
                      <span className='flex my-2'>


                        {Array.from({ length: review.rating }, (_, i) => (
                          <DynamicIcon
                            key={i}
                            name='star'
                            fill='yellow'
                            className={i < review.rating ? 'text-yellow-500' : 'text-gray-800'}
                          />
                        ))}
                      </span>
                      <h3 className='text-lg font-medium text-gray-900'>{review.userName}</h3>
                      <p className='text-sm text-gray-500'>{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className='text-gray-700'>{review.comment}</p>
                  <p className='mt-4'>
                    {review.date && (
                      <span className='text-sm text-gray-500'>
                        Reviewed on {new Date(review.date).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-700 mt-4'>No reviews yet.</p>
          )}

        </section>
      </main>
    </>
  )
}
