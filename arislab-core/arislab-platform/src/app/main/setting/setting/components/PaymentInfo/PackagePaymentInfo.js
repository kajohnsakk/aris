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
    OutlinedInput,
    FormControlLabel,
    Radio,
    IconButton
} from "@material-ui/core";

import { UtilityManager } from '../../../../modules/UtilityManager';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';

import InputMask from 'react-input-mask';
import { Trans, withTranslation } from 'react-i18next';
import AddFormInfo from '../shared-components/AddFormInfo';
import PinModal from '../shared-components/PinModal';
import AlertModal from '../shared-components/AlertModal';

const styles = theme => ({
    formControl: {
        minWidth: 120,
        width: '100%',
        marginTop: '8px',
        marginBottom: '4px'
    }
});


class PackagePaymentInfo extends Component {

    state = {
        storeID: "",
        storePackagePaymentInfo: {},
        creditCardInfo: {},
        currentCreditCardInfo: {},
        displayPaymentInfo: true,
        displayPinModal: false,
        displayAlertModal: false,
        labelWidth: 100,
        useBusinessFeatures: false,
        displayCreditCard: false,

        creditCardNameError: false,
        creditCardNumberError: false,
        creditCardCcvError: false,
        errorMessageI18n: "",
        packagePaymentInfoError: false
    }

    componentDidMount() {

        this.setState({ storeID: this.props.storeID, useBusinessFeatures: this.props.useBusinessFeatures, labelWidth: document.getElementById('selected-area').offsetWidth }, () => { this.getCurrentCreditCard() });

    }

    componentDidUpdate(prevProps, prevState) {
        if( this.props.storeID !== prevProps.storeID ) {
            this.setState({ storeID: this.props.storeID }, () => { this.getCurrentCreditCard() });
        }

        if( this.props.useBusinessFeatures !== prevProps.useBusinessFeatures ) {
            this.setState({ useBusinessFeatures: this.props.useBusinessFeatures });
        }

        if( !_.isEqual(this.state.storePackagePaymentInfo, this.props.storePackagePaymentInfo) ) {
            this.setState({ storePackagePaymentInfo: this.props.storePackagePaymentInfo }, () => { this.checkEmptyCreditCardPaymentMethod() });
        }

        if( this.state.packagePaymentInfoError !== this.props.packagePaymentInfoError ) {
            this.setState({ packagePaymentInfoError: this.props.packagePaymentInfoError });
        }

    }

    getCurrentCreditCard = async () => {
        const creditCardList = await UtilityManager.getInstance().getCurrentCreditCard(this.state.storeID);
        if( creditCardList.length > 0 ) {
            const currentCreditCardInfo = {...creditCardList[0]};
            const creditCardInfo = {
                "name": currentCreditCardInfo.creditCardInfo.name,
                "number": currentCreditCardInfo.creditCardInfo.number,
                "expirationMonth": currentCreditCardInfo.creditCardInfo.expirationMonth,
                "expirationYear": currentCreditCardInfo.creditCardInfo.expirationYear,
                "securityCode": currentCreditCardInfo.creditCardInfo.securityCode,
            };
            this.setState({ currentCreditCardInfo: currentCreditCardInfo, creditCardInfo: creditCardInfo }, () => { this.checkEmptyCreditCardPaymentMethod() });
        }
    }

    isEmptyCreditCardPaymentMethod = () => {
        const { creditCardInfo } = this.state;
        
        let isEmpty = true;
        if( 
            (creditCardInfo.hasOwnProperty('name') && creditCardInfo.name.length > 0) && 
            (creditCardInfo.hasOwnProperty('number') && creditCardInfo.number.length > 0) && 
            (creditCardInfo.hasOwnProperty('expirationMonth') && creditCardInfo.expirationMonth.length > 0) && 
            (creditCardInfo.hasOwnProperty('expirationYear') && creditCardInfo.expirationYear.length > 0) && 
            (creditCardInfo.hasOwnProperty('securityCode') && creditCardInfo.securityCode.length > 0)
        ) {
            isEmpty = false;
        }

        return isEmpty;
    }

    checkEmptyCreditCardPaymentMethod = () => {
        if( this.state.storePackagePaymentInfo.paymentType === "CREDIT_CARD" ) {
            if( this.isEmptyCreditCardPaymentMethod() ) {
                this.setState({ displayCreditCard: true });
            } else {
                this.setState({ displayCreditCard: false });
            }
        }
    }

    checkExistsCurrentCreditCard = () => {
        let isExists = false;

        if( this.state.currentCreditCardInfo.hasOwnProperty('creditCardID') ) {
            isExists = true;
        }

        return isExists;
    }

    togglePinModal = () => {
        this.setState({ displayPinModal: !this.state.displayPinModal});
    }

