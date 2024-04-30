import React, { useEffect, useState, useContext } from 'react';
import SideNav from '../SideNav/SideNav';
import Loading from '../Loading/Loading';
import RichText from '../RichText/RichText';
import { fetchUrl } from '../../config';
import { AllContext } from '../../AllContext';

function Pages() {
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const accessToken = localStorage.getItem('access_token')
    const [isLoading, setIsLoading] = useState(false)
    const [showPageNum, setShowPageNum] = useState(1)
    const [value, setValue] = useState('')
    useEffect(() => {

        if (showPageNum === 1) {
            fetch(`${fetchUrl}/api/about/1/`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
            })
                .then(res => res.json())
                .then(data => setValue(data.page))
        }

        if (showPageNum === 2) {
            fetch(`${fetchUrl}/api/contact/1/`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
            })
                .then(res => res.json())
                .then(data => setValue(data.page))
        }
        if (showPageNum === 3) {
            fetch(`${fetchUrl}/api/privacy-policy/1/`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
            })
                .then(res => res.json())
                .then(data => setValue(data.page))
        }
        if (showPageNum === 4) {
            fetch(`${fetchUrl}/api/return-policy/1/`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
            })
                .then(res => res.json())
                .then(data => setValue(data.page))
        }
        if (showPageNum === 5) {
            fetch(`${fetchUrl}/api/terms/1/`, {
                headers: { "Authorization": `Bearer ${accessToken}` }
            })
                .then(res => res.json())
                .then(data => setValue(data.page))
        }


    }, [accessToken, showPageNum])

    function updatePage() {
        const newFrom = new FormData()
        newFrom.append('page', value)
        if (showPageNum === 1) {
            fetch(`${fetchUrl}/api/about/1/`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
                method: 'PUT',
                body: newFrom
            })
                .then(res => {
                    setIsLoading(false)
                    if (res.status === 200) {
                        setShowAlert(true)
                        setAlertText(` Update Success`)
                        setAlertVariant('success')
                    }
                    else {
                        setShowAlert(true)
                        setAlertText(`Fail to update`)
                        setAlertVariant('danger')
                    }
                })

        }

        if (showPageNum === 2) {
            fetch(`${fetchUrl}/api/contact/1/`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
                method: 'PUT',
                body: newFrom
            })
                .then(res => {
                    setIsLoading(false)
                    if (res.status === 200) {
                        setShowAlert(true)
                        setAlertText(` Update Success`)
                        setAlertVariant('success')
                    }
                    else {
                        setShowAlert(true)
                        setAlertText(`Fail to update`)
                        setAlertVariant('danger')
                    }
                })

        }
        if (showPageNum === 3) {
            fetch(`${fetchUrl}/api/privacy-policy/1/`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
                method: 'PUT',
                body: newFrom
            })
                .then(res => {
                    setIsLoading(false)
                    if (res.status === 200) {
                        setShowAlert(true)
                        setAlertText(` Update Success`)
                        setAlertVariant('success')
                    }
                    else {
                        setShowAlert(true)
                        setAlertText(`Fail to update`)
                        setAlertVariant('danger')
                    }
                })

        }
        if (showPageNum === 4) {
            fetch(`${fetchUrl}/api/return-policy/1/`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
                method: 'PUT',
                body: newFrom
            })
                .then(res => {
                    setIsLoading(false)
                    if (res.status === 200) {
                        setShowAlert(true)
                        setAlertText(` Update Success`)
                        setAlertVariant('success')
                    }
                    else {
                        setShowAlert(true)
                        setAlertText(`Fail to update`)
                        setAlertVariant('danger')
                    }
                })

        }
        if (showPageNum === 5) {
            fetch(`${fetchUrl}/api/terms/1/`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
                method: 'PUT',
                body: newFrom
            })
                .then(res => {
                    setIsLoading(false)
                    if (res.status === 200) {
                        setShowAlert(true)
                        setAlertText(` Update Success`)
                        setAlertVariant('success')
                    }
                    else {
                        setShowAlert(true)
                        setAlertText(`Fail to update`)
                        setAlertVariant('danger')
                    }
                })

        }
    }

    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    {isLoading ? <Loading /> : null}
                    <div className='row'>
                        <div className='col-md-2'><button onClick={() => setShowPageNum(1)} type='button' className='btn btn-primary w-100'>About us</button></div>
                        <div className='col-md-2'><button onClick={() => setShowPageNum(2)} type='button' className='btn btn-success w-100'>Contact</button></div>
                        <div className='col-md-2'><button onClick={() => setShowPageNum(2)} type='button' className='btn btn-primary w-100'>Privacy Policy</button></div>
                        <div className='col-md-2'><button onClick={() => setShowPageNum(4)} type='button' className='btn btn-success w-100'>Return Policy</button></div>
                        <div className='col-md-2'><button onClick={() => setShowPageNum(5)} type='button' className='btn btn-dark w-100'>Terms & Conditions</button></div>
                    </div>
                    <div className='mt-5'>
                        <div>
                            {showPageNum === 1 ?
                                <div>
                                    <h2>About us Page</h2>
                                    <RichText value={value} setValue={setValue} />
                                    <button className='btn btn-dark w-100 mt-3' type='button' onClick={updatePage}>Update</button>
                                </div>
                                : null}
                        </div>
                        <div>
                            {showPageNum === 2 ?
                                <div>
                                    <h2>Contact us Page</h2>
                                    <RichText value={value} setValue={setValue} />
                                    <button className='btn btn-dark w-100 mt-3' type='button' onClick={updatePage}>Update</button>
                                </div>
                                : null}
                        </div>
                        <div>
                            {showPageNum === 3 ?
                                <div>
                                    <h2>Privacy Policy Page</h2>
                                    <RichText value={value} setValue={setValue} />
                                    <button className='btn btn-dark w-100 mt-3' type='button' onClick={updatePage}>Update</button>
                                </div>
                                : null}
                        </div>
                        <div>
                            {showPageNum === 4 ?
                                <div>
                                    <h2>Return Policy Page</h2>
                                    <RichText value={value} setValue={setValue} />
                                    <button type='button' className='btn btn-dark w-100 mt-3' onClick={updatePage}>Update</button>
                                </div>
                                : null}
                        </div>
                        <div>
                            {showPageNum === 5 ?
                                <div>
                                    <h2>Terms and Conditions Page</h2>
                                    <RichText value={value} setValue={setValue} />
                                    <button type='button' className='btn btn-dark w-100 mt-3' onClick={updatePage}>Update</button>
                                </div>
                                : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pages;