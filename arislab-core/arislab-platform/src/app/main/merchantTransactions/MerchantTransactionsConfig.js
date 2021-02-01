import { FuseLoadable } from '@fuse';

export const MerchantTransactionsConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/platform/merchantTransactions',
            component: FuseLoadable({
                loader: () => import('./merchantTransactionsManagement/MerchantTransactions')
            })
        }
    ]
};