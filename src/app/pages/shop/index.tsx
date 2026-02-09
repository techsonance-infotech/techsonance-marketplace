import { use, useEffect } from "react"
import { Carousel } from "../../../components/common/Carousel"
import { HOME_HERO_DESC, HOME_HERO_TITLE } from "../../../utils/constants"
import { useDispatch } from "react-redux";

import { Button } from "../../../components/ui/button";

const imgs=[
'https://m.media-amazon.com/images/I/61KcQyhY6SL._SL1200_.jpg',
'https://m.media-amazon.com/images/I/71YenZNhuPL._SL1500_.jpg',
'https://m.media-amazon.com/images/I/61En6OhNqNL._SL1200_.jpg'
]
export function Home() {
    const dispatch = useDispatch();
   
 
    return (
        <>
        <main className=" ">
<Carousel items={imgs} styles="absolute z-[-10] filter blur-sm" />
        <h1 className="pt-16 text-2xl font-bold text-balance m-auto lg:w-[30vw] sm:w-[50vw] text-center mb-6">
            {HOME_HERO_TITLE
            }
        </h1>
        <p className="lg:text-5xl sm:text-3xl  font-bold text-balance m-auto lg:w-[60vw] sm:w-[70vw] text-center mb-16">{HOME_HERO_DESC}</p>
        <Button className="m-auto block ">Shop Now</Button>
        </main>
        </>
    )
}
