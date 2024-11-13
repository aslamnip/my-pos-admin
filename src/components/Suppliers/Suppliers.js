import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { Table } from 'react-bootstrap';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import './Suppliers.css'
import Loading from '../Loading/Loading';

function Suppliers() {
    const accessToken = localStorage.getItem('access_token')
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const [suppliers, setSuppliers] = useState([])
    useEffect(() => {
        fetch(`${fetchUrl}/api/partner/suppliers/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => { setSuppliers(data); setIsLoading(false) })
    }, [accessToken])





    const [searchTerm, setSearchTerm] = useState("");

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone.includes(searchTerm) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    {isLoading ? <Loading /> : null}
                    <div className=''>
                        <div className="supplier-list">
                            <div className="top-bar">
                                <button onClick={() => navigate('/partner/add-supplier')} type='button' className="add-supplier-btn">+ Add Supplier</button>
                                <input
                                    type="text"
                                    className="search-box"
                                    placeholder="Search here"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="table-wrapper">
                                <table className="supplier-table">
                                    <thead>
                                        <tr>
                                            <th>Supplier Code</th>
                                            <th>Name</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Company</th>
                                            <th>Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSuppliers.map(supplier => (
                                            <tr key={supplier.id}>
                                                <td><Link to={`/partner/supplier/${supplier.id}`}>{supplier.supplier_code}</Link></td>
                                                <td><Link to={`/partner/supplier/${supplier.id}`}>{supplier.name}</Link></td>
                                                <td>{supplier.phone}</td>
                                                <td>{supplier.email}</td>
                                                <td>{supplier.company}</td>
                                                <td>{supplier.balance}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Suppliers;