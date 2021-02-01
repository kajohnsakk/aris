import React from 'react';
import withReducer from 'app/store/withReducer';
import reducer from '../../store/reducers';

const TaxShippingSettings = () => {
    return (
        <div className="p-24">
            <h4>Tax & Shipping settings</h4>
            <h5>TBA</h5>
            <br />
        </div>
    )
}

export default withReducer('storeManagement', reducer)(TaxShippingSettings);