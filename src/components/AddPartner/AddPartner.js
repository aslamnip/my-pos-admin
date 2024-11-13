/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUrl } from '../../config';
import SideNav from '../SideNav/SideNav';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';
import styles from './AddPartner.module.css'
import DeleteModal from '../DeleteModal/DeleteModal';

function AddPartner(props) {
    const { fetchPartnerUrl, postMethod, submitButton, succeessUrl } = props
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const accessToken = localStorage.getItem('access_token')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [partnerData, setPartnerData] = useState({})
    const [inputValue, setInputValue] = useState({
        name: '',
        phone: '',
        email: '',
        company: '',
        address: '',
        notes: '',

    });



    useEffect(() => {
        if (postMethod === 'PATCH') {
            fetch(`${fetchUrl}/${fetchPartnerUrl}`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
            })
                .then(res => res.json())
                .then(data => { setPartnerData(data); setIsLoading(false) })
        }
    }, [accessToken, fetchPartnerUrl, postMethod, isLoading])

    useEffect(() => {
        setInputValue((prevInputValue) => ({
            ...prevInputValue,
            name: partnerData.name,
            phone: partnerData.phone,
            email: partnerData.email,
            company: partnerData.company,
            address: partnerData.address,
            notes: partnerData.notes,


        }));
    }, [partnerData])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValue({ ...inputValue, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        const formData = new FormData();
        Object.keys(inputValue).forEach((key) => {
            formData.append(key, inputValue[key]);
        });

        try {
            const response = await fetch(`${fetchUrl}/${fetchPartnerUrl}`, {
                method: postMethod,
                body: formData,
                headers: { "Authorization": `Bearer ${accessToken}` },
            });

            if (response.ok) {
                setIsLoading(false)
                setShowAlert(true)
                setAlertText(`Update Success`)
                setAlertVariant('success')
                if (postMethod === 'PATCH') {
                    setInputValue({
                        name: '',
                        phone: '',
                        email: '',
                        company: '',
                        address: '',
                        notes: '',
                    });
                }
            } else {
                setShowAlert(true)
                setAlertText(`Fail to update`)
                setAlertVariant('danger');
            }
        } catch (error) {
            console.error('Error:', error);
            setShowAlert(true)
            setAlertText(`Fail to add`)
            setAlertVariant('danger');
            setIsLoading(false)
        }
    };
    const deletePartnaer = () => {
        setIsLoading(true)
        fetch(`${fetchUrl}/${fetchPartnerUrl}`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'DELETE'
        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    navigate(succeessUrl)
                    setShowAlert(true)
                    setAlertText(` Delete Success`)
                    setAlertVariant('success')
                }
                else {
                    setShowAlert(true)
                    setAlertText(`Fail to update`)
                    setAlertVariant('danger')
                }
            })
            .catch(() => {
                setIsLoading(false)
                setShowAlert(true)
                setAlertText(`Fail to update`)
                setAlertVariant('danger')
            })
    }

    const [inputPayment, setInputPayment] = useState('')

    const updatePayment = () => {
        const formData = new FormData()
        formData.append('balance', Number(partnerData.balance) + Number(inputPayment))
        setIsLoading(true)
        fetch(`${fetchUrl}/${fetchPartnerUrl}`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'PATCH',
            body: formData,
        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    setShowAlert(true)
                    setAlertText(` Update Success`)
                    setAlertVariant('success')
                    setInputPayment('')
                }
                else {
                    setShowAlert(true)
                    setAlertText(`Fail to update`)
                    setAlertVariant('danger')
                }
            })
            .catch(() => {
                setIsLoading(false)
                setShowAlert(true)
                setAlertText(`Fail to update`)
                setAlertVariant('danger')
            })
    }
    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    {isLoading ? <Loading /> : null}
                    <div className='m-3  '>

                        <div className={styles.containerx}>
                            <div> 
                                {
                                    postMethod === 'PATCH' ?

<div className='row'>
                                <div className='my-5 col-md-6'>
                                    <h2 className='text-success my-3'>INFORMATION</h2>
                                    <p>Name : {partnerData.name}</p>
                                    <p>Join Date : {partnerData.date_joined}</p>
                                    <p>{partnerData.balance < 0 ? 'Due' : 'Balance'} : <span className='text-danger'>{partnerData.balance} tk</span></p>
                                    <p>{partnerData && partnerData.total_purchase ? ` Sold to Customer : ${partnerData.total_purchase} tk` : null}</p>
                                    <p>{partnerData && partnerData.total_sell_to_me ? ` Sold To Me : ${partnerData.total_sell_to_me} tk` : null}</p>
                                </div>
                                <div className='col-md-6 my-5 '>
                                    <div className='col-md-6'>
                                        <h3 className='my-3 text-success'>Add a payment</h3>
                                        <input value={inputPayment} onChange={(e) => setInputPayment(e.target.value)} type="number" placeholder='Payment Ammount' className='form-control mt-5 ' />
                                        <button onClick={updatePayment} type='button' className='btn btn-success w-100  mt-3'>Add Payment</button>
                                    </div>
                                </div>
                            </div>
                                    : null
                                }
                            </div>
                            
                            <div>
                                <div className='d-md-flex'>
                                    <h2 className='my-5'>{submitButton}</h2>
                                    <div className='my-5 ms-auto pe-5'>
                                        {
                                            postMethod === 'PATCH' ?
                                                <DeleteModal className='btn-dark' iconText='DELETE' warning={`Are you sure to delete- ${partnerData.name}`} handlefunction={deletePartnaer} />
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className={styles.secondContainer}>
                                    <div className={styles.fromGroup}>
                                        <label htmlFor='supplier-name'>Supplier Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={inputValue.name}
                                            onChange={handleInputChange}
                                            className={styles.fromControl}
                                            placeholder='Mr Ali'
                                            required
                                        />
                                    </div>

                                    <div className={styles.fromGroup}>
                                        <label htmlFor='supplier-phone'>Phone</label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={inputValue.phone}
                                            onChange={handleInputChange}
                                            className={styles.fromControl}
                                            placeholder='Phone Number'
                                            required
                                        />
                                    </div>

                                    <div className={styles.fromGroup}>
                                        <label htmlFor='supplier-email'>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={inputValue.email}
                                            onChange={handleInputChange}
                                            className={styles.fromControl}
                                            placeholder='demo@email.com'
                                        />
                                    </div>

                                    <div className={styles.fromGroup}>
                                        <label htmlFor='supplier-code'>Company</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={inputValue.company}
                                            onChange={handleInputChange}
                                            className={styles.fromControl}
                                            placeholder='Company Name'
                                        />
                                    </div>

                                    <div className={styles.fromGroup}>
                                        <label htmlFor='product-code'>Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={inputValue.address}
                                            onChange={handleInputChange}
                                            className={styles.fromControl}
                                            placeholder='Address'
                                        />
                                    </div>
                                    <div className={styles.fromGroup}>
                                        <label htmlFor='product-code'>Note</label>
                                        <input
                                            type="text"
                                            name="notes"
                                            value={inputValue.notes}
                                            onChange={handleInputChange}
                                            className={styles.fromControl}
                                            placeholder='Special Note'
                                        />
                                    </div>
                                </div>

                                <div className={styles.buttonDiv}>
                                    <input className={styles.submitButton} type="submit" value={submitButton} />
                                </div>

                            </form>


                        </div>
                    </div>
                </div>
            </div>
        </div>


    )

}
export default AddPartner
