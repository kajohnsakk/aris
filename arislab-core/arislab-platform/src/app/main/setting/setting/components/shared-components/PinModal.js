import React, { Component } from "react";
import OTPInput from "otp-input-react";
import { Trans, withTranslation } from "react-i18next";
import { withStyles } from '@material-ui/core/styles';
// import i18n from '../../../../i18n';

import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const styles = theme => ({
    
});

class PinModal extends Component {
    state = {
        pin: "",
        errorMessageI18n: ""
    };

    componentDidUpdate(prevProps, prevState) {
        if( this.props.errorMessageI18n && this.state.errorMessageI18n !== this.props.errorMessageI18n ) {
            this.setState({errorMessageI18n: this.props.errorMessageI18n});
        }
    }

    handlePin = event => {
        this.setState({
            pin: event,
            errorMessageI18n: ""
        });
    };

    render() {
        const { errorMessageI18n, pin } = this.state;

        return (

            <Dialog
                open={true}
                TransitionComponent={Transition}
                keepMounted
                // onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                maxWidth="xs"
                fullWidth={true}
            >
                <div id="alert-dialog-slide-title" className="p-12 font-medium text-xl">
                    <Trans i18nKey="settings.payments.enter-pin-code">Enter pin code</Trans>
                </div>
                <div className="p-12">
                    <div className="my-12 flex content-center justify-center">
                        <img alt="" src="assets/images/logos/aris-logo.png" width="100px" className="flex h-full" />
                    </div>

                    <div className="flex flex-col m-auto my-12">
                        <div className="flex justify-center text-red pb-6"><p>{errorMessageI18n.length > 0 ? <Trans i18nKey={errorMessageI18n}></Trans> : " "}</p></div>
                        <OTPInput
                            secure
                            className="flex justify-center"
                            value={this.state.pin}
                            onChange={event => {
                                this.handlePin(event);
                            }}
                            autoFocus
                            inputClassName="flex my-6 border-solid border-1 border-gray-600 text-grey mx-6"
                            inputStyles={{ margin: 5 }}
                            OTPLength={6}
                            otpType="number"
                            pattern="[0-9]*"
                            disabled={false}
                        />
                    </div>
                </div>
                <div className="p-12 mt-24 flex justify-end">
                    <button className="" onClick={(event) => {
                        event.preventDefault();
                        this.props.handleCancelBtn();
                    }}>
                        <Trans i18nKey="main.cancel-btn">Cancel</Trans>
                    </button>
                    <button className="button-primary" onClick={(event) => {
                        event.preventDefault();
                        if( pin.length !== 6 ) {
                            this.setState({ errorMessageI18n: "settings.withdraw-method.wrong-pin-length" });
                        } else {
                            this.props.handleConfirmBtn(pin);
                        }
                        
                    }}>
                        <Trans i18nKey="main.confirm">Confirm</Trans>
                    </button>
                </div>
            </Dialog>
            
        );
    }
}

export default (withStyles(styles, { withTheme: true })(withTranslation()(PinModal)));
