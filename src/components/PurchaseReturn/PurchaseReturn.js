/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import DatePicker from 'rsuite/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Table, Pagination, Modal } from 'react-bootstrap';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import './PurchaseReturn.css'


// (Optional) Import component styles. If you are using Less, import the `index.less` file. 
import 'rsuite/DatePicker/styles/index.css';
import Loading from '../Loading/Loading';
import ReturnPurchaseForm from './ReturnForm';



function PurchaseHistory() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectDate, setSelectDate] = useState(dayjs().$d);
    const [totalPages, setTotalPages] = useState(1);
    const [purchaseReturnHistory, setPurchaseReturnHistory] = useState(0);
    const accessToken = localStorage.getItem('access_token')
    const [searchQuery, setSearchQuery] = useState('');
    const [searchProducts, setSearchProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    useEffect(() => {
        setSearchProducts(purchaseReturnHistory.results)
    }, [purchaseReturnHistory])
    useEffect(() => {
        if (searchQuery) {
            const searchProductsx = purchaseReturnHistory && purchaseReturnHistory.results && purchaseReturnHistory.results.filter(data => data && data.product_name && data.product_name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 || data.supplier_name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)
            setSearchProducts(searchProductsx)
        }
    }, [purchaseReturnHistory, searchQuery])
    const formattedDate = selectDate && `${selectDate.getFullYear()}-${String(selectDate.getMonth() + 1).padStart(2, "0")}-${String(selectDate.getDate()).padStart(2, "0")}`;


    useEffect(() => {
        fetch(`${fetchUrl}/api/partner/purchase/returns/?${selectDate ? `search=${formattedDate}` : null}&ordering=-id&page=${currentPage}`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => { setPurchaseReturnHistory(data); setTotalPages(Math.ceil(data.count / 30)); setIsLoading(false) })


    }, [accessToken, currentPage, formattedDate, selectDate]);

    const dateFunction = (data) => {
        const dateObj = new Date(data);



        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };

        const humanReadableDateTime = dateObj.toLocaleDateString('en-US', options);
        return humanReadableDateTime
    }

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
    
    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    {isLoading ? <Loading /> : null}
                    <div>
                        <div>
                            <Modal className='mt-md-0 mt-5 pt-2' size='lg' show={show} onHide={handleClose}>
                                <Modal.Header closeButton />
                                <Modal.Body>
                                    <ReturnPurchaseForm setShow={setShow} setIsLoading={setIsLoading} fetchUrl={fetchUrl} accessToken={accessToken} />
                                </Modal.Body>

                            </Modal>
                        </div>
                        <div className='d-md-flex justify-content-between py-md-0 my-4 px-3 ps-md-0 py-5'>
                            <div className='col-md-4 '>
                                <button onClick={handleShow} style={{ fontSize: '20px', padding: '10px' }} className='btn btn-primary  col-md-6 ' type='button'>+ Add Return</button>
                            </div>
                            <div className=''>
                                <div>
                                    <div className='d-md-flex'>
                                        <div className='me-md-2'>
                                            <input
                                                type="text"
                                                placeholder="Search Product Or Supplier Name"
                                                value={searchQuery}
                                                onChange={handleSearch}
                                                className="search-barx"
                                            />
                                        </div>
                                        <div className=' mt-md-0 mt-3'>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    format="LL"
                                                    slotProps={{
                                                        field: { clearable: true, onClear: () => setSelectDate('') },
                                                    }}
                                                    defaultValue={dayjs()}
                                                    onChange={(newValue) => setSelectDate(newValue && newValue.$d)}

                                                />
                                            </LocalizationProvider>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div  > {/* Add responsive wrapper for smaller screens */}
                            <Table responsive >
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th> Supplier Name</th>
                                        <th>Product Name</th>
                                        <th>Quantity</th>
                                        <th>Refund Ammount</th>
                                        <th>Reason</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {searchProducts && searchProducts.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div>
                                                    <Link to={`/partner/supplier/${item.supplier}`}>  {item.supplier_name}</Link>
                                                </div>

                                                <div className=''>
                                                    New Balance <span className='text-primary'> {item.new_balance}</span>
                                                </div>

                                            </td>
                                            <td>
                                                <div>
                                                    <Link to={`/product/${item.product_slug}`}>  {item.product_name}</Link>

                                                </div>
                                                <div className='text-success'>
                                                    {dateFunction(item.return_date)}
                                                </div>
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>
                                                {item.refund_amount}
                                            </td>

                                            <td>{item.reason}</td>

                                        </tr>
                                    ))}

                                </tbody>
                            </Table>
                        </div>
                        <div>
                            <div className='pagination'>
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
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PurchaseHistory;