import Landing from './Landing';

export const LandingConfig = {
    settings: {
        layout: {
            config: {
                navbar: {
                    display: false
                },
                createStoreBar: {
                    display: true
                },
                toolbar: {
                    display: false
                },
                footer: {
                    display: false
                },
                leftSidePanel: {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    routes: [
        {
            path: '/',
            component: Landing
        }
    ]
};