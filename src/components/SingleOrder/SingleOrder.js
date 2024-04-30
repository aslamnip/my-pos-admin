import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import styles from './SingleOrder.module.css'
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';
import EditOrder from './EditOrder/EditOrder';

function SingleOrder() {
    const { orderId } = useParams()
    const id = orderId.slice(4, orderId.length)
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(true)
    const [order, setOrder] = useState({})
    const [orderStatusInput, setOrderStatusInput] = useState('')
    const [advance, setAdvance] = useState('')
    const [courier, setCourier] = useState('')
    const [orderAdminInput, setOrderAdminInput] = useState('')
    const accessToken = localStorage.getItem('access_token')
    const route = useNavigate()

    useEffect(() => {
        fetch(`${fetchUrl}/api/order/${id}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
        })
            .then(res => res.json())
            .then(data => {
                setOrder(data);
                setOrderStatusInput(data.order_status);
                setAdvance(data.advance)
                setCourier(data.courier)
                setIsLoading(false)
            })
    }, [accessToken, id])




    const handleOrderStatus = (e) => {
        setOrderStatusInput(e.target.value)
    }


    const handleOrderAdmin = (e) => {
        setOrderAdminInput(e.target.value)
    }

    const handleOrderAdvance = (e) => {
        setAdvance(e.target.value)
    }

    const handleCourier = (e) => {
        setCourier(e.target.value)
    }



    const [employee, setEmployee] = useState([])
    useEffect(() => {
        fetch(`${fetchUrl}/api/employee-list/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => { setEmployee(data); setOrderAdminInput(order.order_confirm_user); })
    }, [accessToken, order])


    const handleUpdateOrderAdmin = () => {
        setIsLoading(true)
        const orderStatus = new FormData()
        orderStatus.append('order_confirm_user', orderAdminInput)
        orderStatus.append('advance', advance)
        orderStatus.append('due', (order.total_amount - advance))
        orderStatus.append('order_status', orderStatusInput)
        orderStatus.append('courier', courier)

        fetch(`${fetchUrl}/api/order/update/${id}/`, {
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

    const deleteOrder = () => {
        setIsLoading(true)
        fetch(`${fetchUrl}/api/order/delete/${order.id}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'DELETE'
        })
            .then(res => {
                setIsLoading(false)
                if (res.status === 204) {
                    route('/orders')
                    setShowAlert(true)
                    setAlertText(` Delete Success`)
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


    const isoDateString = order.order_at
    const dateObj = new Date(isoDateString);



    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };

    const humanReadableDateTime = dateObj.toLocaleDateString('en-US', options);

    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    {isLoading ? <Loading /> : null}
                    <h4 className='text-center mt-5'>Order Details</h4>
                    <div className={styles.mainSgOrder}>
                        <div>
                            <div className='row'>
                                <div className='col-md-2 order-md-2'>
                                    <div className={`${styles.image_side_order} mb-5`}>
                                        <img src={order.order_image} alt="" />
                                        <p className='mt-1 ms-2 text-cneter '>Product Image</p>
                                    </div>
                                </div>
                                <div className='col-md-10'>
                                    <div className='row'> <p className='col-md-3 col-5'><b>Order ID </b> </p><p className='col-1'><b>:</b></p> <p className='col-md-6'>{order.order_id}</p> </div>
                                    <div className='row'> <p className='col-md-3 col-5'><b>Coustomer Name</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-md-6'>{order.name}</p> </div>
                                    <div className='row'> <p className='col-md-3 col-5'><b>Phone</b> </p><p className='col-1'><b>:</b></p>  <p className='col-md-6'>{order.phone}</p> </div>
                                    <div className='row'> <p className='col-md-3 col-5'><b>Address</b> </p> <p className='col-1'><b>:</b></p>  <p className={`${styles.orderAddress} col-md-6`}>{order.address}</p> </div>
                                    <div className='row'> <p className='col-md-3 col-5'><b>Note</b> </p> <p className='col-1'><b>:</b></p>  <p className={`${styles.orderAddress} col-md-6`}>{order.note}</p> </div>
                                    <div className='row'> <p className='col-md-3 col-5'><b>Product name</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-md-6'>{order.products}</p> </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-10'>

                            <div className='row mt-3'> <p className='col-3'><b>Size</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-6'>{order.size}</p> </div>
                            <div className='row'> <p className='col-3'><b>Color</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-6'>{order.color}</p> </div>
                            <div className='row'> <p className='col-3'><b>Quantity</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-6'>{order.quantity}</p> </div>
                            <div className='row'> <p className='col-3'><b>Price per Item</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-6'>{order.price} TK.</p> </div>
                            <div className='row'> <p className='col-3'><b>Delivery fee</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-6'>{order.delivery_fee} TK.</p> </div>
                            <div className='row'> <p className='col-3'><b>Total Ammount</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-6'>{order.total_amount} TK.</p> </div>
                            <div className='row'>
                                <p className='col-3'><b>Advance</b> </p> <p className='col-1'><b>:</b></p>
                                <p className='col-6 d-flex'>
                                    <div className='w-50'>
                                        <input className='form-control' type="text" name="advance" id="" onChange={handleOrderAdvance} value={`${advance}`} />
                                    </div>
                                    <span className='ms-1 mt-2 col'>TK.</span>
                                  
                                </p>
                            </div>
                            <div className='row'> <p className='col-3'><b>Due Ammount</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-6'>{order.due} TK.</p> </div>
                            <div className='row'>
                                <p className='col-3'><b>Courier</b> </p> <p className='col-1'><b>:</b></p>
                                <p className='col-6 d-flex'>
                                    <div className='w-50'>
                                        <input className='form-control' type="text" name="courier" id="" onChange={handleCourier} value={`${courier}`} />
                                    </div>
                                </p>
                            </div>

                            <div className='row'> <p className='col-3'><b>Ordered At</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-6'>{humanReadableDateTime}</p> </div>
                            <div className='row'>
                                <p className='col-3 mt-1'><b>Order Status</b> </p>
                                <p className='col-1 mt-2'><b>:</b></p>
                                <div className='col-6 d-md-flex'>
                                    <div className='w-50 mt-1 '>
                                        <select className='form-select ' name="order-status" onChange={handleOrderStatus} value={orderStatusInput} >
                                            <option value="New">New</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Courier">Courier</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Return">Return</option>
                                            <option value="Money Collected">Money Collected</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='row mt-2'> <p className='col-3'><b>Ordered By</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-6'>{order.order_user_name}</p> </div>
                            <div className='row'> <p className='col-3'><b>Order Admin</b> </p> <p className='col-1'><b>:</b></p>  <p className='col-6'>{order.order_confirm_user_name}</p> </div>
                            <div >

                                <div className='row'>
                                    <p className='col-3 mt-1'><b>Change Order Admin</b> </p>
                                    <p className='col-1 mt-2'><b>:</b></p>
                                    <div className='col-6 d-md-flex'>
                                        {!(employee.length > 0) ? <p className='w-100 mt-2'>No permission</p> :
                                            <div className='w-100 mt-1 '>
                                                <select className='form-select ' name="order-admin" onChange={handleOrderAdmin} value={orderAdminInput} >
                                                    {
                                                        employee.length > 0 && employee.map(data =>
                                                            <option key={data.id} value={data.id}>{data.username}</option>
                                                        )
                                                    }
                                                </select>
                                            </div>
                                        }
                                        <div className='ms-3 mt-1 w-100 '>
                                            <button onClick={handleUpdateOrderAdmin} className='btn btn-outline-success' type='button'>Update Order</button>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className=' mx-auto  '>
                            <EditOrder deleteOrder={deleteOrder} order={order} id={id} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default SingleOrder;