    displayAlertModel = (errorMessageI18n) => {
        this.setState({displayAlertModal: true, errorMessageI18n: errorMessageI18n });
    }

    toggleAlertModal = () => {
        this.setState({ displayAlertModal: !this.state.displayAlertModal, errorMessageI18n: ""});
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
            this.setState({displayPinModal: false, displayCreditCard: true, errorMessageI18n: "" });
        } else {
            this.setState({errorMessageI18n: "settings.withdraw-method.wrong-pin" });
        }
    }

    processPackagePaymentData = async (event) => {
        event.preventDefault();

        let processDone = true;
        if(this.state.storePackagePaymentInfo.paymentType.length > 0) {
            if( this.state.storePackagePaymentInfo.paymentType === "CREDIT_CARD" ){

                if( this.checkExistsCurrentCreditCard() ) {
                    let currentCreditCardInfo = {...this.state.currentCreditCardInfo.creditCardInfo};
                    delete currentCreditCardInfo.token;
                    if( !_.isEqual(currentCreditCardInfo, this.state.creditCardInfo) ) {
                        processDone = this.saveCreditCard();
                    }
                } else {
                    processDone = this.insertCreditCard();
                }
                this.props.disappearPackagePaymentInfoError();
            }

            if( processDone ) {
                this.props.saveBusinessProfileSections('PACKAGE_PAYMENT_INFO');

                setTimeout(() => {
                    this.getCurrentCreditCard();
                }, 2000);
            } else {
                this.displayAlertModel("settings.store-package-info.wrong-credit-card-message");
            }
            
        }
    }

    insertCreditCard = async () => {
        let insertDone = true;

        let storeID = this.state.storeID;
        let creditCardInfo = {...this.state.creditCardInfo};
        creditCardInfo['number'] = creditCardInfo['number'].replace(/ /gi, "");
        let result = await UtilityManager.getInstance().insertCreditCard(storeID, creditCardInfo);

        if( result.toString() === "false" ) {
            insertDone = false;
        }

        return insertDone;
    }

    saveCreditCard = async () => {
        let saveDone = true;
        let insertDone = await this.insertCreditCard();
        if( insertDone ) {
            if( this.checkExistsCurrentCreditCard() ) {
                let currentCreditCardInfo = {...this.state.currentCreditCardInfo};
                await UtilityManager.getInstance().deleteCreditCard(currentCreditCardInfo);
            }
        } else {
            saveDone = false;
        }

        return saveDone;
    }

    handleClickShowCreditCardNumber = () => {
        this.togglePinModal();
    }

    toggleCreditCard = () => {
        this.setState({ displayCreditCard: !this.state.displayCreditCard });
    }

    handleSelectRadioButton = (event) => {
        if( event.target.value === "BILLING" ) {
            this.setState({ displayCreditCard: false });
        }
        this.props.disappearPackagePaymentInfoError();
        this.props.handleInputChange(event);
        setTimeout(() => {
            this.checkEmptyCreditCardPaymentMethod();
        }, 500)
    }

    checkNumberInput = (event) => {
        if( /^\d+$/.test(event.target.value) || event.target.value === "" ) {
            this.handleCreditCardInputChange(event);
        }
    }

    handleCreditCardInputChange = (event) => {
        this.setState(_.set({...this.state}, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
    }

    replaceString = (originalString, start, end, replaceString) => {
        let returnString = "";
        let prefix = "";
        let suffix = "";

        prefix = originalString.substring(0, start);
        suffix = originalString.substring(end + 1);
        returnString = prefix + replaceString + suffix;
        return returnString;
    }


    render() {
        const { creditCardInfo, displayPaymentInfo, displayPinModal, storePackagePaymentInfo, displayCreditCard, packagePaymentInfoError, displayAlertModal, useBusinessFeatures } = this.state;
        const { creditCardNameError, creditCardNumberError, creditCardCcvError } = this.state;
        const { classes } = this.props;

        let checkedCreditCard = false;
        let checkedBilling = false;
        if( storePackagePaymentInfo.hasOwnProperty('paymentType') ) {
            switch( storePackagePaymentInfo.paymentType ) {
                case 'CREDIT_CARD':
                    checkedCreditCard = true;
                    checkedBilling = false;
                    break;
                case 'BILLING':
                    checkedCreditCard = false;
                    checkedBilling = true;
                    break;
                default:
                    break;
            }
        }

        let nowYear = Number( new Date().getFullYear().toString().substr(-2) );
        const MONTH_LIST = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        let YEAR_LIST = [];
        for(let i=0; i<10; i++) {
            YEAR_LIST.push( (nowYear + i).toString() );
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

                { displayAlertModal ? (
                    <AlertModal
                        errorMessageI18n={this.state.errorMessageI18n}
                        handleCancelBtn={this.toggleAlertModal}
                    />
                ) : (null) }

                <form onSubmit={this.processPackagePaymentData}>
                    <div className="">
                        <div className="flex flex-row justify-between items-center p-8 lg:p-12">
                            <div className="flex flex-1 flex-row">
                                <div className="flex mr-1 sm:mr-8"><Trans i18nKey="settings.store-package-info.payment-method">Payment Method</Trans></div>
                                <div className="flex font-light text-grey-dark italic">(<Trans i18nKey="settings.store-package-info.subscription-package">Subscription monthly package</Trans>)</div>
                            </div>
                        </div>
                        <Divider />
                        { displayPaymentInfo ? (
                            <div>
                                <div className="flex flex-col p-8 sm:p-12 mb-8">
                                    <div className="flex flex-col">
                                        <div className="flex flex-col flex-1 mb-8">
                                            <div className="flex flex-1 flex-row">
                                                <div className="flex flex-1">
                                                    <FormControlLabel
                                                        value="CREDIT_CARD"
                                                        control={<Radio color="primary" />}
                                                        name="businessProfile.storeInfo.storePackagePaymentInfo.paymentType"
                                                        checked={checkedCreditCard}
                                                        label={<Trans i18nKey="settings.store-package-info.credit-card"></Trans>}
                                                        onChange={this.handleSelectRadioButton}
                                                    />
                                                </div>
                                                <div className="flex">
                                                    { !this.isEmptyCreditCardPaymentMethod() ? (
                                                        displayCreditCard ? (
                                                            <div className="flex flex-row">
                                                                <div className="flex">
                                                                    <Trans i18nKey="settings.store-package-info."></Trans>
                                                                </div>
                                                                <div className="flex">
                                                                    <IconButton
                                                                        aria-label="toggle credit card number invisibility"
                                                                        onClick={(event) => {this.toggleCreditCard()} }
                                                                        edge="end"
                                                                        disabled={!checkedCreditCard}
                                                                    >
                                                                        <LockIcon />
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-row">
                                                                <div className="flex">
                                                                    <Trans i18nKey="settings.store-package-info."></Trans>
                                                                </div>
                                                                <div className="flex">
                                                                    <IconButton
                                                                        aria-label="toggle credit card number visibility"
                                                                        onClick={(event) => {this.handleClickShowCreditCardNumber()} }
                                                                        edge="end"
                                                                        disabled={!checkedCreditCard}
                                                                    >
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </div>
                                                            </div>
                                                        )
                                                    ) : (null) }
                                                </div>
                                            </div>
                                            <div className="flex flex-1 flex-col sm:pl-24 w-full sm:w-3/5">
                                                <div className="flex flex-1">
                                                    <TextField
                                                        name="creditCardInfo.name"
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                        disabled={!displayCreditCard}
                                                        onChange={this.handleCreditCardInputChange}
                                                        value={ creditCardInfo.hasOwnProperty('name') ? creditCardInfo.name : "" }
                                                        error={creditCardNameError}
                                                        label={ creditCardNameError ? <Trans i18nKey="settings.store-package-info.credit-card-name-error"></Trans> : <Trans i18nKey="settings.store-package-info.credit-card-name"></Trans> }
                                                    />
                                                </div>
                                                <div className="flex flex-1">
                                                    { displayCreditCard ? (
                                                        <InputMask
                                                            mask="9999 9999 9999 9999"
                                                            onChange={this.handleCreditCardInputChange}
                                                            value={ creditCardInfo.hasOwnProperty('number') ? creditCardInfo.number : "" }
                                                            // disabled={!checkedCreditCard}
                                                        >
                                                            {() => <TextField
                                                                required
                                                                pattern="[0-9]*"
                                                                name="creditCardInfo.number"
                                                                margin="dense"
                                                                variant="outlined"
                                                                fullWidth
                                                                error={creditCardNumberError}
                                                                label={ creditCardNumberError ? <Trans i18nKey="settings.store-package-info.credit-card-number-error"></Trans> : <Trans i18nKey="settings.store-package-info.credit-card-number"></Trans> }
                                                                // disabled={!checkedCreditCard}
                                                            />}
                                                        </InputMask>
                                                    ) : (
                                                        <InputMask
                                                            mask="**** **** **** ****"
                                                            onChange={this.handleCreditCardInputChange}
                                                            value={ creditCardInfo.hasOwnProperty('number') ? this.replaceString(creditCardInfo.number, 4, 11, 'xxxxxxxx') : "" }
                                                            disabled={true}
                                                        >
                                                            {() => <TextField
                                                                pattern="[\w0-9]*"
                                                                name="creditCardInfo.creditCardInfo.number"
                                                                margin="dense"
                                                                variant="outlined"
                                                                fullWidth
                                                                error={creditCardNumberError}
                                                                label={ creditCardNumberError ? <Trans i18nKey="settings.store-package-info.credit-card-number-error"></Trans> : <Trans i18nKey="settings.store-package-info.credit-card-number"></Trans> }
                                                                disabled={true}
                                                            />}
                                                        </InputMask>
                                                    ) }
                                                    
                                                </div>
                                                <div className="flex flex-1 flex-row">
                                                    <div className="flex flex-1 mr-4" id="selected-area">
                                                        <FormControl
                                                            variant={ displayCreditCard ? "outlined" : "filled" }
                                                            className={classes.formControl}
                                                        >
                                                            <InputLabel
                                                                htmlFor="month-select"
                                                                disabled={!displayCreditCard}
                                                            >
                                                                <Trans i18nKey="settings.store-package-info.credit-card-expiration-month"></Trans>
                                                            </InputLabel>
                                                            <Select
                                                                value={ creditCardInfo.hasOwnProperty('expirationMonth') ? creditCardInfo.expirationMonth : "" }
                                                                onChange={this.handleCreditCardInputChange}
                                                                input={
                                                                    <OutlinedInput
                                                                        labelWidth={this.state.labelWidth}
                                                                        name="creditCardInfo.expirationMonth"
                                                                        id="month-select"
                                                                    />
                                                                }
                                                                disabled={!displayCreditCard}
                                                                renderValue={(selected) => {return(selected)}}
                                                            >
                                                                { MONTH_LIST.map((month) => {
                                                                    return (<MenuItem key={month} value={month}>{month}</MenuItem>)
                                                                }) }
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                    <div className="flex flex-1 ml-4" id="selected-area">
                                                        <FormControl
                                                            variant={ displayCreditCard ? "outlined" : "filled" }
                                                            className={classes.formControl}
                                                        >
                                                            <InputLabel
                                                                htmlFor="year-select"
                                                                disabled={!displayCreditCard}
                                                            >
                                                                <Trans i18nKey="settings.store-package-info.credit-card-expiration-year"></Trans>
                                                            </InputLabel>
                                                            <Select
                                                                value={ creditCardInfo.hasOwnProperty('expirationYear') ? creditCardInfo.expirationYear : "" }
                                                                onChange={this.handleCreditCardInputChange}
                                                                input={
                                                                    <OutlinedInput
                                                                        labelWidth={this.state.labelWidth}
                                                                        name="creditCardInfo.expirationYear"
                                                                        id="year-select"
                                                                    />
                                                                }
                                                                disabled={!displayCreditCard}
                                                                // renderValue={(selected) => {return(selected.label)}}
                                                            >
                                                                { YEAR_LIST.map((year) => {
                                                                    return (<MenuItem key={year} value={year}>{year}</MenuItem>)
                                                                }) }
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>
                                                <div className="flex flex-1 w-full lg:w-1/2">
                                                    <TextField
                                                        name="creditCardInfo.securityCode"
                                                        margin="dense"
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                        disabled={!displayCreditCard}
                                                        onChange={this.checkNumberInput}
                                                        value={ creditCardInfo.hasOwnProperty('securityCode') ? creditCardInfo.securityCode : "" }
                                                        error={creditCardCcvError}
                                                        label={ creditCardCcvError ? <Trans i18nKey="settings.store-package-info.credit-card-ccv-error"></Trans> : <Trans i18nKey="settings.store-package-info.credit-card-ccv"></Trans> }
                                                        type="password"
                                                        inputProps={{ maxLength: 3 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        { useBusinessFeatures ? (
                                            <div className="flex flex-col flex-1">
                                                <div className="flex flex-1">
                                                    <FormControlLabel
                                                        value="BILLING"
                                                        control={<Radio color="primary" />}
                                                        name="businessProfile.storeInfo.storePackagePaymentInfo.paymentType"
                                                        checked={checkedBilling}
                                                        label={<Trans i18nKey="settings.store-package-info.billing"></Trans>}
                                                        onChange={this.handleSelectRadioButton}
                                                    />
                                                </div>
                                            </div>
                                        ) : null }
                                    </div>
                                </div>

                                <div className="flex flex-row justify-between items-center px-8 lg:px-12">
                                    <div className="flex flex-1 text-red">
                                        { packagePaymentInfoError ? (<Trans i18nKey="settings.store-package-info.package-payment-info-error"></Trans>) : (null) }
                                    </div>
                                    <div className="flex">
                                        <button className="button-primary" type="submit" onClick={(event) => {
                                            // event.preventDefault();
                                            this.props.pushTrackingData("Click", "Click save package payment info button");
                                            // this.processPackagePaymentData();
                                        }}>
                                            <Trans i18nKey="main.save-btn">Save</Trans>
                                        </button>
                                    </div>
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


export default (withStyles(styles, { withTheme: true })(withRouter((withTranslation()(PackagePaymentInfo)))));