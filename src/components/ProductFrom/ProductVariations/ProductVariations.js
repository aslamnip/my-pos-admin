/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-empty */
/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useMemo } from "react";
import "./ProductVariations.css";

function ProductVariations(props) {
    const { setVariationsx, setVariationsPrices, inputValue, isUpdate, editAble, hasStockVar, setHasStockVar, setStocks } = props
    const [attributes, setAttributes] = useState([{ name: "", values: [""] }]);
    const [variations, setVariations] = useState([]);


    // Generate combinations on attribute change
    useEffect(() => {
        const generateCombinations = () => {
            const validAttrs =attributes && attributes.filter(attr => attr.name && attr.values.length);
            if (validAttrs.length === 0) return [];

            const combine = (arr) => {
                if (arr.length === 0) return [];
                if (arr.length === 1) return arr[0].map(v => [v]);

                const rest = combine(arr.slice(1));
                return arr[0].flatMap(v => rest.map(r => [v, ...r]));
            };

            const valueLists = validAttrs.map(attr => attr.values.filter(v => v));
            const combos = combine(valueLists);

            // let x
            // console.log(validAttrs, 0);

            // if (!editAble) {
            //     x = combos.map(combo => ({

            //         name: combo.join(" | "),
            //         price: '',
            //         stock: ''
            //     }));
            // }
            // else {
            //     x = combos.map(combo => ({
            //         name: combo.join(" | "),

            //     }));
            // }
            // return x
            let existingVariations = [];
            try {
                existingVariations = JSON.parse(inputValue.price_variations || '[]');
            } catch (_) { }

            return combos.map(combo => {
                const name = combo.join(" | ");
                const existing = existingVariations.find(v => v.name === name);

                return {
                    name,
                    purchasePrice: existing && existing.purchasePrice ? existing.purchasePrice : '',
                    price: existing && existing.price ? existing.price : '',
                    stock: existing && existing.stock ? existing.stock : ''
                };

            });
        };

        setVariations(generateCombinations());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attributes, editAble]);
    useEffect(() => {
        if (isUpdate && inputValue) {
            setVariations(JSON.parse(inputValue.price_variations))
            setAttributes(JSON.parse(inputValue.variations))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUpdate])


    const handleAttrNameChange = (index, value) => {
        const updated = [...attributes];
        updated[index].name = value;
        setAttributes(updated);
    };

    const handleAttrValueChange = (attrIndex, valueIndex, value) => {
        const updated = [...attributes];
        updated[attrIndex].values[valueIndex] = value;
        setAttributes(updated);
    };

    const addAttribute = () => {
        setAttributes([...attributes, { name: "", values: [""] }]);
    };

    const addAttributeValue = (index) => {
        const updated = [...attributes];
        updated[index].values.push("");
        setAttributes(updated);
    };

    const removeAttribute = (index) => {
        const updated = [...attributes];
        updated.splice(index, 1);
        setAttributes(updated);
    };

    const removeAttributeValue = (attrIndex, valIndex) => {
        const updated = [...attributes];
        updated[attrIndex].values.splice(valIndex, 1);
        setAttributes(updated);
    };

    const updateVariation = (index, field, value) => {
        const updated = [...variations];
        updated[index][field] = value;
        setVariations(updated);

    };
console.log(variations);
    // Final data to reuse anywhere
    const variationData = useMemo(() => ({
        attributes:attributes && attributes.filter(attr => attr.name && attr.values.length),
        combinations: variations
    }), [attributes, variations]);


    useEffect(() => {
        if (hasStockVar) {
            const sum = variations.reduce((accumulator, currentValue) => accumulator + currentValue.stock, 0);
            setStocks(sum)
        }
       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variations])

    useEffect(() => {
        setVariationsx(variationData.attributes)
        setVariationsPrices(variationData.combinations)
    }, [setVariationsPrices, setVariationsx, variationData])
    return (
        <div className="variation-container">
            <h2>Product Variations</h2>

            {attributes.map((attr, index) => (
                <div className="attribute-block" key={index}>
                    <div className="attribute-header">
                        <input
                            disabled={editAble}
                            type="text"
                            placeholder="Variation name (e.g., Color)"
                            value={attr.name}
                            onChange={(e) => handleAttrNameChange(index, e.target.value)}
                        />
                        <button disabled={editAble} className="text-danger" type="button" onClick={() => removeAttribute(index)}>🗑</button>
                    </div>

                    {attr.values.map((val, valIndex) => (
                        <div className="attribute-value-row" key={valIndex}>
                            <input
                                disabled={editAble}
                                required
                                type="text"
                                placeholder={`Value ${valIndex + 1} (eg- Red)`}
                                value={val}
                                onChange={(e) => handleAttrValueChange(index, valIndex, e.target.value)}
                            />
                            <button disabled={editAble} className="text-danger" type="button" onClick={() => removeAttributeValue(index, valIndex)}>🗑</button>
                        </div>
                    ))}
                    <button disabled={editAble} type="button" className="add-btn" onClick={() => addAttributeValue(index)}>+ Add Value</button>
                </div>
            ))}

            <button type="button" className="add-btn" onClick={addAttribute}>+ আরো ভ্যারিয়েন্ট যোগ করুন</button>

            <hr />

            <h3>Manage Variations</h3>
            <div className=" my-5 form-check">
                <input checked={hasStockVar} onChange={(e) => setHasStockVar(e.target.checked)} type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" htmlFor="exampleCheck1">
                    প্রতি ভ্যারিয়েন্ট এর আলাদা স্টোক হিসাব
                </label>
            </div>
            <div className="variation-table">
                <div className="variation-row variation-header">
                    <div>Variant</div>
                    <div>Purchase Price</div>
                    <div>Price</div>
                    <div>{hasStockVar ? 'Stock' : null}</div>
                </div>
                {variations.map((v, i) => (
                    <div className="variation-row" key={i}>
                        <div>{v.name}</div>
                        <div>
                            <input
                                disabled={editAble}
                                required
                                placeholder="Purchase Price"
                                type="number"
                                value={v.purchasePrice}
                                onChange={(e) => updateVariation(i, "purchasePrice", parseFloat(e.target.value))}
                            />
                        </div>
                        <div>
                            <input
                                disabled={editAble}
                                required
                                placeholder="এখানে দাম লিখুন"
                                type="number"
                                value={v.price}
                                onChange={(e) => updateVariation(i, "price", parseFloat(e.target.value))}
                            />
                        </div>
                        <div>
                            {hasStockVar ?
                                <input
                                    disabled={editAble}
                                    required
                                    placeholder="এখানে স্টোক লিখুন"
                                    type="number"
                                    value={v.stock}
                                    onChange={(e) => updateVariation(i, "stock", parseInt(e.target.value, 10))}
                                />
                                : null}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductVariations;
