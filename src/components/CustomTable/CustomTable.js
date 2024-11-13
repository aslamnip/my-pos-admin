import React from 'react';
import { Link } from 'react-router-dom';
import  {Table} from 'react-bootstrap';
import './CustomTable.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGifts } from '@fortawesome/free-solid-svg-icons';

function CustomTable(props) {
    const { tableData } = props
    return (
       <div  className='product-table-wrapper'>
         <div className="product-table">
            <Table responsive= 'lg'>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Sub-Category</th>
                        <th>Brand</th>
                        <th>Stock</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData && tableData.map((product) => (
                        <tr key={product.id}>
                            <td>{product.product_code}</td>
                            <td>
                               {product && product.image ? <img loading="lazy" src={product.image} alt="x" className="product-image" /> :< FontAwesomeIcon icon={faGifts} />}
                            </td>
                            <td><Link to={`/product/${product.slug}`}>{product.name.slice(0, 30)}</Link></td>
                            <td>{product.category_name.slice(0,20)}</td>
                            <td>{product.sub_category_name ? product.sub_category_name : 'N/A'}</td>
                            <td>{product.brand ? product.brand_name : 'N/A'}</td>
                            <td>{product.stock}</td>
                            <td>{product.price}</td>
                            <td>
                                <button type='button' className="actionx-button">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
       </div>
    );
}

export default CustomTable;