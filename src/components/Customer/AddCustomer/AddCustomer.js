import React from 'react';
import AddPartner from '../../AddPartner/AddPartner';

function AddCustomer() {
    return (
        <div>
            <AddPartner fetchPartnerUrl = 'api/partner/customers/' postMethod = 'POST' submitButton = 'CREATE CUSTOMER' succeessUrl = '/partner/customers'/>
        </div>
    );
}

export default AddCustomer;