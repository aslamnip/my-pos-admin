import React from 'react';
import SideNav from '../SideNav/SideNav';
import ProductFrom from '../ProductFrom/ProductFrom';

function ProductCreate() {
    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    <ProductFrom method = "POST" postUrl = 'products/create/' />
                </div>
            </div>
        </div>
    );
}

export default ProductCreate;