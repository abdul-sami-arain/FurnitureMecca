import React, { useEffect, useState } from 'react'
import './CartItems.css';
import minusBtn from '../../../../Assets/icons/minus-white.png';
import plusBtn from '../../../../Assets/icons/plus-white.png';
import closeBtn from '../../../../Assets/icons/close-btn.png';
import deleteBtn from '../../../../Assets/icons/delete-red.png';
import plusCharcol from '../../../../Assets/icons/plus.png';
import minusCharcol from '../../../../Assets/icons/minus.png'
import crossBtn from '../../../../Assets/icons/Mask group (1).png'
import { HiOutlineArrowPathRoundedSquare } from "react-icons/hi2";
import rotatedArrow from '../../../../Assets/icons/arrow-rotate-white.png'
import unProtectedIcon from '../../../../Assets/icons/un-protected.png';
import protectedIcon from '../../../../Assets/icons/protected.png'
import { url } from '../../../../utils/api';
import guardIcon from '../../../../Assets/icons/guard-icon.png';
import { Link } from 'react-router-dom';
import { useCart } from '../../../../context/cartContext/cartContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const CartItems = ({
    cartProductName, 
    productSubTotal,  
    issingleProtected, 
    handleSingleProtected, 
    isAllProtected, 
    cartPRoductImage, 
    cartProductColor, 
    productData,
    cartProductTitle, 
    cartProductTotalPrice, 
    cartSingleProductPrice, 
    isCartOpen, 
    onlyMobile, 
    productColor, 
    quantity, 
    handleRomoveProduct,  
    cartIndex, 
    productsLength, 
    handleIncreament, 
    handleDecreament, 
    handleTotalPrice
    }) => {
        const {addSingleProtection, removeProtection} = useCart()
        const [saveForLeter, setSaveForLeter] = useState(false)
        const formatedSinglePrice = Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'USD'
        }).format(cartSingleProductPrice)

        const productTotalPrice = cartSingleProductPrice * quantity;

        const formatedTotalPrice = Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'USD'
        }).format(productTotalPrice)


        const handleSaveForLeter = () => {
            setSaveForLeter(true)
            const timeOut = setTimeout(() => {
                setSaveForLeter(false);
            }, 2000);
        }

        const protectOrNotButtons = [
            {type: 'button', title: 'No Thanks', style: 'protect-no-thanks', secondStyle: 'select-not-protection'},
            {type: 'button', title: 'Yes Protect', style: 'protect-yes-protect', secondStyle: 'selected-yes-protect'},
        ]

        const [isProtectionClicked, setIsProtectionClicked] = useState();
        const handleProtectOrNotButtonClicked = (value) => {
            setIsProtectionClicked((prevValue) => prevValue === value ? null : value)
        }

        
    return (
    <>
        
        <div className='cart-product'>
                <button className='mobile-cart-remove-btn' onClick={() => handleRomoveProduct(cartIndex)}>
                    <img src={closeBtn} alt='close btn' />
                </button>
            <div className='cart-item-name'>
                <h3>{cartProductName}</h3>
            </div>
            <div className='cart-product-containt'>
                <div className='cart-item-image'>
                    <img src={`${url}${cartPRoductImage}`} alt='product image' />
                </div>
                <div className='cart-product-details'>
                    <p>{cartProductColor}</p>
                    <p>{cartProductTitle}</p>
                    <div className='price-and-count'>
                        <p>{cartSingleProductPrice}</p>
                        <div className='product-count'>
                            <button onClick={handleDecreament}>
                                <img src={minusBtn} alt='minus' />
                            </button>
                            <p>{quantity}</p>
                            <button onClick={handleIncreament}>
                                <img src={plusBtn} alt='plus' />
                            </button>
                        </div>
                    </div>
                    <div className='cart-item-actual-price'>
                        <p>{productTotalPrice} </p>
                        {/* <p>{productTotalPrice} </p> */}
                    </div>
                </div>
            </div>
        </div>



        {/* Desktop view Card */}
        <div className={`desktop-cart-product`}>
            
            <div className='desktop-cart-product-image'>
                <img src={`${url}${cartPRoductImage}`} alt='product image' />
            </div>
            <div className='desktop-cart-containt-section'>
                <button className={`cross-btn ${isCartOpen ? 'hide-cross-btn' : ''}`} onClick={handleRomoveProduct}>
                    <img src={crossBtn} alt='cross' />
                </button>
                <div className='desktop-name-and-single-price'>
                    <h3>{cartProductName}</h3>
                    <p className='desktop-product-extra-info'>{formatedSinglePrice}</p>
                    <p className='desktop-product-extra-info'>Table & 4 Chairs</p>
                    {/* <p className='desktop-product-extra-info'>Yes, Protect it (+$99)</p> */}
 
                    <div className='desktop-card-protection-div'>
                        <div className='guard-and-heading'>
                            <LazyLoadImage effect='blur' src={guardIcon} alt='guard' className='protection-guard-icon' />
                            <div className='guard-title-and-details'>
                                <h3 className='protection-guard-title'>Platinum Elite Furniture</h3>
                                <span className='protection-details-and-message'>
                                    <Link className='protection-details'>Details</Link>
                                    <p className='protection-price-message'>Price shown in summary</p>
                                </span>
                            </div>
                        </div>
                        <div className='protection-btns-accept-and-cancel'>
                            {/* {protectOrNotButtons.map((items, index) => (
                                <button 
                                    key={index}
                                    className={`protection-buttons ${items.style} ${isProtectionClicked === index ? items.secondStyle : ''}`}
                                    onClick={() => handleProtectOrNotButtonClicked(index)}
                                >
                                    {items.title}
                                </button>
                            ))} */}
                            <button 
                                className={`protection-buttons protect-no-thanks ${isProtectionClicked === 'no-thanks' ? 'select-not-protection' : ''}`}
                                onClick={() => {handleProtectOrNotButtonClicked('no-thanks'); removeProtection(productData)}}
                            >
                                No Thanks
                            </button>
                            <button 
                                className={`protection-buttons protect-yes-protect ${isProtectionClicked === 'yes-protect' ? 'selected-yes-protect' : ''}`}
                                onClick={() => {handleProtectOrNotButtonClicked('yes-protect'); addSingleProtection(productData)}}
                            >
                                Yes Protect it
                            </button>
                        </div>
                    </div>

                    {/* <button className={`protect-product-tag ${issingleProtected ? 'protect-tick' : ''}`} onClick={handleSingleProtected}>
                        <img src={issingleProtected ? protectedIcon : unProtectedIcon} alt='unProtected' />
                        {issingleProtected ? 'Protected(+99)' : 'Prodect'}
                    </button> */}




                    <p>{formatedTotalPrice}</p>
                </div>
                <div className={`desktop-quantity-and-save-for-leter ${isCartOpen ? 'hide-quantity' : ''}`}>
                    <div className='desktop-quantity'>
                        <button onClick={handleDecreament}>
                            <img src={minusCharcol} alt='minus' />
                        </button>
                        <p>{quantity}</p>
                        <button onClick={handleIncreament}>
                            <img src={plusCharcol} alt='plus' />
                        </button>
                    </div>
                </div>
                <div className={`desktop-total-price-and-remove-item ${isCartOpen ? 'hide-total-and-remove-item' : ''}`}>
                    <p>$ {productTotalPrice}</p>
                    {/* <p>$ {productTotalPrice}</p> */}
                    <button className='save-for-leter' onClick={handleSaveForLeter}>
                       <img src={rotatedArrow} className={`${saveForLeter ? 'arrow-rotate' : ''}`} /> Save For Later
                    </button>
                </div>
                <div className={isCartOpen ? 'cart-open-quantity-and-total-price' : 'cart-close-quantity-and-total-price'}>
                    <div className='desktop-quantity'>
                        <button onClick={handleDecreament}>
                            <img src={minusCharcol} alt='minus' />
                        </button>
                        <p>{quantity}</p>
                        <button onClick={handleIncreament}>
                            <img src={plusCharcol} alt='plus' />
                        </button>
                    </div>
                    <p className='cart-open-total-price'>$ {formatedTotalPrice}</p>
                    {/* <p className='cart-open-total-price'>$ {productTotalPrice}</p> */}
                </div>
            </div>
        </div>
    </>
  )
}

export default CartItems
