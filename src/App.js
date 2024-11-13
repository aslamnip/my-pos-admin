import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Dashboard from './components/Dashboard/Dashboard';
import Categories from './components/Categories/Categories';
import SingleCategory from './components/SingleCategory/SingleCategory';
import Products from './components/Products/Products';
import SingleProduct from './components/SingleProduct/SingleProduct';
import Order from './components/Order/Order'
import AllContextProvider from './AllContext';
import Alerts from './components/Alert/Alert';
import ProductCreate from './components/ProductCreate/ProductCreate';
import SingleOrder from './components/SingleOrder/SingleOrder';
import BusinessSetting from './components/BusinessSetting/BusinessSetting';
import Pages from './components/Pages/Pages';
import Ratings from './components/Ratings/Ratings';
import Login from './components/Login/Login';
import Sliders from './components/Sliders/Sliders';
// import Users from './components/Usersx/Users';
import Carts from './components/Carts/Carts';
import OrderSort from './components/OrderSort/OrderSort';
import DeliveryFee from './components/DeliveryFee/DeliveryFee';
import SliderSecond from './components/Sliders/SliderSecond';
import TracingCode from './components/TracingCode/TracingCode';
import OrderCreate from './components/OrderCreate/OrderCreate';
import SavedReport from './components/SavedReport/SavedReport';
import Brand from './components/Brand/Brand';
import Units from './components/Units/Units';
import Warranty from './components/Warranty/Warranty';
import Varriations from './components/Varriations/Varriations';
import Suppliers from './components/Suppliers/Suppliers';
import AddSupplier from './components/Suppliers/AddSupplier/AddSupplier';
import SingleSupplier from './components/Suppliers/SingleSupplier/SingleSupplier';
import Customer from './components/Customer/Customer';
import AddCustomer from './components/Customer/AddCustomer/AddCustomer';
import SingleCustomer from './components/Customer/SingleCustomer/SingleCustomer';
import AddUser from './components/AddUser/AddUser';
import Users from './components/Users/Users';
import SingleSubCategory from './components/SingleSubCategory/SingleSubCategory';
import SingleUser from './components/SingleUser/SingleUser';




function App() {
  const accessToken = localStorage.getItem('access_token')
  return (
    <AllContextProvider >
      <Router>
        <Alerts />
        <Routes>
          <Route element={<ProtectedRoutes />} >
            <Route path='/' element={<Dashboard />} />
            <Route path='/categories/' element={< Categories />} />
            <Route path='/brands/' element={< Brand />} />
            <Route path='/units/' element={< Units />} />
            <Route path='/warranties/' element={< Warranty />} />
            <Route path='/variation/' element={< Varriations />} />
            <Route path='/category/:slug' element={< SingleCategory />} />
            <Route path='/sub_category/:id' element={< SingleSubCategory />} />
            <Route path='/products/' element={< Products />} />
            <Route path='/product/:slug' element={< SingleProduct />} />
            <Route path='/product/create' element={< ProductCreate />} />
            <Route path='/partner/suppliers' element={< Suppliers />} />
            <Route path='/partner/add-supplier' element={< AddSupplier />} />
            <Route path='/partner/supplier/:partnerId' element={< SingleSupplier />} />
            <Route path='/partner/customers' element={< Customer />} />
            <Route path='/partner/add-customer' element={< AddCustomer />} />
            <Route path='/partner/customer/:partnerId' element={< SingleCustomer />} />
            <Route path='/orders/' element={<Order />} />
            <Route path='/orders/:orderSort' element={<OrderSort />} />
            <Route path='/order/:orderId' element={<SingleOrder />} />
            <Route path='/order/create/' element={<OrderCreate />} />
            <Route path='/business_setting/' element={<BusinessSetting />} />
            <Route path='/ratings/' element={<Ratings />} />
            <Route path='/pages/' element={<Pages />} />
            <Route path='/sliders/' element={<Sliders />} />
            <Route path='/slider_second/' element={<SliderSecond />} />
            <Route path='/users/' element={<Users />} />
            <Route path='/carts/' element={<Carts />} />
            <Route path='/user/new' element={<AddUser />} />
            <Route path='/user/list' element={<Users />} />/
            <Route path='/user/:username' element={<SingleUser />} />/
            <Route path='/delivery_fee/' element={<DeliveryFee />} />
            <Route path='/tracking-code/' element={<TracingCode />} />
            <Route path='/saved/reports' element={<SavedReport />} />
          </Route>


          <Route path='/login/' element={accessToken ? <Navigate to="/" /> : <Login />} />
        </Routes>
      </Router>
    </AllContextProvider>
  );
};

export default App;


function ProtectedRoutes() {
  const accessToken = localStorage.getItem('access_token')
  return accessToken ? <Outlet /> : <Navigate to="/login" />
}
