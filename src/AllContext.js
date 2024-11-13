/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState, useEffect } from 'react';
import { fetchUrl } from './config';

export const AllContext = createContext()

function AllContextProvider({ children }) {
    const [showAlert, setShowAlert] = useState(false)
    const [alertText, setAlertText] = useState('')
    const [alertVariant, setAlertVariant] = useState('dark')

    const [isLogin, setIslogIn] = useState(false)

    const checkTokenValidity = () => {
        const accessToken = localStorage.getItem('access_token');
        const expirationTime = localStorage.getItem('expiration_time');

        // Check if there is a valid token and it has not expired
        if (accessToken && new Date().getTime() < expirationTime) {
            setIslogIn(true);
        } else {
            // Remove the token from local storage if it has expired or is not present
            localStorage.removeItem('access_token');
            localStorage.removeItem('expiration_time');
            setIslogIn(false);
        }
    };

    // Check token validity on component mount
    useEffect(() => {
        checkTokenValidity();
    }, []);



    const [collapsed, setCollapsed] = useState(false)
    const [myBusiness, setMybusiness] = useState({})
    const accessToken = localStorage.getItem('access_token');
    useEffect(() => {
        fetch(`${fetchUrl}/api/business-setting/1/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data =>setMybusiness(data) )
    }, [accessToken])


    const [products, setProducts] = useState([])
    useEffect(() => {
        fetch(`${fetchUrl}/api/products/?ordering=-id`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [])

    const [categories, setCategories] = useState([])
    useEffect(() => {
        fetch(`${fetchUrl}/api/categories/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }})
            .then(res => res.json())
            .then(data => setCategories(data))


          
    }, [accessToken])
    return (
        <AllContext.Provider value={{categories, products,myBusiness ,collapsed, setCollapsed, alertVariant, setAlertVariant, showAlert, setShowAlert, alertText, setAlertText, isLogin, setIslogIn }}>
            {children}
        </AllContext.Provider>
    );
}

export default AllContextProvider;

// const contextValue = useMemo(() => ({
    //       showAlert,
    //       setAlertShow,
    //       alertText,
    //       setAlertText
    //     }), [showAlert, setAlertShow, alertText, setAlertText]);