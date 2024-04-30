/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { AllContext } from '../../AllContext';
import { fetchUrl } from '../../config';
import Loading from '../Loading/Loading';

function TracingCode() {
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(false)
    const route = useNavigate()
    const accessToken = localStorage.getItem('access_token')
    const [trackeCodes, setTrackCodes] = useState([])

    const [inputValue, setInputvalue] = useState({
        fbpixel: '',
        google: '',

    })
    useEffect(() => {
        fetch(`${fetchUrl}/api/track-codes/`)
            .then(res => res.json())
            .then(data => setTrackCodes(data[0]))


    }, [])

    useEffect(() => {
        setInputvalue((prevInputValue) => ({
            ...prevInputValue,
            fbpixel: trackeCodes.fbpixel,
            google: trackeCodes.google,



        }));
    }, [trackeCodes])
    const handelInput = (action, e) => {
        const newInput = { ...inputValue }
        if (e.target.name === action)
            newInput[e.target.name] = e.target.value
        setInputvalue(newInput)
    }
    const handleUpdateCode = (e) => {
        e.preventDefault()
        setIsLoading(true)
        const codeStatus = new FormData()
        codeStatus.append('fbpixel', inputValue.fbpixel)
        codeStatus.append('google', inputValue.google)


        fetch(`${fetchUrl}/api/track-codes/1/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "PATCH",
            body: codeStatus

        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    route(0)
                    setShowAlert(true)
                    setAlertText(` Update Success`)
                    setAlertVariant('success')
                }
                else {
                    setIsLoading(false)
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
            <div className='NavRow'>
                {isLoading ? <Loading /> : null}
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    <div className='py-5'>
                        <h4 className='text-center text-bg-dark'>FB PIXEL, GOOGLE</h4>
                        <form onSubmit={handleUpdateCode}>
                            <div className=' col-md-6 mx-auto'>
                                <div className='mb-3 mt-5'>
                                    <label htmlFor='name'>Facebook Pixel</label>
                                    <input onChange={(e) => handelInput('fbpixel', e)} value={inputValue.fbpixel} type="text" name="fbpixel" placeholder='FB Pixel' className='form-control mt-2' />
                                </div>
                                <div className='mb-3 mt-5'>
                                    <label htmlFor='name'>Google Track</label>
                                    <input onChange={(e) => handelInput('google', e)} value={inputValue.google} type="text" name="google" placeholder='Google Webmaster' className='form-control mt-2' />
                                </div>



                                <input className='my-3 btn btn-outline-primary' type="submit" value="Update" />
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
}

export default TracingCode;