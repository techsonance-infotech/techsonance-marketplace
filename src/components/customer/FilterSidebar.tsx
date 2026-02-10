import { SlidersHorizontal } from 'lucide-react'
import { type PRODUCT_LIST_TYPE } from '../../utils/customer/constants'
import { useEffect, useState } from 'react'
import { fi } from 'date-fns/locale'



export function FilterSidebar({ PRODUCT_LIST, filterProduct }: {
  PRODUCT_LIST: PRODUCT_LIST_TYPE[],
  filterProduct: React.Dispatch<React.SetStateAction<PRODUCT_LIST_TYPE[]>>
}) {
  const [products, setProducts] = useState<PRODUCT_LIST_TYPE[]>(PRODUCT_LIST)
  const [categoryFilter, setCategoryFilter] = useState<string[]>([...new Set(PRODUCT_LIST.map(pro => pro.category))])
 
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const handlePriceFilter = (value: string) => {
    if (value === 'lowToHigh') {
      const sortedProducts = [...products].sort((a, b) => a.price - b.price);

      filterProduct(sortedProducts)
      console.log('low to high ', products)
    }
    else if (value === 'highToLow') {
      const sortedProducts = [...products].sort((a, b) => b.price - a.price);
      filterProduct(sortedProducts)
      console.log('high to low ', products)
    } else {
      filterProduct(products);
    }
  }
  const handleCategoryFilter = (e: React.ChangeEvent<HTMLInputElement>, category: string) => {

    if (e.target.checked) {
      filterProduct(prev => [...prev, ...products.filter(pro => pro.category === category)])

      setSelectedCategories(prev => [...prev, category])
    } else {
      filterProduct(prev => prev.filter(pro => pro.category !== category))
      setSelectedCategories(prev => prev.filter(cat => cat !== category))
    }
    console.log(PRODUCT_LIST)
  }
  useEffect(() => {
    setProducts(PRODUCT_LIST)
    if(selectedCategories.length === 0) {
      filterProduct(products)
    }

 
  }, [selectedCategories])

  return (
    <>
      <aside className='w-64 bg-card border-2 border-gray-300 text-card-foreground p-4 rounded-lg lg:block lg:h-dvh hidden'>
        <h1 className='flex items-center justify-between'>Filter <SlidersHorizontal /> </h1>
        <div className='flex flex-col gap-4 mt-4' >
          <div className='flex flex-col gap-2' >
            <h2 className='text-lg font-semibold' >Price</h2>
            <div className='flex items-center gap-2' >
              <input onChange={(e) => {
                handlePriceFilter(e.target.value)
              }} type="radio" name='price' id='lowToHigh' value='lowToHigh' />
              <label htmlFor="lowToHigh" >Low to High</label>
            </div>
            <div className='flex items-center gap-2' >
              <input onChange={(e) => {
                handlePriceFilter(e.target.value)
              }} type="radio" name='price' id='highToLow' value='highToLow' />
              <label htmlFor="highToLow" >High to Low  </label>
            </div>
          </div>
        </div>
        <section>
          <h2 className='mt-6 mb-2 text-lg font-semibold' >Category</h2>
          <div className='flex flex-col gap-2 mt-2' >
            {
              categoryFilter.map((category, idx) => (
                <div key={idx} className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1' ${selectedCategories.includes(category) ? 'flex items-center gap-2 bg-amber-100  1' : 'flex items-center gap-2'}`} >
                  <input onChange={(e) => handleCategoryFilter(e, category)} type="checkbox" name={category} id={category} value={category} className='' />
                  <label className="text-lg text-gray-500 cursor-pointer" htmlFor={category} >{category}</label>
                </div>
              ))
            }
          </div>
        </section>

      </aside>
    </>
  )
}
