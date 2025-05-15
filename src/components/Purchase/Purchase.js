/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUrl } from '../../config';
import { AllContext } from '../../AllContext';
import './Purchase.css'
import SideNav from '../SideNav/SideNav';
import Loading from '../Loading/Loading';

function PurchaseForm() {
    const [suppliers, setSuppliers] = useState([]);
    const { setShowAlert, setAlertText, setAlertVariant, products } = useContext(AllContext)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [adjustVariants, setAdjustVariants] = useState(false);
    const [variantStocks, setVariantStocks] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [payAmount, setPayAmount] = useState(0);
    const [discounst, setDicount] = useState(0);
    const [preBlance, SetPreBlance] = useState(true);
    const [previousBalance, setPreviousBalance] = useState(0);
    const navigate = useNavigate()
    const accessToken = localStorage.getItem('access_token')
    useEffect(() => {
        fetch(`${fetchUrl}/api/partner/suppliers/`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        })
            .then(res => res.json())
            .then(data => setSuppliers(data))


    }, [accessToken]);

    // useEffect(() => {
    //     const newpd = products && products.sort((a, b) => parseFloat(b.id) - parseFloat(a.id)).slice(0)
    //     setSortProducts(newpd)
    // },[products])
    const handleProductChange = (id) => {
        const product = products.find(p => Number(p.id) === Number(id));
        setSelectedProduct(product);
        if (product.has_price_variations && product.price_variations) {
            const parsed = JSON.parse(product.price_variations);
            const prepared = parsed.map(v => ({
                ...v,
                addQuantity: 0,
                newStock: v.stock
            }));
            setVariantStocks(prepared);
        }
    };

    
    const handleVariantStockChange = (index, value) => {
        const updated = [...variantStocks];
        updated[index].addQuantity = parseInt(value, 10) || 0;
        updated[index].newStock = Number(updated[index].stock || 0) + updated[index].addQuantity;
        setVariantStocks(updated);
    };

    const handleSupplierChange = (id) => {
        const supplier = suppliers.find(s => Number(s.id) === Number(id));

        setSelectedSupplier(supplier);
        setPreviousBalance(supplier.balance);
    };

    const totalQuantity = adjustVariants
        ? variantStocks.reduce((sum, v) => sum + Number(v.addQuantity || 0), 0)
        : Number(quantity);

    const newTotalQuantity = adjustVariants
        ? variantStocks.reduce((sum, v) => sum + Number(v.newStock || 0), 0)
        : Number(selectedProduct && selectedProduct.stock) + Number(quantity);

    const purchasePrice = selectedProduct ? selectedProduct.purchase_price : 0;
    const totalPrice = adjustVariants
        ? variantStocks.reduce((sum, v) => sum + Number(v.newStock * v.purchasePrice || 0), 0)
        : Number(totalQuantity * purchasePrice);

    const payAble = totalPrice + (preBlance ? previousBalance : 0) - Number(discounst);
    const totalDue = totalPrice + previousBalance - Number(discounst);
    const newBalance = totalDue - Number(payAmount);
    const todayDue = payAble - payAmount



    const updateSupplierBalance = () => {
        const formData = new FormData()
        formData.append('balance', newBalance)
        fetch(`${fetchUrl}/api/partner/suppliers/${selectedSupplier.id}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "PATCH",
            body: formData
        })
            .then(res => {
                setIsLoading(false)
                if (res.ok) {
                    setShowAlert(true)
                    setAlertText(` Update Success`)
                    setAlertVariant('success')
                    navigate(0)

                }

                else {
                    setIsLoading(false)
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


    const updateStocks = () => {
        const formData = new FormData()
        formData.append('price_variations', JSON.stringify(adjustVariants ? variantStocks.map(v => ({ name: v.name, price: v.price, purchasePrice: v.purchasePrice, stock: v.newStock })) : variantStocks.map(v => ({ name: v.name, price: v.price, purchasePrice: v.purchasePrice, }))))
        formData.append('stock', Number(newTotalQuantity))
        fetch(`${fetchUrl}/api/products/update/${selectedProduct.slug}/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "PATCH",
            body: formData
        })
            .then(res => {

                if (res.ok) {
                    updateSupplierBalance()
                }

                else {
                    setIsLoading(false)
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

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();
        const formData = new FormData()
        formData.append(' supplier_name', selectedSupplier.name)
        formData.append("supplier_id", selectedSupplier.id)
        formData.append('product_name', selectedProduct.name)
        formData.append('product_slug', selectedProduct.slug)
        formData.append('pay_amount', payAmount)
        formData.append('total_quantity', quantity)
        formData.append('total_price', totalPrice)
        formData.append('discount', discounst)
        formData.append('due', Number(todayDue))
        formData.append('new_blance', newBalance)
        formData.append('previous_blance', preBlance ? previousBalance : 0)



        fetch(`${fetchUrl}/api/partner/purchase/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "POST",
            body: formData
        })
            .then(res => {

                if (res.ok) {
                    updateStocks()
                }
                else {
                    setIsLoading(false)
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

        const data = {
            product_id: selectedProduct.id,
            supplier_id: selectedSupplier.id,
            quantity,
            pay_amount: payAmount,
            variant_stock_adjust: adjustVariants,
            variant_updates: adjustVariants ? variantStocks.map(v => ({ name: v.name, price: v.price, stock: v.addQuantity })) : []
        };
        // await axios.post('/api/purchase/', data);
        // // eslint-disable-next-line no-alert
        // alert('Purchase submitted!');
        console.log(data);
    };

    return (
        <div>
            {isLoading ? <Loading /> : null}
            <div className='NavRow'>
                <div>
                    <SideNav />
                </div>
                <div className='bodyLayout '>
                    <div className="purchase-form">
                        <h2 className="title">Add Purchase</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-groupx">
                                <label>Select Product</label>
                                <select required onChange={(e) => { handleProductChange(e.target.value); setAdjustVariants(false) }}>
                                    <option value="">--Select--</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedProduct && selectedProduct.has_price_variations && (
                                <div className="form-groupx checkbox">
                                    <label>
                                        <input type="checkbox" onChange={(e) => setAdjustVariants(e.target.checked)} /> Adjust Stock by Variants
                                    </label>
                                </div>
                            )}

                            {adjustVariants ? (
                                <div>
                                    <div className="variant-stock-list">
                                        <div className="variant-row">
                                            <div className="variant-name">V. Name</div>
                                            <div className="variant-stock">P Price</div>
                                            <div className="variant-stock">Current</div>
                                            <div>Quantity</div>
                                            <div className="variant-new-stock ms-5">New</div>
                                        </div>
                                        {variantStocks.map((variant, idx) => (
                                            <div key={idx} className="variant-row">
                                                <div className="variant-name">{variant.name}</div>
                                                <div className="variant-name">{variant.purchasePrice}</div>
                                                <div className="variant-stock"> {variant.stock}</div>
                                                <input
                                                    min={1}
                                                    type="number"
                                                    placeholder="Add Quantity"
                                                    value={variant.addQuantity}
                                                    onChange={(e) => handleVariantStockChange(idx, e.target.value)}
                                                />
                                                <div className="variant-new-stock ms-3">{variant.newStock}</div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            ) : (
                                <div className="form-groupx">
                                    <label>Total Quantity</label>
                                    <input required type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min={1} disabled={adjustVariants} />
                                </div>
                            )}
                            <div> {!adjustVariants ? <div className="summary">Purchase Price: ৳ {purchasePrice} /1p</div> : null}</div>
                            <div className="summary">Total Quantity: {totalQuantity}</div>
                            <div className="summary mb-3">Total Price: ৳ {totalPrice}</div>
                            <div className="form-groupx">
                                <label>Select Supplier</label>
                                <select required onChange={(e) => handleSupplierChange(e.target.value)}>
                                    <option value="">--Select--</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='form-check'>
                                <input defaultChecked={preBlance} onChange={(e) => SetPreBlance(e.target.checked)} className='form-check-input ' type="checkbox" name="" id="" />
                                <label className='from-check-label' htmlFor="preBlance">
                                    <div style={{ font: '#444', fontFamily: 'Segoe UI', fontWeight: '600' }}>Previous Balance: ৳ {previousBalance}</div>
                                </label>
                            </div>

                            <div className="form-groupx mt-4">
                                <label>Discount</label>
                                <input type="number" value={discounst} onChange={(e) => setDicount(e.target.value)} />
                            </div>
                            <div className="summary">Payable Ammount: ৳ {payAble}</div>
                            <div className="form-groupx">
                                <label>Payment Amount</label>
                                <input required min={0} type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
                            </div>
                            <div className="summary">Today Due: ৳ {todayDue}</div>
                            <div className="summary">Supplier Balance: ৳{newBalance} {newBalance > 0 ? <small className='text-danger'>(পাবে)</small> : <small className='text-success'>(পাবো)</small>}</div>

                            <button type="submit" className="submit-btn">Submit Purchase</button>
                        </form>
                    </div>

                </div>
            </div>
        </div>

    );
}

export default PurchaseForm;
