import React, { useState, useEffect } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css';
import Category from '../../Components/Category/Category';
import ShipBanner from '../../Components/ShipBanner/ShipBanner';
import ProductSlider from '../../Components/ProductSlider/ProductSlider';

import tuxedoChair from '../../../Assets/Furniture Mecca/Landing Page/feature products/ma-tax-free_multiple-collection-image2_desktop_su7kxr 1.png'
import vikingImage from '../../../Assets/Furniture Mecca/Landing Page/feature products/ma-tax-free_multiple-collection-image3_desktop_xxwngg 2.png'

import GetTheScop from '../../Components/GetTheScop/GetTheScop';
import Sliderr from '../../../Global-Components/Slider/Slider';
import BlogSlider from '../../Components/BlogSlider/BlogSlider';
import NearStorePopUp from '../../Components/NearStorePopUp/NearStorePopUp';

// Category Images

import newArrivalImage from '../../../Assets/category/new-arrival.png';
import livingRoomImage from '../../../Assets/category/living-room.png';
import diningImage from '../../../Assets/category/dining.png';
import bedroomImage from '../../../Assets/category/badroom.png';
import outDoorImage from '../../../Assets/category/out-door.png';
import recliningImage from '../../../Assets/category/reclining.png';
import SectionaSofa from '../../../Assets/to-be-change/sectional-sofa.png';
import Mattresses from '../../../Assets/to-be-change/mattresses.png';
import HomeOffice from '../../../Assets/to-be-change/home-office.png';
import KidsRoom from '../../../Assets/to-be-change/kids-room.png';
import AreaRugs from '../../../Assets/to-be-change/area-rugs.png';
import HomeDecor from '../../../Assets/to-be-change/home-decor.png';
import Outlet from '../../../Assets/to-be-change/outlet.png';
import shipBanner from '../../../Assets/Furniture Mecca/Landing Page/sale banner/AT FM.jpg'
import BestSellerSlider from '../../Components/BestSellerSlider/BestSellerSlider';
import InstaGallery from '../../Components/InstaGallery/InstaGallery';
import FinanceBannerSlider from '../../Components/FinanceBannerSlider/FinanceBannerSlider';
import Comparision from '../../Components/Comparision/Comparision';
import DealOfTheDay from '../../Components/DealOfTheDay/DealOfTheDay';
import TrendingNow from '../../Components/TrendingNow/TrendingNow';
import FurnitureForBudget from '../../Components/FurnitureForBudget/FurnitureForBudget';
import { useLocation, useNavigate } from 'react-router-dom';
import AnnouncmentBanners from '../../Components/AnnouncmentBanner/AnnouncmentBanner';

import twelveMonthCreditOfferImage from '../../../Assets/Furniture Mecca/Landing Page/sale banner/download 121.png';
import payPalMobileBanner from '../../../Assets/Furniture Mecca/Landing Page/sale banner/PAYPAL-BANNER 1.png';
import sixMonthCreditImage from '../../../Assets/Furniture Mecca/Landing Page/sale banner/download 122.png';
import paymentOptionsBanner from '../../../Assets/Furniture Mecca/Landing Page/sale banner/Frame 4278.png'
import MobileFinancingSlider from '../../Components/FinanceBannerSlider/MobileFinancingSlider';
import ImageSlider from '../../Components/404NotFound/ImageSlider';
import InstaTwoImageGallery from '../../Components/InstaTwoImageGallery/InstaTwoImageGallery';
import { useLPContentContext } from '../../../context/LPContentContext/LPContentContext';
import LandingPageFinancing from '../../Components/LandingPageFinancingBanners/LandingPageFinancing';
import { url } from '../../../utils/api';
import axios from 'axios';
import FinanceBanner2 from '../../Components/FinanceBannerSlider/FinanceBanner2';


const Home = () => {
  const [currentUrl, setCurrentUrl] = useState('/');
  const { postData, data, landingPageCategories,landingPageFOEB } = useLPContentContext();
  const [loading, setLoading] = useState(false);
  const [content2, setContent2] = useState({});
  const [featuredProducts, setFeaturedProducts] = useState([]);
      const [slides, setSlides] = useState([])

  const location = useLocation();
  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location]);



      const getHomeSliderImages = async () => {
        try {
            const response = await axios.get(`${url}/api/v1/pages/home/slider/get`)
            setSlides(response.data.homeSliders || [])
        } catch (error) {
            console.error(error);
        }
    }


  const getLandingPageContent2 = async () => {
    const api = `/api/v1/content2/get`
    try {
      setLoading(true);
      const response = await axios.get(`${url}${api}`)
      setContent2(response.data);
      setLoading(false);
      console.log(response.data)

    } catch (error) {
      console.error("error fetching contents", error);
      setLoading(false);
    }
  }
  const getFeaturedProducts = async () => {
    const api = "/api/v1/products/featured-products";
    try {
      setLoading(true);
      const response = await axios.get(`${url}${api}`);
      // Filter products where parent === 0
      const filteredProducts = response.data.products.filter(
        (product) => product.parent === 0
      );
      setFeaturedProducts(filteredProducts);
      setLoading(false);
      console.log(filteredProducts);
    } catch (error) {
      console.error("Error fetching contents", error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getHomeSliderImages();
    postData();
    getLandingPageContent2();
    getFeaturedProducts();
  }, [])



  const navigate = useNavigate();

  const handleNavigate = (slug, item) => {
    navigate(`/${slug}`, { state: item });
  };




  return (
    <div className='home-page-main-container'>
      <NearStorePopUp />
      <Sliderr images={slides ? slides : []} />
      <ShipBanner bannerImg={shipBanner} showBanner={true} paddindTrue={false} />
      <Category title={'Shop by Category'} categoryData={landingPageCategories} handleNavigate={handleNavigate} />
      <MobileFinancingSlider />
      <AnnouncmentBanners bannerImage={twelveMonthCreditOfferImage} padding={'10px'} />
      <AnnouncmentBanners bannerImage={payPalMobileBanner} padding={'10px 0'} />
      <AnnouncmentBanners bannerImage={sixMonthCreditImage} padding={'10px 0'} />
      <AnnouncmentBanners bannerImage={paymentOptionsBanner} padding={'10px 0'} />
      <FinanceBannerSlider />
      <TrendingNow />
      <LandingPageFinancing />
      <BestSellerSlider />
      {/* <ImageSlider /> */}
      {content2?.section_2 && (
        <FinanceBanner2
          heading={content2.section_2.heading}
          image={content2.section_2.image}
          mobileImage={content2.section_2.mobile_image}
        />
      )}
      {content2?.section_1 && (
        <Comparision
          heading={content2.section_1.heading}
          image={content2.section_1.image}
          mobileImage={content2.section_1.mobile_image}
        />
      )}
     

      {featuredProducts &&
        (<ProductSlider cardData={featuredProducts} />)
        }
      <DealOfTheDay />
      {landingPageFOEB && (
        <FurnitureForBudget budgetCardData={landingPageFOEB} />
      )}
      
      <GetTheScop />
      <BlogSlider />
      <InstaGallery />
      {/* <InstaTwoImageGallery /> */}
    </div>
  )
}

export default Home
