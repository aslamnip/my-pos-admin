/* eslint-disable react/jsx-no-constructed-context-values */
import React, { createContext, useState, useEffect } from 'react';

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







    return (
        <AllContext.Provider value={{ alertVariant, setAlertVariant, showAlert, setShowAlert, alertText, setAlertText, isLogin, setIslogIn }}>
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