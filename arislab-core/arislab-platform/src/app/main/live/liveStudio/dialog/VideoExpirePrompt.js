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


class VideoExpirePrompt extends React.Component {

    backToLiveEventPage = (event) => {
        // this.props.history.push("/platform/lives");
        window.location.href = "platform/lives";
    }

    render() {
        const { classes } = this.props;

        return (

            <Dialog
                open={true}
                onClose={this.backToLiveEventPage}
                maxWidth={"sm"}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" onClose={this.backToLiveEventPage}>
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
                        <Trans i18nKey="live-event.live-expire-title">Cannot connect to Facebook</Trans>
                    </div>
                    <div className="text-base px-24">
                        <Trans i18nKey="live-event.live-expire-description">
                            1. Make sure your LIVE code is correct. Please try to re-enter LIVE code again in your mobile phone
                            2. If the problem still persist, please launch Facebook website to check whether Facebook is down
                            3. Contact 061 286 6328 for our help
                        </Trans>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.backToLiveEventPage} color="primary" autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

        );
    }
}


export default withStyles(styles, { withTheme: true })( withRouter(withTranslation()(VideoExpirePrompt)) );
