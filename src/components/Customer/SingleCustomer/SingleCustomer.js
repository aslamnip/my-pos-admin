import React from 'react';
import { useParams } from 'react-router-dom';
import AddPartner from '../../AddPartner/AddPartner';

function SingleCustomer() {
    const {partnerId} = useParams()
    return (
        <div>
            <AddPartner fetchPartnerUrl={`api/partner/customers/${partnerId}/`} postMethod='PATCH' submitButton ='UPDATE CUSTOMER' succeessUrl = '/partner/customers' />
        </div>
    );
}

export default SingleCustomer;