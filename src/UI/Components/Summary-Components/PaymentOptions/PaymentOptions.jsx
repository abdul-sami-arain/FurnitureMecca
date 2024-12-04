import React, {useState} from 'react'
import './PaymentOptions.css'
import acimoLogo from '../../../../Assets/Logo/acimo-logo.png'
import masterCard from '../../../../Assets/icons/master.png';
import visaCard from '../../../../Assets/icons/visa.png';
import discoverCard from '../../../../Assets/icons/discover.png';
import americanExpress from '../../../../Assets/icons/american-express.png';
import SummaryInputFields from '../InputField/SummaryInputFields';
import { useMyOrders } from '../../../../context/orderContext/ordersContext';

const PaymentOptions = ({onSelectedLabel}) => {
    const creditCards = [masterCard, visaCard, discoverCard, americanExpress]
    const [selectPaymentMethod, setSelectPaymentMethod] = useState(null);
    const [selectedLabelValue, setSelectedLabelValue] = useState('')
    
    const handlePaymentToggle = (paymentMethod, label) => {
        setSelectPaymentMethod(paymentMethod);
        setSelectedLabelValue(label)
        onSelectedLabel(label)
    }

    const { 
        creditCardData, 
        setCreditCardData
    } = useMyOrders();

    return (
        <div className='payment-types-inner-container'>

            <div className='select-payment-method credit-card' onClick={() => handlePaymentToggle('credit-card', 'Credit Card')}>
                <input type="radio" id='credit-card' name="payment" value="credit-card" checked={selectPaymentMethod === 'credit-card'} readOnly />
                <label for='credit-card' class="radio-label">Credit Card</label>
            </div>

            <div className={`credit-card-data ${selectPaymentMethod === 'credit-card' ? 'show-credit-card' : ''}`}>
                <SummaryInputFields 
                        type={'text'}
                        value={creditCardData.card_holder_name || ''}
                        label={'Card Holder Name'}
                        fieldRequired={true}
                        placeholder={'Card Holder Name'}
                        name={'card_holder_name'}
                        required={'required'}
                        onChange={(e) => {
                            const {value} = e.target;
                            setCreditCardData((prevData) => ({
                                ...prevData,
                                card_holder_name: value
                            }))
                        }}
                />

                <label className='card-number-input'>
                    <div className='card-number-input-label'>
                        <p>Card Number</p>
                        <div className='card-number-input-card-types'>
                            {creditCards.map((items, index) => (
                                <img src={items} alt='card' />
                            ))}
                        </div>
                    </div>
                    <input 
                        className='card-number-input-field' 
                        type='text'
                        value={creditCardData.card_number} 
                        placeholder='0000-0000-0000-0000'
                        name='card_number' 
                        onChange={(e) => {
                            let {value} = e.target;
                            value = value.replace(/\D/g, '');
                            if (value.length > 16) {
                                value = value.slice(0, 16);  // Keep only the first 16 digits
                            }
                             const formattedValue = value
                            .replace(/(\d{4})(?=\d)/g, '$1-') // Add dash after every 4 digits
                            .slice(0, 19);
                            setCreditCardData((prevData) => ({
                                ...prevData,
                                card_number: formattedValue
                            }))
                        }}
                    />
                </label>

                <div className='credit-card-expiry-and-sec-number'>
                    <SummaryInputFields 
                        type={'text'}
                        value={creditCardData.expiry_date}
                        placeholder={'MM/YY'}
                        label={'Expiry date'}
                        name={'expiry_date'}
                        onChange={(e) => {
                            let {value} = e.target;
                            value = value.replace(/[^0-9/]/g, '');
                            if (value.length === 2 && !value.includes('/')) {
                                value = `${value}/`; // Add slash after the month
                            }
                            const [month, year] = value.split('/');
                            if (month && parseInt(month, 10) > 12) {
                            value = ''; // Reset if month exceeds 12
                            alert('Invalid month. Please enter a value between 01 and 12.');
                            }
                            if (value.length > 5) {
                                value = value.slice(0, 5); // Limit length to MM/YY format
                            }
                            setCreditCardData((prevData) => ({
                                ...prevData,
                                expiry_date: value
                            }))
                        }}
                    />
                    <SummaryInputFields 
                        type={'text'}
                        value={creditCardData.sec_code}
                        placeholder={'000'}
                        label={'Sec code'}
                        name={'sec_code'}
                        onChange={(e) => {
                            let {value} = e.target;
                            value = value.replace(/\D/g, '');
                            if (value.length > 3) {
                                value = value.slice(0, 3);  // Keep only the first 16 digits
                            }
                            const formattedValue = value
                            .replace(/(\d{4})(?=\d)/g, '$1-')
                            setCreditCardData((prevData) => ({
                                ...prevData,
                                sec_code: formattedValue
                            }))
                        }}
                    />
                </div>

                <div className='pay-secure-option'>
                    <p>Pay securely using your credit card</p>
                </div>
            </div>

            <div className='select-payment-method paypal' onClick={() => handlePaymentToggle('paypal', 'Paypal')}>
                <input type="radio" id='paypal' name="payment" value="paypal" checked={selectPaymentMethod === 'paypal'} readOnly />
                <label for='paypal' class="radio-label">Paypal</label>
            </div>

            <div className={`paypal-data ${selectPaymentMethod === 'paypal' ? 'show-paypal' : ''}`}>
                <p>Pay via Paypal</p>
            </div>

            <div className='select-payment-method' onClick={() => handlePaymentToggle('acima', 'Acima Leasing')}>
                <input type="radio" id='acima' name="payment" value="acima" checked={selectPaymentMethod === 'acima'} readOnly />
                <label for='acima' class="radio-label">Acima Leasing</label>
                <p>The no credit option</p>
                <p>Learn more</p>
            </div>

            <div className={`acima-payment-method acima ${selectPaymentMethod === 'acima' ? 'acima-payment-toggle' : ''}`}>
                <img src={acimoLogo} alt='logo' />
                <p>Pay via acima</p>
            </div>
            
            <div className='select-payment-method checkout' onClick={() => handlePaymentToggle('checkout', 'Checkout Financing')}>
                <input type="radio" id='checkout' name="payment" value="checkout" checked={selectPaymentMethod === 'checkout'} readOnly />
                <label for='checkout' class="radio-label">Checkout Financing</label>
            </div>
        </div>
    )
}

export default PaymentOptions
