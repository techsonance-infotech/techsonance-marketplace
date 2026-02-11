import { SlidersHorizontal, ChevronUp, ChevronRight, ChevronDown } from 'lucide-react'
import { type PRODUCT_LIST_TYPE } from '../../utils/customer/constants'
import { useEffect, useState } from 'react'
import { is } from 'date-fns/locale'

export function FilterSidebar({ PRODUCT_LIST, filterProduct }: {
  PRODUCT_LIST: PRODUCT_LIST_TYPE[],
  filterProduct: React.Dispatch<React.SetStateAction<PRODUCT_LIST_TYPE[]>>
}) {
  const [products, setProducts] = useState<PRODUCT_LIST_TYPE[]>(PRODUCT_LIST)
  const [categoryFilter] = useState<string[]>([...new Set(PRODUCT_LIST.map(pro => pro.category))])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isColorsOpen, setIsColorsOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  // Example colors based on image
  const colors = [
    { name: 'Navy', class: 'bg-blue-600' },
    { name: 'Black', class: 'bg-gray-900' },
    { name: 'Red', class: 'bg-red-500' },
    { name: 'Yellow', class: 'bg-yellow-400' },
    { name: 'White', class: 'bg-white border' },
    { name: 'Blue', class: 'bg-blue-400' }
  ];

  const handleCategoryFilter = (category: string) => {
    if (!selectedCategories.includes(category)) {
      setSelectedCategories(prev => [...prev, category])
    } else {
      setSelectedCategories(prev => prev.filter(cat => cat !== category))
    }
  }

  useEffect(() => {
    if (selectedCategories.length === 0) {
      filterProduct(products)
    } else {
      filterProduct(products.filter(pro => selectedCategories.includes(pro.category)))
    }
  }, [selectedCategories, products, filterProduct])
  return (
    <aside className='w-72 bg-white border-r border-gray-200 p-6 flex flex-col gap-8 hidden lg:block h-full'>
      {/* Header */}
      <div className='flex items-center justify-between pb-4 border-b border-gray-100'>
        <h1 className='text-lg font-bold text-gray-800'>Filter</h1>
        <SlidersHorizontal size={20} className="text-gray-500" />
      </div>

      {/* Price Section */}
      <section className='my-4'>
        <div className='flex items-center justify-between mb-6' onClick={() => setIsPriceOpen(!isPriceOpen)}>
          <h2 className='text-md font-semibold text-gray-700'>Price</h2>
          {isPriceOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>

        {/* Mock Range Slider */}
        {isPriceOpen && (
          <>

            <div className="relative h-1 w-full bg-blue-100 rounded-full mb-6">
              <div className="absolute h-full w-2/3 bg-blue-500 left-4 rounded-full"></div>
              <div className="absolute top-1/2 -translate-y-1/2 left-4 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-md cursor-pointer"></div>
              <div className="absolute top-1/2 -translate-y-1/2 left-[70%] w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-md cursor-pointer"></div>
            </div>


            <div className='flex items-center gap-3'>
              <div className="flex-1 border rounded-md p-1 px-2 text-xs text-gray-500 flex items-center">
                ₹<input type="text" defaultValue="1000" className="w-full outline-none ml-1 bg-transparent" />
              </div>
              <div className="flex-1 border rounded-md p-1 px-2 text-xs text-gray-500 flex items-center">
                ₹<input type="text" defaultValue="10000" className="w-full outline-none ml-1 bg-transparent" />
              </div>
            </div>
          </>

        )}
      </section>

      {/* Colors Section */}
      <section className='my-4'>
        <div className='flex items-center justify-between mb-4' onClick={() => setIsColorsOpen(!isColorsOpen)}>
          <h2 className='text-md font-semibold text-gray-700'>Colors</h2>
          {isColorsOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
        {isColorsOpen && (
          <div className='grid grid-cols-3 gap-y-4 gap-x-2'>
            {colors.map((color) => (
              <div key={color.name} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className={`w-6 h-6 rounded-md ${color.class} shadow-sm group-hover:ring-2 ring-blue-200 transition-all`}></div>
                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">{color.name}</span>
              </div>
            ))}
          </div>
        )}

      </section>

      {/* Category Section */}
      <section className='my-4'>
        <div className='flex items-center justify-between mb-4' onClick={() => setIsCategoryOpen(!isCategoryOpen)}>
          <h2 className='text-md font-semibold text-gray-700'>Category</h2>
          {isCategoryOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </div>
        {isCategoryOpen && (
          <div className='flex flex-col gap-3'>
            {categoryFilter.map((category, idx) => (
              <div
                key={idx}
                onClick={() => handleCategoryFilter(category)}
                className="flex items-center justify-between group cursor-pointer"
              >
                <label
                  className={`text-sm cursor-pointer transition-colors ${selectedCategories.includes(category) ? 'text-blue-600 font-medium' : 'text-gray-500'}`}
                >
                  {category}
                </label>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
            ))}
          </div>

        )}
      </section>
    </aside>
  )
}