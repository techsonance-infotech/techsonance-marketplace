import { Link } from 'react-router'
import type { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';

export default function BuyBtn({ productId, styles }: { productId?: string, styles?: string }) {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <> <Link to={`/customerProfile/${user?.user_id}/checkout/${productId}`} className={`${styles}  `}>   
    <motion.button whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.8 }}
      transition={{ duration: 0.15 }} className={`bg-brand-primary-foreground text-primary px-6 py-3  rounded-lg hover:bg-brand-primary-dark transition-colors duration-300 gap-2 text-center   ${styles}`} >Buy </motion.button> </Link>
    </>
  )
}
