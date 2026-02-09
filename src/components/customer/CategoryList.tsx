import type { CATEGORY_LIST_TYPE } from "../../utils/customer/constants";

export function CategoryList({ categories, styles }: { categories?: CATEGORY_LIST_TYPE[], styles?: string }) {
    return (
        <>
            <section className="xl:pt-10 pb-8 xl:px-32   lg:px-8 md:px-4 sm:px-2 py-1">
                <h2 className="text-2xl text-center font-bold mt-8 mb-4">Our Categories</h2>
                <ul className={`flex flex-wrap justify-between gap-4 ${styles}`}>
                    {categories && categories.slice(0, 4).map((category, idx) => (
                        <li key={idx} className="text-lg text-gray-700 hover:text-gray-900 cursor-pointer">
                            <img className="w-74 h-86 object-cover rounded-lg my-2" src={category.url} alt={category.title.trim()} />
                            {category.title.trim()}
                        </li>
                    ))}
                </ul>

            </section>
        </>
    )
}
