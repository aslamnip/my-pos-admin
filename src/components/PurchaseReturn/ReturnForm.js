import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { AllContext } from '../../AllContext';

function ReturnPurchaseForm({ fetchUrl, accessToken, setShow, setIsLoading }) {
    const { products, setAlertText, setAlertVariant, setShowAlert } = useContext(AllContext)
    // const { setShowAlert, setAlertText, setAlertVariant, products } = useContext(AllContext)
    const [suppliers, setSuppliers] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [variantStocks, setVariantStocks] = useState([]);
    const [variantStocksPrice, setVariantStocksPrice] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [reducedQuantity, setReducedQuantity] = useState(0);
    const [refundAmount, setRefundAmount] = useState(0);
    const [refundAbleAmount, setRefundAbleAmount] = useState(0);
    const [newBalance, setNewBalance] = useState(0);
    const [reason, setReason] = useState('');
   const route = useNavigate()

    // Fetch products and suppliers
    useEffect(() => {

        fetch(`${fetchUrl}/api/partner/suppliers/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then((res) => res.json())
            .then((data) => setSuppliers(data));
    }, [fetchUrl, accessToken]);
    const handleProductChange = (productId) => {
        const product = products.find((p) => Number(p.id) === Number(productId));
        setSelectedProduct(product);

        if (product && product.has_price_variations) {
            const parsedVariants = JSON.parse(product.price_variations).map((variant) => ({
                ...variant,
                reducedQuantity: 0, // Add reducedQuantity field for user input
            }));
            setVariantStocks(parsedVariants);
        } else {
            setVariantStocks([]); // No variants
        }
    };

    const handleVariantStockChange = (index, value) => {
        const updatedVariants = [...variantStocks];
        updatedVariants[index].reducedQuantity = Number(value);
        setVariantStocks(updatedVariants);


    };

    useEffect(() => {
        const x = variantStocks.map((v) => ({ name: v.name, price: v.price, purchasePrice: v.purchasePrice, stock: Number(v.stock) - Number(v.reducedQuantity) }))
        setVariantStocksPrice(x)
    }, [variantStocks, selectedProduct, selectedSupplier])
    const handleSupplierChange = (supplierId) => {
        const supplier = suppliers && suppliers.find((s) => Number(s.id) === Number(supplierId));
        setSelectedSupplier(supplier);
        setNewBalance(supplier.balance); // Initialize with supplier's current balance
    };

    const calculateNewBalance = () => {
        const totalReducedAmount = variantStocks.length
            ? variantStocks.reduce(
                (sum, variant) => variant && sum + variant.reducedQuantity * variant.purchasePrice,
                0
            )
            : reducedQuantity * (selectedProduct && selectedProduct.purchase_price || 0);
        setRefundAbleAmount(totalReducedAmount);
        return (selectedSupplier && Number(selectedSupplier.balance) || 0) + Number(refundAmount) - Number(totalReducedAmount);

    };
    const newTotalQuantity = selectedProduct && selectedProduct.has_price_variations ?
      variantStocksPrice.reduce(
        (sum, variant) => variant && sum + variant.stock ,
        0
    ): reducedQuantity
    useEffect(() => {
        setNewBalance(calculateNewBalance());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reducedQuantity, refundAmount, variantStocks, selectedSupplier, selectedProduct]);
    
    const handleSubmit = (e) => {
        setShow(false)
        setIsLoading(true)
        e.preventDefault();
        const formData = new FormData()
        formData.append('product', Number(selectedProduct.id))
        formData.append('product_name', (selectedProduct.name))
        formData.append('product_slug', (selectedProduct.slug))
        formData.append('supplier', Number(selectedSupplier.id))
        formData.append('supplier_name', (selectedSupplier.name))
        formData.append('quantity', Number(newTotalQuantity))
        formData.append('reason',  reason)
        formData.append('price_variations', JSON.stringify(variantStocksPrice))
        formData.append('refund_amount', Number(refundAmount))
        formData.append('new_balance', Number(newBalance.toFixed(2)))
        fetch(`${fetchUrl}/api/partner/purchase/returns/`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
            method: "POST",
            body: formData
        })
            .then(res => {

                if (res.ok) {
                    setIsLoading(false)
                    setShowAlert(true)
                    setAlertText(`Add Success`)
                    setAlertVariant('success')
                    route(0)
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

    };

    useEffect(() => {
        setReducedQuantity(0)
        setRefundAmount(0)
    }, [selectedProduct, selectedSupplier])

    return (
        <div className="container mt-4">
          
            <h2 className="text-center mb-4">Add Return Purchase</h2>
            <Form onSubmit={handleSubmit}>
                {/* Product Selection */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>
                        Product
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Select required onChange={(e) => handleProductChange(e.target.value)}>
                            <option value="">Select a Product</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Form.Group>

                {/* Variant Stocks */}
                {selectedProduct && selectedProduct.has_price_variations && (
                    <div className='variant-stock-list'>
                        <h5 className='my-3'>Product Variations</h5>
                        <div className="mb-3 row">
                            <div className='col-2'>
                                V. Name
                            </div>
                            <div className='col-2'>
                                P. Price
                            </div>
                            <div className='col-3'>
                                Quantity
                            </div>
                            <div className='col-3 ms-3'>
                                R. Ammount
                            </div>
                        </div>
                        {variantStocks.map((variant, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={index} className="mb-3 row">
                                <div className='col-2'>
                                    {variant.name}
                                </div>
                                <div className='col-2'>
                                    {variant.purchasePrice}
                                </div>
                                <div className='col-3'>
                                    <Form.Control
                                        type="number"
                                        min={0}
                                        max={variant.stock}
                                        value={variant.reducedQuantity}
                                        onChange={(e) =>
                                            handleVariantStockChange(index, e.target.value)
                                        }
                                        placeholder="Reduce Quantity"
                                    />
                                </div>
                                <div className='col-3 ms-3'>
                                    {variant.purchasePrice * variant.reducedQuantity}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Quantity for Non-Variant Products */}
                {selectedProduct && !selectedProduct.has_price_variations && (
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={4}>
                            Quantity *  <small className='text-muted'>{selectedProduct.purchase_price} tk</small>
                        </Form.Label>
                        <Col sm={8}>
                            <Form.Control
                                type="number"
                                min={1}
                                value={reducedQuantity}
                                onChange={(e) => setReducedQuantity(e.target.value)}
                                placeholder="Enter Quantity to Reduce"
                            />
                        </Col>
                    </Form.Group>
                )}
                <div className='row'><p className='col-4'>Refundable Ammount :</p> <div className='col-7 ms-2'>{refundAbleAmount}</div></div>
                {/* Supplier Selection */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>
                        Supplier
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Select required onChange={(e) => handleSupplierChange(e.target.value)}>
                            <option value="">Select a Supplier</option>
                            {suppliers && suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>
                </Form.Group>
                <div className='row'><p className='col-4'>Supplier Balance :</p> <div className='col-7 ms-2'>{selectedSupplier &&  selectedSupplier.balance}</div></div>

                {/* Refund Amount */}
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>
                        Refund Amount <small>By Supplier</small>
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="number"
                            min={0}
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(e.target.value)}
                            placeholder="Enter Refund Amount"
                        />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>
                        Reason 
                    </Form.Label>
                    <Col sm={8}>
                        <Form.Control
                            type="text"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter Reason"
                        />
                    </Col>
                </Form.Group>

                {/* New Balance */}
                <div className="mb-3">
                    <h5>Supplier New Balance: ৳ {newBalance.toFixed(2)}</h5>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <Button variant="primary" type="submit">
                        Submit Return
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export default ReturnPurchaseForm;
