import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { 
    Dialog,
    IconButton,
    Typography,
    Slide,
    Fab
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';
// import _ from '@lodash';
import { Trans, withTranslation } from 'react-i18next';
import classNames from 'classnames';
import UtilityFunction from '../../../modules/UtilityFunction';
// var QRCode = require('qrcode-react');

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
});


const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
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



function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class EventCodePrompt extends React.Component {


    render() {
        const { classes } = this.props;

        return (

            <Dialog
                fullWidth={true}
                fullScreen={ UtilityFunction.useMediaQuery('(max-width: 1024px)') }
                maxWidth="sm"
                open={this.props.isDisplayEventCodeDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.props.toggleDialog}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle id="customized-dialog-title" onClose={this.props.toggleDialog}>
                    <Trans i18nKey="live-event.go-live-btn">GO LIVE</Trans>
                </DialogTitle>
                <DialogContent className="flex flex-col justify-center px-64 py-32">
                    <div className="text-center mb-12"><Trans i18nKey="live-event.enter-code-message">กรุณากรอกรหัส หรือ สแกน QR ใน Application</Trans></div>
                    <div className="text-center text-5xl font-extrabold mb-12" style={{ color: "#E81790" }}>{this.props.liveEventCode}</div>
                    {/* <div className="text-center mb-12">
                        <QRCode 
                            value={this.props.liveEventCode}
                            size={200}
                            logoWidth={75}
                            logo="assets/images/logos/qr-code-logo.png"
                        />
                    </div>
                    <div className="text-center mb-24"><a href={process.env.REACT_APP_WEB_URL+'download/app/mobile'} target="_blank" rel="noopener noreferrer"><Trans i18nKey="live-event.download-application">Download Application</Trans></a></div> */}
                    <div className="text-center">
                        <Fab variant="extended" aria-label="Next" className={classNames(classes.button, classes.highlightButton, "m-0 w-full")} onClick={this.props.toggleDialog} >
                            <span><Trans i18nKey="live-event.next">Next</Trans></span>
                        </Fab>
                    </div>
                    {/* <DialogContentText id="dialog-description" className="text-center">
                        <span className="text-5xl my-8">{dataObj.code}</span>
                    </DialogContentText> */}
                </DialogContent>
            </Dialog>

        );
    }
}


export default withStyles(styles, { withTheme: true })(withTranslation()(EventCodePrompt) );
