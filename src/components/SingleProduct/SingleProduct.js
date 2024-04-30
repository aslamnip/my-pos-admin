import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import styles from './SingleProduct.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import ProductFrom from '../ProductFrom/ProductFrom';
import styles from './SingleProduct.module.css'
import DeleteModal from '../DeleteModal/DeleteModal';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';

function SingleProduct() {
    const accessToken = localStorage.getItem('access_token')
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const navigate = useNavigate()
    const [editAble, setEditAble] = useState(true)
    const [addImage, setAddImage] = useState(false)
    const [editImage, setEditImage] = useState(false)
    const [editImageId, setEditImageId] = useState('')
    const [showData, setShowData] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [singleImage, setSingleImage] = useState('')


    useEffect(() => {
        setTimeout(() => {
            setShowData(true)
        }, 500);
    }, [])

    const { slug } = useParams()
    const [product, setProduct] = useState({})
    useEffect(() => {
        fetch(`${fetchUrl}/api/products/${slug}/`,{
            headers: { "Authorization": `Bearer ${accessToken}` },
        })
            .then(res => res.json())
            .then(data => setProduct(data))
    }, [slug, singleImage, accessToken])




    const deleteProduct = () => {
        setIsLoading(true)
        fetch(`${fetchUrl}/api/products/update/${product.slug}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'DELETE'
        })
            .then(res => {
                setIsLoading(false)
                if (res.status === 204) {
                    navigate('/products')
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



    const handleImage = (e) => {
        setSingleImage(e.target.files[0])
    }





    const addSingleImage = (e) => {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData()
        formData.append("product", product.id)
        formData.append("image", singleImage)

        fetch(`${fetchUrl}/api/products/image/create/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'POST',
            body: formData
        })
            .then(res => {
                setIsLoading(false)
                setAddImage(false)
                if (res.status === 201) {
                    setShowAlert(true)
                    setAlertText(` Add  Success`)
                    setAlertVariant('success')
                    setSingleImage('')
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



    const updateSingleImage = (e) => {

        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData()
        formData.append("product", product.id)
        formData.append("image", singleImage)

        fetch(`${fetchUrl}/api/products/image/${editImageId}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'PATCH',
            body: formData
        })
            .then(res => {
                setIsLoading(false)
                setEditImage(false)
                if (res.status === 200) {
                    setShowAlert(true)
                    setAlertText(` Update  Success`)
                    setAlertVariant('success')
                    setSingleImage('')
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


    const deleteImage = (imageId) => {
        setIsLoading(true)
        fetch(`${fetchUrl}/api/products/image/${imageId}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: 'DELETE'
        })
            .then(res => {
                setIsLoading(false)
                if (res.status === 204) {
                    navigate('/products')
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

    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    {isLoading ? <Loading /> : null}
                    <div className={styles.ImagesSection}>
                        <div >
                            <h5>Product Code - {product.product_code}</h5>
                        </div>
                        <div>
                            <h6>Images</h6>
                            <div className='d-flex flex-wrap'>
                                <div className='d-flex flex-wrap'>
                                    {
                                        product.images && product.images.map(data =>
                                            <div key={data.id} className={styles.prodctsImages}>
                                                <img src={data.image} alt="product" width={100} height={100} />
                                                <div className='d-flex mt-1'>
                                                    <button
                                                        onClick={() => {
                                                            setEditImage(!editImage);
                                                            setAddImage(false);
                                                            setEditImageId(data.id)
                                                        }}
                                                        type="button"
                                                        className='btn btn-success' >
                                                        <FontAwesomeIcon icon={faPen} size='sm' />
                                                    </button>
                                                    <div className='ms-auto'>
                                                        {product.images.length > 1 ? <button onClick={() => deleteImage(data.id)} className='btn btn-danger' type='button'><FontAwesomeIcon icon={faTrash} size='sm' /></button> : null}

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div style={{ height: 140, width: '200px' }} className='mt-3 ms-3'>
                                        {addImage || editImage ?
                                            <div>
                                                <form onSubmit={editImage && !addImage ? updateSingleImage : addSingleImage}>
                                                    <input multiple accept="image/jpeg,image/png,image/gif" onChange={(e) => handleImage(e)} className='form-control' type="file" name="sgimage" required />
                                                    <input className='btn btn-dark mt-3 w-100' type="submit" value={editImage ? 'Update Image' : "Add Image"} />
                                                </form>
                                            </div>
                                            :
                                            <button onClick={() => { setAddImage(true); setEditImage(false) }} className='h-100 btn btn-outline-dark' type='button'>Add New Image</button>


                                        }
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div>
                        <h4 className='text-center'>Product Info</h4>
                        <div className={styles.ImagesSection}>
                            <div className='d-flex'>
                                <button onClick={() => setEditAble(!editAble)} className='btn btn-success my-3' type='button'>{`${editAble ? "Click Here to Edit" : "Lock"} Product info`}</button>
                                <div className="ms-3 my-3" >
                                    <DeleteModal iconText='Delete Product' warning={`Are you sure to delete ${product.name}?`} handlefunction={deleteProduct} />
                                </div>
                            </div>
                        </div>
                        <ProductFrom editAble={editAble} showData={showData} isUpdate method="PATCH" postUrl={`products/update/${slug}/`} product={product} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleProduct;