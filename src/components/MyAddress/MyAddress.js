/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';

function MyAddress() {
    const [phone, setPhone] = useState([])
    const accessToken = localStorage.getItem('access_token')
    const [isLoading, setIsLoading] = useState(false)
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [addressInput, setAddressInput] = useState({
        address: '',
        email: '',
        facebook: '',
        messanger: '',
        instagram: '',
        twitter: '',
        youtube: '',
        phone: ''
    })
    useEffect(() => {
        fetch(`${fetchUrl}/api/address/1/`, {
            headers: {  "Authorization": `Bearer ${accessToken}` }})
            .then(res => res.json())
            .then(data => {
                // setAddress(data)
                setAddressInput((prev) => ({
                    ...prev,
                    address: data.address,
                    email: data.email,
                    facebook: data.facebook,
                    messanger: data.messanger,
                    instagram: data.instagram,
                    twitter: data.twitter,
                    youtube: data.youtube,

                }))
            })
    }, [accessToken, phone])
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
        fromData.append('address', addressInput.address)
        fromData.append('email', addressInput.email)
        fromData.append('facebook', addressInput.facebook)
        fromData.append('messanger', addressInput.messanger)
        fromData.append('instagram', addressInput.instagram)
        fromData.append('twitter', addressInput.twitter)
        fromData.append('youtube', addressInput.youtube)

        fetch(`${fetchUrl}/api/address/1/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "PUT",
            body: fromData
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
            .catch(() => {
                setIsLoading(false)
                setShowAlert(true)
                setAlertText(`Fail to update`)
                setAlertVariant('danger')
            })

    }

    useEffect(() => {
        fetch(`${fetchUrl}/api/phone/`)
            .then(res => res.json())
            .then(data => setPhone(data))
    }, [addressInput.phone])



    const addPhone = (e) => {
        setIsLoading(true)
        e.preventDefault()
        const fromData = new FormData()
        fromData.append('phone', addressInput.phone)
        fetch(`${fetchUrl}/api/phone/create/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "POST",
            body: fromData
        })
            .then(res => {
                setIsLoading(false)
                if (res.status === 201) {
                    setShowAlert(true)
                    setAlertText(` Update Success`)
                    setAlertVariant('success')
                    setAddressInput((prev) => ({
                        ...prev,
                        phone: ''
                    }))
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

    const deletePhone = (id) => {
        setIsLoading(true)
        fetch(`${fetchUrl}/api/phone/${id}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'DELETE'
        })
            .then(res => {
                setIsLoading(false)
                if (res.status === 204) {
                    setShowAlert(true)
                    setAlertText(` Delete Success`)
                    setAlertVariant('success')
                    setAddressInput((prev) => ({
                        ...prev,
                        phone: ' '
                    }))
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
                                <label className='form-label' htmlFor="messanger">Messanger</label>
                                <input onChange={(e) => handleChange('messanger', e)} className='form-control' type="text" name='messanger' id='messanger' placeholder='Messanger' value={addressInput.messanger} />
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
                            <input type="submit" value='Update' className='btn btn-dark w-100' />
                        </form>
                        <div>
                            <h6 className='text-center mt-5'>Phone Numbers</h6>
                            <div className='d-flex'>
                                <ul>
                                    {
                                        phone.map(data =>
                                            <div className=' mt-3' key={data.id}>
                                                <li><h5>{data.phone}</h5></li>
                                                <button onClick={() => deletePhone(data.id)} type='button' className='ms-3 btn btn-danger'>Delete</button>
                                            </div>
                                        )
                                    }
                                </ul>
                                <div className='ms-auto my-5'>
                                    <form onSubmit={addPhone}>
                                        .<div className="input-group mb-3">
                                            <input onChange={(e) => handleChange('phone', e)} value={addressInput.phone} type="text" name="phone" id="name" className="form-control" placeholder="Phone Number" />
                                        </div>
                                        <input className='btn btn-dark' type="submit" value="Add Number" />

                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyAddress;