import React, {useState, useRef} from 'react'
import './ProductSlider.css';
import ProductCard from './ProductCard/ProductCard';
import { url } from '../../../utils/api';

const ProductSlider = ({cardData}) => {  

  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);

  const getPositionX = (event) => {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  };

  const dragStart = (event) => {
    setIsDragging(true); 
    setStartPos(getPositionX(event));
    if (sliderRef.current) {
      setScrollPos(sliderRef.current.scrollLeft);
      sliderRef.current.classList.add('dragging');
    }
  };

  const dragEnd = () => {
    setIsDragging(false); 
    if (sliderRef.current) {
      sliderRef.current.classList.remove('dragging');
    }
  };

  const drag = (event) => {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      const distance = currentPosition - startPos;
      if (sliderRef.current) {
        sliderRef.current.scrollLeft = scrollPos - distance; 
      }
    }
  };

    return (
      <div className="products-slider-main-container">
        <h3 className='feature-product-heading'>Featured Products</h3>
        <div className='products-slider'
          ref={sliderRef}
          onMouseDown={dragStart}
          onMouseUp={dragEnd}
          onMouseLeave={dragEnd}
          onMouseMove={drag}
          onTouchStart={dragStart}
          onTouchEnd={dragEnd}
          onTouchMove={drag}
        >
        {cardData.map((item, index) => {
            return <ProductCard key={index} 
                      img={url+item.images[0].image_url} 
                      heading={item.name} 
                      para={item.para} 
                      btnTxt={"Purchase Now"} 
                      productImageHeading={item.categories[0] !== undefined ? item.categories[0].name : "" }
                      productImagePrice={"$"+ item.sale_price}
                      productImageAbout={""}
                      productLink={""}
                    />
        })}
        </div>
      </div>
    );
  };
  
  export default ProductSlider;
  
