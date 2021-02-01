import React, { Component } from 'react';
import { Button, Popover, MenuItem } from '@material-ui/core';
import * as Actions from '../../main/setting/store/actions';
import reducer from '../../main/setting/store/reducers';
import { connect } from 'react-redux';
import * as authActions from 'app/auth/store/actions';
import { bindActionCreators } from 'redux';
import { UtilityManager } from '../../main/modules/UtilityManager';
import UtilityFunction from '../../main/modules/UtilityFunction';
import Cookies from "js-cookie";
import withReducer from 'app/store/withReducer';
import { withRouter } from 'react-router-dom';
import { withTranslation, Trans } from 'react-i18next';

import { Zoom, Divider } from '@material-ui/core';

class UserManualButton extends Component {

    state = {
        auth0_uid: "",
        email: "",
        storeID: "",
        displayUserManual: null
    };

    componentDidMount() {
        // let cookieValue = Cookies.get('email');
        let cookieValue = Cookies.get('auth0_uid');

        UtilityManager.getInstance().storeInfoLookup(cookieValue).then((resultStoreInfo) => {

            this.setState({
                auth0_uid: resultStoreInfo[0].auth0_uid,
                email: resultStoreInfo[0].email,
                storeID: resultStoreInfo[0].storeID
            });
        });
    }

    toggleUserManual = (event) => {

        let displayUserManual = null;
        if( !Boolean(this.state.displayUserManual) ) {
            displayUserManual = event.currentTarget;
        }

        this.setState({ displayUserManual: displayUserManual });
    }

    openUserManualLink = (event, dataObj) => {
        let url = dataObj.url;
        let userManual = dataObj.name;
        UtilityFunction.tagManagerPushDataLayer("Platform", "Click", "View user manual '"+userManual+"'", UtilityFunction.getExistValue(this.state.auth0_uid, "Anonymous"));
        
        this.toggleUserManual(event);
        window.open(url, "_blank");
    }


    render() {

        const { displayUserManual } = this.state;
        const userManualList = [
            {
                name: "Register with ARIS",
                i18nKey: "navigationMenu.registert-user-manual",
                url: `https://drive.google.com/file/d/1O2JqQ6DFpUcWjbE80sZW2cojtM3Ktl7o/view`
            },
            {
                name: "Use automated sales Chatbot",
                i18nKey: "navigationMenu.use-chatbot-user-manual",
                url: `https://drive.google.com/file/d/1pH8R51ZDFu2PVhvgs_zyKaKEPyOaqjny/view`
            },
            {
                name: "Use LIVE Overlay feature",
                i18nKey: "navigationMenu.use-live-overlay-user-manual",
                url: `https://drive.google.com/file/d/1S-IQqNqQ1YBsJldA_5y52rTviRZwQFZg/view`
            },
            {
                name: "Update payment settings",
                i18nKey: "navigationMenu.payment-setting-user-manual",
                url: `https://drive.google.com/file/d/1AMfB9R2sJawzKhP-igF80I6tnQOedB33/view`
            }
        ];

        return (

            this.props.open ? (
                <div className="flex">
                    <Zoom in={true} style={{ transitionDelay: '2000ms'}}>
                        <div className="flex">
                            <Button id="user-manual-btn" className="w-8 mr-8" onClick={this.toggleUserManual}>
                                <img className="w-1/2" src="assets/images/etc/info-icon-btn.png" alt="Tutorial" />
                            </Button>
                            <Popover
                                open={Boolean(displayUserManual)}
                                anchorEl={displayUserManual}
                                onClose={this.toggleUserManual}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                                classes={{
                                    paper: "py-8"
                                }}
                            >
                                <div>
                                    <div className="text-center my-12 text-lg">
                                        <Trans i18nKey="navigationMenu.user-manual">User Manual</Trans>
                                    </div>
                                    <Divider />
                                    {userManualList.map((userManualItem) => {
                                        return (
                                            <MenuItem key={userManualItem.i18nKey} onClick={(event) => this.openUserManualLink(event, userManualItem)}>
                                                <Trans i18nKey={userManualItem.i18nKey}>{userManualItem.name}</Trans>
                                            </MenuItem>
                                        );
                                    })}
                                </div>

                            </Popover>
                        </div>
                    </Zoom>

                </div>
            ) : null 
            
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // setUserDataAuth0: authActions.setUserDataAuth0,
        // showMessage: Actions.showMessage,
        getBusinessProfile: Actions.getBusinessProfile,
        logout: authActions.logoutUser
    }, dispatch);
}

function mapStateToProps({ storeManagement }) {
    return {
        // user: auth.user,
        businessProfile: storeManagement.businessProfile

    }
}

export default withReducer('storeManagement', reducer)(withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(UserManualButton))));
