// import LiveStudio from './liveStudio/LiveStudio'
// import LiveEvent from './liveEvent/LiveEvents';
import { FuseLoadable } from '@fuse';

export const LiveConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/platform/lives/studio/:eventID',
            component: FuseLoadable({
                loader: () => import('./liveStudio/LiveStudio')
            })
        },
        {
            path: '/platform/lives/:eventID',
            component: FuseLoadable({
                loader: () => import('./liveEvent/LiveEvent')
            })
        },
        {
            path: '/platform/lives',
            component: FuseLoadable({
                loader: () => import('./liveEvent/LiveEvents')
            })
        }
    ]
};