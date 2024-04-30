import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faBagShopping, faBars, faBook, faCaravan, faCartShopping, faClose, faCodeBranch, faDashboard, faGift, faImage, faStar, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';
import './SideNav.css'


function SideNav() {
    const [showMenu, setShowMenu] = useState(false)
    const handleMenu = () => {
        setShowMenu(true)
    }
    const route = useNavigate()
const handleLogout = ()=> {
    route("/login")
    localStorage.removeItem('access_token')
    
}
    return (
        <div>
            <div className='mobileNav py-4 px-3' >
                <div className=' d-flex'>
                    <FontAwesomeIcon onClick={handleMenu} size='2x' className='d-flex text-dark' icon={faBars} />
                    <h3 className='ms-auto'>RUPMAHAL</h3>
                </div>
            </div>
            <div className={`navMian ${showMenu ? 'showMenu' : null}`}>

                <div className='d-flex'>
                  <Link className='text-decoration-none text-light' to= "/">  <h2 style={{fontFamily:'monospace', letterSpacing:'7px'}} className='text-light'>RUPMAHAL</h2></Link>
                    
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
            </div >
        </div >

    );
}

export default SideNav;