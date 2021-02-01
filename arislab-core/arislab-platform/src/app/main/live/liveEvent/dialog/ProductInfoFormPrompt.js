import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { 
    Dialog,
    IconButton,
    Typography,
} from '@material-ui/core';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CloseIcon from '@material-ui/icons/Close';

import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import _ from '@lodash';
import { Trans, withTranslation } from 'react-i18next';

import styles from '../styles/styles';

// import ProductForm from '../../../chatbot/productManagement/ProductForm';
// import ProductStepper from '../../../product/productManagement/ProductStepper';
import UtilityFunction from '../../../modules/UtilityFunction';
import Product from '../../../product/productManagement/Product';

const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit,
        background: '#fbfbfb',
        color: '#8d9095',
        fontWeight: 'bolder',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: 0,
        color: theme.palette.grey[500],
        fontSize: 'small',
        fontWeight: 'bolder'
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography style={{color: '#8d9095', fontSize: 'large'}}>{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0
    },
}))(MuiDialogContent);



const initialState = {
    storeID: ''
};


class ProductInfoFormPrompt extends React.Component {

    state = {...initialState};

    componentDidMount() {
        
        this.setState( { storeID: this.props.storeID } );
    }

    componentDidUpdate(prevProps, prevState) {
        if ( !_.isEqual(this.props.storeID, prevProps.storeID) ) {
            this.setState({ storeID: this.props.storeID });
        }
    }

    render() {
        const { //classes,
            closeProductInfoFormPrompt } = this.props;

        return (

            <Dialog
                onClose={closeProductInfoFormPrompt}
                fullScreen={ UtilityFunction.useMediaQuery('(max-width: 1024px)') }
                aria-labelledby="customized-dialog-title"
                open={true}
                scroll={'body'}
                fullWidth={true}
                maxWidth="lg"
            >
                <DialogTitle id="customized-dialog-title" onClose={closeProductInfoFormPrompt}>
                    <span className="flex flex-1 px-8 py-4">
                        <Trans i18nKey="product.product-detail">Product Details</Trans>
                    </span>
                </DialogTitle>
                <DialogContent className="p-0 sm:p-16">
                    {/* <ProductForm  */}
                    {/* <ProductStepper
                        productId={ this.props.selectedProductID ? this.props.selectedProductID : "new"}
                        reference="prompt"
                        storeID={ this.props.storeID }
                        onCancelBtnClick={closeProductInfoFormPrompt}
                        // onDoneProcessData={this.props.selectedProductID ? this.handleDoneUpdateProductData : this.handleDoneInsertProductData}
                        onDoneProcessData={this.props.handleDoneProcessProductData}
                        pushTrackingData={this.props.pushTrackingData}
                    /> */}
                    <Product productIDFromLive={ this.props.selectedProductID ? this.props.selectedProductID : "new" } onCancelBtnClick={closeProductInfoFormPrompt} onDoneProcessData={this.props.handleDoneProcessProductData}></Product>

                </DialogContent>
            
            </Dialog>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        closeProductInfoFormPrompt      : Actions.closeProductInfoFormPrompt,
        // insertProductToLiveEvent        : Actions.insertProductToLiveEvent,
        // updateProductInLiveEvent        : Actions.updateProductInLiveEvent,
    }, dispatch);
}

function mapStateToProps({liveEventsApp}) {

    return {
        selectedLiveEventID     : liveEventsApp.liveEventUi.selectedLiveEventID,
        selectedProductID       : liveEventsApp.liveEventUi.selectedProductID,
        liveEventList           : liveEventsApp.liveEvents.liveEventList,
    };
}

export default withReducer('liveEventsApp', reducer)( withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)( withTranslation()(ProductInfoFormPrompt) ) ) );
