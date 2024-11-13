/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable consistent-return */
import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faDashboard, faHome, faUser, faGift, faUsd, faCar, faCogs, faTty, faBook, faSmile, faMoneyBillAlt, faSignOut } from '@fortawesome/free-solid-svg-icons';

// import { faAddressCard, faBagShopping, faBars, faBook, faCaravan, faCartShopping, faClose, faCodeBranch, faDashboard, faGift, faImage, faStar, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { Sidebar, Menu, MenuItem, SubMenu, menuClasses, } from 'react-pro-sidebar';
import './SideNav.css'
import { AllContext } from '../../AllContext';


// import OrderNotifications from '../OrderNotifications/OrderNotifications';


function SideNav() {
    const { collapsed, setCollapsed, myBusiness } = useContext(AllContext)
    document.title = myBusiness.business_title ? myBusiness.business_title : 'My POS'
    const handleCollapsed = () => {
        setCollapsed(!collapsed);
        const sidebar = document.getElementsByClassName("bodyLayout")[0];
        sidebar.classList.toggle("collapsed");  // Toggles the 'collapsed' class
    }
    const locationx = useLocation('/')

    // const handleMenu = () => {
    //     setShowMenu(true)
    // }
    // const route = useNavigate()
    // const handleLogout = () => {
    //     route("/login")
    //     localStorage.removeItem('access_token')

    // }

    const [toggle, setToggle] = useState(false)
    const handleMenuIcon = () => {
        setToggle(!toggle)
    }
    const SidebarCss = {
        color: 'white',
        backgroundColor: 'black',
        height: '100vh',
        position: 'fixed',
        paddingRight: '8px'
    }
    return (
        <div>
            <div className='mobileNav' >
                <div>
                    <h3 className='text-light'>{myBusiness.business_title}</h3>
                </div>
                <div>
                    <div onClick={() => handleMenuIcon()} className="container">


                        <div className={toggle ? 'bar1 change1' : 'bar1'} />
                        <div className={toggle ? 'bar1 change2' : 'bar2'} />
                        <div className={toggle ? 'bar3 change3' : 'bar3'} />

                    </div>
                </div>
            </div>
            <Sidebar
                toggled={toggle}
                breakPoint='xl'
                collapsed={collapsed}
                rootStyles={SidebarCss}
                width='250px'
                backgroundColor='black'

            >
                <div >

                    <Menu
                        menuItemStyles={{
                            button: ({ level }) => {
                                if (level === 0)
                                    return {
                                        background: 'none',
                                        padding: '0',
                                        marginTop: '15px',
                                        marginBottom: '15px',
                                        '&:hover': {
                                            background: 'none',
                                        },

                                    };
                            },
                        }}
                    >
                        <MenuItem >
                            {!collapsed ?
                                <div className='titleSec'>
                                    <h5> <FontAwesomeIcon icon={faHome} /> {myBusiness.business_title}</h5>
                                    <button
                                        onClick={handleCollapsed}
                                        style={{
                                            color: 'white',
                                            marginLeft: '50px',
                                            transition: '1s',
                                            border: '1px solid white',
                                            background: 'none'
                                        }}
                                        type='button'
                                        className="sb-button" >
                                        <FontAwesomeIcon icon={faAngleLeft} />
                                    </button>
                                </div>
                                :
                                <button
                                    onClick={handleCollapsed}
                                    style={{
                                        color: 'white',
                                        transition: '1s',
                                        border: '1px solid white',
                                        background: 'none',
                                        marginLeft: '10px',
                                        padding: '3px 10px',
                                        margin: '20px'
                                    }}
                                    type='button'
                                    className="sb-button" >
                                    <FontAwesomeIcon icon={faAngleRight} />
                                </button>}

                        </MenuItem>
                    </Menu>


                </div>
                <Menu
                    menuItemStyles={{
                        button: ({ level, active, }) => {
                            if (level === 0)
                                return {
                                    color: 'white',
                                    border: ` 0.5px solid rgba(255, 255, 255, 0.273)`,
                                    margin: `5px 0`,
                                    'a': {
                                        color: 'white',
                                        textDecoration: 'none',

                                    },
                                    '&:hover': {
                                        border: '1px solid white',
                                        background: ' rgb(1, 70, 110)',
                                    },

                                    background: active ? 'rgba(79, 149, 189, 0.359)' : 'none',

                                };
                        },
                    }}
                >
                    <MenuItem
                        active={locationx.pathname === '/'}
                        icon={<FontAwesomeIcon className='iconDs' icon={faDashboard} />}
                        component={<Link to="/" />}>
                        Dashboard
                    </MenuItem>
                    <SubMenu
                        icon={<FontAwesomeIcon className='iconDs' icon={faUser} />}
                        label='Users'
                        rootStyles={{

                            [`.${menuClasses.subMenuContent}`]: {
                                backgroundColor: 'white',
                                color: 'black',
                            },

                        }}
                    >
                        <MenuItem > Admin</MenuItem>
                        <MenuItem component={<Link to="/user/list" />} > User List  </MenuItem>
                        {/* <MenuItem> Part Timer </MenuItem> */}
                        <MenuItem component={<Link to="/user/new" />}> Add a User</MenuItem>
                    </SubMenu>
                    <SubMenu
                        active={
                            locationx.pathname === '/partner/suppliers' ||
                            locationx.pathname.indexOf('/partner/supplier/') !== -1 ||
                            locationx.pathname === '/partner/add-supplier' ||
                            locationx.pathname === "/partner/customers" ||
                            locationx.pathname.indexOf('/partner/customer/') !== -1 ||
                            locationx.pathname === "/partner/add-customer" 
                        
                    }
                    icon={<FontAwesomeIcon className='iconDs' icon={faTty} />}
                    label='Partners'
                    rootStyles={{

                        [`.${menuClasses.subMenuContent}`]: {
                            backgroundColor: 'white',
                            color: 'black',
                        },

                    }}
                    >
                    <MenuItem component={<Link to="/partner/suppliers" />}> Suppliers</MenuItem>
                    <MenuItem component={<Link to="/partner/add-supplier" />}> Add Supplier  </MenuItem>
                    <MenuItem component={<Link to="/partner/customers" />}> Customers  </MenuItem>
                    <MenuItem component={<Link to="/partner/add-customer" />}>Add Customers  </MenuItem>
                </SubMenu>


                <SubMenu
                    active={
                        locationx.pathname === '/products' ||
                        locationx.pathname === "/product/create" ||
                        locationx.pathname === "/categories/" ||
                        locationx.pathname === "/brands/" ||
                        locationx.pathname === "/variation/" ||
                        locationx.pathname === "/warranties/" ||
                        locationx.pathname === "/units/"
                    }
                    icon={<FontAwesomeIcon className='iconDs' icon={faGift} />}
                    label='Products'
                    rootStyles={{

                        [`.${menuClasses.subMenuContent}`]: {
                            backgroundColor: 'white',
                            color: 'black',

                        },

                    }}
                >
                    <MenuItem component={<Link to="/products" />}> Products List</MenuItem>
                    <MenuItem component={<Link to="/product/create" />}> Add Product  </MenuItem>
                    <MenuItem component={<Link to='/categories/' />}> Categories </MenuItem>
                    {/* <MenuItem component={<Link to='/variation/' />}>Variation </MenuItem> */}
                    <MenuItem component={<Link to='/units/' />}> Units </MenuItem>
                    <MenuItem component={<Link to='/warranties/' />}> Warrenty  </MenuItem>
                    <MenuItem component={<Link to='/brands/' />}> Brands </MenuItem>
                </SubMenu>

                <SubMenu
                    active={locationx.pathname === '/sales'}
                    icon={<FontAwesomeIcon className='iconDs' icon={faUsd} />}
                    label='Purchase'
                    rootStyles={{

                        [`.${menuClasses.subMenuContent}`]: {
                            backgroundColor: 'white',
                            color: 'black',
                        },

                    }}
                >
                    <MenuItem > Purchase History </MenuItem>
                    <MenuItem> Add Purchase </MenuItem>
                    <MenuItem> Purchase Return  </MenuItem>
                </SubMenu>


                <SubMenu
                    active={locationx.pathname === '/sales'}
                    icon={<FontAwesomeIcon className='iconDs' icon={faUsd} />}
                    label='Sales'
                    rootStyles={{

                        [`.${menuClasses.subMenuContent}`]: {
                            backgroundColor: 'white',
                            color: 'black',
                        },

                    }}
                >
                    <MenuItem > Sales List </MenuItem>
                    <MenuItem> New Sales </MenuItem>
                    <MenuItem> Advance Booking </MenuItem>
                    <MenuItem> Sales Return </MenuItem>
                    <MenuItem> Delivery Options </MenuItem>
                    <MenuItem> Courier List </MenuItem>
                    <MenuItem> Payment Method </MenuItem>
                </SubMenu>

                <MenuItem
                    active={locationx.pathname === '/s'}
                    icon={<FontAwesomeIcon className='iconDs' icon={faCar} />}
                    component={<Link to="/" />}>
                    Stocks Adjust
                </MenuItem>
                <SubMenu
                    active={locationx.pathname === '/sales'}
                    icon={<FontAwesomeIcon className='iconDs' icon={faMoneyBillAlt} />}
                    label='Expense'
                    rootStyles={{

                        [`.${menuClasses.subMenuContent}`]: {
                            backgroundColor: 'white',
                            color: 'black',
                        },

                    }}
                >
                    <MenuItem > Exoense List </MenuItem>
                    <MenuItem> New Sales </MenuItem>
                    <MenuItem> Advance Booking </MenuItem>
                </SubMenu>

                <SubMenu
                    active={locationx.pathname === '/sales'}
                    icon={<FontAwesomeIcon className='iconDs' icon={faBook} />}
                    label='Reports'
                    rootStyles={{

                        [`.${menuClasses.subMenuContent}`]: {
                            backgroundColor: 'white',
                            color: 'black',
                        },

                    }}
                >
                    <MenuItem> Profit </MenuItem>
                    <MenuItem > Purschase Report </MenuItem>
                    <MenuItem>  Sales Sales Report</MenuItem>
                    <MenuItem>  Products Report</MenuItem>
                    <MenuItem> Expense Report </MenuItem>
                    <MenuItem> Supplier Report  </MenuItem>
                    <MenuItem> Customer Report </MenuItem>

                </SubMenu>

                <SubMenu
                    active={locationx.pathname === '/sales'}
                    icon={<FontAwesomeIcon className='iconDs' icon={faSmile} />}
                    label='HRM'
                    rootStyles={{

                        [`.${menuClasses.subMenuContent}`]: {
                            backgroundColor: 'white',
                            color: 'black',
                        },

                    }}
                >
                    <MenuItem > Employees  </MenuItem>
                    <MenuItem> New Sales </MenuItem>
                    <MenuItem> Advance Booking </MenuItem>
                </SubMenu>

                <SubMenu
                    active={locationx.pathname === '/business_setting/'}
                    icon={<FontAwesomeIcon className='iconDs' icon={faCogs} />}
                    label='Setting'
                    rootStyles={{

                        [`.${menuClasses.subMenuContent}`]: {
                            backgroundColor: 'white',
                            color: 'black',
                        },

                    }}
                >
                    <MenuItem component={<Link to='/business-setting/' />}> Business Info </MenuItem>

                    <MenuItem > Sales Setting </MenuItem>
                    <MenuItem> Invoice Setting </MenuItem>
                </SubMenu>
            </Menu>

            <div>
                <Menu
                    menuItemStyles={{
                        button: ({ level }) => {
                            if (level === 0)
                                return {
                                    background: 'none',
                                    padding: '0',
                                    marginTop: '15px',
                                    marginBottom: '15px',
                                    '&:hover': {
                                        background: 'none',
                                    },

                                };
                        },
                    }}
                >
                    <MenuItem
                        icon={<FontAwesomeIcon icon={faSignOut} />}
                    >
                        Log Out
                    </MenuItem>
                </Menu>

            </div>
        </Sidebar>
            {/* <OrderNotifications/> */ }
    {/* <div className='mobileNav py-4 px-3' >
                <div className=' d-flex'>
                    <FontAwesomeIcon onClick={handleMenu} size='2x' className='d-flex text-dark' icon={faBars} />
                    <h3 className='ms-auto'>BACHAI</h3>
                </div>
            </div>
            <div className={`navMian ${showMenu ? 'showMenu' : null}`}>

                <div className='d-flex'>
                    <Link className='text-decoration-none text-light' to="/">  <h2 style={{ fontFamily: 'monospace', letterSpacing: '7px' }} className='text-light'>BACHAI</h2></Link>

                    <button onClick={() => setShowMenu(false)} className={` ${showMenu ? 'showClose' : 'hideClose'}`} type='button'><FontAwesomeIcon icon={faClose} /></button>
                </div>
            
                <div className='navList'>
                    <ul>

                        <Link onClick={() => setShowMenu(false)} to='/'><li><FontAwesomeIcon className='iconDs' icon={faDashboard} />  Dashboard </li> </Link>


                        <Link onClick={() => setShowMenu(false)} to='/categories'><li><FontAwesomeIcon className='iconDs' icon={faBars} />   Categories </li> </Link>


                        <Link onClick={() => setShowMenu(false)} to='/products'><li><FontAwesomeIcon className='iconDs' icon={faGift} />  Products </li> </Link>


                        <Link onClick={() => setShowMenu(false)} to='/orders/'><li><FontAwesomeIcon className='iconDs' icon={faBagShopping} />   Orders </li> </Link>


                        <Link onClick={() => setShowMenu(false)} to='/Ratings/'><li><FontAwesomeIcon className='iconDs' icon={faStar} />   Ratings </li> </Link>


                        <Link onClick={() => setShowMenu(false)} to='/address/'><li><FontAwesomeIcon className='iconDs' icon={faAddressCard} />  My Address </li> </Link>


                        <Link onClick={() => setShowMenu(false)} to='/pages'><li><FontAwesomeIcon className='iconDs' icon={faBook} />  Pages </li> </Link>


                        <Link onClick={() => setShowMenu(false)} to='/sliders'><li><FontAwesomeIcon className='iconDs' icon={faImage} />  Sliders </li> </Link>


                        <Link onClick={() => setShowMenu(false)} to='/slider-second/'><li><FontAwesomeIcon className='iconDs' icon={faImage} /> Second Slider  </li> </Link>

                        <Link onClick={() => setShowMenu(false)} to='/employees'><li><FontAwesomeIcon className='iconDs' icon={faUserTie} />  Employees </li> </Link>


                        <Link onClick={() => setShowMenu(false)} to='/users'><li><FontAwesomeIcon className='iconDs' icon={faUser} />  Users </li> </Link>


                        <Link onClick={() => setShowMenu(false)} to='/carts'><li><FontAwesomeIcon className='iconDs' icon={faCartShopping} />  Cart </li> </Link>

                        <Link onClick={() => setShowMenu(false)} to='/delivery-fee'><li><FontAwesomeIcon className='iconDs' icon={faCaravan} />  Delivery Fee </li> </Link>

                        <Link onClick={() => setShowMenu(false)} to='/tracking-code'><li><FontAwesomeIcon className='iconDs' icon={faCodeBranch} />  Tracking Code </li> </Link>
                    </ul>
                </div >
                <div className='btn-logout'>
                    <button onClick={handleLogout} type='button'>Log out</button>
                </div>
            </div > */}
        </div >

    );
}

export default SideNav;