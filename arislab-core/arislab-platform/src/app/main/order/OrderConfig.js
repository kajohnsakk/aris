// import React from 'react';
// import { Redirect } from 'react-router-dom';
import { FuseLoadable } from '@fuse';

export const OrderConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/platform/orders',
            component: FuseLoadable({
                loader: () => import('./orderManagement/Orders')
            })
        }
    ]
};