import React, { useState, useContext, useEffect , useLayoutEffect} from 'react';
import { Link } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import CustomTable from '../CustomTable/CustomTable';
import './Products.css'
import { AllContext } from '../../AllContext';
import CustomSelect from '../CustomSelect/CustomeSelect';


function Products() {
    const { products, categories } = useContext(AllContext)
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Select Category');
    const [sortOption, setSortOption] = useState('default');
    const [filterProducts, setFilterProducts] = useState(products)
    const [sortProducts, setSortProducts] = useState(products)

    // Mock data for filtering/sorting (use your API call data here)

    useLayoutEffect(()=>{
        window.scrollTo(0,0)
    },[])
    const handleSearch = (e) => {
    setSearchQuery(e.target.value);
        // Trigger search logic/filtering logic
    };

    const handleSelectChange = (value) => {
        setCategoryFilter(value);
        // Trigger filter logic
    };

    const handleSort = (e) => {
        setSortOption(e.target.value);
        // Trigger sort logic
    };
    useEffect(() => {
        let searchProducts = products
        if (searchQuery) {
            searchProducts = products && products.filter(data => data && data.name && data.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)

        }

        if (categoryFilter === 'Select Category') {
            setFilterProducts(searchProducts)
        }

        else {
            const categoryProducts = searchProducts.filter(data => data.category_name === categoryFilter)
            setFilterProducts(categoryProducts)
        }
    }, [categoryFilter, products, searchQuery])

    useEffect(() => {
        if (sortOption === 'default') {
            const newpd = filterProducts && filterProducts.sort((a, b) => parseFloat(b.id) - parseFloat(a.id)).slice(0)
            setSortProducts(newpd)
        }
        if (sortOption === 'new') {
            const newpd = filterProducts && filterProducts.sort((a, b) => parseFloat(b.id) - parseFloat(a.id)).slice(0)
            setSortProducts(newpd)
        }
        if (sortOption === 'old') {
            const oldpd = filterProducts && filterProducts.sort((a, b) => parseFloat(a.id) - parseFloat(b.id)).slice(0)
            setSortProducts(oldpd)
        }
        if (sortOption === 'pricel2h') {
            const lowestPricePd = filterProducts && filterProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).slice(0)
            setSortProducts(lowestPricePd)
        }
        if (sortOption === 'priceh2l') {
            const lowestPricePd = filterProducts && filterProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)).slice(0)
            setSortProducts(lowestPricePd)
        }

        if (sortOption === 'stockl2h') {
            const lowestStockPd = filterProducts && filterProducts.sort((a, b) => parseFloat(a.stock) - parseFloat(b.stock)).slice(0)
            setSortProducts(lowestStockPd)
        }
        if (sortOption === 'stockh2l') {
            const lowestStockPd = filterProducts && filterProducts.sort((a, b) => parseFloat(b.stock) - parseFloat(a.stock)).slice(0)
            setSortProducts(lowestStockPd)
        }

    }, [filterProducts, sortOption])
    return (
        <div>

            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>

                    <div >
                        <div className="product-page">
                            {/* Top bar with Add button, Search, Filter, Sort */}
                            <div className="top-bar">
                                <Link to='/product/create'>  <button type='button' className="btn-add-product">Add A New Product</button></Link>

                                <div className="filter-group">
                                    <input
                                        type="text"
                                        placeholder="Search Products"
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        className="search-bar"
                                    />
                                    <div style={{ width: '300px' }}>
                                        <CustomSelect notshowValidText options={categories} handleSelectChange={handleSelectChange} defaultOption='Select Category' noSelectValue='Select Category'  />
                                    </div>

                                    <select value={sortOption} onChange={handleSort} className="sort-dropdown">
                                        <option value="default">Sort By</option>
                                        <option value="new">New First</option>
                                        <option value="old">Old First</option>
                                        <option value="pricel2h">Price L-to-H</option>
                                        <option value="priceh2l">Price H-to-L</option>
                                        <option value="stockl2h">Stock L-to-H</option>
                                        <option value="stockh2l">Stock H-to-L</option>
                                    </select>
                                </div>
                            </div>

                            {/* The product list table is already created */}
                            <div className="product-list">
                                {/* Your product table component goes here */}
                            </div>
                        </div>
                    </div>
                    <CustomTable tableData={sortProducts} />
                </div>
            </div>
        </div>
    );
}

export default Products;