import React from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button
} from '@material-ui/core';
import { Trans, withTranslation } from 'react-i18next';

class GBGuide extends React.Component {

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
                    <Trans i18nKey="settings.payments.gbpay-guide-title">How to get token with GB Pay</Trans>
                </DialogTitle>
                <DialogContent className="pb-20">
                    <ul style={{ size: "15pt", fontFamily: "Arial" }}>
                        <li><Trans i18nKey="settings.payments.gbpay-guide-1">Go to the following website</Trans> <a rel="noopener noreferrer" href="http://www.gbprimepay.com/register" className="click-link" target="_blank">GB Pay</a></li>
                        <li><Trans i18nKey="settings.payments.gbpay-guide-2">Sign up for an account.</Trans></li>
                        <li><Trans i18nKey="settings.payments.gbpay-guide-3">Wait 1-2 days to get approval.</Trans></li>
                        <li><Trans i18nKey="settings.payments.gbpay-guide-4">After your GB Pay is ready, log in to GB Pay and go to profile. You will see token at the bottom of the page. You can call 02-645-3781 if you need assistance.</Trans></li>
                    </ul>
                    <div className="mt-24" style={{ color: '#A0A0A0' }}><Trans i18nKey="settings.payments.note">*You can set up LIVE event in ARIS in a meantime but please note that you will not be able to LIVE unless the the payment detail is complete.</Trans></div>
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

GBGuide.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};

export default withTranslation()(GBGuide); 