import React from 'react';
import { AppBar, MuiThemeProvider, Toolbar, Grid } from '@material-ui/core';
import connect from 'react-redux/es/connect/connect';
import Classnames from 'classnames';
import { withStyles } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import SmartphoneIcon from '@material-ui/icons/Smartphone';

import { Trans, withTranslation } from 'react-i18next';

const styles = theme => ({
    footer: {
        color: '#FFFFFF',
        backgroundColor: '#150433'
    },
    footerContent: {
        width: '100%',
        maxWidth: '1280px',
        margin: 'auto'
    },
    copyRightArea: {
        color: '#D4D4D4',
        [theme.breakpoints.up('lg')]: {
            color: '#FFFFFF',
            backgroundColor: '#EB3390',
        }
    },
    copyRightContent: {
        width: '100%',
        maxWidth: '1280px',
        margin: 'auto'
    }
});

const FooterLayout = ({ classes, footerTheme }) => {

    const web = process.env.REACT_APP_HOME_PAGE_URL || 'https://www.arislab.ai';
    const showTelNumber = process.env.REACT_APP_CONTACT_TEL_NUMBER_DISPLAY || '061-286-6328';
    const tel = process.env.REACT_APP_CONTACT_TEL_NUMBER || '0612866328';
    const email = process.env.REACT_APP_CONTACT_EMAIL || 'contactus@arislab.ai';
    const fb = process.env.REACT_APP_FACEBOOK_URL || 'https://www.facebook.com/arislablive/';
    // const ig = process.env.REACT_APP_INSTAGRAM_URL || '';
    // const medium = process.env.REACT_APP_MEDIUM_URL || '';

    const createdYear = process.env.REACT_APP_CREATED_YEAR || 2019;
    const currentYear = new Date().getFullYear().toString();      
    var copyrightYear = createdYear;

    if (currentYear !== createdYear){
        copyrightYear += ' - ' + currentYear;
    }

    return (
        // <MuiThemeProvider theme={footerTheme}>
        //     <AppBar id="fuse-footer" className="relative z-10" color="default">
        //         <Toolbar className="px-16 py-0 flex items-center">
        //             <Typography>
        //                 Footer
        //             </Typography>
        //         </Toolbar>
        //     </AppBar>
        // </MuiThemeProvider>

        <MuiThemeProvider theme={footerTheme}>
            <AppBar id="fuse-footer" className={Classnames("hidden lg:flex relative z-10", classes.footer)}>
                <Toolbar className={Classnames("flex items-center", classes.footerContent)}>
                    <Grid container className="py-56 mb-56">
                        <Grid item xs={3}>
                            <img alt="Footer Logo" src='assets/images/logos/aris-white.png' width = '150' />
                            {/* <Typography className="text-lg text-white">
                                Enter text here
                            </Typography> */}
                        </Grid>
                        <Grid item xs={2}>
                            <span className="text-white text-lg font-black" style={{fontFamily: 'Mplus 1p', borderBottom: '2px solid #EB3390'}}>
                                M E N U
                            </span>
                            <ul className="mt-12 list-reset">
                                <li>
                                    <a href={web}><Trans i18nKey="navigationMenu.home">Home</Trans></a>
                                </li>
                                {/* <li className='mt-12'>
                                    <a href=''><Trans i18nKey="navigationMenu.about-us">About us</Trans></a>
                                </li>
                                <li className='mt-12'>
                                    <a href=''><Trans i18nKey="navigationMenu.contact-us">Contact us</Trans></a>
                                </li> */}
                            </ul>

                        </Grid>
                        <Grid item xs={2}>
                            <span className="text-white text-lg font-black" style={{ fontFamily: 'Mplus 1p', borderBottom: '2px solid #EB3390' }}>
                                S E R V I C E S
                            </span>
                            <ul className="mt-12 list-reset">
                                <li className='mt-12'>
                                    <a href='/platform/lives'><Trans i18nKey="navigationMenu.live">Live</Trans></a>
                                </li>
                                {/* <li className='mt-12'>
                                    <a href='/platform/setting/chatbotManagement'>Chatbot</a>
                                </li> */}
                                <li className='mt-12'>
                                    <a href='/platform/products'><Trans i18nKey="navigationMenu.products">Products</Trans></a>
                                </li>
                                <li className='mt-12'>
                                    <a href='/platform/orders'><Trans i18nKey="navigationMenu.orders">Orders</Trans></a>
                                </li>
                                {/* <li className='mt-12'>
                                    <a href=''><Trans i18nKey="navigationMenu.dashboard">Dashboard</Trans></a>
                                </li> */}
                            </ul>
                        </Grid>
                        <Grid item xs={3}>
                            <span  className="text-white text-lg font-black" style={{ fontFamily: 'Mplus 1p', borderBottom: '2px solid #EB3390' }}>
                                C O N T A C T &nbsp;&nbsp;U S
                            </span>
                            <ul className="mt-12 list-reset">
                                <li className='mt-12 flex items-center'>
                                    <EmailIcon className="mr-6" fontSize="small" />
                                    <a href={"mailto:" + email}> {email} </a>
                                </li>
                                <li className='mt-12 flex items-center'>
                                    <SmartphoneIcon className="mr-6" fontSize="small" />
                                    <a href={"tel:" + tel}> {showTelNumber} </a>
                                </li>
                            </ul>
                        </Grid>
                        <Grid item xs={2}>
                            <span className="text-white text-lg font-black" style={{ fontFamily: 'Mplus 1p', borderBottom: '2px solid #EB3390' }}>
                                F O L L O W  U S
                            </span>
                            <div className='mt-24'>
                                <a href={fb} target="_blank" rel="noopener noreferrer">
                                    <img alt="Facebook Logo" src='assets/images/logos/fb.png' />
                                </a>
                                {/* <a href={ig} target="_blank" className="ml-24" rel="noopener noreferrer">
                                    <img alt="Instagram Logo" src='assets/images/logos/ig.png' />
                                </a>
                                <a href={medium} target="_blank" className="ml-24" rel="noopener noreferrer">
                                    <img alt="Medium Logo" src='assets/images/logos/m.png' />
                                </a> */}
                            </div>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <div className={Classnames("relative flex z-10", classes.copyRightArea)}>
                <div className={Classnames("flex items-center justify-center p-8", classes.copyRightContent)}>
                    &copy; {copyrightYear} Aris Company. All rights reserved.
                </div>
            </div>
        </MuiThemeProvider>
    );
};

function mapStateToProps({ fuse }) {
    return {
        footerTheme: fuse.settings.footerTheme
    }
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps)(withTranslation()(FooterLayout)));
