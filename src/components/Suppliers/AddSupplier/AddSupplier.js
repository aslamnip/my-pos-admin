import React from 'react';
import AddPartner from '../../AddPartner/AddPartner';

function AddSupplier() {
    return (
        <div>
            <AddPartner fetchPartnerUrl = 'api/partner/suppliers/' postMethod = 'POST' submitButton = 'CREATE SUPPLIER'  succeessUrl = '/partner/suppliers'/>
        </div>
    );
}

export default AddSupplier;