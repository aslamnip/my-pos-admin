
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AllContext } from '../../AllContext';
import { fetchUrl } from '../../config';
import Loading from '../Loading/Loading';
import SideNav from '../SideNav/SideNav';
// import styles from './EditOrder.module.css'

function OrderCreate() {
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(false)
    const route = useNavigate()
    const accessToken = localStorage.getItem('access_token')
    const [products, setProducts] = useState('')
    useEffect(() => {
        fetch(`${fetchUrl}/api/products/?ordering=-id`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [])
    const [inputValue, setInputvalue] = useState({
        name: '',
        phone: '',
        address: '',
        product: '',
        order_image: '',
        size: '',
        color: '',
        quantity: '1',
        price: "",
        purchase_price: '',
        delivery: 120,
        total: '',
        note: '',

    })

    useEffect(() => {
        const x = products && products.find(data => data.name === inputValue.product)
        if (x) {
            setInputvalue((prevState) => ({
                ...prevState,
                order_image: x.images && x.images[0].image,
                price: x.price,
                purchase_price: x.purchase_price
            }))
        }
    }, [inputValue.product, products])
    useEffect(() => {
        const totalPrice = parseFloat(inputValue.price * inputValue.quantity) || 0;
        const deliveryCost = parseFloat(inputValue.delivery) || 0;
        setInputvalue((prevState) => ({
            ...prevState,
            total: totalPrice + deliveryCost,
        }));
    }, [inputValue.price, inputValue.quantity, inputValue.delivery]);

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
        orderStatus.append('order_image', inputValue.order_image)
        orderStatus.append('size', inputValue.size)
        orderStatus.append('color', inputValue.color)
        orderStatus.append('price', inputValue.price)
        orderStatus.append('purchase_price', inputValue.purchase_price)
        orderStatus.append('quantity', inputValue.quantity)
        orderStatus.append('delivery_fee', inputValue.delivery)
        orderStatus.append('total_amount', inputValue.total)
        orderStatus.append('due', inputValue.total)
        orderStatus.append('note', inputValue.note)
        fetch(`${fetchUrl}/api/order/create/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "POST",
            body: orderStatus

        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    route(0)
                    setShowAlert(true)
                    setAlertText(` Create Success`)
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
        <div className='NavRow'>
            <div>
                <SideNav />
            </div>
            <div className='bodyLayout'>
                <div>
                    <div>
                        {isLoading ? <Loading /> : null}
                        <div>

                            <div>

                                <div className='py-5'>
                                    <h4 className='text-center text-bg-dark'> New Order</h4>
                                    <form onSubmit={handleUpdateOrderStatus}>
                                        <div className=' col-md-6 mx-auto'>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Name</label>
                                                <input onChange={(e) => handelInput('name', e)} value={inputValue.name} type="text" name="name" placeholder='Name' className='form-control mt-2' required />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Phone</label>
                                                <input onChange={(e) => handelInput('phone', e)} value={inputValue.phone} type="text" name="phone" placeholder='Phone' className='form-control mt-2' required />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Address</label>
                                                <input onChange={(e) => handelInput('address', e)} value={inputValue.address} type="text" name="address" placeholder='Address' className='form-control mt-2' required />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Product</label>
                                                <select required onChange={(e) => handelInput('product', e)} name="product" id="product" className='form-select mt-2'>
                                                    <option name='products' value=''>Select a product</option>
                                                    {
                                                        products && products.map((data) =>
                                                            <option key={data.id} name='products' value={data.name}>{data.name}</option>
                                                        )
                                                    }
                                                </select>
                                                {/* <input onChange={(e) => handelInput('product', e)} value={inputValue.product} type="text" name="product" placeholder='Product' className='form-control mt-2' /> */}
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
                                                <label htmlFor='name'>Price</label>
                                                <input onChange={(e) => handelInput('price', e)} value={inputValue.price} type="number" name="price" placeholder='Price Per Item' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Pruchase Price</label>
                                                <input required onChange={(e) => handelInput('purchase_price', e)} value={inputValue.purchase_price} type="number" name="purchase_price" placeholder='Purchase Price' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Delivery Fee</label>
                                                <input onChange={(e) => handelInput('delivery', e)} value={inputValue.delivery} type="number" name="delivery" placeholder='Delivery Fee' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Total Price</label>
                                                <input disabled onChange={(e) => handelInput('total', e)} value={inputValue.total} type="number" name="total" placeholder='Total Price' className='form-control mt-2' />
                                            </div>
                                            <div className='mb-3 mt-5'>
                                                <label htmlFor='name'>Note</label>
                                                <input onChange={(e) => handelInput('note', e)} value={inputValue.note} type="text" name="note" placeholder='Note' className='form-control mt-2' />
                                            </div>
                                            <input className='my-3 btn btn-primary w-100' type="submit" value="Create" />
                                        </div>
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

export default OrderCreate;