import { Link } from 'react-router'
import type { RootState } from '../../app/store';
import { useSelector } from 'react-redux';

export default function BuyBtn({ productId, styles }: { productId?: string,  styles?: string }) {
  const {user } = useSelector((state: RootState) => state.auth);
  return (
    <> <Link to={`/customerProfile/${user?.user_id}/checkout/${productId}`}> <button className={`bg-brand-primary-foreground text-primary px-6 py-2 border-2 rounded-md hover:bg-brand-primary-dark transition-colors duration-300 gap-2 ${styles} text-center`} >Buy </button> </Link>
    </>
  )
}
