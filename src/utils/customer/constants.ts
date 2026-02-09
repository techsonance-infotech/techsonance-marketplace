
//Cusomter Home hero title and description
export const HOME_HERO_TITLE = "Welcome to Sound Sphere - Your Ultimate Music Marketplace";
export const HOME_HERO_DESC = "Discover, buy, and sell music products with ease. Join our vibrant community of music lovers and elevate your sound experience today!";
export const HERO_BTN_TEXT = "Shop Now";
export interface NavLinkType {
    [key: string]: string;
}
// Navigation Links
export const NAV_LINKS: NavLinkType[] = [{ Home: '/' }, { Shop: '/shop' }, { About: '/about' }, { Contact: '/contact' }]
// Footer Text
export const FOOTER_TEXT = "Copyright © 2026 Sound Sphere. All rights reserved."

export const HOME_BRAND_FEATURES = [
    {
        title: 'Secure Payment',
        icon: 'Wallet'
    },
    {
        title: 'Free Shipping',
        icon: 'Package'
    },
    {
        title: 'Delivered with Care and on time',
        icon: 'Truck'
    },
    {
        title: 'High Quality audio',
        icon: 'audio-lines'
    },
]
export interface CATEGORY_LIST_TYPE {
    title: string;
    url: string;
}
export const CATEGORY_LIST: CATEGORY_LIST_TYPE[] = [
    {
        title: 'Guitars',
        url: 'https://m.media-amazon.com/images/I/61KcQyhY6SL._SL1200_.jpg'
    },
    {
        title: 'Drums',
        url: 'https://m.media-amazon.com/images/I/71YenZNhuPL._SL1500_.jpg'
    },
    {
        title: 'Keyboards',
        url: 'https://m.media-amazon.com/images/I/61En6OhNqNL._SL1200_.jpg'
    },
    {
        title: 'Microphones',
        url: 'https://m.media-amazon.com/images/I/61KcQyhY6SL._SL1200_.jpg'
    },
    {
        title: 'Headphones',
        url: 'https://m.media-amazon.com/images/I/71YenZNhuPL._SL1500_.jpg'
    },
    {
        title: 'Audio Interfaces',
        url: 'https://m.media-amazon.com/images/I/61En6OhNqNL._SL1200_.jpg'
    },
    {
        title: 'Studio Monitors',
        url: 'https://m.media-amazon.com/images/I/61KcQyhY6SL._SL1200_.jpg'
    },
    {
        title: 'DJ Equipment',
        url: 'https://m.media-amazon.com/images/I/71YenZNhuPL._SL1500_.jpg'
    }
]
export interface BestSellingProductType {
    title: string;
    url: string;
    description: string;
    satisfaction: string;
}
    export const BEST_SELLING_PRODUCTS: BestSellingProductType = {

    title: 'Fender Stratocaster Electric Guitar',
    url: 'https://m.media-amazon.com/images/I/61KcQyhY6SL._SL1200_.jpg',
    description: 'Experience the iconic sound and playability of the Fender Stratocaster Electric Guitar. Perfect for musicians of all levels, this guitar delivers classic tones and exceptional performance. Whether you\'re a beginner or a seasoned pro, the Stratocaster is your ticket to musical greatness.',
    satisfaction: '98%  ',
}