
import React, { useEffect, useState, useContext } from 'react';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { fetchUrl } from '../../config';
import styles from './Order.module.css'
import SideNav from '../SideNav/SideNav';
import { AllContext } from '../../AllContext';
import BuklStatusUpdate from './BuklStatusUpdate/BuklStatusUpdate';

function Order() {
    const [orders, setOrders] = useState([]);
    const [edit, setEdit] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const accessToken = localStorage.getItem('access_token')
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [allOrders, setAllOrders] = useState([]);
    const [realOrders, setrealOrders] = useState([]);



    useEffect(() => {
        fetch(`${fetchUrl}/api/order/?ordering=-id&page=${currentPage}`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => { setOrders(data.results); setTotalPages(Math.ceil(data.count / 30)); })
    }, [accessToken, currentPage]);

    useEffect(() => {
        setrealOrders(orders)
    }, [orders])

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };


    const handleUpdateOrderStatus = (id, value) => {

        const orderStatus = new FormData()
        orderStatus.append('order_status', value)
        fetch(`${fetchUrl}/api/order/update/${id}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "PATCH",
            body: orderStatus

        })
            .then(res => {

                if (res.ok) {

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

                setShowAlert(true)
                setAlertText(`Fail to update`)
                setAlertVariant('danger')
            })
    }
    const handleOrderStatus = (id, e) => {
        // setOrderStatusInput(e.target.value)
        setTimeout(() => {
            handleUpdateOrderStatus(id, e.target.value)
        }, 400);
    }
    const [checkArr, setCheckArr] = useState([])
    const handleChecked = (id,data, e) => {
        if (e.target.checked) {
            const x = [...checkArr, id]
            setCheckArr(x)
        }
        else {
            const x = [...checkArr]
            const y = x.indexOf(id)
            x.splice(y, 1)
            setCheckArr(x)

        }
    }



    useEffect(() => {
        fetch(`${fetchUrl}/api/all/order/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => { setAllOrders(data) })
    }, [accessToken,]);


    const serachCustomer = (e) => {
        const newOrder = allOrders.filter(data => data.phone.toString().indexOf(e.target.value.toString()) === 0)
        setrealOrders(e.target.value ? newOrder : allOrders)
    }

    const serachCourier = (e) => {
        const newOrder = allOrders.filter(data => (data.courier.toLowerCase().indexOf(e.target.value.toLowerCase()) === 0))
        const h2l = newOrder.sort((a, b) => parseFloat(b.order_id.slice(4, b.order_id.length)) - parseFloat(a.order_id).slice(4, a.order_id.length))
        setrealOrders(e.target.value ? h2l : allOrders)

    }

    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout'>
                    <h1 className='text-center'>Order List</h1>
                    <div className='text-center mx-auto '>
                        <div className='col-md-8 mx-auto row p-1 '>
                            <input onChange={serachCustomer} type="text" className={`${styles.customform} col-md-4`} placeholder='Search A Number' />
                            <input className={`${styles.customform} col-md-4 mx-md-2`} placeholder='Filter Courier' type="text" onChange={serachCourier} />
                            <button className='btn btn-primary col-md-3' type='button'><Link className='text-light text-decoration-none' to='/order/create/'>Create Order</Link></button>

                        </div>

                    </div>
                    <div className={styles.CustomTable}>
                        <div className={styles.CustomTable2nd}>
                            <div className={styles.cutomRowHeader}>
                                <div className={styles.cutomHeader}>SL</div>
                                <div className={styles.cutomHeader}>Order Id</div>
                                <div className={styles.cutomHeader}>Name</div>
                                <div className={styles.cutomHeader}>Phone</div>
                                <div className={styles.cutomHeader}>Address</div>
                                <div className={styles.cutomHeader}>Note</div>
                                <div className={styles.cutomHeader}>Product</div>
                                <div className={styles.cutomHeader}>Status</div>
                            </div>
                            <div>
                                {
                                    realOrders && realOrders.map((data, index) =>
                                        <div className={styles.cutomRow} key={data.id}>
                                            <div className={styles.cutomRowData} > {edit ?
                                                <input onChange={(e) => handleChecked(data.id, data, e)} className='form-check-input' type="checkbox" name="orderid" id="orderid" />
                                                : index + 1}</div>
                                            <div className={styles.cutomRowData} ><Link className={`${styles.order_link}`} to={`/order/${data.order_id}`}>{data.order_id}</Link></div>
                                            <div className={styles.cutomRowData} >{data.name.slice(0, 15)}</div>
                                            <div className={styles.cutomRowData} >{data.phone} <span>{data.old_customer ? <FontAwesomeIcon className='text-danger' icon={faLightbulb} /> : null}</span></div>
                                            <div className={styles.cutomRowData} >{data.address.slice(0, 30)}</div>
                                            <div className={styles.cutomRowData} ><small>{data.note && data.note.slice(0, 20)}</small></div>
                                            <div className={styles.cutomRowData} >{data.products.slice(0, 20)}</div>
                                            <div className={styles.cutomRowData} >
                                                <select className={styles.select} name="order-status" onChange={(e) => handleOrderStatus(data.id, e)} defaultValue={data.order_status} >
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
                                    )
                                }
                            </div>
                        </div>
                    </div>

                    <div>

                        <div className={styles.pagination}>
                            <Pagination >
                                <Pagination.First onClick={() => setCurrentPage(1)} />
                                <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} />

                                {currentPage > 3 && <Pagination.Ellipsis />}
                                {currentPage > 2 && (
                                    <Pagination.Item onClick={() => setCurrentPage(currentPage - 2)}>
                                        {currentPage - 2}
                                    </Pagination.Item>
                                )}
                                {currentPage > 1 && (
                                    <Pagination.Item onClick={() => setCurrentPage(currentPage - 1)}>
                                        {currentPage - 1}
                                    </Pagination.Item>
                                )}

                                <Pagination.Item active>{currentPage}</Pagination.Item>

                                {currentPage < totalPages && (
                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 1)}>
                                        {currentPage + 1}
                                    </Pagination.Item>
                                )}
                                {currentPage < totalPages - 1 && (
                                    <Pagination.Item onClick={() => setCurrentPage(currentPage + 2)}>
                                        {currentPage + 2}
                                    </Pagination.Item>
                                )}
                                {currentPage < totalPages - 2 && <Pagination.Ellipsis />}

                                <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
                                <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
                            </Pagination>
                        </div>
                    </div>
                    <BuklStatusUpdate edit={edit} setEdit={setEdit} checkArr={checkArr} setCheckArr={setCheckArr} />
                </div>
            </div>
        </div>

    );
}

export default Order;
