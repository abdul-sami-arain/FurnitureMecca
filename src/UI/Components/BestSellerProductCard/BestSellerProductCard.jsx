import React from 'react'
import './BestSellerProductCard.css';
import heartIcon from '../../../Assets/icons/like.png'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { VscHeartFilled } from "react-icons/vsc";
import { useList } from '../../../context/wishListContext/wishListContext';

const BestSellerProductCard = ({ productMainImage, listed, handleWishListClicked, isDiscountable, productData, starIcon, reviews, productName, oldPrice, newPrice, singleProductLink, handleCardClicked}) => {
    const url = 'https://fm.skyhub.pk/'
    const maxLength = 40;
    const truncateTitle = (title, maxLength) => {
        if(!title) return '';
        return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
    };
    console.log("product uid", productData.uid)

    const formatedPrice = (price) => {
        return new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'USD'
        }).format(price)
    }

    // console.log("product name", productName)
    const {isInWishList} = useList()

  return (
    <div 
        className='category-product-card' 
        onClick={() => handleCardClicked(productData)}
    >
        <img src={heartIcon} alt='heart' className='show-on-mobile' />
        <div className='category-product-image'>
            <img src={`${url}${productMainImage}`} alt='product image' effect='blur' />
        </div>
        <div className='category-containt-section'>
            <div className='category-product-rating-and-name'>
                {/* <div className='category-product-rating-section'>
                    <div className='category-product-rating-stars'>
                        {starIcon && starIcon.map((item, index) => (
                            <img 
                                key={index} 
                                src={item.icon} 
                                alt='img' 
                            />
                        ))}
                    </div>
                    <p>({reviews})</p>
                </div> */}
                <div className='category-product-name'>
                    <h3>{truncateTitle(productName, maxLength)}</h3>
                    {/* <h3>{productName}</h3> */}
                </div>
            </div>
            <div className='category-product-price-and-heart'>
                <div className='category-product-price'>
                    {isDiscountable ? <del>{formatedPrice(oldPrice)}</del> : <></>}
                    {/* <del>${oldPrice}</del> */}
                    {/* {newPrice !== null ? <p>${newPrice}</p> : <></>} */}
                    <p>{formatedPrice(newPrice)}</p>
                    
                </div>
                {isInWishList(productData.uid) ? <VscHeartFilled size={25} style={{color: '#C61B1A'}} onClick={(e) => {e.stopPropagation(); handleWishListClicked(productData)}} /> : <img src={heartIcon} alt='heart' className='hide-on-mobile' onClick={(e) => {e.stopPropagation(); handleWishListClicked(productData)}} />}
                
            </div>
        </div>
    </div>
  )
}

export default BestSellerProductCard
