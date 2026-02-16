import { Carousel } from "../../../components/common/Carousel"
import { HOME_HERO_DESC, HOME_HERO_TITLE } from "../../../utils/constants"
import { useDispatch } from "react-redux";
import { DynamicIcon } from 'lucide-react/dynamic';
import {motion} from "motion/react";
import { BEST_SELLING_PRODUCTS, CATEGORY_LIST, FEEDBACK_LIST, HOME_BRAND_FEATURES, PRODUCT_LIST } from "../../../utils/customer/constants";
import { useState } from "react";
import { CategoryList } from "../../../components/customer/CategoryList";
import { BestSelling } from "../../../components/customer/BestSelling";
import { ProductList } from "../../../components/customer/ProductList";
import { CustomerFeedback } from "../../../components/customer/CustomerFeedback";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router";

const imgs = [
    'https://m.media-amazon.com/images/I/61KcQyhY6SL._SL1200_.jpg',
    'https://m.media-amazon.com/images/I/71YenZNhuPL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61En6OhNqNL._SL1200_.jpg'
]
export function Home() {
    const dispatch = useDispatch();
    const [features, setFeatures] = useState(HOME_BRAND_FEATURES);
    const isMobile = useMediaQuery({
        query: "(max-width: 768px)"
    });

    return (
        <>
            <main className="h-full w-full relative  ">
                <Carousel items={imgs} styles="absolute z-[-10] filter blur-sm" />
                <section className="xl:px-32 xl:py-2 lg:px-8 md:px-4 sm:px-2 py-1">


                    <h1 className="pt-16 px-2 lg:text-2xl md:text-xl text-lg font-bold text-balance m-auto lg:w-[30vw] sm:w-[50vw] text-center mb-6">
                        {HOME_HERO_TITLE}
                    </h1>
                    <p className="lg:text-5xl md:text-4xl text-2xl px-2  font-bold text-balance m-auto lg:w-[60vw] sm:w-[70vw] text-center mb-16">{HOME_HERO_DESC}</p>
                    <Link to="/shopping" className="m-auto  ">
                        <motion.button className="m-auto block  bg-linear-to-t from-brand-primary to-brand-secondary text-primary font-bold px-4 py-2 rounded-lg">Shop Now</motion.button>
                    </Link>
                </section>
                <section className="flex justify-between gap-16 mt-14  flex-wrap bg-primary xl:pt-10 pb-8 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1">
                    <div className="w-full  grid lg:grid-cols-4  grid-cols-2 gap-4 ">

                        {Array.isArray(features) && features.map((feature, idx) => (
                            <div key={idx} className="flex flex-col items-center justify-center gap-4 p-2" >
                                <span className="bg-linear-to-t from-brand-primary to-brand-secondary p-3 rounded-full ">
                                    <DynamicIcon name={feature.icon.toLowerCase()} className="lg:h-8 lg:w-8 h-6 w-6 text-primary" />
                                </span>
                                <p className="lg:px-2 lg:py-1 py-0 px-1 font-bold text-center lg:text-lg text-sm text-band-primary-foreground">{feature.title}</p>
                            </div>
                        ))}
                    </div>

                    <hr className="mx-auto w-[80%] h-[2px] lg:text-gray-400  text-gray-300 mb mb-2  " />
                </section>
                <section className="hero_img ">
                    <img className="w-full h-86 object-cover" src="https://m.media-amazon.com/images/I/61KcQyhY6SL._SL1200_.jpg" alt="Hero Image" />
                </section>
                <CategoryList categories={CATEGORY_LIST} />

                <BestSelling product={BEST_SELLING_PRODUCTS} styles="bg-linear-to-r from-brand-primary to-brand-secondary" />

                <section className="xl:pt-5 pb-2 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1">
                    <h2 className="text-2xl text-center font-bold mt-8 mb-4">Popular products</h2>
                    <ProductList products={PRODUCT_LIST} />
                </section>
                <CustomerFeedback FEEDBACK_LIST={FEEDBACK_LIST} />
            </main>
        </>
    )
}
