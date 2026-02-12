import { Carousel } from "../../../components/common/Carousel"
import { HOME_HERO_DESC, HOME_HERO_TITLE } from "../../../utils/constants"
import { useDispatch } from "react-redux";
import { DynamicIcon } from 'lucide-react/dynamic';
import { Button } from "../../../components/ui/button";
import { BEST_SELLING_PRODUCTS, CATEGORY_LIST, FEEDBACK_LIST, HOME_BRAND_FEATURES } from "../../../utils/customer/constants";
import { useState } from "react";
import { CategoryList } from "../../../components/customer/CategoryList";
import { BestSelling } from "../../../components/customer/BestSelling";
import { ProductList } from "../../../components/customer/ProductList";
import { CustomerFeedback } from "../../../components/customer/CustomerFeedback";

const imgs = [
    'https://m.media-amazon.com/images/I/61KcQyhY6SL._SL1200_.jpg',
    'https://m.media-amazon.com/images/I/71YenZNhuPL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61En6OhNqNL._SL1200_.jpg'
]
export function Home() {
    const dispatch = useDispatch();
    const [features, setFeatures] = useState(HOME_BRAND_FEATURES);
    

    return (
        <>
            <main className="h-full w-full relative  ">
                <Carousel items={imgs} styles="absolute z-[-10] filter blur-sm" />
                <section className="xl:px-32 xl:py-2 lg:px-8 md:px-4 sm:px-2 py-1">


                    <h1 className="pt-16 text-2xl font-bold text-balance m-auto lg:w-[30vw] sm:w-[50vw] text-center mb-6">
                        {HOME_HERO_TITLE
                        }
                    </h1>
                    <p className="lg:text-5xl sm:text-3xl  font-bold text-balance m-auto lg:w-[60vw] sm:w-[70vw] text-center mb-16">{HOME_HERO_DESC}</p>
                    <Button className="m-auto block  bg-linear-to-t from-brand-primary to-brand-secondary text-primary font-bold">Shop Now</Button>
                </section>
                <section className="flex justify-between gap-16 mt-14  flex-wrap bg-primary xl:pt-10 pb-8 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1">
                    {Array.isArray(features) && features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-4 p-2" >
                            <span className="bg-linear-to-t from-brand-primary to-brand-secondary p-3 rounded-full ">
                                <DynamicIcon name={feature.icon.toLowerCase()} className="h-8 w-8 text-primary" />
                            </span>
                            <p className="font-bold text-lg text-band-primary-foreground">{feature.title}</p>
                        </div>
                    ))}
                    <span className="w-[80%] h-[2px] bg-gray-300 mb-2  " ></span>
                </section>
                <section className="hero_img ">
                    <img className="w-full h-86 object-cover" src="https://m.media-amazon.com/images/I/61KcQyhY6SL._SL1200_.jpg" alt="Hero Image" />
                </section>
                <CategoryList categories={CATEGORY_LIST} />

                <BestSelling product={BEST_SELLING_PRODUCTS} styles="bg-linear-to-r from-brand-primary to-brand-secondary" />

                <section className="xl:pt-5 pb-2 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1">
                    <h2 className="text-2xl text-center font-bold mt-8 mb-4">Popular products</h2>
                    <ProductList products={CATEGORY_LIST} />
                </section>
                    <CustomerFeedback FEEDBACK_LIST={FEEDBACK_LIST} />
            </main>
        </>
    )
}
