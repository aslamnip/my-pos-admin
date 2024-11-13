/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';
import styles from './AddUser.module.css'

function AddUser() {
    const accessToken = localStorage.getItem('access_token')
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        phone: '',
        role: 'Sales Manager',
        password: '',
        is_staff: true,
    });
    const route = useNavigate()
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true); // Set loading state to true
        const newForm = new FormData();

        // Append form data
        newForm.append('username', formData.username);
        newForm.append('password', formData.password);
        newForm.append('is_staff', formData.is_staff); // Use the is_staff state
        newForm.append('name', formData.name); // Append name field
        newForm.append('phone', formData.phone); // Append phone field
        newForm.append('role', formData.role); // Append role field

        // Fetch request to your API
        fetch(`${fetchUrl}/api/users/create/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            body: newForm
        })
            .then(res => {
                setIsLoading(false); // Set loading state to false
                if (res.ok) {
                    route('/user/list'); // Navigate to the desired route
                    setShowAlert(true);
                    setAlertText(`User Added Successful`);
                    setAlertVariant('success');
                } else {
                    setShowAlert(true);
                    setAlertText(`Failed to update`);
                    setAlertVariant('danger');
                }
            })
            .catch(() => {
                setIsLoading(false); // Set loading state to false
                setShowAlert(true);
                setAlertText(`Failed to update`);
                setAlertVariant('danger');
            });
    };


console.log(formData);


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
                            <div className='pt-5 mt-5'>
                                <h4 className='ps-5'>Add New User</h4>
                                <form onSubmit={handleSubmit}>

                                    <div className={styles.formMainDiv}>

                                        <div>
                                            <label>Username:</label>
                                            <input
                                                required
                                                className={styles.fromControl}
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder='Username'
                                            />
                                        </div>
                                        <div>
                                            <label>Password:</label>
                                            <input
                                                className={styles.fromControl}
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder='password'
                                            />
                                        </div>
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

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddUser;