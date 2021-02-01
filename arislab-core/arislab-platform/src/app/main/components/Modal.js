import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Dialog, IconButton } from "@material-ui/core";
import MuiDialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import { withTranslation } from "react-i18next";
import UtilityFunction from "../../main/modules/UtilityFunction";
import DialogTitle from '@material-ui/core/DialogTitle';
// import "./MerchantTransactions.css";

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

class Modal extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Dialog
                fullWidth={this.props.fullWidth}
                fullScreen={UtilityFunction.useMediaQuery("(max-width: 728px)")}
                maxWidth="sm"
                open={this.props.isDisplayHorizontalDialog}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
                className="merchant-font"
            >
                <div className="absolute right pin-t pin-r">
                    <IconButton
                        aria-label="Close"
                        className={classes.closeButton}
                        onClick={() => {
                            this.props.toggleDialog(this.props.dialogName);
                            // this.props.pushTrackingData("Leave ", this.props.dialogName)
                        }}
                    >
                        <CloseIcon fontSize="default" />
                    </IconButton>
                </div>

                <DialogContent className=" flex flex-col justify-center px-64 py-32">
                    <div className="flex justify-center">
                        {/* <img className="merchant-logo" src="assets/images/logos/aris-logo.png" alt="logo" /> */}
                    </div>
                    <div className="text-center">{this.props.children}</div>
                </DialogContent>
            </Dialog>
        );
    }
}

export default withStyles(styles, { withTheme: true })(withTranslation()(Modal));
