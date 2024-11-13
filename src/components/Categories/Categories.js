/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-expressions */
import React, { useState, useContext, useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import styles from './Categories.module.css'
import Loading from '../Loading/Loading';
import { AllContext } from '../../AllContext';
import CustomSelect from '../CustomSelect/CustomeSelect';

function Categories() {
    const accessToken = localStorage.getItem('access_token')
    const { setShowAlert, setAlertText, setAlertVariant, categories } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(false)
    const [categoryInput, setCategoryInput] = useState('')
    const [subCategoryInput, setSubCategoryInput] = useState('')
    const [selectCategory, setSelectcategory] = useState('')
    const navigate = useNavigate()


    useLayoutEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleCategoryInput = (e) => {
        setCategoryInput(e.target.value)
    }
    const handleSubCategoryInput = (e) => {
        setSubCategoryInput(e.target.value)
    }

    const submitCategory = (e) => {
        setIsLoading(true)
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", categoryInput)
        fetch(`${fetchUrl}/api/categories/`, {
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
    const handleSelectCategory = (value) => {
        const findX = categories.find(data => data.name === value);

        // If a matching category is found, return its id, otherwise null
        const categoryId = findX ? findX.id : null;

        // Set the categoryId as the selected category
        setSelectcategory(categoryId);
    }

    const submitSubCategory = (e) => {
        setIsLoading(true)
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", subCategoryInput)
        formData.append("category", selectCategory)
        console.log(formData);
        fetch(`${fetchUrl}/api/sub_categories/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'POST',
            body: formData
        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    setCategoryInput('')
                    setShowAlert(true)
                    setAlertText(`'${subCategoryInput}'  Added Success`)
                    setAlertVariant('success')
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
                            <h4 className='my-3'>Add a New Category</h4>
                            <form onSubmit={submitCategory}>
                                <input className='form-control w-50 mb-3' name='category' type="text" placeholder='New Category' value={categoryInput} onChange={handleCategoryInput} required />
                                <input className='btn btn-dark' type="submit" value="Add" />
                            </form>
                        </div>
                        <div className='col-md-6 order-md-first ps-5 mt-5' >
                            <h5>Categories</h5>
                            <div className={styles.category}>
                                <ul>
                                    {
                                        categories && categories.map(data =>
                                            <li key={data.id}><Link className='text-decoration-none' to={`/category/${data.slug}`}>{data.name}</Link></li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className='row'>
                        <div className='col-md-6  ps-5 mt-5'>
                            <h4 className='my-3 '>Add a Sub Category</h4>
                            <form onSubmit={submitSubCategory}>
                                <div className='my-3 w-50'>
                                    < CustomSelect options={categories}  defaultOption='Select Category' noSelectValue='Select Category' handleSelectChange={handleSelectCategory} />
                                </div>
                                <input className='form-control w-50 mb-3' name='subcategory' type="text" placeholder='Sub Category' value={subCategoryInput} onChange={handleSubCategoryInput} required />
                                <input className='btn btn-dark' type="submit" value="Add" />
                            </form>
                        </div>
                        <div className='col-md-6 order-md-first ps-5 mt-5' >
                            <h5>Sub Categories</h5>
                            <div className={styles.category}>
                                <ul style={{ listStyleType: 'circle' }}>
                                    {
                                        categories && categories.map(data =>
                                            <li className='my-4 p-2  border-bottom' key={data.id}>{data.name}
                                                <ul>
                                                    {
                                                        data.subcategories && data.subcategories.map((sub) =>
                                                            <li key={sub.id} className=' py-1'><Link className='text-decoration-none' to={`/sub_category/${sub.id}`}>{sub && sub.name}</Link></li>
                                                        )
                                                    }
                                                </ul>
                                            </li>
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

export default Categories;