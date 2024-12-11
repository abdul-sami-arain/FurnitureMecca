import React, { useEffect, useState, useRef } from 'react'
import './Cart.css'
import CartMainImage from '../../Components/Cart-Components/CartMainImage/CartMainImage'
import CartProducts from '../../Components/Cart-Components/Cart-Products/CartProducts'
import CartProductsSuggestion from '../../Components/Cart-Components/CartProductsSuggestion/CartProductsSuggestion'
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowDropleft } from "react-icons/io";
import { IoIosArrowDropright } from "react-icons/io";
import axios from 'axios'
import ProductCard from '../../Components/ProductCard/ProductCard'
import heart from '../../../Assets/icons/heart-vector.png';
import star from '../../../Assets/icons/black-star.png'
import { Link, useNavigate } from 'react-router-dom'
import leftArrow from '../../../Assets/icons/arrow-left-charcol.png'
import rightArrow from '../../../Assets/icons/arrow-right-charcol.png'
import Slider from 'react-slick'
import { useCart } from '../../../context/cartContext/cartContext'
import ProductCardShimmer from '../../Components/Loaders/productCardShimmer/productCardShimmer'
import { useList } from '../../../context/wishListContext/wishListContext'
import { toast } from 'react-toastify'
import { useGlobalContext } from '../../../context/GlobalContext/globalContext'



const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div onClick={onClick} className={`cart-latest-products-slider-arrow cart-latest-products-slider-arrow-left ${className}`} >
      <img src={leftArrow} alt='arrow' />
    </div>
  )
}

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div onClick={onClick} className={`cart-latest-products-slider-arrow cart-latest-products-slider-arrow-right ${className}`} >
      <img src={rightArrow} alt='arrow' />
    </div>
  )
}

