import { createContext, useContext, useEffect, useState } from "react";
import { url } from "../../utils/api";

const GlobalContext = createContext();
// const singleProductContext = createContext();

export const GlobalContextProvider = ({ children }) => {

    const [stores,setStores] = useState([]);
    const [shippingMethods,setShippingMethods] = useState([]);
    const [shippingLoader,setShippingLoader]=useState(false);


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
          return data.shippingZones[0]; // You can return the data for further processing
        } catch (error) {
          console.error("Error fetching data:", error);
          setShippingLoader(false)
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
    
        if (data) {
            setShippingMethods(data); // Set the sorted data to the state
        }
    };

      

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
    

    return (
        <GlobalContext.Provider value={{
            info,
            setInfo,
            updateLocationData,
            zipCode, setZipCode, handleInputChange, handleButtonClick,
            fetchAllstores,stores,setStores,setAllShippingMethods,shippingMethods,setShippingMethods,shippingLoader,setShippingLoader
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export const useGlobalContext = () => useContext(GlobalContext);