import { createContext, useContext, useEffect, useState } from "react";
import { url } from "../../utils/api";
import { useCart } from "../cartContext/cartContext";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {

    const [stores,setStores] = useState([]);
    const [shippingMethods,setShippingMethods] = useState(null);
    const [totalTax,setTotalTax] = useState(null);
    const [shippingLoader,setShippingLoader]=useState(false);
    const [taxLoader,setTaxLoader]=useState(false);
    const {subTotal,cartProducts} = useCart();


    const [info, setInfo] = useState(() => {
        const savedInfo = localStorage.getItem('other_info');
        return savedInfo ? JSON.parse(savedInfo) : {
            locationData: {
                zipCode: '19134',
                stateCode: 'PA',
                city: 'E Venango St',
                state: 'Philadelphia',
                country: 'us',
                longitude: '-75.1276754',
                latitude:'40.0045027',
            }
        };
    });

    const updateLocationData = (newLocationData) => {
        setInfo((prevState) => ({
            ...prevState,
            locationData: {
                ...prevState.locationData,
                ...newLocationData
            }
        }));
        
    };

    useEffect(() => {
        localStorage.setItem('other_info', JSON.stringify(info));
        fetchAllstores();
        // console.log(subTotal,"here is")
    }, [info])

 

    const [zipCode, setZipCode] = useState("");
    const handleInputChange = (e) => {
        setZipCode(e.target.value);
    };

    async function getStateByPostalCode(postalCode) {
        const apiUrl = `https://api.zippopotam.us/us/${postalCode}`;
      
        try {
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
      
          const data = await response.json();
        //   console.log("API Response:", data);
          return data.places[0]; // You can return the data for further processing
        } catch (error) {
          console.error("Error fetching data:", error);
          return null; // Return null or handle the error accordingly
        }
    }


    async function getStoresByDistance1() {
        const apiUrl = `${url}/api/v1/stores/get-distant?latitude=${info.locationData.latitude}&longitude=${info.locationData.longitude}`;
      
        try {
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
      
          const data = await response.json();
          console.log("API Response:", data);
          return data.data; // You can return the data for further processing
        } catch (error) {
          console.error("Error fetching data:", error);
          return null; // Return null or handle the error accordingly
        }
    }


    async function getShippingMethods() {
        const apiUrl = `${url}/api/v1/shipping/get?stateCode=${info.locationData.stateCode}`;
      
        try {
            setShippingLoader(true)
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            setShippingLoader(false)
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
            
          }
      
          const data = await response.json();
          console.log("API Response:", data);
          setShippingLoader(false)
          return data; // You can return the data for further processing
        } catch (error) {
          console.error("Error fetching data:", error);
          setShippingLoader(false)
          return null; // Return null or handle the error accordingly
        }
    }



    async function getTotalTax() {
        const apiUrl = `${url}/api/v1/tax/get?stateCode=${info.locationData.stateCode}`;
      
        try {
            setTaxLoader(true)
          const response = await fetch(apiUrl);
          
          if (!response.ok) {
            setTaxLoader(false)
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
            
          }
      
          const data = await response.json();
          console.log("API Response:", data);
          setTaxLoader(false)
          return data; // You can return the data for further processing
        } catch (error) {
          console.error("Error fetching data:", error);
          setTaxLoader(false)
          return null; // Return null or handle the error accordingly
        }
    }

    const fetchAllstores = async () => {
        const data = await getStoresByDistance1();
    
        if (data) {
            // Sort the data based on the 'distance' attribute
            const sortedData = data.sort((a, b) => {
                // Extract numeric part from distance string (e.g., '10 km' -> 10)
                const distanceA = parseFloat(a.distance);
                const distanceB = parseFloat(b.distance);
    
                return distanceA - distanceB; // Sort in ascending order (shortest distance first)
            });
    
            setStores(sortedData); // Set the sorted data to the state
        }
    };

    const setAllShippingMethods = async () => {
        const data = await getShippingMethods();
        setShippingMethods(data?.shippingZones[0]);
    };


    const setTaxValues = async () => {
        const data = await getTotalTax();
        setTotalTax(data?.tax[0]);
    };

    function calculateTotalTax(subtotal, taxRate) {
        if (isNaN(subtotal) || isNaN(taxRate) || subtotal < 0 || taxRate < 0) {
          throw new Error("Invalid input: subtotal and taxRate must be non-negative numbers.");
        }
        const taxAmount = (subtotal * taxRate) / 100;
        return taxAmount;
    }
      

//      function getShippingMethods(subtotal, shippingMethods) {
//     let selectedMethods = [];
  
//     // Case 1: METHOD-1 (Free Shipping)
//     const method1 = shippingMethods.find(method => method.id === "METHOD-1");
//     if (method1 && subtotal >= method1.min_cost) {
//         selectedMethods.push(method1);
//     }

//     // If METHOD-1 is applied, no other methods will be shown
//     if (selectedMethods.length > 0) {

//         setSelectedShippingMethods(selectedMethods);
//         console.log(selectedMethods,"selectedMethods are here");
//         return;
//     }

//     // Case 2: METHOD-2 (Flat Rate Shipping)
//     const method2 = shippingMethods.find(method => method.id === "METHOD-2");
//     if (method2) {
//         selectedMethods.push({ ...method2, cost: subtotal >= method2.min_cost ? method2.cost : 0 });
//     }
  
//     // Case 3: METHOD-3 (Local Pickup)
//     const method3 = shippingMethods.find(method => method.id === "METHOD-3");
//     if (method3 && method3.cost === 0) {
//         selectedMethods.push(method3);
//     }
//     console.log(selectedMethods,"selectedMethods are here");
  
//     setSelectedShippingMethods(selectedMethods)
//   }


    useEffect(()=>{
        setAllShippingMethods();
        setTaxValues();
    },[info])

      

    const  handleButtonClick = async () => {
        console.log("Updated Zip Code:", zipCode);
        const data = await  getStateByPostalCode(zipCode);
        console.log(data)
        if(data){
            updateLocationData({
                zipCode: zipCode,
                stateCode: data['state abbreviation'],
                city: data['place name'],
                state: data['state'],
                country: 'US',
                longitude: data['longitude'],
                latitude:data['latitude'],
            })
        }
    };

    function getShippingInfo(option) {
        let result = "";
        let taxIncluded = "";
      
        if (option.id === "METHOD-2") {
          result = option.cost;
          taxIncluded = option.tax !== 0 ? "Tax Included" : "";
        } else if (option.id === "METHOD-1") {
          result = "free shipping"; 
          taxIncluded = "";
        } else if (option.id === "METHOD-3") {
          result = "local pickup";
          taxIncluded = "";
        } else {
          result = "Identifying";
        }
      
        return { result, taxIncluded };
      }
      
    

    return (
        <GlobalContext.Provider value={{
            info,
            setInfo,
            updateLocationData,
            zipCode, setZipCode, handleInputChange, handleButtonClick,
            fetchAllstores,stores,setStores,setAllShippingMethods,shippingMethods,setShippingMethods,shippingLoader,setShippingLoader,
            totalTax,calculateTotalTax,getShippingInfo
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => useContext(GlobalContext);