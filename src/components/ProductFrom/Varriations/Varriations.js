/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-syntax */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Varriations(props) {
    const { inputValue,
        setVariationsPrices,
        setInputValue,
        variationPrices,
        isPriceVar,
        setIsPriceVar,
        editAble,
        handleInput,
        setVariations,
        variations,
        product,
        isUpdate,
        setaddNewPriceVary,
        addNewPriceVary
    } = props

    const [variationsDivs, setVariationsDivs] = useState(false);
    const [exitingPriceVariants, setExistingPriceVariants] = useState('');


    const handleVariationsDivs = () => {
        setVariationsDivs(!variationsDivs)
    }

    useEffect(() => {

        if (product && product.variations) {
            // console.log(JSON.parse(product.variations));
            const pasrseVariations = JSON.parse(product.variations);
            setVariations(pasrseVariations);

        }
        if (product && product.price_variations) {
            // console.log(JSON.parse(product.variations));
            const pasrsePriceVariations = JSON.parse(product.price_variations);
            setExistingPriceVariants(pasrsePriceVariations);

        }
    }, [product])


    const handleVariationsToggle = () => {
        setVariationsDivs(false)
        const x = { [inputValue.variant_name]: [inputValue.variant_value] }
        setVariations(inputValue.variant_value && inputValue.variant_name ? [...variations, x] : [...variations])
        setInputValue(prevState => ({
            ...prevState,
            variant_name: '',
            variant_value: '',
        }));
    }
    // Function to generate combinations
    function generateCombinations(arr) {
        // Extract keys and values from the input array
        const keys = arr.map(obj => Object.keys(obj)[0]);
        const values = arr.map(obj => obj[Object.keys(obj)[0]].toString().split(','));

        // Helper function to create combinations recursively
        function combine(current, index) {
            if (index === keys.length) {
                return [current];
            }

            const result = [];
            const currentKey = keys[index];

            for (const value of values[index]) {
                result.push(...combine({ Price: inputValue.price, ...current, [currentKey]: value, }, index + 1));
            }

            return result;
        }

        return combine({}, 0);
    }



    const [prices, setPrices] = useState(0);
    useEffect(() => {
        const variants = generateCombinations(variations);
        setVariationsPrices(variants)
    }, [variations])


    const handlePriceChange = (index, value) => {
        setPrices(prevPrices => ({
            ...prevPrices,
            [index]: value,
        }));
    };

    // Handle submit
    const handleSubmitVarPrice = () => {
        const finalVariants = variationPrices.map((variant, index) => ({
            ...variant,
            Price: prices[index] || inputValue.price, // Assign price or null if not provided
        }));
        console.log(exitingPriceVariants, 'ফাইনাল');
        setVariationsPrices(finalVariants)
    };



    const handleDeleteVaraints = (index) => {
        const newVariations = [...variations];
        newVariations.splice(index, 1);

        setVariations(newVariations);

    }

    return (
        <div>
            <div>
                <div className='col-md-3 mb-5 pe-3'>
                    <label className='form-label' htmlFor='variations'><b>কালার/সাইজ</b><small className='text-muted'> (Optional)</small></label>
                    <br /> <small style={{ visibility: 'hidden' }}>No Error</small>
                    <button disabled={editAble} className='btn btn-outline-dark w-100  p-2' onClick={handleVariationsDivs} type='button'>{`${variations.length > 0 ? 'আরো ' : ''}ভ্যারিয়েশন যোগ করুন`}</button>
                </div>
            </div>
            <div>
                {
                    variations ?
                        variations.map((data, index) =>
                            <div key={index} className='col-md-9 my-1 border '>
                                <div className=' row p-2'>
                                    <div className='col-3 border-end '>{Object.keys(data)}</div>
                                    <div className='col-8 ms-auto'><b>{Object.values(data)}</b></div>
                                    <div onClick={() => handleDeleteVaraints(index)} className='col-1 border-start '>
                                        <FontAwesomeIcon className='text-danger' icon={faTrash} />
                                    </div>
                                </div>


                            </div>
                        )
                        : null
                }
            </div>
            <div>
                {
                    variationsDivs ?
                        <div className='row col-md-9'>
                            <div className='col-md-3 me-2 mb-3'>
                                <label className='form-label' htmlFor=' variant_name'><b>Name</b></label>
                                <input className='form-control' type="text" name='variant_name' placeholder='কালার/সাইজ' value={inputValue.variant_name} onChange={(e) => handleInput('variant_name', e)} disabled={editAble} />
                            </div>
                            <div className='col-md-6 me-2 mb-3'>
                                <div className='w-100'>
                                    <label className='form-label' htmlFor=' variant_value'><b>Value</b> <small className='text-muted' >( কমা , দিয়ে লিখুন)</small></label>
                                    <input className='form-control ' type="text" name='variant_value' placeholder='Black, Blue, S, T' value={inputValue.variant_value} onChange={(e) => handleInput('variant_value', e)} disabled={editAble} />
                                </div>

                            </div>
                            <div className='col-md-3 ms-2'>
                                <small className=' '>ক্লিক করুন</small>
                                <button onClick={handleVariationsToggle} className='btn btn-dark w-100 mt-2' type='button'>যোগ করুন</button>
                            </div>
                        </div>
                        : null
                }
            </div>
            <div>
                {
                    variations.length > 0 ?
                        <div className=" my-5 form-check">
                            <input checked={isPriceVar} onChange={(e) => setIsPriceVar(e.target.checked)} type="checkbox" className="form-check-input" id="exampleCheck1" />
                            <label className="form-check-label" htmlFor="exampleCheck1">
                                পণ্যের দাম ভ্যারিয়েন্ট (কালার/সাইজ )অনুযায়ী আলাদা
                            </label>
                        </div>
                        : null
                }
            </div>
            <div className='my-5'>
                {
                    variations.length > 0 && isUpdate && exitingPriceVariants.length > 0 ?
                        <div>
                            <h5>আগের প্রাইজ টেবিল</h5>
                            <table>
                                <thead>
                                    <tr>
                                        {exitingPriceVariants.length > 0 && Object.keys(exitingPriceVariants[0]).map(value =>
                                            <th>{value}</th>

                                        )}
                                    </tr>
                                </thead>
                                <tbody>

                                    {exitingPriceVariants.map((variant, index) => (

                                        <tr key={index}>
                                            {Object.values(variant).map((value, i) =>
                                                <td key={i}>{value}</td>

                                            )}


                                        </tr>

                                    ))}


                                </tbody>
                            </table>

                        </div>
                        : null
                }
            </div>

            <div>
                {
                    exitingPriceVariants.length > 0 ?
                        <button disabled={editAble} className='btn btn-dark' onClick={() => setaddNewPriceVary(!addNewPriceVary)} type='button'>{addNewPriceVary ? 'বাতিল করুন' : 'দাম ইডিট করুন'}</button>
                        : null
                }
            </div>
            <div className='my-5'>

                <div>
                    {
                        !isUpdate || addNewPriceVary ?
                            <div>
                                {
                                    isPriceVar && variations.length > 0 ?
                                        <div>
                                            <h5><span>{isUpdate ? 'New' : ''}</span> Variant Prices Table</h5>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>New Price</th>
                                                        {variationPrices.length > 0 && Object.keys(variationPrices[0]).map(value =>
                                                            <th>{value}</th>

                                                        )}

                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {variationPrices.map((variant, index) => (

                                                        <tr key={index}>
                                                            <td>
                                                                <input
                                                                    required
                                                                    className='form-control'
                                                                    type="number"
                                                                    placeholder=' এখানে দাম লিখে কনফার্ম বাটনে ক্লিক'
                                                                    onChange={(e) => handlePriceChange(index, e.target.value)}
                                                                />
                                                            </td>
                                                            {Object.values(variant).map((value, i) =>
                                                                <td key={i}>{value}</td>

                                                            )}


                                                        </tr>

                                                    ))}


                                                </tbody>
                                            </table>

                                            <button className=' my-3 btn  btn-primary' type='button' onClick={handleSubmitVarPrice}>Confirm Prices</button>
                                            <br /><small className='text-danger'>সব বক্সে দাম লিখে Confirm Prices বাটনে ক্লিক করুন </small>
                                        </div>
                                        : null
                                }
                            </div>
                            : null
                    }

                </div>
            </div>

        </div>
    );
}

export default Varriations;