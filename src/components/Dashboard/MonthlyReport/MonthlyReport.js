import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import ReactDatePicker from 'react-datepicker';
import { AllContext } from '../../../AllContext';
import { fetchUrl } from '../../../config';
import styles from './MonthlyReport.module.css'
import 'react-datepicker/dist/react-datepicker.css'
import Loading from '../../Loading/Loading';

function MonthlyReport(props) {
    const { orders, userName } = props
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const accessToken = localStorage.getItem('access_token')
    const currentDate = new Date()
    const StDate = new Date(currentDate)
    StDate.setMonth(currentDate.getMonth() - 1)

    const [startDate, setStartDate] = useState(StDate)
    const [endDate, setEndDate] = useState(currentDate)

    const selectedOrdersRange = orders.filter(data => {
        const orderDate = new Date(data.order_at);
        return orderDate >= startDate && orderDate <= endDate;
    });


    const pendingOrders = selectedOrdersRange.filter(data => data.order_status === 'Pending')
    const returnOrders = selectedOrdersRange.filter(data => data.order_status === 'Return')
    const cancellOrders = selectedOrdersRange.filter(data => data.order_status === 'Cancelled')
    const totalCancellOrders = returnOrders.length + cancellOrders.length
    const confirmed = selectedOrdersRange.filter(data => data.order_status === 'Confirmed')
    const Couirer = selectedOrdersRange.filter(data => data.order_status === 'Courier')
    const Delivered = selectedOrdersRange.filter(data => data.order_status === 'Delivered')
    const moneyCollected = selectedOrdersRange.filter(data => data.order_status === 'Money Collected')
    const orderConfirmQn = confirmed.length + Couirer.length + Delivered.length + moneyCollected.length
    const orderAmt = selectedOrdersRange.reduce((total, value) => total + value.total_amount, 0)
    const sellItems = selectedOrdersRange.reduce((total, value) => total + value.quantity, 0)

    const orderConfirm = confirmed.concat(Couirer, Delivered, moneyCollected)
    const onCourier = Couirer.concat(Delivered, moneyCollected, returnOrders)
    const sellAmt = orderConfirm.reduce((total, value) => total + value.total_amount, 0)
    const dueCollect = moneyCollected.reduce((total, value) => total + value.due, 0)

    const advCollect = orderConfirm.reduce((total, value) => total + value.advance, 0)
    const purchaseCost = orderConfirm.reduce((total, value) => total + (value.purchase_price), 0)
    const courierCost = onCourier.reduce((total, value) => total + (value.delivery_fee),0) 
    const returnCharge =   (returnOrders.length * 60) 

    const [adCost, setAdCost] = useState(0)
    const [rentSalaryCost, setRentSalaryCost] = useState(0)
    const [othersCost, setOthersCost] = useState(0)
    useEffect(() => {
        setAdCost(selectedOrdersRange.length * 200)
    }, [selectedOrdersRange.length])
    const handleAdcostInput = (e) => {
        setAdCost(e.target.value)
    }
    const handleRentSalaryCost = (e) => {
        setRentSalaryCost(e.target.value)
    }

    const handleOthersCost = (e) => {
        setOthersCost(e.target.value)
    }


    const profite = (dueCollect + advCollect) - (purchaseCost + Number(adCost) + Number(courierCost) + Number(returnCharge) + Number(rentSalaryCost) + Number(othersCost))

    const [isLoading, setIsLoading] = useState(false)
    const handleSavereport = () => {
        setIsLoading(true)
        const orderStatus = new FormData()
        orderStatus.append('title', `Showing Order Data of ${startDate.toDateString()} to ${endDate.toDateString()}`)
        orderStatus.append('advance', advCollect)
        orderStatus.append('due', dueCollect)
        orderStatus.append('adcost', adCost)
        orderStatus.append('ppcost', purchaseCost)
        orderStatus.append('shippingcost', courierCost)
        orderStatus.append('rentcost', rentSalaryCost)
        orderStatus.append('othercost', othersCost)
        orderStatus.append('profit', profite)
        fetch(`${fetchUrl}/api/save-report/create/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "POST",
            body: orderStatus

        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    setShowAlert(true)
                    setAlertText(` Save Success`)
                    setAlertVariant('success')
                }
                else {
                    setIsLoading(false)
                    setShowAlert(true)
                    setAlertText(`Fail to Save`)
                    setAlertVariant('danger')
                }

            })
            .catch(() => {
                setIsLoading(false)
                setShowAlert(true)
                setAlertText(`Fail to Save`)
                setAlertVariant('danger')
            })
    }
    return (
        <div>
            <div>
                {isLoading ? <Loading /> : null}
            </div>
            {
                userName && userName[0] && userName[0].is_superuser ?
                    <div className={styles.mainDiv}>
                        <h4 className='btn-dark text-center'>Report Analyzer</h4>


                        <div>
                            <div className='d-flex'>
                                <div className='d-md-flex'>
                                    <div className='col-md-6'>
                                        <div>
                                            <div className={styles.dateTitle}><p>Start Date (dd/mm/yyyy)</p></div>
                                        </div>
                                        <div>
                                            <ReactDatePicker
                                                maxDate={endDate}
                                                selected={startDate}
                                                onChange={data => setStartDate(data)}
                                                dateFormat='dd/MM/yyyy'
                                                className={styles.datepicker}
                                            />
                                        </div>
                                    </div>
                                    <div className='ms-md-5 col-md-6'>
                                        <div>
                                            <div className={styles.dateTitle}><p>End Date (dd/mm/yyyy)</p></div>
                                        </div>
                                        <div>
                                            <ReactDatePicker
                                                minDate={startDate}
                                                maxDate={currentDate}
                                                selected={endDate}
                                                onChange={data => setEndDate(data)}
                                                dateFormat='dd/MM/yyyy'
                                                className={styles.datepicker}

                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='ms-auto mt-5 me-5'>
                                    <Link to='/saved/reports'> <button className='btn btn-outline-danger' type='button'>Saved Repots </button></Link>
                                </div>
                            </div>

                            <div className='m-5'>
                                <h5>Showing Order Data of {startDate.toDateString()} to {endDate.toDateString()}</h5>

                                <div className='row'>
                                    <div className='col-md-6  mb-5'>
                                        <div className={styles.anlyzeRow} >
                                            <div className='d-flex'> <p>Orders</p> <p><b>{selectedOrdersRange.length}</b></p></div>
                                            <div className='d-flex'> <p>Void</p> <p><b>{totalCancellOrders}</b></p></div>
                                            <div className='d-flex'> <p>Pending</p> <p><b>{pendingOrders.length}</b></p></div>
                                            <div className='d-flex'> <p>Confirm</p> <p><b>{orderConfirmQn}</b></p></div>
                                            <div className='d-flex'> <p>Cancel Rate</p> <p><b>{orderConfirmQn}%</b></p></div>
                                            <div className='d-flex'> <p>Item Sell</p> <p><b>{sellItems}</b></p></div>
                                            <div className='d-flex'> <p>Order Ammount</p> <p><b>{orderAmt} tk.</b></p></div>
                                            <div className='d-flex'> <p>Sell Ammount</p> <p><b>{sellAmt} tk.</b></p></div>


                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <div className={styles.anlyzeRow} >
                                            <div className='d-flex'> <p>Due Collect</p> <p><b>{dueCollect} tk.</b></p></div>
                                            <div className='d-flex'> <p>Advance Receive</p> <p><b>{advCollect} tk.</b></p></div>
                                            <div className='d-flex'> <p>Purchase Cost</p> <p><b>{purchaseCost} tk.</b></p></div>
                                            <div className='d-flex'> <p>Shipping Cost</p> <p><b>{courierCost} tk.</b></p></div>
                                            <div className='d-flex'> <p>Retrun Charge</p> <p><b>{returnCharge} tk.</b></p></div>
                                            <div className='d-flex'> <p>Ad Cost</p> <p><b><input className={styles.inputCl} type="number" name="adcost" onChange={handleAdcostInput} id="adcost" value={adCost} /> tk.</b></p></div>
                                            <div className='d-flex'> <p>Rent & Salary</p> <p><b><input className={styles.inputCl} type="number" name="rentcost" onChange={handleRentSalaryCost} id="rentcost" value={rentSalaryCost} /> tk.</b></p></div>
                                            <div className='d-flex'> <p>Others Cost</p> <p><b><input className={styles.inputCl} type="number" name="otherscost" onChange={handleOthersCost} id="otherscost" value={othersCost} /> tk.</b></p></div>
                                            <div className='d-flex'> <p>Profit</p> <p><b>{profite} tk.</b></p></div>
                                        </div>

                                        <div className='mt-3'>
                                            <button onClick={handleSavereport} type='button' className='btn btn-dark col-md-6'>Save Data</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    : null
            }
        </div>
    );
}

export default MonthlyReport;