/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { AllContext } from '../../AllContext';
import { fetchUrl } from '../../config';
import Loading from '../Loading/Loading';

function DeliveryFee() {
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(false)
    const route = useNavigate()
    const accessToken = localStorage.getItem('access_token')
    const [inputValue, setInputvalue] = useState({
        dhaka: '',
        dhakaBangla: '',
        outDhaka: '',
        outDhakaBangla: '',


    })
    const [deliveryCharge, setDeliveryCharge] = useState([])
    useEffect(() => {
        fetch(`${fetchUrl}/api/delivery-charge/update/1/`)
            .then(res => res.json())
            .then(data => setDeliveryCharge(data))


    }, [])

    useEffect(() => {
        setInputvalue((prevInputValue) => ({
            ...prevInputValue,
            dhaka: deliveryCharge.in_dhaka,
            dhakaBangla: deliveryCharge.in_dhaka_bangla,
            outDhaka: deliveryCharge.out_dhaka,
            outDhakaBangla: deliveryCharge.out_dhaka_bangla,


        }));
    },[deliveryCharge])
    const handelInput = (action, e) => {
        const newInput = { ...inputValue }
        if (e.target.name === action)
            newInput[e.target.name] = e.target.value
        setInputvalue(newInput)
    }

    const handleUpdateDeliveryCharge = (e) => {
        e.preventDefault()
        setIsLoading(true)
        const orderStatus = new FormData()
        orderStatus.append('in_dhaka', inputValue.dhaka)
        orderStatus.append('in_dhaka_bangla', inputValue.dhakaBangla)
        orderStatus.append('out_dhaka', inputValue.outDhaka)
        orderStatus.append('out_dhaka_bangla', inputValue.outDhakaBangla)

        fetch(`${fetchUrl}/api/delivery-charge/update/1/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "PATCH",
            body: orderStatus

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
                        <h4 className='text-center text-bg-dark'>ডেলিভারি চার্জ</h4>
                        <form onSubmit={handleUpdateDeliveryCharge}>
                            <div className=' col-md-6 mx-auto'>
                                <div className='mb-3 mt-5'>
                                    <label htmlFor='name'>Dhaka City Delivery Charge</label>
                                    <input onChange={(e) => handelInput('dhaka', e)} value={inputValue.dhaka} type="text" name="dhaka" placeholder='Dhaka City Delivery' className='form-control mt-2' />
                                </div>
                                <div className='mb-3 mt-5'>
                                    <label htmlFor='name'>ঢাকায় ডেলিভারি চার্জ বাংলা</label>
                                    <input onChange={(e) => handelInput('dhakaBangla', e)} value={inputValue.dhakaBangla} type="text" name="dhakaBangla" placeholder='ঢাকা ডেলিভারি চার্জ বাংলা' className='form-control mt-2' />
                                </div>
                                <div className='mb-3 mt-5'>
                                    <label htmlFor='name'>Out of Dhaka City Delivery Charge</label>
                                    <input onChange={(e) => handelInput('outDhaka', e)} value={inputValue.outDhaka} type="text" name="outDhaka" placeholder='Out of Dhaka Charge' className='form-control mt-2' />
                                </div>
                                <div className='mb-3 mt-5'>
                                    <label htmlFor='name'> ঢাকার বাইরে ডেলিভারি চার্জ বাংলা</label>
                                    <input onChange={(e) => handelInput('outDhakaBangla', e)} value={inputValue.outDhakaBangla} type="text" name="outDhakaBangla" placeholder='ঢাকার বাইরে চার্জ বাংলা' className='form-control mt-2' />
                                </div>

                                <input className='my-3 btn btn-outline-primary' type="submit" value="Update" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeliveryFee;