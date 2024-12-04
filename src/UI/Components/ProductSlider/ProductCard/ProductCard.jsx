import React from 'react'
import  './ProductCard.css'
import arrowLeft from '../../../../Assets/icons/arrow-left-black.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ProductCard = ({img, heading, para, btnTxt, productImageHeading, productImagePrice, productImageAbout, productLink}) => {
  return (
    <div className="product">
        <div className='product-img'>
            <LazyLoadImage src={img} alt="product" effect='blur' />
            <div className='product-img-detail'>
              <h3>{productImageHeading}</h3>
              <span>{productImagePrice}</span>
              <p>{productImageAbout}</p>
            </div>
        </div>
        <div className='product-details'>
            <h3>{heading}</h3>
            <p>{para}</p>
            <button> 
                <a href={productLink}>{btnTxt}</a>
                <img src={arrowLeft} alt='arrow left' />
              </button>
        </div>
    </div>
  )
}

export default ProductCard
