import React from 'react';
import { AppBar, Hidden, Icon, withStyles } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import classNames from 'classnames';
//import UserNavbarHeader from 'app/fuse-layouts/shared-components/UserNavbarHeader';
//import Logo from 'app/fuse-layouts/shared-components/Logo';
//import NavbarFoldedToggleButton from 'app/fuse-layouts/shared-components/NavbarFoldedToggleButton';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import Navigation from 'app/fuse-layouts/shared-components/Navigation';
import ArisLogo from 'app/fuse-layouts/shared-components/ArisLogo';
import LanguageMenu from 'app/fuse-layouts/shared-components/LanguageMenu';
import LanguageIcon from '@material-ui/icons/Language';


const styles = () => ({
    content: {
        overflowX: 'hidden',
        overflowY: 'auto',
        '-webkit-overflow-scrolling': 'touch',
        height: '100%',
        background: '#FFFFFF',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 40px, 100% 10px',
        backgroundAttachment: 'local, scroll'
    }
});


const NavbarLayout = ({ classes, navigation, className }) => {
    return (
        <div className={classNames("flex flex-col overflow-hidden h-full", className)}>
            <AppBar
                color="primary"
                position="static"
                elevation={0}
                //className="flex flex-row items-center flex-shrink h-64 min-h-64 pl-20 pr-12"
                className="flex flex-row items-center flex-shrink min-h-64 pl-20 pr-12 bg-white"
            >
                {/* ซ่อนโลโก้
                <div className="flex flex-1 pr-8">
                    <Logo/>
                </div>

                ซ่อนเบอร์เกอร์สำหรับปิดแถบด้านข้าง
                <Hidden mdDown>
                    <NavbarFoldedToggleButton className="w-40 h-40 p-0"/>
                </Hidden>
                */}

                <div className="flex flex-1 pr-8">
                    <ArisLogo />
                </div>

                <Hidden lgUp>
                    <NavbarMobileToggleButton className="w-40 h-40 p-0 text-black">
                        <Icon>arrow_back</Icon>
                    </NavbarMobileToggleButton>
                </Hidden>

            </AppBar>

            <div className="py-8 flex justify-center items-center">
                <div className="inline-flex mr-8">
                    <LanguageIcon />
                </div>
                <LanguageMenu />
            </div>

            <FuseScrollbars className={classNames(classes.content)}>

                {/* <UserNavbarHeader/> */}

                <Navigation layout="vertical" />

            </FuseScrollbars>
        </div>
    );
};

export default withStyles(styles, { withTheme: true })(NavbarLayout);


