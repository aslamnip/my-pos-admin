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
import MyAddress from './components/MyAddress/MyAddress';
import Pages from './components/Pages/Pages';
import Ratings from './components/Ratings/Ratings';
import Login from './components/Login/Login';
import Sliders from './components/Sliders/Sliders';
import Users from './components/Users/Users';
import Carts from './components/Carts/Carts';
import Employee from './components/Employee/Employee';
import OrderSort from './components/OrderSort/OrderSort';
import DeliveryFee from './components/DeliveryFee/DeliveryFee';
import SliderSecond from './components/Sliders/SliderSecond';
import TracingCode from './components/TracingCode/TracingCode';
import OrderCreate from './components/OrderCreate/OrderCreate';
import SavedReport from './components/SavedReport/SavedReport';




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
            <Route path='/category/:slug' element={< SingleCategory />} />
            <Route path='/products/' element={< Products />} />
            <Route path='/product/:slug' element={< SingleProduct />} />
            <Route path='/product/create' element={< ProductCreate />} />
            <Route path='/orders/' element={<Order />} />
            <Route path='/orders/:orderSort' element={<OrderSort />} />
            <Route path='/order/:orderId' element={<SingleOrder />} />
            <Route path='/order/create/' element={<OrderCreate />} />
            <Route path='/address/' element={<MyAddress />} />
            <Route path='/ratings/' element={<Ratings />} />
            <Route path='/pages/' element={<Pages />} />
            <Route path='/sliders/' element={<Sliders />} />
            <Route path='/slider-second/' element={<SliderSecond />} />
            <Route path='/users/' element={<Users />} />
            <Route path='/carts/' element={<Carts />} />
            <Route path='/employees/' element={<Employee />} />
            <Route path='/delivery-fee/' element={<DeliveryFee />} />
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
