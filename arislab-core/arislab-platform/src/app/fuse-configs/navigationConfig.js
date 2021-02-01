import i18n from '../../app/i18n';

const navigationConfig = [
    {
        'id': 'menu',
        'title': 'Menu',
        'type': 'group',
        'icon': 'apps',
        'children': [
            {
                'id': 'dashboard-component',
                'title': i18n.t('navigationMenu.dashboard'),
                'type': 'item',
                'icon': 'dashboard',
                'url': '/platform/dashboard'
            },
            {
                'id': 'live-component',
                'title': i18n.t('navigationMenu.live'),
                'type': 'item',
                'icon': 'live_tv',
                'url': '/platform/lives'
            },
            {
                'id': 'productManagement-component',
                'title': i18n.t('navigationMenu.products'),
                'type': 'item',
                'icon': 'library_books',
                'url': '/platform/products'
            },
            {
                'id': 'orderManagement-component',
                'title': i18n.t('navigationMenu.orders'),
                'type': 'item',
                'icon': 'receipt',
                'url': '/platform/orders'
            },
            {
                'id': 'label-generator-external-url',
                'title': i18n.t('navigationMenu.label_generator'),
                'type': 'link',
                'icon': 'label',
                'url': 'https://logistic-label.arislab.ai/',
                'target': '_blank'
            },
            {
                'id': 'merchantTransactions-component',
                'title': i18n.t('navigationMenu.transactions'),
                'type': 'item',
                'icon': 'receipt',
                'url': '/platform/merchantTransactions'
            }
        ]
    }
];

export default navigationConfig;