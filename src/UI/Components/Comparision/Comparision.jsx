import React from 'react'
import './Comparision.css'
import ComparisionImage from '../../../Assets/Furniture Mecca/Comparision/comparision-img.jpg';
import mobCompair from '../../../Assets/Furniture Mecca/Comparision/download 120.png';
import compatetantImage from '../../../Assets/Furniture Mecca/Comparision/compatetant.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { url } from '../../../utils/api';

const Comparision = ({heading,image,mobileImage}) => {
  return (
    <div className='comparision-main-div'>
        <h3>{heading}</h3>
        <div className='comparision-img-div'>
            <LazyLoadImage src={url+image.image_url} alt='img' effect='blur' />
        </div>
        <div className='mobile-view-comparission'>
          <LazyLoadImage src={url+mobileImage.image_url} alt='img' effect='blur' />
        </div>
    </div>
  )
}

export default Comparision