const Cart = () => {
  const [isZipUpdateOpen, setIsZipUpdateOpen] = useState(false)
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [isCheck, setIsCheck] = useState({});

  const { setAllShippingMethods,shippingMethods,setShippingMethods,shippingLoader,setShippingLoader,info, updateLocationData, zipCode, setZipCode, handleInputChange, handleButtonClick  } = useGlobalContext();

  const handleCheckboxCheck = (index) => {
    setIsCheck((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the checked state
    }));
    // setIsCheck(index);
    console.log("checked value", isCheck)
  }

  const { cart,calculateTotalPrice,subTotal ,savings,isCartProtected,
    isProfessionalAssembly,
    handleCartProtected,
    handleCartAssembly,} = useCart();
  const subTotalOfAllProducts = cart.map(item => item.product.sub_total);
  // console.log("sub total of products", subTotalOfAllProducts)
  const subtotal = subTotalOfAllProducts.reduce((acc, value) => acc + value, 0)
  // console.log("sub tot ", subtotal)

  const formatePrice = (price) => {
    return new Intl.NumberFormat('en-us', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const protectionPrice = isCheck[0] ? 210 : 0;
  const assemblyPrice = isCheck[1] ? 250 : 0;
  const shipping = 109;
  const discountPrice = 123;
  const taxPrice = 322;

  const grandTotal = subtotal + protectionPrice + assemblyPrice + shipping + taxPrice - discountPrice
  const orderPriceDetails = [
    { title: 'Subtotal', price: formatePrice(subTotal) },
    { title: 'Protection plan', price: formatePrice(protectionPrice) },
    { title: 'Professional Assembly', price: formatePrice(assemblyPrice) },
    {title: 'Shipping', price: formatePrice(shipping)},
    { title: 'Discount', price: formatePrice(discountPrice) },
    { title: 'Tax', price: formatePrice(taxPrice) }
  ]
  const handleZipInput = () => {
    setIsZipUpdateOpen(!isZipUpdateOpen)
  }
  const handleCouponInput = () => {
    setIsCouponOpen(!isCouponOpen)
  }

  const [latestProducts, setLatestProducts] = useState([]);
  const getLatestProducts = async () => {
    const api = `https://fm.skyhub.pk/api/v1/products/get`;
    try {
      const response = await axios.get(api);
      setLatestProducts(response.data.products)
      // console.log("response from cart products lates cards", response.data.products);
    } catch (error) {
      console.error("error", error);
    }
  }
  useEffect(() => {
    getLatestProducts();
    setAllShippingMethods();
  }, []);

  const productsUids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const newProducts = latestProducts.filter((product) => productsUids.includes(product.uid));
  // console.log("new filtered product", newProducts)

  const maxLength = 30;
  const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
  };

  const navigate = useNavigate()
  const [quickViewProduct, setQuickViewProduct] = useState({})
  const [quickViewClicked, setQuickView] = useState(false);
  const handleQuickViewOpen = (item) => {
    setQuickView(true);
    setQuickViewProduct(item)

  }

  const handleQuickViewClose = () => { setQuickView(false) }

  const handleProductClick = (item) => {
    navigate(`/single-product/${item.slug}`, { state: item })
  };

  // Slick
  let settings = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: true,
    // nextArrow: true,
    // prevArrow: true,
    nextArrow: <SampleNextArrow to="next" />,
    prevArrow: <SamplePrevArrow to="prev" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // Define conditional visibility logic
  const filteredOrderPriceDetails = orderPriceDetails.filter((_, index) => {
    if (index === 1) return isCheck[0]; // Show 'Professional Assembly' if isCheck[0] is true
    if (index === 2) return isCheck[1]; // Show 'Elite Title' if isCheck[1] is true
    return true; // Always include other items
  });

  const handleCardClick = (item) => {
        navigate(`/single-product/${item.slug}`, {state: {products: item}})
    }

  // wish list
    const {addToList, removeFromList, isInWishList} = useList()
    const notify = (str) => toast.success(str);
    const notifyRemove = (str) => toast.error(str)
    const handleWishList = (item) => {
        if(isInWishList(item.uid)){
            removeFromList(item.uid);
            notifyRemove('Removed from wish list', {
                autoClose: 10000,
                className: "toast-message",
            })
        }else{
            addToList(item)
            notify("added to wish list", {
                autoClose: 10000,
            })
        }
    }


    const [selectedValue, setSelectedValue] = useState("");

    const options = [
      { id: 1, label: "Delivery & Setup",description:"Package is delivered inside the house and set up by our Professional Crew without mistake and hassle", value: "Delivery & Setup" },
      { id: 2, label: "Delivery & No Setup",description:"Package is delivered on your front door but setup is not included", value: "Delivery & No Setup" },
      { id: 3, label: "Local Pickup",description:"Come to your designated Furniture Mecca franchise and get your furniture packed and ready for you", value: "Local Pickup" },
    ];
  
    const handleChange = (e) => {
      setSelectedValue(e.target.value);
    };

  return (
    <div className='cart-main-container'>
      <CartMainImage />
      <div className='cart-body'>
        <div className='cart-products-section'>
          <CartProducts />
        </div>

        <div className='cart-order-summery-section'>
          <div className='cart-order-summery-inner-section'>
            <h3 className='cart-order-summary-heading'>Order Summary</h3>
            <p className='cart-order-summary-sub-title'>This order qualifies for free shipping</p>
            <div className='proffesional-assembly-check-sec'>
                <label className='order-summary-proffesional-check-item-label'>
                  <input
                    type="checkbox"
                    className='order-summary-checkbox'
                    checked={isProfessionalAssembly}
                    onChange={() => handleCartAssembly()}
                  />
                  Professional Assembly (+ $210)
                </label>
                <p className='order-summary-proffesional-check-item-detail'>Use professional assembly for all products and save up to $80</p>
              </div>
              <div className='proffesional-assembly-check-sec'>
                <label className='order-summary-proffesional-check-item-label'>
                  <input
                    type="checkbox"
                    className='order-summary-checkbox'
                    checked={isCartProtected}
                    onChange={() => handleCartProtected()}
                  />
                  Elite Platinum Furniture Protection(+ $199)
                </label>
                <p className='order-summary-proffesional-check-item-detail'>Use professional assembly for all products and save up to $80</p>
              </div>

            <div className='cart-order-summary-price-details'>
              {filteredOrderPriceDetails.map((price, index) => (
                <div key={index} className='cart-order-summary-price-detail-single-item'>
                  <p className='cart-order-summary-price-detail-single-item-title'>{price.title}</p>
                  <p className='cart-order-summary-price-detail-single-item-price'>{price.price}</p>
                </div>
              ))}
              <div className='cart-order-summary-zip-code'>
                <span className='cart-order-summary-zip-code-heading'>
                  <p>Deliver to:</p>
                  <h3 onClick={handleZipInput}>{info?.locationData.state} {info?.locationData.stateCode} <IoIosArrowDown className={`cart-order-summary-zip-arrow ${isZipUpdateOpen ? 'cart-order-summary-zip-arrow-rotate' : ''}`} size={20} /> </h3>
                </span>
                <div className={`cart-order-summary-zip-code-input-div ${isZipUpdateOpen ? 'show-zip-code-update-input' : ''}`}>
                  <div className='cart-order-summary-zip-code-input-and-button'>
                    <input 
                      type='text' 
                      placeholder='Zip Code' 
                      className='cart-summary-update-zip-input'
                      value={zipCode}
                      onChange={handleInputChange} 
                    />
                    <button className='cart-summary-update-zip-btn' onClick={async () => {await handleButtonClick();} }>Update</button>
                  </div>
                </div>
              </div>

              <div className="delivery-option-container">
                <p className='delivery-opt-heading' >Delivery Options :</p>
              {shippingMethods['shippingMethods'] &&  shippingMethods['shippingMethods']?.map((option) => (
        <label key={option.id} style={{ display: "flex",   alignItems:"flex-start",
          justifyContent:"flex-start", margin: "5px 0",gap:"10px" }}>
          <input
            type="radio"
            name="options"
            value={option.id}
            checked={selectedValue === option.id}
            onChange={handleChange}
            style={{marginTop:"5px"
            }}
          />
            <div style={{display:"flex",flexDirection:"column",
              alignItems:"flex-start",
              justifyContent:"center"
            }}>
            <p className='delivery-option-container-label'>{option.name}</p>
            <p className='delivery-option-container-description'>{option.name}</p>
            </div>
        </label>
      ))}
              </div>
              <div className='order-summary-coupon-div'>
                <p onClick={handleCouponInput}>Add Coupon Code <IoIosArrowDown className={`cart-order-summary-coupon-arrow ${isCouponOpen ? 'cart-order-summary-coupon-arrow-rotate' : ''}`} size={20} /></p>
                <div className={`cart-order-summary-coupon-input-div ${isCouponOpen ? 'show-coupon-update-input' : ''}`}>
                  <div className='cart-order-summary-coupon-input-and-button'>
                    <input type='text' placeholder='Coupon Code' className='cart-summary-update-coupon-input' />
                    <button className='cart-summary-update-coupon-btn'>Update</button>
                  </div>
                </div>
              </div>
            </div>

            <div className='cart-order-summary-total'>
              <div className='cart-order-summary-price-detail-single-item'>
                <p className='cart-order-summary-price-detail-single-item-title'>Total</p>
                <p className='cart-order-summary-price-detail-single-item-price'>{formatePrice(grandTotal)}</p>
              </div>
              <div className='cart-order-summary-price-detail-save-discount'>
                <p>You Save</p>
                <p>{formatePrice(savings)}</p>
              </div>
            </div>

            <Link to={'/cart-page/check-out'} className='cart-summary-proceed-btn'>Proceed to checkout</Link>

          </div>
        </div>
      </div>




      <div className='cart-related-products-display-section'>
        <h3>You May Also Like</h3>
        <div className='cart-related-products-slider-main-div'>
          <Slider {...settings}>
            {newProducts && newProducts.length > 0 ? (
              newProducts.map((item, index) => (
              <div key={index} className='cart-latest-product-cards-container'>
                <ProductCard
                  key={index}
                  slug={item.slug}
                  singleProductData={item}
                  maxWidthAccordingToComp="98%"
                  // justWidth={'320px'}
                  tagIcon={item.productTag ? item.productTag : heart}
                  tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                  mainImage={`${item.image.image_url}`}
                  productCardContainerClass="product-card"
                  ProductSku={item.sku}
                  tags={item.tags}
                  ProductTitle={truncateTitle(item.name, maxLength)}
                  stars={[
                    { icon: star, title: 'filled' },
                    { icon: star, title: 'filled' },
                    { icon: star, title: 'filled' },
                    { icon: star, title: 'filled' },
                    { icon: star, title: 'filled' },
                  ]}
                  reviewCount={item.reviewCount}
                  lowPriceAddvertisement={item.lowPriceAddvertisement}
                  priceTag={item.regular_price}
                  sale_price={item.sale_price}
                  financingAdd={item.financingAdd}
                  learnMore={item.learnMore}
                  mainIndex={index}
                  deliveryTime={item.deliveryTime}
                  stock={item.manage_stock}
                  attributes={item.attributes}
                  handleCardClick={() => handleProductClick(item)}
                  handleQuickView={() => handleQuickViewOpen(item)}
                  type={item.type}
                  variation={item.variations}
                  handleWishListclick={() => handleWishList(item)}
                />
              </div>
            ))
            ) : (
              Array.from({ length: 4 }).map((_, index) => (
                            <ProductCardShimmer />
                        ))
            )}
            {/* newProducts.map((item, index) => (
              <div key={index} className='cart-latest-product-cards-container'>
                <ProductCard
                  key={index}
                  slug={item.slug}
                  singleProductData={item}
                  maxWidthAccordingToComp="98%"
                  // justWidth={'320px'}
                  tagIcon={item.productTag ? item.productTag : heart}
                  tagClass={item.productTag ? 'tag-img' : 'heart-icon'}
                  mainImage={`${item.image.image_url}`}
                  productCardContainerClass="product-card"
                  ProductSku={item.sku}
                  tags={item.tags}
                  ProductTitle={truncateTitle(item.name, maxLength)}
                  stars={[
                    { icon: star, title: 'filled' },
                    { icon: star, title: 'filled' },
                    { icon: star, title: 'filled' },
                    { icon: star, title: 'filled' },
                    { icon: star, title: 'filled' },
                  ]}
                  reviewCount={item.reviewCount}
                  lowPriceAddvertisement={item.lowPriceAddvertisement}
                  priceTag={item.regular_price}
                  sale_price={item.sale_price}
                  financingAdd={item.financingAdd}
                  learnMore={item.learnMore}
                  mainIndex={index}
                  deliveryTime={item.deliveryTime}
                  stock={item.manage_stock}
                  attributes={item.attributes}
                  handleCardClick={() => handleProductClick(item)}
                  handleQuickView={() => handleQuickViewOpen(item)}
                  type={item.type}
                  variation={item.variations}
                />
              </div>
            )) */}
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default Cart
