/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';

function BusinessSetting() {
    const accessToken = localStorage.getItem('access_token')
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [addressInput, setAddressInput] = useState({
        business_title: '',
        address: '',
        email: '',
        facebook: '',
        phone_1: '',
        phone_2: '',
        instagram: '',
        twitter: '',
        youtube: '',
        linkedin: ''
    })
    useEffect(() => {
        fetch(`${fetchUrl}/api/business-setting/1/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => {
                // setAddress(data)
                setAddressInput((prev) => ({
                    ...prev,
                    address: data.address,
                    business_title: data.business_title,
                    email: data.email,
                    facebook: data.facebook,
                    phone_1: data.phone_1,
                    phone_2: data.phone_2,
                    instagram: data.instagram,
                    twitter: data.twitter,
                    youtube: data.youtube,
                    linkedin: data.linkedin,

                }))
            })
    }, [accessToken])
    const handleChange = (action, e) => {
        if (e.target.name === action) {
            const newInput = { ...addressInput }
            newInput[e.target.name] = e.target.value
            setAddressInput(newInput)
        }
    }

    const handleSubmit = (e) => {
        setIsLoading(true)
        e.preventDefault()
        const fromData = new FormData()
        fromData.append('business_title', addressInput.business_title)
        fromData.append('address', addressInput.address)
        fromData.append('email', addressInput.email)
        fromData.append('facebook', addressInput.facebook)
        fromData.append('phone_1', addressInput.phone_1)
        fromData.append('phone_2', addressInput.phone_2)
        fromData.append('instagram', addressInput.instagram)
        fromData.append('twitter', addressInput.twitter)
        fromData.append('youtube', addressInput.youtube)
        fromData.append('linkedin', addressInput.linkedin)

        fetch(`${fetchUrl}/api/business-setting/1/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "PUT",
            body: fromData
        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    setShowAlert(true)
                    setAlertText(` Update Success`)
                    setAlertVariant('success')
                    navigate(0)
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
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>

                    {isLoading ? <Loading /> : null}
                    <div className='w-50 mx-auto'>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="business_title">Business Title</label>
                                <input onChange={(e) => handleChange('business_title', e)} className='form-control' type="text" name='business_title' id='business_title' placeholder='Business Title' value={addressInput.business_title} />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="address">Address</label>
                                <input onChange={(e) => handleChange('address', e)} className='form-control' type="text" name='address' id='address' placeholder='Address' value={addressInput.address} />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="email">Email</label>
                                <input onChange={(e) => handleChange('email', e)} className='form-control' type="text" name='email' id='email' placeholder='Email' value={addressInput.email} />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="facebook">Facebook</label>
                                <input onChange={(e) => handleChange('facebook', e)} className='form-control' type="text" name='facebook' id='facebook' placeholder='Facebook' value={addressInput.facebook} />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="phone_1">Phone Number- 1</label>
                                <input onChange={(e) => handleChange('phone_1', e)} className='form-control' type="text" name='phone_1' id='phone_1' placeholder='Phone Number - 1' value={addressInput.phone_1} />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="phone_2">Phone Number- 2</label>
                                <input onChange={(e) => handleChange('phone_2', e)} className='form-control' type="text" name='phone_2' id='phone_2' placeholder='Phone Number - 2' value={addressInput.phone_2} />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="instagram">Instagram</label>
                                <input onChange={(e) => handleChange('instagram', e)} className='form-control' type="text" name='instagram' id='instagram' placeholder='Instagram' value={addressInput.instagram} />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="twitter">Twitter</label>
                                <input onChange={(e) => handleChange('twitter', e)} className='form-control' type="text" name='twitter' id='twitter' placeholder='Twitter' value={addressInput.twitter} />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="Youtube">youtube</label>
                                <input onChange={(e) => handleChange('youtube', e)} className='form-control' type="text" name='youtube' id='youtube' placeholder='Youtube' value={addressInput.youtube} />
                            </div>
                            <div className='mb-3'>
                                <label className='form-label' htmlFor="linkedin">Linkedin</label>
                                <input onChange={(e) => handleChange('linkedin', e)} className='form-control' type="text" name='linkedin' id='linkedin' placeholder='Linkedin' value={addressInput.linkedin} />
                            </div>
                            <input type="submit" value='Update' className='btn btn-dark w-100' />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BusinessSetting;