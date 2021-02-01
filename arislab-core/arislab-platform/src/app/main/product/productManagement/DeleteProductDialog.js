import React, {Component} from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
} from '@material-ui/core';

import { Trans, withTranslation } from 'react-i18next';

class DeleteProductDialog extends Component {

    render() {

        return (
            <Dialog
                open={true}
                onClose={this.props.deleteItems ? this.props.deleteProducts : null}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Trans i18nKey="main.confirm-delete">Confirm Delete</Trans>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Trans i18nKey={"products.product-dialog-text-delete-confirmation"}></Trans>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.deleteProducts}>
                        <Trans i18nKey="main.delete-btn" >Delete</Trans>
                    </Button>
                    <Button onClick={this.props.cancelDelete}>
                        <Trans i18nKey="main.cancel-btn">Cancel</Trans>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}


export default (withTranslation()(DeleteProductDialog));