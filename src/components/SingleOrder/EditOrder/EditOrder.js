/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../../DeleteModal/DeleteModal';
import { AllContext } from '../../../AllContext';
import { fetchUrl } from '../../../config';
import Loading from '../../Loading/Loading';
// import styles from './EditOrder.module.css'

function EditOrder(props) {
    const { id, order, deleteOrder } = props
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(false)
    const route = useNavigate()
    const [edit, setedit] = useState(false)
    const accessToken = localStorage.getItem('access_token')
    const [inputValue, setInputvalue] = useState({
        name: '',
        phone: '',
        address: '',
        product: '',
        size: '',
        color: '',
        quantity: '',
        price: '',
        purchase_price: '',
        delivery: '',
        total: '',
        note: '',

    })
    useEffect(() => {
        setInputvalue((prevInputValue) => ({
            ...prevInputValue,
            name: order.name,
            phone: order.phone,
            address: order.address,
            product: order.products,
            size: order.size,
            color: order.color,
            quantity: order.quantity,
            price: order.price,
            due: order.due,
            advance: order.advance,
            purchase_price: order.purchase_price,
            delivery: order.delivery_fee,
            total: order.total_amount,
            note: order.note,

        }));
    }, [order])
    const handelInput = (action, e) => {
        const newInput = { ...inputValue }
        if (e.target.name === action)
            newInput[e.target.name] = e.target.value
        setInputvalue(newInput)
    }

    const handleUpdateOrderStatus = (e) => {
        e.preventDefault()
        setIsLoading(true)
        const orderStatus = new FormData()
        orderStatus.append('name', inputValue.name)
        orderStatus.append('phone', inputValue.phone)
        orderStatus.append('address', inputValue.address)
        orderStatus.append('products', inputValue.product)
        orderStatus.append('size', inputValue.size)
        orderStatus.append('color', inputValue.color)
        orderStatus.append('price', (inputValue.total - inputValue.delivery) / inputValue.quantity)
        orderStatus.append('quantity', inputValue.quantity)
        orderStatus.append('delivery_fee', inputValue.delivery)
        orderStatus.append('due', (inputValue.total - order.advance))
        orderStatus.append('note', inputValue.note)
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
    return (
        <div>
            <div>
                {isLoading ? <Loading /> : null}
                <div>
                    <div className='text-center  mb-5 mt-5'>
                        <div className='d-flex w-25 mx-auto'>
                            <div>
                                <button onClick={() => setedit(!edit)} type='button' className='btn btn-dark' > {!edit ? 'Eidt Order Details' : 'Close'}</button>
                            </div>
                            <div className='ms-3'>
                                <DeleteModal iconText='Delete Order' warning={`Are you sure to delete ${order.order_id}?`} handlefunction={deleteOrder} />
                            </div>
                        </div>
                    </div>
                    <div>
                        {
                            edit ?
                                <div className='py-5'>
                                    <h4 className='text-center text-bg-dark'> New Details</h4>
                                    <form onSubmit={handleUpdateOrderStatus}>
                                        <div className=' col-md-6 mx-auto'>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Name</label>
                                                <input onChange={(e) => handelInput('name', e)} value={inputValue.name} type="text" name="name" placeholder='Name' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Phone</label>
                                                <input onChange={(e) => handelInput('phone', e)} value={inputValue.phone} type="text" name="phone" placeholder='Phone' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Address</label>
                                                <input onChange={(e) => handelInput('address', e)} value={inputValue.address} type="text" name="address" placeholder='Address' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Product</label>
                                                <input onChange={(e) => handelInput('product', e)} value={inputValue.product} type="text" name="product" placeholder='Product' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Size</label>
                                                <input onChange={(e) => handelInput('size', e)} value={inputValue.size} type="text" name="size" placeholder='Size' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Color</label>
                                                <input onChange={(e) => handelInput('color', e)} value={inputValue.color} type="text" name="color" placeholder='Color' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Quantity</label>
                                                <input onChange={(e) => handelInput('quantity', e)} value={inputValue.quantity} type="number" name="quantity" placeholder='Quantity' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Price Per Item</label>
                                                <input onChange={(e) => handelInput('price', e)} value={(inputValue.total - inputValue.delivery) / inputValue.quantity} type="number" name="price" disabled placeholder='Price Per Item' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Purchase Cost {`(of ${inputValue.quantity})`}</label>
                                                <input onChange={(e) => handelInput('purchase_price', e)} value={inputValue.purchase_price} type="number" name="purchase_price" placeholder='Total Purchase Cost' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Delivery Fee</label>
                                                <input onChange={(e) => handelInput('delivery', e)} value={inputValue.delivery} type="number" name="delivery" placeholder='Delivery Fee' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Total Price (Important)</label>
                                                <input onChange={(e) => handelInput('total', e)} value={inputValue.total} type="number" name="total" placeholder='Total Price' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Note</label>
                                                <input onChange={(e) => handelInput('note', e)} value={inputValue.note} type="text" name="note" placeholder='Note' className='form-control mt-2' />
                                            </div>
                                            <input className='my-3 btn btn-outline-primary' type="submit" value="Update" />
                                        </div>
                                    </form>
                                </div>
                                : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditOrder;