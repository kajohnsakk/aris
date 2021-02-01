import React, { Component } from 'react';
import _ from '@lodash';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import {
    Divider,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput
} from "@material-ui/core";

import { UtilityManager } from '../../../../modules/UtilityManager';
import UtilityFunction from '../../../../modules/UtilityFunction';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import InputMask from 'react-input-mask';
import bankList from '../../../../config/payment/bankList.json';
import { Trans, withTranslation } from 'react-i18next';
import AddFormInfo from '../shared-components/AddFormInfo';
import PinModal from '../shared-components/PinModal';

const styles = theme => ({
    formControl: {
        minWidth: 120,
        width: '100%'
    }
});


class PaymentInfo extends Component {

    state = {
        storeID: "",
        paymentInfo: {},
        displayPaymentInfo: false,
        displayPinModal: false,
        labelWidth: 0,
        bankAccountNumberError: false,
        bankAccountNameError: false,
        errorMessageI18n: ""
    }

    componentDidMount() {

        this.setState({ storeID: this.props.storeID });
        
    }

    componentDidUpdate(prevProps, prevState) {
        if( this.props.storeID !== prevProps.storeID ) {
            this.setState({ storeID: this.props.storeID });
        }

        if( !_.isEqual(this.state.paymentInfo, this.props.paymentInfo) ) {
            this.setState({ paymentInfo: this.props.paymentInfo }, () => { this.checkHasPaymentInfo() });
        }

    }

    checkHasPaymentInfo = () => {
        if( this.state.paymentInfo.accountName.length > 0 ) {
            this.setState({ displayPaymentInfo: true});
        }
    };

    togglePaymentInfo = () => {
        this.setState({ displayPaymentInfo: !this.state.displayPaymentInfo}, () => {
            if( this.state.labelWidth === 0 && document.getElementById('selected-area') ) {
                this.setState({ labelWidth: document.getElementById('selected-area').offsetWidth });
            }
        });
    }

    togglePinModal = () => {
        this.setState({ displayPinModal: !this.state.displayPinModal});
    }

    checkPinCode = async (pinCode) => {
        let isCorrectPin = false;
        let storeIDList = await UtilityManager.getInstance().checkPinCode(pinCode);
        if( storeIDList.length > 0 ) {
            for(let i=0; i<storeIDList.length; i++) {
                if( this.state.storeID === storeIDList[i]['storeID'] ) {
                    isCorrectPin = true;
                }
            }
        }
        
        if( isCorrectPin ) {
            this.setState({displayPinModal: false }, () => {
                this.props.saveBusinessProfileSections('PAYMENT_INFO');
            });
        } else {
            this.setState({errorMessageI18n: "settings.withdraw-method.wrong-pin" });
        }
    }

    checkFormInfo = () => {
        let numberError = false;
        let nameError = false;
        let accountNumber = this.state.paymentInfo.accountNumber;
        let accountName = this.state.paymentInfo.accountName;

        let accountNumberLength = accountNumber.replace("_", "").split("-").join("").length;
        if( accountNumberLength !== 10 ) {
            numberError = true;
        } 

        if( accountName.length === 0 ) {
            nameError = true;
        }

        if( numberError && nameError ) {
            this.setState({bankAccountNameError: true, bankAccountNumberError: true});
        } else if(numberError) {
            this.setState({bankAccountNumberError: true});
        } else if(nameError) {
            this.setState({bankAccountNameError: true});
        } else {
            this.setState({bankAccountNameError: false, bankAccountNumberError: false}, () => {
                this.togglePinModal();
            });
        }
    }


