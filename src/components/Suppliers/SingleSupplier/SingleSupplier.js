import React from 'react';
import { useParams } from 'react-router-dom';
import AddPartner from '../../AddPartner/AddPartner';

function SingleSupplier() {
    const {partnerId} = useParams()
    return (
        <div>
            <AddPartner fetchPartnerUrl={`api/partner/suppliers/${partnerId}/`} postMethod='PATCH' submitButton ='UPDATE SUPPLIER'  succeessUrl = '/partner/suppliers' />
        </div>
    );
}

export default SingleSupplier;