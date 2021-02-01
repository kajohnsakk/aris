import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Dialog, DialogTitle } from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogContent";
import '../merchantTransactions/merchantTransactionsManagement/MerchantTransactions.css';
import { withTranslation } from "react-i18next";
import i18n from "../../i18n"
// import UtilityFunction from "../../modules/UtilityFunction";

import { Trans } from "react-i18next";
import { Fab } from "@material-ui/core";

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        textTransform: "none",
        border: "solid 1px #b7bbbe",
        background: "#fefefe",
        color: "#686868",
        fontWeight: "bolder",
        boxShadow: "none",
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    },
    highlightButton: {
        background: theme.palette.primary.color,
        color: "#ffffff"
    }
});

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2
    }
}))(MuiDialogContent);

class PinExplain extends React.Component {
    render() {
        return (
            <Dialog
                fullWidth={true}
                // fullScreen={UtilityFunction.useMediaQuery('(max-width: 1024px)')}
                maxWidth="sm"
                open={this.props.isDisplayPinPrompt}
                onClose={() => this.props.toggleDialog()}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                className={(i18n.language.includes("en") ? "en" : "th")}
            >
                <DialogTitle id="customized-dialog-title" onClose={ this.props.toggleDialog}>
                    <Trans i18nKey="live-event.information-header">Information</Trans>
                </DialogTitle>
                <DialogContent className="flex flex-col justify-center px-64 py-32">
                    <div className="text-center mb-12"><Trans i18nKey="settings.businessProfile.pin-prompt">Pin prompt</Trans></div>
                </DialogContent>
                <div className="text-center mt-2">
                    <Fab
                        aria-label="Confirm"
                        className="login-primary-button py-16 my-24"
                        onClick={() => this.props.toggleDialog()} >
                        <span><Trans i18nKey="transactions.confirm">OK</Trans></span>
                    </Fab>
                </div>
            </Dialog>
        );
    }
}

export default withStyles(styles, { withTheme: true })(withTranslation()(PinExplain));
