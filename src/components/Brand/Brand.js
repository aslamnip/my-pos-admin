import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import styles from './Brand.module.css'
import Loading from '../Loading/Loading';
import { AllContext } from '../../AllContext';

function Brand() {
    const accessToken = localStorage.getItem('access_token')
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(false)
    const [categoryInput, setCategoryInput] = useState('')
    const navigate = useNavigate()

    const [brands, setBrands] = useState([])
    useEffect(() => {
        fetch(`${fetchUrl}/api/brand/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => setBrands(data))
    }, [accessToken])


    const handleCategoryInput = (e) => {
        setCategoryInput(e.target.value)
    }

    const submitCategory = (e) => {
        setIsLoading(true)
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", categoryInput)
        fetch(`${fetchUrl}/api/brand/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'POST',
            body: formData
        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    setCategoryInput('')
                    setShowAlert(true)
                    setAlertText(`'${categoryInput}'  Added Success`)
                    setAlertVariant('success')
                    navigate(0)
                }
                else {
                    setShowAlert(true)
                    setAlertText(`Fail to add`)
                    setAlertVariant('danger')
                }
            })
            .catch(() => {
                setIsLoading(false)
                setShowAlert(true)
                setAlertText(`Fail to add`)
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
                    <div className='row'>
                        <div className='col-md-6  ps-5 mt-5'>
                            <h4 className='my-3'>Add a New Brnad Name</h4>
                            <form onSubmit={submitCategory}>
                                <input className='form-control w-50 mb-3' name='category' type="text" placeholder='New Brand Name' value={categoryInput} onChange={handleCategoryInput} required />
                                <input className='btn btn-dark' type="submit" value="Add" />
                            </form>
                        </div>
                        <div className='col-md-6 order-md-first ps-5 mt-5' >
                            <h5>Brands Name</h5>
                            <div className={styles.category}>
                                <ul>
                                    {
                                        brands && brands.map(data =>
                                            <li key={data.id}><Link className='text-decoration-none' to={`/category/${data.slug}`}>{data.name}</Link></li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Brand;