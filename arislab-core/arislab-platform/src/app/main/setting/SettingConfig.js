// import React from 'react';
// import { Redirect } from 'react-router-dom';
import { FuseLoadable } from '@fuse';

export const SettingConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/platform/setting/delivery',
            component: FuseLoadable({
                loader: () => import('./storeManagement/delivery/delivery')
            })
        },
        {
            path: '/platform/setting/payment',
            component: FuseLoadable({
                loader: () => import('./storeManagement/payment/payments')
            })
        },
        {
            path: '/platform/setting/storeManagement',
            component: FuseLoadable({
                loader: () => import('./storeManagement/StoreManagement')
            })
        },
        {
            path: '/platform/setting/salesChannels',
            component: FuseLoadable({
                loader: () => import('./channelManagement/Facebook/Facebook')
            })
        },
        {
            path: '/platform/setting/chatbotManagement',
            component: FuseLoadable({
                loader: () => import('./chatbotManagement/ChatbotManagement')
            })
        },
        {
            path: '/platform/setting',
            component: FuseLoadable({
                loader: () => import('./setting/Settings')
            })
        }
    ]
};