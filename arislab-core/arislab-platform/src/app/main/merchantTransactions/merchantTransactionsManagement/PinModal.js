import React, { Component } from "react";
import OTPInput from "otp-input-react";
import './MerchantTransactions.css'
import { Trans } from "react-i18next";
import { Fab, Divider } from "@material-ui/core";

class PinModal extends Component {
    state = {
        pin: ""
    };

    handlePin = event => {
        this.setState({
            pin: event
        });
    };

    render() {
        return (
            <div className="mt-20">
                <div className="my-12 flex content-center justify-center">
                    <img alt="" src="assets/images/logos/aris-logo.png" width="100px" className="flex h-full" />
                </div>

                <div className="text-xl font-bold my-4 flex content-center justify-center">
                    <Trans i18nKey="settings.payments.enter-pin-code">Enter pin code</Trans>
                </div>

                <div className="text-lg text-gray my-4 flex content-center justify-center">
                    <Trans i18nKey="settings.payments.verify-yourself">To verify yourself</Trans>
                </div>

                <Divider className='mx-64 mt-12 mb-24 bg-pink' />
{/* 
                <div className="mb-24 text-red flex content-center justify-center">
                    {this.state.error}
                </div> */}


                <div className="m-auto merchant-font text-center">
                    <div className="merchant-red pb-6">{this.props.error}</div>
                    <OTPInput
                        secure
                        className="flex justify-center"
                        value={this.state.pin}
                        onChange={event => {
                            this.handlePin(event);
                            this.props.resetError();
                        }}
                        autoFocus
                        inputClassName="flex my-6 border-solid border-1 border-gray-600 text-grey mx-6"
                        inputStyles={{ margin: 7 }}
                        OTPLength={6}
                        otpType="number"
                        pattern="[0-9]*"
                        disabled={false}
                    />
                </div>
                <Fab
                    variant="extended"
                    aria-label="Confirm"
                    className="merchant-button mt-24 px-24"
                    onClick={() => {
                        this.props.submitPin(this.state.pin);
                        this.props.pushTrackingData("Click", "Click confirm PIN button");
                    }}
                >
                    <Trans i18nKey="transactions.confirm">Confirm</Trans>
                </Fab>
            </div>
        );
    }
}

export default PinModal;
