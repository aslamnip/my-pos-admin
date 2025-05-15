/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import DatePicker from 'rsuite/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Table, Pagination } from 'react-bootstrap';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import './PurchaseHistory.css'


// (Optional) Import component styles. If you are using Less, import the `index.less` file. 
import 'rsuite/DatePicker/styles/index.css';
import Loading from '../Loading/Loading';



function PurchaseHistory() {
    const route = useNavigate()
    const [currentPage, setCurrentPage] = useState(1);
    const [selectDate, setSelectDate] = useState(dayjs().$d);
    const [totalPages, setTotalPages] = useState(1);
    const [purchaseHistory, setPurchaseHistory] = useState(0);
    const accessToken = localStorage.getItem('access_token')
    const [searchQuery, setSearchQuery] = useState('');
    const [searchProducts, setSearchProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };
    useEffect(() => {
        setSearchProducts(purchaseHistory.results)
    }, [purchaseHistory])
    useEffect(() => {
        if (searchQuery) {
            const searchProductsx = purchaseHistory && purchaseHistory.results && purchaseHistory.results.filter(data => data && data.product_name && data.product_name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 || data.supplier_name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)
            setSearchProducts(searchProductsx)
        }
    }, [purchaseHistory, searchQuery])
    const formattedDate = selectDate && `${selectDate.getFullYear()}-${String(selectDate.getMonth() + 1).padStart(2, "0")}-${String(selectDate.getDate()).padStart(2, "0")}`;


    useEffect(() => {
        fetch(`${fetchUrl}/api/partner/purchase/?${selectDate ? `search=${formattedDate}` : null}&ordering=-id&page=${currentPage}`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => { setPurchaseHistory(data); setTotalPages(Math.ceil(data.count / 30)); setIsLoading(false) })


    }, [accessToken, currentPage, formattedDate, selectDate]);
    useEffect(() => {
       if(!Loading){
        route(0)
       }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ Loading])
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
                        <div className='d-md-flex justify-content-between py-md-0 my-4 py-5 px-2 px-md-0'>
                            <div className='col-md-4 '>
                                <h2 >Purchase History</h2>
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
                                        <th>Total Cost</th>
                                        <th>Discount</th>
                                        <th>Pay</th>
                                        <th>Due</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {searchProducts && searchProducts.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div>
                                                    <Link to={`/partner/supplier/${item.supplier_id}`}>  {item.supplier_name}</Link>
                                                </div>

                                                <div className=''>
                                                    New Balance <span className='text-primary'> {item.new_blance}</span>
                                                </div>

                                            </td>
                                            <td>
                                                <div>
                                                    <Link to={`/product/${item.product_slug}`}>  {item.product_name}</Link>

                                                </div>
                                                <div className='text-success'>
                                                    {dateFunction(item.date)}
                                                </div>
                                            </td>
                                            <td>{item.total_quantity}</td>
                                            <td>
                                                <div>
                                                    {item.total_price}
                                                </div>
                                                <div>
                                                    <b>CPB: </b> {item.previous_blance}
                                                </div>
                                            </td>
                                            <td>{item.discount}</td>
                                            <td>{item.pay_amount}</td>
                                            <td>{item.due}</td>

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