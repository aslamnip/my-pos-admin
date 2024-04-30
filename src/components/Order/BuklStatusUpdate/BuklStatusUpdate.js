import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUrl } from '../../../config';
import Loading from '../../Loading/Loading';
import { AllContext } from '../../../AllContext';

function BuklStatusUpdate(props) {
    const route = useNavigate()
    const accessToken = localStorage.getItem('access_token')
    const { edit, setEdit, checkArr, setCheckArr } = props
    const [isLoading, setIsLoading] = useState(false)
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [orderStatusInput, setOrderStatusInput] = useState('')
    const handleOrderStatus = (e) => {
        setOrderStatusInput(e.target.value)
    }
    const hanldeUpdateStutus = () => {
        setIsLoading(true)
        const orderStatus = new FormData()
        orderStatus.append('order_status', orderStatusInput)
        checkArr.map(data =>


            fetch(`${fetchUrl}/api/order/update/${data}/`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
                method: "PATCH",
                body: orderStatus

            })
                .then(res => {
                    setIsLoading(false)
                    if (res.ok) {
                        route(0)
                        console.log('ok')

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
        )
        setCheckArr([])
    }

    return (
        <div>
            {isLoading ? <Loading /> : null}
            <div className='text-center my-3'> <button onClick={() => setEdit(!edit)} type="button" className="btn btn-outline-primary">{!edit ? "Bulk Update" : ' Close'}</button></div>
            <div>
                {
                    edit ?
                        <div className='col-md-6 mx-auto mt-3 mb-5 pb-5'>

                            <select className='form-select' name="order-status" onChange={(e) => handleOrderStatus(e)} >
                                <option value="New">New</option>
                                <option value="Pending">Pending</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Courier">Courier</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Return">Return</option>
                                <option value="Money Collected">Money Collected</option>
                            </select>
                            <button onClick={hanldeUpdateStutus} className='btn btn-dark my-3 px-5' type='button'>Update</button>
                        </div>
                        : null
                }
            </div>
        </div>
    );
}

export default BuklStatusUpdate;