import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import styles from './SingleProduct.module.css'
import SideNav from '../SideNav/SideNav';
import { fetchUrl } from '../../config';
import ProductFrom from '../ProductFrom/ProductFrom';
// import styles from './SingleProduct.module.css'
import DeleteModal from '../DeleteModal/DeleteModal';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';

function SingleProduct() {
    const accessToken = localStorage.getItem('access_token')
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const navigate = useNavigate()
    const [editAble, setEditAble] = useState(true)
    const [showData, setShowData] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        setTimeout(() => {
            setShowData(true)
        }, 500);
    }, [])

    const { slug } = useParams()
    const [product, setProduct] = useState({})
    useEffect(() => {
        fetch(`${fetchUrl}/api/products/${slug}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
        })
            .then(res => res.json())
            .then(data => { setProduct(data); setIsLoading(false) })
    }, [slug, accessToken])




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



    return (
        <div>
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    {isLoading ? <Loading /> : null}

                    <div>
                        <div className='text-center pt-5 mt-5'>
                            <h4 className='text-center'>Product Info</h4>
                            <h5>Product Code - {product.product_code}</h5>
                            <div className='col-lg-4 mx-auto'>
                                <div className='row'>
                                    <div className='col-6 '>
                                        <button onClick={() => setEditAble(!editAble)} className='btn btn-success my-3 ' type='button'>{`${editAble ? "Edit" : "Lock"} Product info`}</button>
                                    </div>
                                    <div className="col-6 mt-3" >
                                        <DeleteModal iconText='Delete Product' warning={`Are you sure to delete ${product.name}?`} handlefunction={deleteProduct} />
                                    </div>
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