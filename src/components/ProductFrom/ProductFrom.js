/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductFrom.module.css'
import { fetchUrl } from '../../config';
import RichText from '../RichText/RichText';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';

function ProductFrom(props) {
    const { method, isUpdate, postUrl, product, showData, editAble } = props
    const { setShowAlert, setAlertText, setAlertVariant } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const accessToken = localStorage.getItem('access_token')
    const [category, setCategory] = useState([])
    useEffect(() => {
        fetch(`${fetchUrl}/api/categories/`)
            .then(res => res.json())
            .then(data => setCategory(data))
    }, [])


    const [RichTextValue, setRichTextValue] = useState('Product Details')
    const [inputValue, setInputValue] = useState({
        name: '',
        price: '',
        pre_price: '',
        purchase_price: '',
        color: '',
        size: '',
        chargeFree: false,
        available: true,
        stock: '1',
        video: '',
        category: "",
        image: {
            preview: '',
            data: ''
        },
    })
    useEffect(() => {
        if (showData && isUpdate && product) {

            setInputValue((prevInputValue) => ({
                ...prevInputValue,
                name: product.name,
                price: product.price,
                pre_price: product.pre_price,
                purchase_price: product.purchase_price,
                color: product.color ? product.color : '',
                size: product.size ? product.size : '',
                chargeFree: product.chargeFree ? product.chargeFree : false,
                available: product.available ? product.available : false,
                stock: product.stock ? product.stock : '',
                video: product.video ? product.video : '',
                category: product.category,

            }));
            setRichTextValue(product.details);
        }
    }, [isUpdate, product, showData]);
    const handleInput = (acion, e) => {


        if (acion === e.target.name) {
            const newData = { ...inputValue }
            newData[e.target.name] = e.target.value
            setInputValue(newData)
        }
        if (e.target.name === 'image') {
            const newData = { ...inputValue }
            const [file] = e.target.files;
            newData.image.data = file
            newData.image.preview = URL.createObjectURL(e.target.files[0])
            setInputValue(newData)
        }
        if (acion === 'chargeFree') {
            const newData = { ...inputValue }
            newData[e.target.name] = e.target.checked
            setInputValue(newData)
        }
        if (acion === 'available') {
            const newData = { ...inputValue }
            newData[e.target.name] = e.target.checked
            setInputValue(newData)
        }
    }
    const handleSubmit = (e) => {
        setIsLoading(true)
        e.preventDefault()
        const formData = new FormData()
        formData.append('name', inputValue.name)
        formData.append('price', Number(inputValue.price))
        formData.append('pre_price', Number(inputValue.pre_price))
        formData.append('purchase_price', Number(inputValue.purchase_price))
        formData.append('stock', Number(inputValue.stock))
        formData.append('color', inputValue.color)
        formData.append('size', inputValue.size)
        formData.append('chargeFree', inputValue.chargeFree)
        formData.append('available', inputValue.available)
        formData.append('video', inputValue.video)
        formData.append('category', Number(inputValue.category))
        formData.append('image', inputValue.image.data)
        formData.append('details', RichTextValue)

        fetch(`${fetchUrl}/api/${postUrl}`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method,
            body: formData
        })
            .then(res => {
                setIsLoading(false)
                if (res.status === 200) {
                    setShowAlert(true)
                    setAlertText(` Update Success`)
                    setAlertVariant('success')
                    navigate('/products')

                }
                else if (res.status === 201) {
                    setShowAlert(true)
                    setAlertText(` Add  Success`)
                    setAlertVariant('success')
                    navigate('/products')
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

    return (
        <div>
            {isLoading ? <Loading /> : null}
            <div className={styles.formMaoin}>
                <form onSubmit={handleSubmit}>
                    <div>
                        {
                            !isUpdate ?
                                <div className='mb-3'>
                                    <div className='mb-3'>
                                        {inputValue.image.preview && <img width={100} src={inputValue.image.preview} alt="imagePd" />}
                                    </div>
                                    <input required type="file" name="image" multiple accept="image/jpeg,image/png,image/gif" onChange={(e) => handleInput('image', e)} />
                                </div>
                                : null}
                    </div>
                    <div className=' mb-3'>
                        <label className='form-label' htmlFor=' name'>Product Name</label>
                        <input className='form-control ' type="text" name='name' placeholder='Product Name' value={inputValue.name} onChange={(e) => handleInput('name', e)} required disabled={editAble} />
                    </div>
                    <div className=' mb-3'>
                        <label className='form-label' htmlFor=' price'>Price</label>
                        <input className='form-control' type="text" name='price' placeholder='Price' value={inputValue.price} onChange={(e) => handleInput('price', e)} required disabled={editAble} />
                    </div>
                    <div className=' mb-3'>
                        <label className='form-label' htmlFor=' pprice'>Pre Price <small className='text-muted'>(Optional)</small></label>
                        <input className='form-control' type="text" name='pre_price' placeholder='Pre Price' value={inputValue.pre_price} onChange={(e) => handleInput('pre_price', e)} disabled={editAble} />
                    </div>
                    <div className=' mb-3'>
                        <label className='form-label' htmlFor=' pprice'>Purchase Price </label>
                        <input className='form-control' type="text" name='purchase_price' placeholder='Purchase Price' value={inputValue.purchase_price} onChange={(e) => handleInput('purchase_price', e)} required disabled={editAble} />
                    </div>
                    <div className=' mb-3'>
                        <label className='form-label' htmlFor=' color'>Color <small className='text-muted'>(Optional)</small></label>
                        <input className='form-control' type="text" name='color' placeholder='Color' value={inputValue.color} onChange={(e) => handleInput('color', e)} disabled={editAble} />
                    </div>
                    <div className=' mb-3'>
                        <label className='form-label' htmlFor=' size'>Size <small className='text-muted'>(Optional)</small></label>
                        <input className='form-control' type="text" name='size' placeholder='Size' value={inputValue.size} onChange={(e) => handleInput('size', e)} disabled={editAble} />
                    </div>
                    <div className=' mb-3'>
                        <input className='form-check-input me-2' type="checkbox" name='chargeFree' id="chargeFree" checked={inputValue.chargeFree} onChange={(e) => handleInput('chargeFree', e)} disabled={editAble} />
                        <label className='form-check-label' htmlFor=' chargeFree'>Charge Free <small className='text-muted'>(Optional)</small></label>
                    </div>
                    <div className=' mb-3'>
                        <input className='form-check-input me-2' type="checkbox" name='available' id="available" checked={inputValue.available} onChange={(e) => handleInput('available', e)} disabled={editAble} />
                        <label className='form-check-label' htmlFor=' chargeFree'>Product Available <small className='text-muted'>(Optional)</small></label>
                    </div>
                    <div className=' mb-3'>
                        <label className='form-label' htmlFor=' stock'>Stock <small className='text-muted'>(Optional)</small></label>
                        <input className='form-control' type="text" name='stock' placeholder='Stock' value={inputValue.stock} onChange={(e) => handleInput('stock', e)} disabled={editAble} />
                    </div>
                    <div className=' mb-3'>
                        <label className='form-label' htmlFor=' video'>Youtube Video Code <small className='text-muted'>(Optional)</small></label>
                        <input className='form-control' type="text" name='video' placeholder='Youtube Video Code ' value={inputValue.video} onChange={(e) => handleInput('video', e)} disabled={editAble} />
                    </div>
                    <div>
                        <label className='form-label' htmlFor=' category'>Category</label>
                        <select value={inputValue.category} className='form-select mb-3' name="category" required onChange={(e) => handleInput('category', e)} disabled={editAble}>
                            <option value="">Category</option>
                            {category && category.map(data =>
                                <option key={data.id} value={data.id} >{data.name} </option>
                            )}

                        </select>
                    </div>
                    <div>
                        <RichText value={RichTextValue} setValue={setRichTextValue} disabled={editAble} />
                    </div>
                    <input className='btn btn-dark w-100 mt-3' type="submit" value={isUpdate ? "Update Product" : " Add Proudct"} disabled={editAble} />
                </form>
            </div>
        </div>
    );
}

export default ProductFrom;