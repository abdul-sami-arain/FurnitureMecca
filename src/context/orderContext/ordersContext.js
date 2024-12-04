import { createContext, useContext, useEffect, useState } from "react";
import { url } from "../../utils/api";
import axios from "axios";
import { CartContext } from "../cartContext/cartContext";

const MyOrderContext = createContext();

export const MyOrdersProvider = ({ children }) => {

    const [creditCardData, setCreditCardData] = useState({
        card_holder_name: '',
        card_number: '',
        expiry_date: '',
        sec_code: '',
    })

    const [orderPayload, setOrderPayload] = useState({
        status: 'pending',
        currency: "USD",
        billing: {
            first_name: "",
            last_name: "",
            address_1: "",
            city: "",
            state: "",
            postal_code: "",
            country: "USA",
            email: "",
            phone: ""
        },

        payment_method: "",
        card_info: {
            card_holder_name: '',
            card_number: '',
            expiry_month: '',
            expiry_year: '',
            sec_number: ''
        },
        items: [],
        discount: 10,
        tax: 5,
        cart_protected: 0,
        is_shipping: 1,
        shipping_cost: 10
    })
    const [emptyField, setEmptyField] = useState({});
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedTab, setSelectedTab] = useState(0)
    const [isLoader, setIsLoader] = useState(false)
    const { resetCart } = useContext(CartContext)

    useEffect(() => {
        const storeOrders = localStorage.getItem('myOrders');
        if (storeOrders) {
            try {
                setOrderPayload(JSON.parse(storeOrders)); // Parse the JSON string correctly
            } catch (error) {
                console.error("Failed to parse myOrders from localStorage:", error);
                //setOrderPayload(initialOrderPayload); // Fallback to initial structure
            }
        }
        setLoading(false); // Set loading to false after processing
    }, []);

    useEffect(() => {
        if (orderPayload) {
            localStorage.setItem('myOrders', JSON.stringify(orderPayload)); // Save as a JSON string
        }
    }, [orderPayload]);

    const handleNestedValueChange = (e) => {
        const { name, value } = e.target;

        setOrderPayload((prevOrders) => ({
            ...prevOrders,
            billing: {
                ...prevOrders.billing,
                [name]: value, // Update the specific field in billing
            },
        }));
        setEmptyField((prev) => ({ ...prev, [name]: "" }));
    };

    const addProducts = (products) => {
        setOrderPayload((prevOrder) => ({
            ...prevOrder,
            items: [
                ...(Array.isArray(products) ? products : [products]) // Ensure single product is handled like an array
                    .map((product) => ({
                        name: product.product.name,
                        product_id: product.product.uid,
                        quantity: product.product.quantity,
                        sku: product.product.sku,
                        is_protected: product.product.is_protected,
                        image: product.product.image.image_url
                    }))
            ]
        }))
    }

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        setOrderPayload((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleClickTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const handleTabOpen = (tabId, scrollTop) => {

        setSelectedTab(tabId);
        console.log("selected id", selectedTab)

        if (scrollTop) {
            scrollTop();
        }
    }

    const sendProducts = async () => {
        try {
            setIsLoader(true)
            const api = `/api/v1/orders/add`;
            const response = await axios.post(`${url}${api}`, orderPayload);
            if (response.status === 201) {
                setOrderPayload({});
                resetCart()
            }
        } catch (error) {
            console.error("error adding order", error);
        } finally {
            setIsLoader(false); // Set isLoader to false after the async operation (success or error)
        }
        //   setIsLoader(false)
    }

    const handlePaymentInfo = () => {
        // Split the expiry_date to get month and year
        const [expiry_month, expiry_year] = creditCardData.expiry_date.split("/");

        // Update the orderPayload with the values from creditCardData
        setOrderPayload((prevPayload) => ({
            ...prevPayload,
            card_info: {
                ...prevPayload.payment_info,
                card_holder_name: creditCardData.card_holder_name,
                card_number: creditCardData.card_number,
                expiry_month: expiry_month || '',  // Set month, default to empty string if not present
                expiry_year: expiry_year || '',    // Set year, default to empty string if not present
                sec_number: creditCardData.sec_code,
            }
        }));
    }

    return (
        <MyOrderContext.Provider value={{
            orderPayload,
            setOrderPayload,
            handleNestedValueChange,
            handleValueChange,
            loading,
            selectedTab,
            handleTabOpen,
            addProducts,
            sendProducts,
            isLoader,
            setIsLoader,
            handleClickTop,
            emptyField,
            setEmptyField,
            creditCardData,
            setCreditCardData,
            handlePaymentInfo
        }}>
            {children}
        </MyOrderContext.Provider>
    )
}

export const useMyOrders = () => useContext(MyOrderContext)