import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import './Dashboard.css'
import MonthlyReport from './MonthlyReport/MonthlyReport';

function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [userName, setUserName] = useState([]);
    const accessToken = localStorage.getItem('access_token')

    useEffect(() => {
        fetch(`${fetchUrl}/api/employee/own/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => { setUserName(data) })
    }, [accessToken,]);

    useEffect(() => {
        fetch(`${fetchUrl}/api/all/order/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => { setOrders(data) })
    }, [accessToken,]);
    const newOrder = orders.filter(data => data.order_status === 'New')
    const pendingOrder = orders.filter(data => data.order_status === 'Pending')
    const returns = orders.filter(data => data.order_status === 'Return')
    const cancelled = orders.filter(data => data.order_status === 'Cancelled')
    const confirmed = orders.filter(data => data.order_status === 'Confirmed')
    const Couirer = orders.filter(data => data.order_status === 'Courier')
    const Delivered = orders.filter(data => data.order_status === 'Delivered')
    const moneyCollected = orders.filter(data => data.order_status === 'Money Collected')

    const currentDate = new Date();
    const lastMonthDate = new Date(currentDate);
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    const lastMonthOrders = orders.filter(data => {
        const orderDate = new Date(data.order_at);
        return orderDate >= lastMonthDate;
    });

    const LastMonthmoneyCollectedOrders = lastMonthOrders.filter(data => data.order_status === 'Money Collected')
    const LastMonthmonthCancellOrders = lastMonthOrders.filter(data => data.order_status === 'Return' || data.order_status === 'Cancelled')


    const lifeTimeSell = orders.reduce((total, value) => total + value.total_amount, 0)
    const lastMonthOrderAmmount = lastMonthOrders.reduce((total, value) => total + value.total_amount, 0)
    const lastMonthMoneyCollected = LastMonthmoneyCollectedOrders.reduce((total, value) => total + value.total_amount, 0)
    const lastMonthCencellAmt = LastMonthmonthCancellOrders.reduce((total, value) => total + value.total_amount, 0)

    const lastWeekDate = new Date(currentDate);
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);

    const lastWeekOrders = orders.filter(data => {
        const orderDate = new Date(data.order_at);
        return orderDate >= lastWeekDate;
    });

    const lastTwoMonthDate = new Date(currentDate);
    lastTwoMonthDate.setMonth(lastTwoMonthDate.getMonth() - 2);

    const previousOneMonthOrders = orders.filter(data => {
        const orderDate = new Date(data.order_at);
        return orderDate >= lastTwoMonthDate && orderDate <= lastMonthDate;
    });

    ChartJS.register(ArcElement, Tooltip, Legend);
    const data = {
        labels: [`Last Month ${lastMonthOrders.length}`, `Previous Month ${previousOneMonthOrders.length}`],
        datasets: [
            {
                label: 'Order',
                data: [lastMonthOrders.length, previousOneMonthOrders.length],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',

                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const percentageChange = (((lastMonthOrders.length - previousOneMonthOrders.length) / (previousOneMonthOrders.length > 0 ? previousOneMonthOrders.length : 1)) * 100);
    return (
        <div >
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout'>

                    <div className='dahshboardMain'>
                        <div>
                            <h2 className='text-center'>Welcome {userName && userName[0] && userName[0].username}</h2> <h3 className='text-center mb-5'>to Admin Panel</h3>
                        </div>
                        <div className=''>
                            <div className='piechart'>
                                <Pie data={data} />
                            </div>
                            <h6 className='my-3 text-center'>Last Month vs Previous Month order Ratio <span className={percentageChange > 0 ? 'text-success' : 'text-danger'}>{percentageChange.toFixed(2)}%</span></h6>
                            <div className='mt-5 orderCountlist'>
                                <Link className='text-decoration-none text-dark' to='/orders/' >
                                    <div className='dashboardData'>
                                        <p> <b>Total Orders </b></p> <p className='lengthCount'>{orders.length}</p>
                                    </div>
                                </Link>
                                <Link className='text-decoration-none text-dark' to='/orders/new' >
                                    <div className='dashboardData'>
                                        <p> <b>New Orders </b></p> <p className='lengthCount text-warning'>{newOrder.length}</p>
                                    </div>
                                </Link>
                                <Link className='text-decoration-none text-dark' to='/orders/pending' >
                                    <div className='dashboardData'>
                                        <p> <b>Pending Orders </b></p> <p className='lengthCount'>{pendingOrder.length}</p>
                                    </div>
                                </Link>
                                <Link className='text-decoration-none text-dark' to='/orders/return' >
                                    <div className='dashboardData'>
                                        <p> <b>Returns  </b> </p><p className='lengthCount text-light'>{returns.length}</p>
                                    </div>
                                </Link>
                                <Link className='text-decoration-none text-dark' to='/orders/cancelled' >
                                    <div className='dashboardData'>
                                        <p> <b>Cancelled  </b> </p><p className='lengthCount text-light'>{cancelled.length}</p>
                                    </div>
                                </Link>
                                <Link className='text-decoration-none text-dark' to='/orders/confirmed' >
                                    <div className='dashboardData'>
                                        <p> <b>Confirmed  </b> </p><p className='lengthCount text-light'>{confirmed.length}</p>
                                    </div>
                                </Link>
                                <Link className='text-decoration-none text-dark' to='/orders/courier' >
                                    <div className='dashboardData'>
                                        <p> <b>Courier  </b> </p><p className='lengthCount text-light'>{Couirer.length}</p>
                                    </div>
                                </Link>
                                <Link className='text-decoration-none text-dark' to='/orders/delivered' >
                                    <div className='dashboardData'>
                                        <p> <b>Delivered  </b> </p><p className='lengthCount text-light'>{Delivered.length}</p>
                                    </div>
                                </Link>
                                <Link className='text-decoration-none text-dark' to='/orders/money+collected' >
                                    <div className='dashboardData'>
                                        <p> <b>Money Collected  </b> </p><p className='lengthCount text-light'>{moneyCollected.length}</p>
                                    </div>
                                </Link>

                                <div className='dashboardData'>
                                    <p> <b>Last One Week Orders</b> </p><p className='lengthCount'>{lastWeekOrders.length}</p>
                                </div>
                                <div className='dashboardData'>
                                    <p> <b>Last One Month Orders</b> </p><p className='lengthCount'> {lastMonthOrders.length}</p>
                                </div>
                                <div className='dashboardData'>
                                    <p> <b>Previous Month Orders</b> </p><p className='lengthCount'>{previousOneMonthOrders.length}</p>
                                </div>
                                {
                                    userName && userName[0] && userName[0].is_superuser ?
                                        <>
                                            <div className='dashboardData'>
                                                <p> <b>Life Time Sell</b> </p><p className='lengthCount'> {lifeTimeSell} tk.</p>
                                            </div>
                                            <div className='dashboardData'>
                                                <p> <b>Last Month Sell</b> </p><p className='lengthCount'> {lastMonthOrderAmmount} tk.</p>
                                            </div>
                                            <div className='dashboardData'>
                                                <p> <b>Money Collected</b> </p><p className='lengthCount'> {lastMonthMoneyCollected} tk.</p>
                                            </div>
                                            <div className='dashboardData'>
                                                <p> <b>Last Month Cancel Amt</b> </p><p className='lengthCount'> {lastMonthCencellAmt} tk.</p>
                                            </div>
                                        </>
                                        : null
                                }

                            </div>

                        </div>
                    </div>
                    <MonthlyReport userName={userName} orders={orders} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;