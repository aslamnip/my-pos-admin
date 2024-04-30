import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import CustomTable from '../CustomTable/CustomTable';

function Products() {
    const [products, setProducts] = useState('')
    useEffect(() => {
        fetch(`${fetchUrl}/api/products/?ordering=-id`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [])
    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    <div >
                        <Link to='/product/create'><button type='button' className='btn btn-dark'>Add A New Product</button></Link>
                    </div>
                    <CustomTable tableData={products} />
                </div>
            </div>
        </div>
    );
}

export default Products;