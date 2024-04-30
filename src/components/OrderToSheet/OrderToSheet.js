import React, { useState, useContext } from 'react';
import { useLocation, } from 'react-router-dom';
import { fetchUrl } from '../../config';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';



function OrderToSheet() {
    const route = useLocation()
    const path = route.pathname.indexOf('new') !== -1
    const accessToken = localStorage.getItem('access_token')
    const [isLoading, setIsLoading] = useState(false)
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)

    const dbToSheet = () => {
        setIsLoading(true)
        fetch(`${fetchUrl}/api/upadte/tosheet/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },

        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    setShowAlert(true)
                    setAlertText(` Update To Sheet Success`)
                    setAlertVariant('success')
                }
                else {

                    setShowAlert(true)
                    setAlertText(`Fail to update`)
                    setAlertVariant('danger')
                }

            })
            .catch(() => {
                setIsLoading(false)
                setShowAlert(true)
                setAlertText(`Fail to update`)
                setAlertVariant('danger')
            })

    }

    return (
        <div>
             {isLoading ? <Loading /> : null}
            <div>
               
                {path && <button onClick={dbToSheet} className='btn btn-dark' type='button'>Print To Sheet</button>}
            </div>

        </div>
    );
}

export default OrderToSheet;