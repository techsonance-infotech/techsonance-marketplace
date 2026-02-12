import { Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../features/Wishlist';
 
export default function WishListBtn({productId,styles}: {productId?: string, styles?: string}) {
  const dispatch = useDispatch();   
  const {wishItems}=useSelector((state:any)=>state.wishlist)
  const isAlreadyInWishlist = wishItems.some((item: any) => item.productId === productId);
  const handleAddToWishlist = () => {
    if (isAlreadyInWishlist) {
     dispatch(removeFromWishlist(productId));
     console.log(`Removing product ${productId} from wishlist`);
      return;
    }
    dispatch(addToWishlist({ productId }));
    console.log(`Adding product ${productId} to wishlist`);
  }
  return (
    <>
    <button onClick={handleAddToWishlist} className={` text-primary px-2 py-2 rounded-full  transition-colors duration-300 flex items-center gap-2 mt-4 ${styles} ${isAlreadyInWishlist ? 'bg-pink-100 text-pink-500' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
        <Heart size={32} color={isAlreadyInWishlist ? "pink" : "black"} fill={isAlreadyInWishlist ? "pink" : "none"} />
    </button>
    </>
  )
}
