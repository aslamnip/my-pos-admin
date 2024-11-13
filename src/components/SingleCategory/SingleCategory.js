import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AllContext } from '../../AllContext';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import CustomTable from '../CustomTable/CustomTable';
import DeleteModal from '../DeleteModal/DeleteModal';
import Loading from '../Loading/Loading';

function SingleCategory() {
    const accessToken = localStorage.getItem('access_token')
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { slug } = useParams()
    const [category, setCategory] = useState({})
    const [showEidt, setShowEdit] = useState(false)
    const [categoryName, setCategoryName] = useState('')
    useEffect(() => {
        fetch(`${fetchUrl}/api/categories/update/${slug}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => setCategory(data))
            .then(setCategoryName(category.name))
    }, [accessToken, category.name, slug])

    const handleEditCategory = (e) => {
        setCategoryName(e.target.value)
    }
    const updateCategory = (e) => {
        setIsLoading(true)
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", categoryName)
        fetch(`${fetchUrl}/api/categories/update/${slug}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'PATCH',
            body: formData
        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    navigate('/categories')
                    setShowAlert(true)
                    setAlertText(` Update Success`)
                    setAlertVariant('success')
                }
                else {
                    setShowAlert(true)
                    setAlertText(`Fail to update`)
                    setAlertVariant('danger')
                }
            })
            .catch(() => {
                setShowAlert(true)
                setAlertText(`Fail to update`)
                setAlertVariant('danger')
            })
    }
    const deleteCategory = () => {
        setIsLoading(true)
        fetch(`${fetchUrl}/api/categories/update/${slug}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'DELETE',
        })
            .then(res => {
                setIsLoading(false)
                if (res.status === 204) {
                    navigate('/categories')
                    setShowAlert(true)
                    setAlertText(` Delete Success`)
                    setAlertVariant('success')
                }
                else {
                    setShowAlert(true)
                    setAlertText(`Fail to Delete`)
                    setAlertVariant('danger')
                }
            })
            .catch(() => {
                setShowAlert(true)
                setAlertText(`Fail to Delete`)
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
                    <div className='m-3'>
                        <h3> {category.name}</h3>
                        <div className='d-flex'>
                            <button onClick={() => setShowEdit(!showEidt)} className='btn btn-secondary me-3' type='button'>Edit</button>
                            <DeleteModal handlefunction={deleteCategory} iconText='Delete' warning={<div><p>All produts of category will be deleted </p> <h4>Are you sute to delete this category?</h4></div>} />
                        </div>
                        <div>
                            {showEidt ?
                                <div className='col-md-6 mt-3'>
                                    <form onSubmit={updateCategory} className='d-flex'>
                                        <input className='form-control' type="text" value={categoryName} onChange={handleEditCategory} />
                                        <input className='btn btn-dark' type="submit" value="Update" />
                                    </form>

                                </div>
                                : null}
                        </div>
                    </div>
                    <div className='mt-5'>
                        <CustomTable tableData={category && category.products} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleCategory;