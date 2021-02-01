import React from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
    Divider
} from '@material-ui/core';
import { Trans, withTranslation } from 'react-i18next';

class WhyGBPay extends React.Component {

    render() {
        const { show, onClose } = this.props;

        return (
            <Dialog
                open={show}
                onClose={onClose}
                maxWidth="sm"
                fullWidth={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Trans i18nKey="settings.payments.what-gb-pay">What is GBPay and how can it help you</Trans>
                </DialogTitle>

                <DialogContent className="pb-20">

                    <Divider variant="middle" className='mb-20' />

                    <Trans i18nKey="settings.payments.what-gb-pay-2">Description of GBPay</Trans>

                    <div className='my-16'></div>

                    <Trans i18nKey="settings.payments.using-gbpay">Using GBPay</Trans>

                    <div className='my-12'></div>

                    <ol className='list-decimal' style={{ size: "15pt", fontFamily: "Arial" }}>

                        <li><Trans i18nKey="settings.payments.gb1">Increase selling opportunities</Trans></li>
                        <ul className='list-disc'>
                            <li>
                                <Trans i18nKey="settings.payments.gb1-1">QR Code</Trans>
                            </li>
                            <li>
                                <Trans i18nKey="settings.payments.gb1-2">Accept credit cards</Trans>
                            </li>
                        </ul>

                        <li><Trans i18nKey="settings.payments.gb2">Increase selling opportunities</Trans></li>
                        <ul className='list-disc'>
                            <li>
                                <Trans i18nKey="settings.payments.gb2-1">QR Code</Trans>
                            </li>
                            <li>
                                <Trans i18nKey="settings.payments.gb2-2">Accept credit cards</Trans>
                            </li>
                        </ul>

                        <li><Trans i18nKey="settings.payments.gb3">Secure and traceable</Trans></li>
                        <ul className='list-disc'>
                            <li>
                                <Trans i18nKey="settings.payments.gb3-1">Eliminate counterfeit pay slip problem</Trans>
                            </li>
                            <li>
                                <Trans i18nKey="settings.payments.gb3-2">Everything is traceable</Trans>
                            </li>
                        </ul>

                    </ol>

                    <div className='my-16'></div>

                    <Trans i18nKey="settings.payments.gb-star">There may be some commissions</Trans>
                    <a href="https://www.gbprimepay.com/"> https://www.gbprimepay.com/ </a>

                    <Divider variant="middle" className='my-20' />

                    <Trans i18nKey='settings.payments.gb-footer1'></Trans>
                    
                    <div className="mt-12" style={{ color: '#A0A0A0' }}>
                        <Trans i18nKey='settings.payments.gb-footer2'></Trans>
                    </div>

                    <div style={{ color: '#A0A0A0' }}>
                        <Trans i18nKey='settings.payments.gb-footer3'></Trans>
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>
                        <Trans i18nKey="main.close-btn">Close</Trans>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

WhyGBPay.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};

export default withTranslation()(WhyGBPay); 