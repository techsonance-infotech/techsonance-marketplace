import { Heart } from 'lucide-react'
 
export default function WishListBtn({productId,styles}: {productId?: string, styles?: string}) {
  return (
    <>
    <button className={`bg-brand-secondary text-primary px-2 py-2 rounded-full hover:bg-brand-secondary-dark transition-colors duration-300 flex items-center gap-2 mt-4 ${styles}`}>
        <Heart size={32} />
    </button>
    </>
  )
}