    render() {
        const { paymentInfo, displayPaymentInfo, displayPinModal } = this.state;
        const { classes } = this.props;

        let bankObj = {};
        if( paymentInfo.hasOwnProperty('bank') ) {
            bankObj = UtilityFunction.sortObjectByKeys(paymentInfo.bank);
        }

        return (
            <React.Fragment>

                { displayPinModal ? (
                    <PinModal
                        errorMessageI18n={this.state.errorMessageI18n}
                        handleConfirmBtn={this.checkPinCode}
                        handleCancelBtn={this.togglePinModal}
                    />
                ) : (null) }

                <form>
                    <div className="">
                        <div className="flex flex-row justify-between items-center p-8 lg:p-12">
                            <div className="flex">
                                <Trans i18nKey="settings.withdraw-method.withdraw-method">Withdraw Method</Trans>
                            </div>
                        </div>
                        <Divider />
                        { displayPaymentInfo ? (
                            <div>
                                <div className="flex flex-col p-8 sm:p-12 mb-8">
                                    <div id="selected-area" className="w-full sm:w-3/5">
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel
                                                htmlFor="outlined-bank-select"
                                            >
                                                <Trans i18nKey="settings.withdraw-method.bank-name">Bank</Trans>
                                            </InputLabel>
                                            <Select
                                                value={bankObj}
                                                onChange={this.props.handleInputChange}
                                                input={
                                                    <OutlinedInput
                                                        labelWidth={this.state.labelWidth}
                                                        name="businessProfile.storeInfo.paymentInfo.bank"
                                                        id="outlined-bank-select"
                                                    />
                                                }
                                                renderValue={(selected) => {return(selected.label)}}
                                            >
                                                { bankList.map((bankInfo) => {
                                                    let bankInfoValue = UtilityFunction.sortObjectByKeys(bankInfo)
                                                    return (<MenuItem key={bankInfo.label} value={bankInfoValue}>{bankInfo.label}</MenuItem>)
                                                }) }
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="w-full sm:w-3/5">
                                        <InputMask
                                            mask="999-999-9999"
                                            onChange={this.props.handleInputChange}
                                            value={paymentInfo.accountNumber}
                                        >
                                            {() => <TextField
                                                required
                                                pattern="[0-9]*"
                                                name="businessProfile.storeInfo.paymentInfo.accountNumber"
                                                margin="dense"
                                                variant="outlined"
                                                fullWidth
                                                error={this.state.bankAccountNumberError}
                                                label={this.state.bankAccountNumberError ? <Trans i18nKey="settings.withdraw-method.bank-number-error"></Trans> : <Trans i18nKey="settings.withdraw-method.bank-number">Bank Number</Trans> }
                                            />}
                                        </InputMask>
                                    </div>
                                    <div className="w-full sm:w-3/5">
                                        <TextField
                                            name="businessProfile.storeInfo.paymentInfo.accountName"
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            required
                                            onChange={this.props.handleInputChange}
                                            value={paymentInfo.accountName}
                                            error={this.state.bankAccountNameError}
                                            label={this.state.bankAccountNameError ? <Trans i18nKey="settings.withdraw-method.bank-holder-name-error"></Trans> : <Trans i18nKey="settings.withdraw-method.bank-holder-name">Account Name</Trans> }
                                        />
                                    </div>
                                    
                                </div>

                                <div className="flex flex-row justify-end items-center px-8 lg:px-12">
                                    <button className="button-primary" onClick={(event) => {
                                        event.preventDefault();
                                        this.props.pushTrackingData("Click", "Click save payment info button");
                                        this.checkFormInfo();
                                    }}>
                                        <Trans i18nKey="main.save-btn">Save</Trans>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-row justify-between items-center p-8 lg:p-12">
                                <AddFormInfo handleClick={this.togglePaymentInfo}>
                                    <AddCircleIcon className="mr-8" /><Trans i18nKey="settings.withdraw-method.add-account">Add Account</Trans>
                                </AddFormInfo>
                            </div>
                        ) }
                        
                    </div>
                </form>
            </React.Fragment>
        );
    }
}


export default (withStyles(styles, { withTheme: true })(withRouter((withTranslation()(PaymentInfo)))));