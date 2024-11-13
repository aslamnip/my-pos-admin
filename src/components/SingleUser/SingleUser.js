/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import styles from './SingleUser.module.css'
import Loading from '../Loading/Loading';

function SingleUser() {
    const { username } = useParams()
    const [userData, setUserData] = useState([])
    const accessToken = localStorage.getItem('access_token')
    // const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        fetch(`${fetchUrl}/api/user/${username}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => { setUserData(data); setIsLoading(false); })
    }, [accessToken, username])


    const [formData, setFormData] = useState({
        username: '',
        name: '',
        phone: '',
        role: 'Sales Manager',
        password: 'x',
        is_staff: true,
    });
    useEffect(() => {
        setFormData((prevInputValue) => ({
            ...prevInputValue,
            username: userData.username,
            name: userData.name,
            phone: userData.phone,
            role: userData.role,
            address: userData.address,
            is_staff: userData.is_staff,


        }));
    }, [userData])
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(userData);
    }

    const [updateUserShow, setUpdateUserShow] = useState(false)
    const [changeUsernameShow, setChangeUsernameShow] = useState(false)
    return (
        <div>
            <div className='NavRow'>
                {isLoading ? <Loading /> : null}
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div className='py-3'>
                                        <h2 className='text-center'>User Informations</h2>
                                    </div>
                                    <div className='row'>
                                        <div className='col-md-6'>
                                            <div className={styles.userinfosec}>
                                                <div>
                                                    Username
                                                </div>
                                                <div>:</div>
                                                <div>
                                                    {userData.username}
                                                </div>
                                            </div>
                                            <div className={styles.userinfosec}>
                                                <div>
                                                    Name
                                                </div>
                                                <div>:</div>
                                                <div>
                                                    {userData.name}
                                                </div>
                                            </div>
                                            <div className={styles.userinfosec}>
                                                <div>
                                                    Phone
                                                </div>
                                                <div>:</div>
                                                <div>
                                                    {userData.phone}
                                                </div>
                                            </div>
                                            <div className={styles.userinfosec}>
                                                <div>
                                                    Address
                                                </div>
                                                <div>:</div>
                                                <div>
                                                    {userData.address}
                                                </div>
                                            </div>
                                            <div className={styles.userinfosec}>
                                                <div>
                                                    Email
                                                </div>
                                                <div>:</div>
                                                <div>
                                                    {userData.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className={styles.userinfosec}>
                                                <div>
                                                    Role
                                                </div>
                                                <div>:</div>
                                                <div>
                                                    {userData.role}
                                                </div>
                                            </div>
                                            <div className={styles.userinfosec}>
                                                <div>
                                                    Basic Salery
                                                </div>
                                                <div>:</div>
                                                <div>
                                                    {userData.basic_salary}
                                                </div>
                                            </div>
                                            <div className={styles.userinfosec}>
                                                <div>
                                                    Total Order
                                                </div>
                                                <div>:</div>
                                                <div>
                                                    {userData.total_orders}
                                                </div>
                                            </div>
                                            <div className={styles.userinfosec}>
                                                <div>
                                                    Commission Type
                                                </div>
                                                <div>:</div>
                                                <div>
                                                    {userData.total_orders}
                                                </div>
                                            </div>
                                            <div className={styles.userinfosec}>
                                                <div>
                                                    Commission Amount
                                                </div>
                                                <div>:</div>
                                                <div>
                                                    {userData.total_orders}
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                </div>
                            </div>
                            <div>
                                <div className='my-5'>
                                    <button onClick={() => { setUpdateUserShow(!updateUserShow) }} className='btn btn-dark ms-4' type='button'>Update User Info</button>
                                    <button onClick={() => setChangeUsernameShow(!changeUsernameShow)} className='btn btn-success ms-3' type='button'>Change Username/ Password</button>
                                </div>
                            </div>
                            <div>
                                {
                                    updateUserShow ?
                                        <div className='pt-5 mt-5'>
                                            <h4 className='ps-5'>Add New User</h4>
                                            <form onSubmit={handleSubmit}>

                                                <div className={styles.formMainDiv}>

                                                    <div>
                                                        <label>Name:</label>
                                                        <input
                                                            className={styles.fromControl}
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleChange}
                                                            placeholder='Name'
                                                        />
                                                    </div>

                                                    <div>
                                                        <label>Phone:</label>
                                                        <input
                                                            className={styles.fromControl}
                                                            type="text"
                                                            name="phone"
                                                            value={formData.phone}
                                                            onChange={handleChange}
                                                            placeholder='Phone'
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>Address:</label>
                                                        <input
                                                            className={styles.fromControl}
                                                            type="text"
                                                            name="address"
                                                            value={formData.address}
                                                            onChange={handleChange}
                                                            placeholder='Address'
                                                        />
                                                    </div>
                                                    <div>
                                                        <label>Email:</label>
                                                        <input
                                                            className={styles.fromControl}
                                                            type="mail"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleChange}
                                                            placeholder='Email'
                                                        />
                                                    </div>
                                                    
                                                    <div className='form-check mt-4'>

                                                        <input
                                                            className='form-check-input mt-3'
                                                            type="checkbox"
                                                            name="is_staff"
                                                            checked={formData.is_staff}
                                                            onChange={handleChange}
                                                        />
                                                        <label className='form-check-label h5'>Has Permission</label>
                                                        <p><small className='text-muted'>এটি আন মার্ক করুন যদি সেল ক্রিয়েট ছাড়া আর কোনো পার্মিশন না দিতে চান</small></p>
                                                    </div>
                                                    <div>
                                                        <label>Role:</label>
                                                        <select className={styles.fromControl} name="role" value={formData.role} onChange={handleChange}>
                                                            <option value="Sales Manager">Sales Manager</option>
                                                            <option value="Admin">Admin</option>
                                                            <option value="Part-Timer">Part-Timer</option>
                                                            <option value="CEO">CEO</option>
                                                            <option value="MD">MD</option>
                                                            <option value="Cashier">Cashier</option>
                                                            <option value="Inventory Manager">Inventory Manager</option>
                                                        </select>
                                                    </div>





                                                    <div>
                                                        <button className={styles.submitButton} type="submit">Submit</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                        : null
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleUser;