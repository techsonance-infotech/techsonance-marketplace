'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Save, 
  Languages, 
  FileText, 
  CheckCircle, 
  Loader2, 
  Plus, 
  Trash2, 
  Globe, 
  ListOrdered,
  BookOpen,
  Mail,
  ShoppingBag,
  Info,
  Layers,
  Heart
} from 'lucide-react';
import AxiosAPI from '@/lib/axios';

type PageType = 'home' | 'navbar' | 'footer' | 'about' | 'contact' | 'shopping';
type LangType = 'en' | 'es';

export default function CmsManagementPage() {
  const { vendorId } = useParams();
  
  const [selectedPage, setSelectedPage] = useState<PageType>('home');
  const [selectedLang, setSelectedLang] = useState<LangType>('en');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [pageTitle, setPageTitle] = useState('');
  
  // Home Page state details
  const [homeHeroSubtitle, setHomeHeroSubtitle] = useState('');
  const [homeHeroTitle, setHomeHeroTitle] = useState('');
  const [homeHeroDesc, setHomeHeroDesc] = useState('');
  const [homeHeroBtnText, setHomeHeroBtnText] = useState('');
  const [homeHeroImageUrl, setHomeHeroImageUrl] = useState('');
  
  const [homeMidSubtitle, setHomeMidSubtitle] = useState('');
  const [homeMidTitle, setHomeMidTitle] = useState('');
  const [homeMidDesc, setHomeMidDesc] = useState('');
  const [homeMidBtnText, setHomeMidBtnText] = useState('');
  const [homeMidImageUrl, setHomeMidImageUrl] = useState('');
  
  const [homeNewArrivalsLeftSubtitle, setHomeNewArrivalsLeftSubtitle] = useState('');
  const [homeNewArrivalsLeftTitle, setHomeNewArrivalsLeftTitle] = useState('');
  const [homeNewArrivalsLeftDesc, setHomeNewArrivalsLeftDesc] = useState('');
  const [homeNewArrivalsLeftBtnText, setHomeNewArrivalsLeftBtnText] = useState('');
  const [homeNewArrivalsLeftImageUrl, setHomeNewArrivalsLeftImageUrl] = useState('');
  
  const [homeNewArrivalsRightTopTitle, setHomeNewArrivalsRightTopTitle] = useState('');
  const [homeNewArrivalsRightTopImageUrl, setHomeNewArrivalsRightTopImageUrl] = useState('');
  const [homeNewArrivalsRightBottomTitle, setHomeNewArrivalsRightBottomTitle] = useState('');
  const [homeNewArrivalsRightBottomImageUrl, setHomeNewArrivalsRightBottomImageUrl] = useState('');
  
  const [homeNewsletterTitle, setHomeNewsletterTitle] = useState('');
  const [homeNewsletterDesc, setHomeNewsletterDesc] = useState('');
  const [homeNewsletterBtnText, setHomeNewsletterBtnText] = useState('');

  // Navbar Links state (list of label-href pairs)
  const [navbarLinks, setNavbarLinks] = useState<{ label: string; href: string }[]>([]);

  // Footer Config state
  const [footerBottomText, setFooterBottomText] = useState('');
  const [footerColumns, setFooterColumns] = useState<{
    header: string;
    links: { title: string; url: string; category?: string; icon?: string; styles?: string }[];
  }[]>([]);

  // About Page state
  const [aboutHeroTitle, setAboutHeroTitle] = useState('');
  const [aboutHeroDesc, setAboutHeroDesc] = useState('');
  const [aboutHeroImg, setAboutHeroImg] = useState('');
  const [aboutOwnThoughtsImg, setAboutOwnThoughtsImg] = useState('');
  const [aboutOwnThoughtsTitle, setAboutOwnThoughtsTitle] = useState('');
  const [aboutOwnThoughtsDesc, setAboutOwnThoughtsDesc] = useState('');
  const [aboutFounderImg, setAboutFounderImg] = useState('');
  const [aboutFounderName, setAboutFounderName] = useState('');
  const [aboutFounderTitle, setAboutFounderTitle] = useState('');
  const [aboutCoreValuesImg, setAboutCoreValuesImg] = useState('');
  const [aboutCoreValuesTitle, setAboutCoreValuesTitle] = useState('');
  const [aboutCoreValuesDesc, setAboutCoreValuesDesc] = useState('');
  const [aboutMissionImg, setAboutMissionImg] = useState('');
  const [aboutMissionTitle, setAboutMissionTitle] = useState('');
  const [aboutMissionDesc, setAboutMissionDesc] = useState('');
  
  const [aboutCoreValues, setAboutCoreValues] = useState<{
    id: number;
    title: string;
    tagline: string;
    description: string;
  }[]>([]);
  
  const [aboutMissionToDeliver, setAboutMissionToDeliver] = useState<{
    id: number;
    title: string;
    tagline: string;
    description: string;
  }[]>([]);

  // Contact Page state
  const [contactHeroTitle, setContactHeroTitle] = useState('');
  const [contactHeroDesc, setContactHeroDesc] = useState('');
  const [contactHeroImg, setContactHeroImg] = useState('');
  const [contactList, setContactList] = useState<{
    id: string;
    type: string;
    title: string;
    description: string;
    icon: string;
  }[]>([]);

  // Shopping Promotion state
  const [shoppingPromoTitle, setShoppingPromoTitle] = useState('');
  const [shoppingPromoDesc, setShoppingPromoDesc] = useState('');
  const [shoppingPromoImg, setShoppingPromoImg] = useState('');
  const [shoppingPromoLink, setShoppingPromoLink] = useState('');

  // Fetch page content
  const loadCmsPage = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const res = await AxiosAPI.get(`/v1/cms/${selectedPage}?lang=${selectedLang}`);
      const data = res.data;
      
      setPageTitle(data?.title || `${selectedPage.toUpperCase()} page configuration`);
      
      const content = typeof data?.content === 'string' ? JSON.parse(data.content) : data?.content || {};

      if (selectedPage === 'home') {
        setHomeHeroSubtitle(content.hero_subtitle || 'SEASON 2024 COLLECTION');
        setHomeHeroTitle(content.hero_title || 'Define Your Modern Aesthetic');
        setHomeHeroDesc(content.hero_desc || 'Experience the masterpiece of architecture, precision and innovation with our handpicked designers.');
        setHomeHeroBtnText(content.hero_btn_text || 'Explore');
        setHomeHeroImageUrl(content.hero_image_url || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop');
        
        setHomeMidSubtitle(content.middle_banner_subtitle || 'LIMITED TIME');
        setHomeMidTitle(content.middle_banner_title || 'Summer Sale: Up to 40% Off');
        setHomeMidDesc(content.middle_banner_desc || 'Select items from our latest collection on sale now.');
        setHomeMidBtnText(content.middle_banner_btn_text || 'Shop Now');
        setHomeMidImageUrl(content.middle_banner_image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop');
        
        setHomeNewArrivalsLeftSubtitle(content.new_arrivals_left_subtitle || 'NEW COLLECTION');
        setHomeNewArrivalsLeftTitle(content.new_arrivals_left_title || 'The Avant-Garde Edit');
        setHomeNewArrivalsLeftDesc(content.new_arrivals_left_desc || 'Exhibiting the boundaries of contemporary fashion. Discover a new status.');
        setHomeNewArrivalsLeftBtnText(content.new_arrivals_left_btn_text || 'Explore Collection');
        setHomeNewArrivalsLeftImageUrl(content.new_arrivals_left_image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop');
        
        setHomeNewArrivalsRightTopTitle(content.new_arrivals_right_top_title || 'Premium Footwear');
        setHomeNewArrivalsRightTopImageUrl(content.new_arrivals_right_top_image_url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop');
        setHomeNewArrivalsRightBottomTitle(content.new_arrivals_right_bottom_title || 'Workplace Essentials');
        setHomeNewArrivalsRightBottomImageUrl(content.new_arrivals_right_bottom_image_url || 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop');
        
        setHomeNewsletterTitle(content.newsletter_title || 'Join the Inner Circle');
        setHomeNewsletterDesc(content.newsletter_desc || 'Subscribe for early access to our latest collections, exclusive events and seasonal updates.');
        setHomeNewsletterBtnText(content.newsletter_btn_text || 'Subscribe');
      } else if (selectedPage === 'navbar') {
        const links = content.links || [
          { "Shop All": "/shopping" },
          { "New Arrivals": "/shopping?tag=new" },
          { "Collections": "/shopping?tag=collections" }
        ];
        const formatted = links.map((linkObj: any) => {
          const key = Object.keys(linkObj)[0];
          return { label: key, href: linkObj[key] || '' };
        });
        setNavbarLinks(formatted);
      } else if (selectedPage === 'footer') {
        setFooterBottomText(content.bottom_text || '© 2026 Luxe Market. All rights reserved.');
        setFooterColumns(content.content || [
          {
            header: "Company",
            links: [
              { title: "About Us", url: "/about" },
              { title: "Sustainability", url: "/sustainability" }
            ]
          }
        ]);
      } else if (selectedPage === 'about') {
        setAboutHeroTitle(content.heroTitle || 'ABOUT US');
        setAboutHeroDesc(content.heroDesc || 'We are Passionate About Our Work');
        setAboutHeroImg(content.heroImg || 'https://static.vecteezy.com/system/resources/previews/022/281/057/original/halftone-gradient-background-with-dots-abstract-blue-dotted-pop-art-pattern-in-comic-style-illustration-vector.jpg');
        setAboutOwnThoughtsImg(content.ownThoughtsImg || 'https://www.mivi.in/cdn/shop/files/SuperPods_Opera_ENC_-_Blue.png?v=1730114006&width=1500');
        setAboutOwnThoughtsTitle(content.ownThoughtsTitle || 'We strive to provide our customers with the highest quality');
        setAboutOwnThoughtsDesc(content.ownThoughtsDesc || 'products and services. Our team is dedicated to ensuring that every customer has a positive experience with our brand.');
        setAboutFounderImg(content.founderImg || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=687&auto=format&fit=crop');
        setAboutFounderName(content.founderName || 'John Doe');
        setAboutFounderTitle(content.founderTitle || 'Founder & CEO');
        setAboutCoreValuesImg(content.coreValuesImg || 'https://wallpaper.forfun.com/fetch/d1/d17e24d67388285f8e284a58a36a866f.jpeg?w=1470&r=0.5625&f=webp');
        setAboutCoreValuesTitle(content.coreValuesTitle || 'Our Core Values that Drive Everything We Do');
        setAboutCoreValuesDesc(content.coreValuesDesc || 'At Techsonance, our core values are the foundation of our company culture.');
        setAboutMissionImg(content.missionImg || 'https://www.mivi.in/cdn/shop/files/For_Why_section_1_044b23b6-dbbd-4b3b-9307-1970700eb153.png?v=1748874263&width=2500');
        setAboutMissionTitle(content.missionTitle || 'Our Mission');
        setAboutMissionDesc(content.missionDesc || 'To redefine the art of listening by fusing collaborative creativity with innovative acoustic engineering.');
        
        setAboutCoreValues(content.coreValues || [
          { id: 1, title: 'Innovation', tagline: 'Acoustic Avant-Garde', description: 'We are committed to pushing boundaries.' }
        ]);
        setAboutMissionToDeliver(content.missionToDeliver || [
          { id: 1, title: 'Quality', tagline: 'Uncompromising Fidelity', description: 'We prioritize quality in everything we do.' }
        ]);
      } else if (selectedPage === 'contact') {
        setContactHeroTitle(content.hero?.heroTitle || 'CONTACT US');
        setContactHeroDesc(content.hero?.heroDesc || "Let's Connect");
        setContactHeroImg(content.hero?.heroImg || 'https://static.vecteezy.com/system/resources/previews/022/281/057/original/halftone-gradient-background-with-dots-abstract-blue-dotted-pop-art-pattern-in-comic-style-illustration-vector.jpg');
        setContactList(content.list || [
          { id: '1', type: 'phone', title: 'Phone', description: '+1 (123) 456-7890', icon: 'phone' },
          { id: '2', type: 'email', title: 'Email', description: 'info@example.com', icon: 'mail' },
          { id: '3', type: 'address', title: 'Address', description: '123 Main St, India', icon: 'map-pin' }
        ]);
      } else if (selectedPage === 'shopping') {
        setShoppingPromoTitle(content.promo_banner_title || 'Uncompromised High-Fidelity Audio');
        setShoppingPromoDesc(content.promo_banner_desc || 'Save up to 40% on professional studio monitors and smart amplifiers.');
        setShoppingPromoImg(content.promo_banner_image_url || 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop');
        setShoppingPromoLink(content.promo_banner_link || '/shopping?tag=promotion');
      }
    } catch (err) {
      console.error('Error fetching CMS page config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCmsPage();
  }, [selectedPage, selectedLang]);

  // Handle Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    let contentPayload: any = {};
    if (selectedPage === 'home') {
      contentPayload = {
        hero_subtitle: homeHeroSubtitle,
        hero_title: homeHeroTitle,
        hero_desc: homeHeroDesc,
        hero_btn_text: homeHeroBtnText,
        hero_image_url: homeHeroImageUrl,
        
        middle_banner_subtitle: homeMidSubtitle,
        middle_banner_title: homeMidTitle,
        middle_banner_desc: homeMidDesc,
        middle_banner_btn_text: homeMidBtnText,
        middle_banner_image_url: homeMidImageUrl,
        
        new_arrivals_left_subtitle: homeNewArrivalsLeftSubtitle,
        new_arrivals_left_title: homeNewArrivalsLeftTitle,
        new_arrivals_left_desc: homeNewArrivalsLeftDesc,
        new_arrivals_left_btn_text: homeNewArrivalsLeftBtnText,
        new_arrivals_left_image_url: homeNewArrivalsLeftImageUrl,
        
        new_arrivals_right_top_title: homeNewArrivalsRightTopTitle,
        new_arrivals_right_top_image_url: homeNewArrivalsRightTopImageUrl,
        new_arrivals_right_bottom_title: homeNewArrivalsRightBottomTitle,
        new_arrivals_right_bottom_image_url: homeNewArrivalsRightBottomImageUrl,
        
        newsletter_title: homeNewsletterTitle,
        newsletter_desc: homeNewsletterDesc,
        newsletter_btn_text: homeNewsletterBtnText
      };
    } else if (selectedPage === 'navbar') {
      contentPayload = {
        links: navbarLinks.filter(l => l.label).map(l => ({ [l.label]: l.href }))
      };
    } else if (selectedPage === 'footer') {
      contentPayload = {
        content: footerColumns,
        bottom_text: footerBottomText
      };
    } else if (selectedPage === 'about') {
      contentPayload = {
        heroTitle: aboutHeroTitle,
        heroDesc: aboutHeroDesc,
        heroImg: aboutHeroImg,
        ownThoughtsImg: aboutOwnThoughtsImg,
        ownThoughtsTitle: aboutOwnThoughtsTitle,
        ownThoughtsDesc: aboutOwnThoughtsDesc,
        founderImg: aboutFounderImg,
        founderName: aboutFounderName,
        founderTitle: aboutFounderTitle,
        coreValuesImg: aboutCoreValuesImg,
        coreValuesTitle: aboutCoreValuesTitle,
        coreValuesDesc: aboutCoreValuesDesc,
        missionImg: aboutMissionImg,
        missionTitle: aboutMissionTitle,
        missionDesc: aboutMissionDesc,
        coreValues: aboutCoreValues,
        missionToDeliver: aboutMissionToDeliver
      };
    } else if (selectedPage === 'contact') {
      contentPayload = {
        hero: {
          heroTitle: contactHeroTitle,
          heroDesc: contactHeroDesc,
          heroImg: contactHeroImg
        },
        list: contactList
      };
    } else if (selectedPage === 'shopping') {
      contentPayload = {
        promo_banner_title: shoppingPromoTitle,
        promo_banner_desc: shoppingPromoDesc,
        promo_banner_image_url: shoppingPromoImg,
        promo_banner_link: shoppingPromoLink
      };
    }

    try {
      await AxiosAPI.post('/v1/cms', {
        page_content_type: selectedPage,
        language: selectedLang,
        title: pageTitle,
        content: JSON.stringify(contentPayload),
        seo_meta: {}
      });
      
      setMessage({ text: 'Storefront CMS content updated successfully!', type: 'success' });
      // Clear local storage cache
      localStorage.removeItem(`soundsphere_cms_${selectedPage}_${selectedLang}`);
    } catch (err) {
      console.error('Failed to save CMS config:', err);
      setMessage({ text: 'Failed to update CMS page configuration. Please check inputs.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Helper methods for Navbar Link list
  const addNavbarLink = () => {
    setNavbarLinks([...navbarLinks, { label: '', href: '' }]);
  };
  const removeNavbarLink = (index: number) => {
    setNavbarLinks(navbarLinks.filter((_, idx) => idx !== index));
  };
  const updateNavbarLink = (index: number, key: 'label' | 'href', val: string) => {
    const updated = [...navbarLinks];
    updated[index][key] = val;
    setNavbarLinks(updated);
  };

  // Helper methods for Footer Columns list
  const addFooterColumn = () => {
    setFooterColumns([...footerColumns, { header: '', links: [{ title: '', url: '' }] }]);
  };
  const removeFooterColumn = (colIdx: number) => {
    setFooterColumns(footerColumns.filter((_, idx) => idx !== colIdx));
  };
  const updateFooterColHeader = (colIdx: number, val: string) => {
    const updated = [...footerColumns];
    updated[colIdx].header = val;
    setFooterColumns(updated);
  };
  const addFooterColLink = (colIdx: number) => {
    const updated = [...footerColumns];
    updated[colIdx].links.push({ title: '', url: '' });
    setFooterColumns(updated);
  };
  const removeFooterColLink = (colIdx: number, linkIdx: number) => {
    const updated = [...footerColumns];
    updated[colIdx].links = updated[colIdx].links.filter((_, idx) => idx !== linkIdx);
    setFooterColumns(updated);
  };
  const updateFooterColLink = (colIdx: number, linkIdx: number, key: 'title' | 'url', val: string) => {
    const updated = [...footerColumns];
    updated[colIdx].links[linkIdx][key] = val;
    setFooterColumns(updated);
  };

  // Helper methods for About Core Values
  const addCoreValue = () => {
    setAboutCoreValues([...aboutCoreValues, { id: Date.now(), title: '', tagline: '', description: '' }]);
  };
  const removeCoreValue = (id: number) => {
    setAboutCoreValues(aboutCoreValues.filter(v => v.id !== id));
  };
  const updateCoreValue = (id: number, key: 'title' | 'tagline' | 'description', val: string) => {
    setAboutCoreValues(aboutCoreValues.map(v => v.id === id ? { ...v, [key]: val } : v));
  };

  // Helper methods for About Mission Items
  const addMissionItem = () => {
    setAboutMissionToDeliver([...aboutMissionToDeliver, { id: Date.now(), title: '', tagline: '', description: '' }]);
  };
  const removeMissionItem = (id: number) => {
    setAboutMissionToDeliver(aboutMissionToDeliver.filter(m => m.id !== id));
  };
  const updateMissionItem = (id: number, key: 'title' | 'tagline' | 'description', val: string) => {
    setAboutMissionToDeliver(aboutMissionToDeliver.map(m => m.id === id ? { ...m, [key]: val } : m));
  };

  // Helper methods for Contact methods list
  const addContactMethod = () => {
    setContactList([...contactList, { id: String(Date.now()), type: 'phone', title: '', description: '', icon: 'phone' }]);
  };
  const removeContactMethod = (id: string) => {
    setContactList(contactList.filter(c => c.id !== id));
  };
  const updateContactMethod = (id: string, key: 'type' | 'title' | 'description' | 'icon', val: string) => {
    setContactList(contactList.map(c => c.id === id ? { ...c, [key]: val } : c));
  };

  return (
    <div className="flex-1 bg-[#f9fafb] p-6 lg:p-10 text-gray-800">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <FileText className="text-purple-600" size={24} /> Complete Storefront CMS Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
            Edit text, links, banners, and promotions across the entire storefront layout
          </p>
        </div>
        
        {/* Save button */}
        <button 
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>

      {/* Selectors Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
        
        {/* Page selector */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Storefront Page or Block</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 bg-gray-50 p-1.5 rounded-xl border border-gray-100 gap-1">
            <button 
              onClick={() => setSelectedPage('home')}
              className={`text-center py-2 text-xs font-semibold rounded-lg transition-all ${selectedPage === 'home' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Home Page
            </button>
            <button 
              onClick={() => setSelectedPage('navbar')}
              className={`text-center py-2 text-xs font-semibold rounded-lg transition-all ${selectedPage === 'navbar' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Navbar
            </button>
            <button 
              onClick={() => setSelectedPage('footer')}
              className={`text-center py-2 text-xs font-semibold rounded-lg transition-all ${selectedPage === 'footer' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Footer
            </button>
            <button 
              onClick={() => setSelectedPage('about')}
              className={`text-center py-2 text-xs font-semibold rounded-lg transition-all ${selectedPage === 'about' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              About Us
            </button>
            <button 
              onClick={() => setSelectedPage('contact')}
              className={`text-center py-2 text-xs font-semibold rounded-lg transition-all ${selectedPage === 'contact' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Contact
            </button>
            <button 
              onClick={() => setSelectedPage('shopping')}
              className={`text-center py-2 text-xs font-semibold rounded-lg transition-all ${selectedPage === 'shopping' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Promotions
            </button>
          </div>
        </div>

        {/* Language switcher */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Target Language</label>
          <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-100 gap-1">
            <button 
              onClick={() => setSelectedLang('en')}
              className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all flex justify-center items-center gap-1.5 ${selectedLang === 'en' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <Globe size={14} /> English (EN)
            </button>
            <button 
              onClick={() => setSelectedLang('es')}
              className={`flex-1 text-center py-2 text-xs font-semibold rounded-lg transition-all flex justify-center items-center gap-1.5 ${selectedLang === 'es' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              <Languages size={14} /> Spanish (ES)
            </button>
          </div>
        </div>
      </div>

      {/* Success/Error Toast Message */}
      {message && (
        <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          <CheckCircle size={20} className={message.type === 'success' ? 'text-emerald-600' : 'text-red-500'} />
          <span className="text-sm font-semibold">{message.text}</span>
        </div>
      )}

      {/* Main Form Area */}
      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-20 flex justify-center items-center flex-col gap-4">
          <Loader2 size={36} className="animate-spin text-purple-600" />
          <span className="text-sm text-gray-400 font-medium">Fetching configuration details...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* General Metadata */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">CMS Record Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Config Page Name</label>
                <input 
                  type="text" 
                  value={pageTitle} 
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="e.g. Home Page English version"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex gap-4 items-end">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-500 font-semibold uppercase">
                  Route Key: <span className="text-purple-600 font-bold ml-1">/v1/cms/{selectedPage}?lang={selectedLang}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Sections by selectedPage */}
          {selectedPage === 'home' && (
            <>
              {/* Home - Hero Section */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">1. Main Hero Block</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Collection Subtitle</label>
                    <input 
                      type="text" 
                      value={homeHeroSubtitle} 
                      onChange={(e) => setHomeHeroSubtitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Action Button text</label>
                    <input 
                      type="text" 
                      value={homeHeroBtnText} 
                      onChange={(e) => setHomeHeroBtnText(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Modern Aesthetic Title</label>
                    <input 
                      type="text" 
                      value={homeHeroTitle} 
                      onChange={(e) => setHomeHeroTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Description text</label>
                    <textarea 
                      rows={3}
                      value={homeHeroDesc} 
                      onChange={(e) => setHomeHeroDesc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Model Banner Image URL</label>
                    <input 
                      type="text" 
                      value={homeHeroImageUrl} 
                      onChange={(e) => setHomeHeroImageUrl(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Home - Middle Banner */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">2. Middle Promotional Sale Banner</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Promo Subtitle</label>
                    <input 
                      type="text" 
                      value={homeMidSubtitle} 
                      onChange={(e) => setHomeMidSubtitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Promo Button Text</label>
                    <input 
                      type="text" 
                      value={homeMidBtnText} 
                      onChange={(e) => setHomeMidBtnText(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Promo Title</label>
                    <input 
                      type="text" 
                      value={homeMidTitle} 
                      onChange={(e) => setHomeMidTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Promo Description</label>
                    <textarea 
                      rows={2}
                      value={homeMidDesc} 
                      onChange={(e) => setHomeMidDesc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Beach Promo Image URL</label>
                    <input 
                      type="text" 
                      value={homeMidImageUrl} 
                      onChange={(e) => setHomeMidImageUrl(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Home - New Arrivals */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">3. New Arrivals Edit Blocks</h3>
                <div className="space-y-6">
                  {/* Left big card */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-4">Left Featured Edit Card</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Subtitle</label>
                        <input 
                          type="text" 
                          value={homeNewArrivalsLeftSubtitle} 
                          onChange={(e) => setHomeNewArrivalsLeftSubtitle(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Button Text</label>
                        <input 
                          type="text" 
                          value={homeNewArrivalsLeftBtnText} 
                          onChange={(e) => setHomeNewArrivalsLeftBtnText(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Title</label>
                        <input 
                          type="text" 
                          value={homeNewArrivalsLeftTitle} 
                          onChange={(e) => setHomeNewArrivalsLeftTitle(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Short Description</label>
                        <input 
                          type="text" 
                          value={homeNewArrivalsLeftDesc} 
                          onChange={(e) => setHomeNewArrivalsLeftDesc(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Image URL</label>
                        <input 
                          type="text" 
                          value={homeNewArrivalsLeftImageUrl} 
                          onChange={(e) => setHomeNewArrivalsLeftImageUrl(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right stacked cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top stack */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-4">Right Card - Top Stack</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Title</label>
                          <input 
                            type="text" 
                            value={homeNewArrivalsRightTopTitle} 
                            onChange={(e) => setHomeNewArrivalsRightTopTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Image URL</label>
                          <input 
                            type="text" 
                            value={homeNewArrivalsRightTopImageUrl} 
                            onChange={(e) => setHomeNewArrivalsRightTopImageUrl(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottom stack */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <h4 className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-4">Right Card - Bottom Stack</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Title</label>
                          <input 
                            type="text" 
                            value={homeNewArrivalsRightBottomTitle} 
                            onChange={(e) => setHomeNewArrivalsRightBottomTitle(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">Image URL</label>
                          <input 
                            type="text" 
                            value={homeNewArrivalsRightBottomImageUrl} 
                            onChange={(e) => setHomeNewArrivalsRightBottomImageUrl(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Home - Newsletter */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">4. Inner Circle Newsletter</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Newsletter Title</label>
                    <input 
                      type="text" 
                      value={homeNewsletterTitle} 
                      onChange={(e) => setHomeNewsletterTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Subscribe Button Text</label>
                    <input 
                      type="text" 
                      value={homeNewsletterBtnText} 
                      onChange={(e) => setHomeNewsletterBtnText(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Newsletter Description Text</label>
                    <input 
                      type="text" 
                      value={homeNewsletterDesc} 
                      onChange={(e) => setHomeNewsletterDesc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Navbar Links management */}
          {selectedPage === 'navbar' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <ListOrdered size={18} /> Header Menu Navigation Links
                </h3>
                <button 
                  type="button"
                  onClick={addNavbarLink}
                  className="flex items-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2 text-xs font-bold rounded-lg transition-colors border border-purple-200"
                >
                  <Plus size={14} /> Add Navbar Link
                </button>
              </div>

              <div className="space-y-4">
                {navbarLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 border border-gray-100 rounded-xl group relative">
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Link Title/Label</label>
                        <input 
                          type="text" 
                          required
                          value={link.label}
                          onChange={(e) => updateNavbarLink(idx, 'label', e.target.value)}
                          placeholder="e.g. Shop All"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Target Href Link</label>
                        <input 
                          type="text" 
                          required
                          value={link.href}
                          onChange={(e) => updateNavbarLink(idx, 'href', e.target.value)}
                          placeholder="e.g. /shopping"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono"
                        />
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => removeNavbarLink(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-200 self-end mt-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {navbarLinks.length === 0 && (
                  <div className="text-center py-10 text-gray-400 text-sm">
                    No navbar links created yet. Click the add button to add links.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer columns management */}
          {selectedPage === 'footer' && (
            <div className="space-y-8">
              
              {/* Bottom Copyright Text */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Bottom Info</h3>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Footer Legal/Copyright Text</label>
                  <input 
                    type="text" 
                    value={footerBottomText} 
                    onChange={(e) => setFooterBottomText(e.target.value)}
                    placeholder="© 2026 Luxe Market. All rights reserved."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Columns list */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
                  <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">Footer Columns</h3>
                  <button 
                    type="button"
                    onClick={addFooterColumn}
                    className="flex items-center gap-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2 text-xs font-bold rounded-lg transition-colors border border-purple-200"
                  >
                    <Plus size={14} /> Add Footer Column
                  </button>
                </div>

                <div className="space-y-8">
                  {footerColumns.map((col, colIdx) => (
                    <div key={colIdx} className="bg-gray-50 p-6 border border-gray-200/60 rounded-2xl relative">
                      
                      {/* Column Header Controls */}
                      <div className="flex justify-between items-center gap-4 mb-4">
                        <div className="flex-1 max-w-sm">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Column Header Title</label>
                          <input 
                            type="text" 
                            required
                            value={col.header}
                            onChange={(e) => updateFooterColHeader(colIdx, e.target.value)}
                            placeholder="e.g. Customer Support"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold"
                          />
                        </div>
                        <div className="flex gap-2 self-end mb-0.5">
                          <button 
                            type="button"
                            onClick={() => addFooterColLink(colIdx)}
                            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                          >
                            <Plus size={12} /> Add Link
                          </button>
                          <button 
                            type="button"
                            onClick={() => removeFooterColumn(colIdx)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-1.5 rounded-lg text-xs"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Links list inside Column */}
                      <div className="space-y-3 pl-4 border-l-2 border-purple-100">
                        {col.links?.map((link, linkIdx) => (
                          <div key={linkIdx} className="flex gap-4 items-center bg-white p-3 border border-gray-100 rounded-xl relative">
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div>
                                <input 
                                  type="text" 
                                  required
                                  value={link.title}
                                  onChange={(e) => updateFooterColLink(colIdx, linkIdx, 'title', e.target.value)}
                                  placeholder="Link Label (e.g. Terms)"
                                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
                                />
                              </div>
                              <div>
                                <input 
                                  type="text" 
                                  required
                                  value={link.url}
                                  onChange={(e) => updateFooterColLink(colIdx, linkIdx, 'url', e.target.value)}
                                  placeholder="URL Path (e.g. /terms)"
                                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono"
                                />
                              </div>
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeFooterColLink(colIdx, linkIdx)}
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-lg transition-colors border border-transparent hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* About page management */}
          {selectedPage === 'about' && (
            <div className="space-y-8">
              
              {/* About - Hero block */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">About - Hero Block</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Hero Title</label>
                    <input 
                      type="text" 
                      value={aboutHeroTitle} 
                      onChange={(e) => setAboutHeroTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Hero Subheading/Tagline</label>
                    <input 
                      type="text" 
                      value={aboutHeroDesc} 
                      onChange={(e) => setAboutHeroDesc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Hero Background Image URL</label>
                    <input 
                      type="text" 
                      value={aboutHeroImg} 
                      onChange={(e) => setAboutHeroImg(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* About - Company Thoughts & Founder Details */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Thoughts & Founder Details</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Thoughts Block Title</label>
                      <input 
                        type="text" 
                        value={aboutOwnThoughtsTitle} 
                        onChange={(e) => setAboutOwnThoughtsTitle(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Thoughts Block Image URL</label>
                      <input 
                        type="text" 
                        value={aboutOwnThoughtsImg} 
                        onChange={(e) => setAboutOwnThoughtsImg(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Thoughts Description Text</label>
                      <textarea 
                        rows={3}
                        value={aboutOwnThoughtsDesc} 
                        onChange={(e) => setAboutOwnThoughtsDesc(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-purple-900 mb-1.5">Founder Name</label>
                      <input 
                        type="text" 
                        value={aboutFounderName} 
                        onChange={(e) => setAboutFounderName(e.target.value)}
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-purple-900 mb-1.5">Founder Title</label>
                      <input 
                        type="text" 
                        value={aboutFounderTitle} 
                        onChange={(e) => setAboutFounderTitle(e.target.value)}
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-purple-900 mb-1.5">Founder Image URL</label>
                      <input 
                        type="text" 
                        value={aboutFounderImg} 
                        onChange={(e) => setAboutFounderImg(e.target.value)}
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2 text-sm focus:border-purple-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* About - Core Values */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
                  <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Layers size={18} /> Company Core Values Block
                  </h3>
                  <button 
                    type="button"
                    onClick={addCoreValue}
                    className="flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border border-purple-200"
                  >
                    <Plus size={12} /> Add Value Item
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Values Section Title</label>
                    <input 
                      type="text" 
                      value={aboutCoreValuesTitle} 
                      onChange={(e) => setAboutCoreValuesTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Values Section BG Image</label>
                    <input 
                      type="text" 
                      value={aboutCoreValuesImg} 
                      onChange={(e) => setAboutCoreValuesImg(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Values Section Tagline/Desc</label>
                    <input 
                      type="text" 
                      value={aboutCoreValuesDesc} 
                      onChange={(e) => setAboutCoreValuesDesc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {aboutCoreValues.map((val) => (
                    <div key={val.id} className="bg-gray-50 p-4 border border-gray-100 rounded-xl relative group">
                      <button 
                        type="button" 
                        onClick={() => removeCoreValue(val.id)}
                        className="absolute right-3 top-3 text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title</label>
                          <input 
                            type="text" 
                            value={val.title} 
                            onChange={(e) => updateCoreValue(val.id, 'title', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tagline</label>
                          <input 
                            type="text" 
                            value={val.tagline} 
                            onChange={(e) => updateCoreValue(val.id, 'tagline', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Value Description</label>
                          <input 
                            type="text" 
                            value={val.description} 
                            onChange={(e) => updateCoreValue(val.id, 'description', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* About - Mission to Deliver */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
                  <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                    <BookOpen size={18} /> Our Mission Section
                  </h3>
                  <button 
                    type="button"
                    onClick={addMissionItem}
                    className="flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border border-purple-200"
                  >
                    <Plus size={12} /> Add Mission Card
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Mission Title</label>
                    <input 
                      type="text" 
                      value={aboutMissionTitle} 
                      onChange={(e) => setAboutMissionTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Mission Section Banner URL</label>
                    <input 
                      type="text" 
                      value={aboutMissionImg} 
                      onChange={(e) => setAboutMissionImg(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Mission Statement</label>
                    <textarea 
                      rows={2}
                      value={aboutMissionDesc} 
                      onChange={(e) => setAboutMissionDesc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {aboutMissionToDeliver.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-4 border border-gray-100 rounded-xl relative group">
                      <button 
                        type="button" 
                        onClick={() => removeMissionItem(item.id)}
                        className="absolute right-3 top-3 text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title</label>
                          <input 
                            type="text" 
                            value={item.title} 
                            onChange={(e) => updateMissionItem(item.id, 'title', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Tagline</label>
                          <input 
                            type="text" 
                            value={item.tagline} 
                            onChange={(e) => updateMissionItem(item.id, 'tagline', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mission Details</label>
                          <input 
                            type="text" 
                            value={item.description} 
                            onChange={(e) => updateMissionItem(item.id, 'description', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* Contact page management */}
          {selectedPage === 'contact' && (
            <div className="space-y-8">
              
              {/* Contact Hero details */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Contact - Hero Block</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Hero Title</label>
                    <input 
                      type="text" 
                      value={contactHeroTitle} 
                      onChange={(e) => setContactHeroTitle(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Hero Subtitle</label>
                    <input 
                      type="text" 
                      value={contactHeroDesc} 
                      onChange={(e) => setContactHeroDesc(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">Hero Background Image URL</label>
                    <input 
                      type="text" 
                      value={contactHeroImg} 
                      onChange={(e) => setContactHeroImg(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Contact methods list */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
                  <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail size={18} /> Contact Methods List
                  </h3>
                  <button 
                    type="button"
                    onClick={addContactMethod}
                    className="flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border border-purple-200"
                  >
                    <Plus size={12} /> Add Method
                  </button>
                </div>

                <div className="space-y-4">
                  {contactList.map((contact) => (
                    <div key={contact.id} className="bg-gray-50 p-4 border border-gray-100 rounded-xl relative group">
                      <button 
                        type="button" 
                        onClick={() => removeContactMethod(contact.id)}
                        className="absolute right-3 top-3 text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Method Type</label>
                          <select 
                            value={contact.type} 
                            onChange={(e) => updateContactMethod(contact.id, 'type', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                          >
                            <option value="phone">Phone Number</option>
                            <option value="email">Email Address</option>
                            <option value="address">Postal Address</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title</label>
                          <input 
                            type="text" 
                            value={contact.title} 
                            onChange={(e) => updateContactMethod(contact.id, 'title', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
                            placeholder="e.g. Support Hotline"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Icon Name (Lucide)</label>
                          <input 
                            type="text" 
                            value={contact.icon} 
                            onChange={(e) => updateContactMethod(contact.id, 'icon', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono"
                            placeholder="e.g. phone or mail"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Details</label>
                          <input 
                            type="text" 
                            value={contact.description} 
                            onChange={(e) => updateContactMethod(contact.id, 'description', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold"
                            placeholder="+1 (123) 456-7890"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Shopping page promotions */}
          {selectedPage === 'shopping' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-6 flex items-center gap-1.5">
                <ShoppingBag size={18} /> Storefront Promotional Banner (Shopping Page)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Promo Banner Title</label>
                  <input 
                    type="text" 
                    value={shoppingPromoTitle} 
                    onChange={(e) => setShoppingPromoTitle(e.target.value)}
                    placeholder="Uncompromised High-Fidelity Audio"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Banner Action Link Href</label>
                  <input 
                    type="text" 
                    value={shoppingPromoLink} 
                    onChange={(e) => setShoppingPromoLink(e.target.value)}
                    placeholder="e.g. /shopping?tag=promotion"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-mono"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Banner Promo Subheading / Description</label>
                  <textarea 
                    rows={2}
                    value={shoppingPromoDesc} 
                    onChange={(e) => setShoppingPromoDesc(e.target.value)}
                    placeholder="Save up to 40% on professional studio monitors..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Banner Background Image URL</label>
                  <input 
                    type="text" 
                    value={shoppingPromoImg} 
                    onChange={(e) => setShoppingPromoImg(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="flex justify-end gap-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <button 
              type="button"
              onClick={loadCmsPage}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase rounded-xl transition-all"
            >
              Reset Changes
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
