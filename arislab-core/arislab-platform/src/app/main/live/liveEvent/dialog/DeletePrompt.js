import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { 
    Dialog, 
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button 
} from '@material-ui/core';

import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

import styles from '../styles/styles';

import { Trans, withTranslation } from 'react-i18next';

class DeletePrompt extends React.Component {

    handlePromptConfirmBtnClick = event => {
        event.preventDefault();

        if( this.props.isDisplayDeleteLiveEventPrompt ) {
            this.props.pushTrackingData("Delete", "Delete LIVE: " + this.props.selectedLiveEventID);
            this.props.deleteLiveEvent(this.props.storeID, this.props.selectedLiveEventID);
        } else if( this.props.isDisplayDeleteProductPrompt ) {
            this.props.pushTrackingData("Delete", "Delete Product from LIVE: " + this.props.selectedProductID);
            this.props.removeProductIdFromLiveEvent(this.props.selectedProductID);
            // this.props.deleteProductFormLiveEvent(this.props.liveEventList, this.props.selectedLiveEventID, this.props.selectedProductID);
        }
        
    }

    render() {
        const { classes, isDisplayDeleteLiveEventPrompt, closeDeleteLiveEventPrompt, closeDeleteProductPrompt } = this.props;

        return (
            <Dialog
                open={true}
                onClose={isDisplayDeleteLiveEventPrompt ? closeDeleteLiveEventPrompt : closeDeleteProductPrompt}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Trans i18nKey="main.confirm-delete">Confirm Delete</Trans>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Trans i18nKey={ isDisplayDeleteLiveEventPrompt ? "live-event.delete-message" : "live-event.delete-product-message"}></Trans>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handlePromptConfirmBtnClick} className={classNames(classes.button, classes.dangerButton)}>
                        <Trans i18nKey="main.delete-btn">Delete</Trans>
                    </Button>
                    <Button onClick={isDisplayDeleteLiveEventPrompt ? closeDeleteLiveEventPrompt : closeDeleteProductPrompt} className={classes.linkButton} autoFocus>
                        <Trans i18nKey="main.cancel-btn">Cancel</Trans>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

DeletePrompt.propTypes = {
    classes: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        closeDeleteLiveEventPrompt  : Actions.closeDeleteLiveEventPrompt,
        closeDeleteProductPrompt    : Actions.closeDeleteProductPrompt,
        deleteLiveEvent             : Actions.deleteLiveEvent,
        deleteProductFormLiveEvent  : Actions.deleteProductFormLiveEvent
    }, dispatch);
}

function mapStateToProps({liveEventsApp}) {
    return {
        isDisplayDeleteLiveEventPrompt      : liveEventsApp.liveEventUi.isDisplayDeleteLiveEventPrompt,
        isDisplayDeleteProductPrompt        : liveEventsApp.liveEventUi.isDisplayDeleteProductPrompt,
        selectedLiveEventID                 : liveEventsApp.liveEventUi.selectedLiveEventID,
        selectedProductID                   : liveEventsApp.liveEventUi.selectedProductID,
        liveEventList                       : liveEventsApp.liveEvents.liveEventList
    }
}

export default withReducer('liveEventsApp', reducer)( withStyles(styles, {withTheme: true})( connect(mapStateToProps, mapDispatchToProps)( withTranslation()(DeletePrompt) ) ) );