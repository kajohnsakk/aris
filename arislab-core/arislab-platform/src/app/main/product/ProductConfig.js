// import React from 'react';
// import { Redirect } from 'react-router-dom';
import { FuseLoadable } from '@fuse';

export const ProductConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/platform/products/:productId/:productHandle?',
            component: FuseLoadable({
                loader: () => import('./productManagement/Product')
            })
        },
        {
            path: '/platform/products',
            component: FuseLoadable({
                loader: () => import('./productManagement/Products')
            })
        }
    ]
};