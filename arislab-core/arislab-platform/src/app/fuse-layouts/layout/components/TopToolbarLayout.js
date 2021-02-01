import React from 'react';
import { withStyles } from '@material-ui/core';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import SmallLanguageMenu from 'app/fuse-layouts/shared-components/SmallLanguageMenu';
import Classnames from 'classnames';
import CurrentMenu from 'app/fuse-layouts/shared-components/CurrentMenu';


import { Trans, withTranslation } from 'react-i18next';

const styles = () => ({
    headerNavArea: {
        color: '#FFFFFF',
        background: 'url("assets/images/store-management/wave-header.png") no-repeat ',
        backgroundSize: 'cover',
        width: '100%'
    },
    headerNavContent: {
        width: '100%',
        maxWidth: '1280px',
        margin: 'auto'
    }
});

const TopToolbarLayout = ({ classes }) => {

    const web = process.env.REACT_APP_HOME_PAGE_URL || 'https://www.arislab.ai';
    const showTelNumber = process.env.REACT_APP_CONTACT_TEL_NUMBER_DISPLAY || '061-286-6328';
    const tel = process.env.REACT_APP_CONTACT_TEL_NUMBER || '0612866328';

    return (

        <div className={Classnames("relative flex z-10", classes.headerNavArea)}>
            <div className={Classnames("flex items-center justify-center p-8", classes.headerNavContent)}>
                <div className="flex lg:hidden w-full justify-between items-center">
                    <div className="flex">
                        <NavbarMobileToggleButton className="w-40 h-40 p-0 border border-white rounded border-solid" />
                    </div>

                    <div className="flex">
                        <img alt="Toolbar Logo" src='assets/images/logos/aris-white.png' height="40" />
                    </div>

                    <div className="flex">
                        <CurrentMenu />
                    </div>
                </div>

                <div className="hidden lg:flex w-full">
                    <div className="flex flex-1">
                        <div className='text-white text-xs'>
                            Aris hotline <a href={"tel:"+tel}>{showTelNumber}</a>
                        </div>
                    </div>
                    <div className="flex text-white text-xs">
                        <ul className="list-reset inline-block mr-32">
                            <li className="inline-block mr-32"><a href={web}><Trans i18nKey="navigationMenu.home">Home</Trans></a></li>
                            {/* <li className="inline-block mr-32"><a href=""><Trans i18nKey="navigationMenu.about-us">About us</Trans></a></li>
                            <li className="inline-block"><a href=""><Trans i18nKey="navigationMenu.contact-us">Contact us</Trans></a></li> */}
                        </ul>
                        <SmallLanguageMenu />
                    </div>
                </div>

            </div>
        </div>

    );
};

function mapStateToProps({ fuse }) {
    return {
        settings: fuse.settings.current,
        toolbarTheme: fuse.settings.toolbarTheme
    }
}

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps)(withTranslation()(TopToolbarLayout))));
