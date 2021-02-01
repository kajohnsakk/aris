import React, { Component } from 'react';
import {
    Button,
    Switch
} from '@material-ui/core';

import withReducer from 'app/store/withReducer';
import reducer from '../../store/reducers';
import * as Actions from '../../store/actions';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import _ from '@lodash';
import { UtilityManager } from '../../../modules/UtilityManager';
import Cookies from "js-cookie";
import { withTranslation, Trans } from 'react-i18next';

const styles = theme => ({
    card: {
        maxWidth: '100%',
        border: 'solid 1px #ededed',
        paddingBottom: 5
    },
    header: {
        background: '#fbfbfb',
        borderBottom: 'solid 2px #ededed',
        color: '#8d9095',
        fontWeight: 'bolder'
    },
    content: {
        background: '#ffffff',
        paddingTop: '2.5rem',
        paddingBottom: 10,
    },
    button: {
        background: '#e83490',
        color: '#ffffff',
        fontWeight: 'bold',
        border: '0px',
        '&:hover': {
            background: '#e83490',
            color: '#ffffff',
            fontWeight: 'bold',
            border: '0px'
        }
    },
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    formControl: {
        marginBottom: '2.5rem',
    },
    group: {
        margin: '1%'
    },
    disabledInput: {
        background: '#dddddd',
        color: '#AAAAAA'
    },
});

class StoreConfig extends Component {

    state = {
        form: null,
        storeID: '',
        tempDeliverySecondPrice: 0
    }

    componentDidMount() {
        if (this.props.storeID) {
            this.updateStoreConfigState();
        } else {
            // let cookieValue = Cookies.get('email');
            let cookieValue = Cookies.get('auth0_uid');

            UtilityManager.getInstance().storeInfoLookup(cookieValue).then((resultStoreInfo) => {

                this.setState({
                    storeID: resultStoreInfo[0].storeID
                })

                this.props.getStoreConfig({
                    storeID: resultStoreInfo[0].storeID
                });
            });

        }

        this.props.pushTrackingData("View", "View " + this.props.dataLabel);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.storeConfig && !this.state.form)) {
            this.updateFormState();
        }
    }

    componentWillUnmount() {
        this.props.pushTrackingData("Leave", "Leave " + this.props.dataLabel);
    }

    handleChange = (event) => {
        this.setState({
            form: _.set(
                { ...this.state.form },
                event.target.name,
                event.target.type === 'checkbox' ? event.target.checked : event.target.value
            )
        });

        if( event.target.name === "config.useCart" ) {
            let secondPrice = 0;
            if( event.target.checked ) {
                secondPrice = this.state.tempDeliverySecondPrice
            }

            this.setState({
                form: _.set(
                    { ...this.state.form },
                    'delivery.price.additionalPiece',
                    secondPrice
                )
            });

        }
        
    };

    updateFormState = () => {
        this.setState({ form: this.props.storeConfig });
        this.setState({ tempDeliverySecondPrice: this.props.storeConfig.delivery.price.additionalPiece });
    };

    updateStoreConfigState = () => {
        const storeID = this.props.storeID;
        this.props.getStoreConfig({
            storeID: storeID
        });
    };

    render() {
        var storeID;
        if (this.props.storeID) {
            storeID = this.props.storeID;
        } else {
            storeID = this.state.storeID;
        }

        const { saveStoreConfig, classes } = this.props;
        const { form } = this.state;

        let useCart = false;
        // let useCashOnDelivery = false;
        let useCreditCard = false;

        if (form) {
            if (form.hasOwnProperty('config')) {
                if (form.config.hasOwnProperty('useCart')) {
                    useCart = form.config.useCart;
                }

                // if (form.config.hasOwnProperty('useCashOnDelivery')) {
                //     useCashOnDelivery = form.config.useCashOnDelivery;
                // }

                if (form.config.hasOwnProperty('useCreditCard')) {
                    useCreditCard = form.config.useCreditCard;
                }
            }
        }

        return (
            <div className="text-center content-center">
                <div className="store-management-body-container w-full lg:w-2/3 md:my-32 rounded overflow-hidden shadow inline-block">

                    <div className="px-24 sm:px-40 py-20 store-management-header">
                        <div className="font-bold text-xl mb-2 text-left"><Trans i18nKey="settings.store-config.store-config-details">Store Cofig</Trans></div>
                    </div>
                    <form className="py-40 px-24">
                        <div className="text-left w-full flex flex-row align-top mb-32 items-center">
                            <div className="w-1/5">
                                <Trans i18nKey="settings.store-config.use-cart-message">
                                    Use Cart
                                </Trans>
                            </div>
                            <div className="w-4/5">
                                <Switch
                                    checked={useCart}
                                    onChange={this.handleChange}
                                    name="config.useCart"
                                    color="primary"
                                />
                            </div>
                        </div>
                        {/* <div className="text-left w-full flex flex-row align-top mb-32 items-center">
                            <div className="w-1/5">
                                <Trans i18nKey="settings.store-config.use-cash-on-delivery-message">
                                    Use Cash on Delivery
                                </Trans>
                            </div>
                            <div className="w-4/5">
                                <Switch
                                    checked={useCashOnDelivery}
                                    onChange={this.handleChange}
                                    name="config.useCashOnDelivery"
                                    color="primary"
                                />
                            </div>
                        </div> */}
                        <div className="text-left w-full flex flex-row align-top mb-32 items-center">
                            <div className="w-1/5">
                                <Trans i18nKey="settings.store-config.use-credit-card-message">
                                    Use Credit Card
                                </Trans>
                            </div>
                            <div className="w-4/5">
                                <Switch
                                    checked={useCreditCard}
                                    onChange={this.handleChange}
                                    name="config.useCreditCard"
                                    color="primary"
                                />
                            </div>
                        </div>
                        <div className="text-right w-full block">
                            <Button
                                variant="outlined"
                                className={classes.button}
                                onClick={() => {
                                    saveStoreConfig(form, { storeID: storeID });
                                    this.props.pushTrackingData("Click", "Save store config button");
                                    this.props.pushTrackingData("Update", "Update " + this.props.dataLabel);
                                }}
                            >
                                <Trans i18nKey="main.save-btn">
                                    Save
                                </Trans>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getStoreConfig: Actions.getStoreConfig,
        saveStoreConfig: Actions.saveStoreConfig
    }, dispatch);
}

function mapStateToProps({ storeManagement }) {
    return {
        storeConfig: storeManagement.storeConfig
    }
}

export default withReducer('storeManagement', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(StoreConfig)))));