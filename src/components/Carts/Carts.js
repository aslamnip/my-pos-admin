/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */

import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';

function Carts() {
    const [products, setProducts] = useState([])
    const [carts, setCarts] = useState([])
    const accessToken = localStorage.getItem('access_token')
    useEffect(() => {
        fetch(`${fetchUrl}/api/cart/all/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => setCarts(data))
    }, [accessToken])
    useEffect(() => {
        fetch(`${fetchUrl}/api/products/`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [])
    const cartProducts = carts.length > 0 ? carts.map(dt => {
        const yy = products.find(data => {
            if (dt.product_id === data.id) {
                data.in_cart = dt.total_quantity
                return data
            }
        })
        return yy  
    }) : []


    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    <div>
                        <Table striped hover responsive="md">
                            <thead>
                                <tr>
                                    <th>Product id</th>
                                    <th>Product </th>
                                    <th>Added In Cart</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartProducts && cartProducts.map(data =>
                                    data &&
                                    <tr key={data.product_code}>
                                        <td><Link to={`/product/${data.slug}`} className='text-decoration-none'>{data.product_code}</Link></td>
                                        <td>{data.name}</td>
                                        <td>{data.in_cart} Times</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Carts;