import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import PinModal from "../../../merchantTransactions/merchantTransactionsManagement/PinModal"


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

class PinPrompt extends React.Component {

    render() {
        return (
            <div className="text-center mb-12">
                <PinModal
                    submitPin={this.props.submitPin}
                    error={this.props.error}
                    pushTrackingData={this.props.pushTrackingData}
                    resetError={this.props.resetError}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(withTranslation()(PinPrompt));