import React, { Component } from 'react';
import Cookies from "js-cookie";
import { withTranslation, Trans } from 'react-i18next';

import Tour from "reactour";
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";
import UtilityFunction from '../../main/modules/UtilityFunction';
import { UtilityManager } from '../../main/modules/UtilityManager';
import ALink from '@material-ui/core/Link';


class TutorialTour extends Component {
    state = {
        isTourOpen: false,
        auth0_uid: '',
        email: '',
        storeID: ''
    };

    componentDidMount() {
        let cookieValue = Cookies.get('auth0_uid');

        if (this.state.storeID.length === 0 || this.state.auth0_uid.length === 0) {
            UtilityManager.getInstance().storeInfoLookup(cookieValue).then((resultStoreInfo) => {
                this.setState({
                    auth0_uid: resultStoreInfo[0].auth0_uid,
                    email: resultStoreInfo[0].email,
                    storeID: resultStoreInfo[0].storeID
                });
            });
        }

        setTimeout(() => {
            let isWatchedTutorial = Cookies.get("isWatchedTutorial");

            if (!isWatchedTutorial) {
                this.setState({ isTourOpen: true });
            }
        }, 2000);

    }

    disableBody = target => disableBodyScroll(target);
    enableBody = target => { document.body.style.overflowY = 'auto'; enableBodyScroll(target); clearAllBodyScrollLocks(); }

    closeTour = () => {
        this.setState({ isTourOpen: false }, () => {
            clearAllBodyScrollLocks();
        });
    };

    openTour = () => {
        this.setState({ isTourOpen: true });
    };


    render() {

        const { isTourOpen } = this.state;
        const accentColor = "#ec3390";
        const lineURL = process.env.REACT_APP_LINE_URL || "https://lin.ee/wj86cIh"

        let tourConfig = [];
        if (this.state.isTourOpen) {
            let mobileScreen = window.matchMedia("(max-width: 1280px)");
            if (mobileScreen.matches) {
                tourConfig = [
                    {
                        selector: '',
                        content: <Trans i18nKey="tutorial.welcome">Welcome</Trans>
                    },
                    {
                        selector: '#user-menu',
                        content: <Trans i18nKey="tutorial.connect-channels">Connect Channels</Trans>
                    },
                    {
                        selector: '#navbar-mobile-toggle-btn',
                        content: <Trans i18nKey="tutorial.create-product">Create Product</Trans>
                    },
                    {
                        selector: '#navbar-mobile-toggle-btn',
                        content: <Trans i18nKey="tutorial.create-live">Create Live</Trans>
                    },
                    {
                        selector: '#user-manual-btn',
                        content: <Trans i18nKey="tutorial.download-user-manual">Download User Manual</Trans>
                    },
                    {
                        selector: '.intercom-launcher-frame',
                        content: <div>
                            <Trans i18nKey="tutorial.chat-with-us">Chat with Us</Trans>
                            <ALink style={{ color: "#f00" }} href={lineURL} target="_blank" rel="noopener noreferrer">
                                <Trans i18nKey="live-event.here">here</Trans></ALink>
                        </div>
                    }
                ];
            } else {
                tourConfig = [
                    {
                        selector: '',
                        content: <Trans i18nKey="tutorial.welcome">Welcome</Trans>
                    },
                    {
                        selector: '#store-profile-card-connect-channels',
                        content: <Trans i18nKey="tutorial.connect-channels">Connect Channels</Trans>
                    },
                    {
                        selector: '#nav-menu-products',
                        content: <Trans i18nKey="tutorial.create-product">Create Product</Trans>
                    },
                    {
                        selector: '#nav-menu-orders',
                        content: <Trans i18nKey="tutorial.check-order">Check Order</Trans>
                    },
                    {
                        selector: '#nav-menu-live',
                        content: <Trans i18nKey="tutorial.create-live">Create Live</Trans>
                    },
                    {
                        selector: '#user-manual-btn',
                        content: <Trans i18nKey="tutorial.download-user-manual">Download User Manual</Trans>
                    },
                    {
                        selector: '.intercom-launcher-frame',
                        content: <div>
                            <Trans i18nKey="tutorial.chat-with-us">Chat with Us</Trans>
                            <ALink style={{ color: "#f00" }} href={lineURL} target="_blank" rel="noopener noreferrer">
                                <Trans i18nKey="live-event.here">here</Trans></ALink>
                        </div>
                    }
                ];
            }
        }

        return (

            tourConfig.length > 0 ? (
                <Tour
                    onRequestClose={() => {
                        Cookies.set('isWatchedTutorial', true);
                        this.closeTour();
                    }}
                    steps={tourConfig}
                    isOpen={isTourOpen}
                    maskClassName="mask"
                    className="helper"
                    rounded={5}
                    accentColor={accentColor}
                    onAfterOpen={this.disableBody}
                    onBeforeClose={this.enableBody}
                    prevButton={<Trans i18nKey="main.back-btn">Back</Trans>}
                    nextButton={<Trans i18nKey="main.next-btn">Next</Trans>}
                    lastStepNextButton={<button onClick={() => {
                        Cookies.set('isWatchedTutorial', true);
                        UtilityFunction.tagManagerPushDataLayer("Platform", "Click", "Click close TutorialTour", UtilityFunction.getExistValue(this.state.auth0_uid, "Anonymous"));
                    }}><Trans i18nKey="main.let-live-btn">Let's LIVE</Trans></button>}
                    closeWithMask={false}
                />
            ) : null

        );
    }
}


export default (withTranslation()(TutorialTour));
