/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-restricted-syntax */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProductFrom.module.css'
import { fetchUrl } from '../../config';
import RichText from '../RichText/RichText';
import { AllContext } from '../../AllContext';
import Loading from '../Loading/Loading';
import CustomSelect from '../CustomSelect/CustomeSelect';
import imageAvatr from '../Media/icons8-image-100.png'
import Varriations from './Varriations/Varriations';

function ProductFrom(props) {
    const { method, isUpdate, postUrl, product, showData, editAble } = props
    const { setShowAlert, setAlertText, setAlertVariant, categories } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(false)
    const [isPriceVar, setIsPriceVar] = useState(false)
    const [addNewPriceVary, setaddNewPriceVary] = useState(false)
    const [selectBrands, setselectBrands] = useState([])
    const [selectUnits, setselectUnits] = useState([])
    const [selectWarranty, setselectWarranty] = useState([])
    const [variations, setVariations] = useState([]);
    const [selectCategoryId, setSelectCategoryId] = useState('')
    const [selectSubCategory, setSelectSubCategory] = useState('')
    const [selectSubCategoryId, setSelectSubCategoryId] = useState('')
    const [variationPrices, setVariationsPrices] = useState([])
    const [RichTextValue, setRichTextValue] = useState('Product Details')
    const [customIsValid, setCustomIsValid] = useState(true);
    const navigate = useNavigate()


    const accessToken = localStorage.getItem('access_token')

    const [brands, setBrands] = useState([])
    const [units, setUnits] = useState([])
    const [warranty, setWarranty] = useState([])
    useEffect(() => {
        fetch(`${fetchUrl}/api/brand/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => setBrands(data))



        fetch(`${fetchUrl}/api/units/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => setUnits(data))


        fetch(`${fetchUrl}/api/warranty/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => setWarranty(data))
    }, [accessToken])


    const [inputValue, setInputValue] = useState({
        name: '',
        product_code: '',
        price: '',
        purchase_price: '',
        stock: '1',
        has_price_variations: '',
        price_variations: '',
        image: {
            preview: '',
            data: ''
        },
    })
    const [defaultValue, setDefaultValue] = useState({
        category_name: 'Category',
        sub_category_name: 'Sub Category',
        warranty: 'No Warranty',
        units: 'Set Units',
        brands: 'No Brand',


    })

    useEffect(() => {
        if (showData && isUpdate && product) {
            setIsPriceVar(product.has_price_variations)
            setselectWarranty(product.warranty)
            setselectBrands(product.brand)
            setselectUnits(product.units)
            setSelectCategoryId(product.category)
            setSelectSubCategoryId(product.sub_category)
            setInputValue((prevInputValue) => ({
                ...prevInputValue,
                name: product.name,
                product_code: product.product_code,
                price: product.price,
                purchase_price: product.purchase_price,
                stock: product.stock ? product.stock : '',
                has_price_variations: product.has_price_variations ? product.has_price_variations : false,
                price_variations: product.rice_variations ? product.price_variations : false,


            }));
            setDefaultValue((prev) => ({
                ...prev,
                warranty: product.warranty ? product.warranty : 'No Warranty',
                units: product.units ? product.units : 'Select Units',
                brands: product.brand_name ? product.brand_name : 'No Brand',
                category_name: product.category_name ? product.category_name : 'Category',
                sub_category_name: product.sub_category_name ? product.sub_category_name : 'Sub Category',

            }))
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

    }





    useEffect(() => {
        const findX = categories.find(data => data.name === defaultValue.category_name);

        // If a matching category is found, return its id, otherwise null
        const Subcategory = findX ? findX.subcategories : null;

        // Set the categoryId as the selected category
        setSelectSubCategory(Subcategory);
    },[defaultValue])

    const handleSelectCategory = (value) => {
        const findX = categories.find(data => data.name === value);

        // If a matching category is found, return its id, otherwise null
        const Subcategory = findX ? findX.subcategories : null;
        const categoryId = findX ? findX.id : null;

        // Set the categoryId as the selected category
        setSelectSubCategory(Subcategory);
        setSelectCategoryId(categoryId)
        setSelectSubCategoryId(null)

    }
    const handleSelectSubCategory = (value) => {
        const findX = selectSubCategory.find(data => data.name === value);
        const subCategoryId = findX ? findX.id : null;
        // Set the categoryId as the selected category
        setSelectSubCategoryId(subCategoryId)

    }



    const handleSelecBrands = (value) => {
        const findX = brands.find(data => data.name === value);
        const brandId = findX ? findX.id : null;
        // Set the categoryId as the selected category
        setselectBrands(brandId)
    }
    const handleSelecUnits = (value) => {
        setselectUnits(value)
    }

    const handleSelecWarranty = (value) => {
        setselectWarranty(value)
    }


    let priceVariationsx;

    if (!isUpdate || addNewPriceVary) {
        priceVariationsx = JSON.stringify(variationPrices);
    } else {
        priceVariationsx = product.price_variations;
    }
    const handleSubmit = (e) => {
        setIsLoading(true)
        e.preventDefault()
        if (!customIsValid) {
            setIsLoading(false)
            setShowAlert(true)
            setAlertText(`Select All Option Correctly`)
            setAlertVariant('danger')
        }
        else {
            const formData = new FormData()
            formData.append('name', inputValue.name)
            formData.append('product_code', inputValue.product_code)
            formData.append('price', Number(inputValue.price))
            formData.append('purchase_price', Number(inputValue.purchase_price))
            formData.append('stock', Number(inputValue.stock))
            formData.append('has_price_variations', Number(inputValue.has_price_variations))
            formData.append('image', inputValue.image.data)
            formData.append('category', Number(selectCategoryId))
            formData.append('sub_category', Number(selectSubCategoryId))
            formData.append('brand', selectBrands)
            formData.append('units', selectUnits)
            formData.append('warranty', selectWarranty)
            formData.append('price_variations', priceVariationsx)
            formData.append('variations', JSON.stringify(variations))

            formData.append('details', RichTextValue)

            fetch(`${fetchUrl}/api/${postUrl}`, {
                headers: { "Authorization": `Bearer ${accessToken}` },
                method,
                body: formData
            })
                .then(res => {
                    setIsLoading(false)
                    if (res.ok) {
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

    }
    const [isAutcode, setIsAutoCode] = useState(true)
    const handelChangeAuto = (e) => {
        setIsAutoCode(e.target.checked)
    }

    
    return (
        <div>
            {isLoading ? <Loading /> : null}
            <div className={styles.formMaoin}>
                <form onSubmit={handleSubmit}>
                    <div className='col-md-9'>

                        <div className='row'>
                            <div className='col-md-4'>
                                <div className='mb-3'>
                                    <h5>Product Image</h5>
                                    <div>
                                        {
                                            isUpdate ?
                                                <div>
                                                    {
                                                        editAble ?
                                                            <img width={150} src={product.image} alt="imagePd" />
                                                            :
                                                            <div className='mb-3'>
                                                                {inputValue.image.preview ?
                                                                    <img width={150} src={inputValue.image.preview} alt="imagePd" />
                                                                    :
                                                                    <img width={150} src={product.image} alt="imagePd" />
                                                                }
                                                                <div className='mt-2'>
                                                                    <label className=" btn btn-primary p-2">  CHOOSE IMAGE
                                                                        <input className='d-none' type="file" name="image" multiple accept="image/jpeg,image/png,image/gif" onChange={(e) => handleInput('image', e)} />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                    }
                                                </div>

                                                :
                                                <div className='mb-3'>
                                                    {inputValue.image.preview ?
                                                        <img width={150} src={inputValue.image.preview} alt="imagePd" />
                                                        :
                                                        <img width={150} src={imageAvatr} alt="imagePd" />
                                                    }
                                                    <div className='mt-1' >
                                                        <label className=" btn btn-primary p-2">  CHOOSE IMAGE
                                                            <input className='d-none' required type="file" name="image" multiple accept="image/jpeg,image/png,image/gif" onChange={(e) => handleInput('image', e)} />
                                                        </label>
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className='col-md-8'>
                                <div className=' mb-3'>
                                    <div className=' mt-5 mt-md-0'>
                                        <label className='form-label' htmlFor=' name'><b>পণ্যের নাম</b></label>
                                        <input className='form-control ' type="text" name='name' placeholder='Product Name' value={inputValue.name} onChange={(e) => handleInput('name', e)} required disabled={editAble} />
                                    </div>
                                    <div className='col-md-6 pt-3'>
                                        <div>
                                            <div className='py-3'>
                                                <div className='form-check'>
                                                    <input checked={isAutcode} onChange={(e) => handelChangeAuto(e)} className=' form-check-input' type="checkbox" name="ceode" id="code" />
                                                    <label className='form-check-lebel' htmlFor="code">Auto Genarate</label>
                                                </div>
                                                <div className='mt-3 mb-3'>
                                                    <label className='form-label' htmlFor='product-code'><b>পণ্যের কোড নাম্বার</b></label>
                                                    <input disabled={isAutcode} className='form-control ' type="text" name='product_code' placeholder='Product Code' onChange={(e) => handleInput('product_code', e)} value={inputValue.product_code} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className='row mt-5 mb-3'>
                        <div className='col-md-3 me-2 my-3'>
                            <label className='form-label' htmlFor=' price'><b>দাম*</b></label>
                            <input className='form-control' type="text" name='price' placeholder='Price' value={inputValue.price} onChange={(e) => handleInput('price', e)} required disabled={editAble} />
                        </div>
                        <div className='col-md-3 me-2 my-3'>
                            <label className='form-label' htmlFor=' pprice'><b>ক্রয় মূল্য*</b> </label>
                            <input className='form-control' type="text" name='purchase_price' placeholder='Purchase Price' value={inputValue.purchase_price} onChange={(e) => handleInput('purchase_price', e)} required disabled={editAble} />
                        </div>
                        <div className='col-md-3 my-3'>
                            <label className='form-label' htmlFor=' stock'><b>স্টোক*</b></label>
                            <input className='form-control' type="text" name='stock' placeholder='Stock' value={inputValue.stock} onChange={(e) => handleInput('stock', e)} disabled={editAble} />
                        </div>
                    </div>
                    <div className='row mb-5'>
                        <div className='col-md-3 my-3 me-2'>
                            <label className='form-label' htmlFor=' category'><b>ক্যাটাগরি*</b></label>
                            <CustomSelect
                                options={categories}
                                defaultOption={defaultValue.category_name}
                                handleSelectChange={handleSelectCategory}
                                isDisable={editAble}
                                required
                                noSelectValue="Category"
                                setCustomIsValid={setCustomIsValid}
                            />
                        </div>
                        <div className='col-md-3 my-3 me-2'>
                            <label className='form-label' htmlFor=' category'><b>সাব ক্যাটাগরি</b><small className='text-muted'> (Optional)</small></label>
                            <CustomSelect
                                options={selectSubCategory}
                                defaultOption={defaultValue.sub_category_name}
                                handleSelectChange={handleSelectSubCategory}
                                isDisable={selectCategoryId === '' || selectCategoryId === null || editAble}
                                noSelectValue="Sub Category"
                                setCustomIsValid={setCustomIsValid}
                            />
                        </div>
                        <div className='col-md-3 my-3 me-2'>
                            <label className='form-label' htmlFor=' brand'><b>ব্রান্ডের নাম</b><small className='text-muted'> (Optional)</small></label>
                            <CustomSelect
                                options={brands}
                                defaultOption={defaultValue.brands}
                                handleSelectChange={handleSelecBrands}
                                noSelectValue="No Brand"
                                isDisable={editAble}
                                setCustomIsValid={setCustomIsValid}
                            />
                        </div>

                    </div>


                    <div className='row mb-5'>
                        <div className='col-md-3 my-3 me-2'>
                            <label className='form-label' htmlFor=' warranty'><b>ওয়ারেন্টি</b><small className='text-muted'> (Optional)</small></label>
                            <CustomSelect
                                options={warranty}
                                defaultOption={defaultValue.warranty}
                                handleSelectChange={handleSelecWarranty}
                                noSelectValue='No Warranty'
                                isDisable={editAble}
                                setCustomIsValid={setCustomIsValid}
                            />
                        </div>
                        <div className='col-md-3 my-3 me-2'>
                            <label className='form-label' htmlFor=' units'><b>ইউনিটস*</b></label>
                            <CustomSelect
                                options={units}
                                defaultOption={defaultValue.units}
                                handleSelectChange={handleSelecUnits}
                                noSelectValue='Set Units'
                                required
                                isDisable={editAble}
                                setCustomIsValid={setCustomIsValid}
                            />
                        </div>
                    </div>

                    <div className=' mb-5'>
                        <div className=''>
                            <Varriations
                                setVariationsPrices={setVariationsPrices}
                                product={product}
                                inputValue={inputValue}
                                setInputValue={setInputValue}
                                variationPrices={variationPrices}
                                isPriceVar={isPriceVar}
                                setIsPriceVar={setIsPriceVar}
                                editAble={editAble}
                                handleInput={handleInput}
                                variations={variations}
                                setVariations={setVariations}
                                isUpdate={isUpdate}
                                addNewPriceVary={addNewPriceVary}
                                setaddNewPriceVary={setaddNewPriceVary}
                            />
                        </div>



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