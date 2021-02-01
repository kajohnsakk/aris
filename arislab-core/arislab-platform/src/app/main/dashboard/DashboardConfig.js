import { FuseLoadable } from '@fuse';

export const DashboardConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/platform/dashboard',
            component: FuseLoadable({
                loader: () => import('./Dashboard')
            })
        }
    ]
};