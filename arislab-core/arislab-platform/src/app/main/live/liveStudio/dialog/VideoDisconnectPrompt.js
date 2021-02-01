import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { 
    Dialog,
    IconButton,
    Typography,
    DialogActions,
    // DialogContentText,
    Button
} from '@material-ui/core';

import classnames from 'classnames';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
import { withRouter } from 'react-router-dom';
import { Trans, withTranslation } from 'react-i18next';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        textTransform: 'none',
        border: 'solid 1px #b7bbbe',
        background: '#fefefe',
        color: '#686868',
        fontWeight: 'bolder',
        boxShadow: 'none',
        paddingLeft: theme.spacing.unit,
        paddingRight: theme.spacing.unit
    },
    highlightButton: {
        background: theme.palette.primary.color,
        color: '#ffffff'
    },
    highlightText: {
        color: theme.palette.primary.color,
    },
});


const DialogTitle = withStyles(theme => ({
    root: {
        // borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
        background: '#ffffff',
        color: '#000000',
        fontWeight: 'bolder',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between'
    },
    closeButton: {
        right: theme.spacing.unit,
        color: theme.palette.grey[500],
        fontSize: 'small',
        fontWeight: 'bolder',
        padding: 0
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography>{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
}))(MuiDialogContent);


class VideoDisconnectPrompt extends React.Component {

    render() {
        const { classes } = this.props;

        return (

            <Dialog
                open={true}
                onClose={this.props.onCloseDialogClick}
                fullWidth={true}
                maxWidth={"sm"}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" onClose={this.props.onCloseDialogClick}>
                    {/* <Trans i18nKey="live-event.live-expire-title">Error: LIVE session expire</Trans> */}
                </DialogTitle>
                <DialogContent className="pb-24">
                    {/* <DialogContentText id="alert-dialog-description">
                        <Trans i18nKey="live-event.live-expire-description">LIVE session is expired, please create LIVE session again by click 'GO LIVE' button.</Trans>
                    </DialogContentText> */}
                    <div className="text-center mb-16">
                        <img style={{ maxWidth: '80px' }} alt="Logo" src="assets/images/logos/qr-code-logo.png" />
                    </div>
                    <div className={classnames(classes.highlightText ,"uppercase text-lg font-black text-center mb-24")}>
                        <Trans i18nKey="live-event.live-disconnect-title">LIVE Streaming Stop</Trans>
                    </div>
                    <div className="text-base flex px-24">
                        <div className="flex items-center mx-auto">
                            <div>
                                <img style={{ maxWidth: '80px' }} alt="Mobile" src="assets/images/etc/mobile.png" />
                            </div>
                            <div className="mx-16">
                                <div className="mb-8">
                                    <Trans i18nKey="live-event.live-disconnect-description">To continue...</Trans>
                                </div>
                                <div className="mb-8 flex items-center">
                                    <span className="mr-8">1. <Trans i18nKey="main.click-label">Click</Trans></span>
                                    <img alt="Mobile stop btn" src="assets/images/etc/mobile-stop-btn.png"/>
                                </div>
                                <div className="mb-8 flex items-center">
                                    <span className="mr-8">2. <Trans i18nKey="main.click-label">Click</Trans></span>
                                    <img alt="Mobile start btn" src="assets/images/etc/mobile-start-btn.png"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onCloseDialogClick} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

        );
    }
}


export default withStyles(styles, { withTheme: true })( withRouter(withTranslation()(VideoDisconnectPrompt)) );
