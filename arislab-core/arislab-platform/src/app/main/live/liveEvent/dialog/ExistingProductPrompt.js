import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { 
    Dialog,
    IconButton,
    Typography,
    Paper,
    Button
} from '@material-ui/core';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';

import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import _ from '@lodash';
import { Trans, withTranslation } from 'react-i18next';
import i18n from '../../../../i18n';

// import ProductTable from '../table/ProductTable';
import NewProductTable from '../table/NewProductTable';
import UtilityFunction from '../../../modules/UtilityFunction';

import styles from '../styles/styles';

// import ProductForm from '../../../chatbot/productManagement/ProductForm';

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
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
}))(MuiDialogContent);



const initialState = {
    productList: [],
    liveEventProducts: [],
    tableSrc: [],
    tableSrcTemp: [],
    searchText: '',
    tempCount: 0
};


class ExistingProductPrompt extends React.Component {

    state = {...initialState};
    tableCol = [];

    componentDidMount() {
        
        this.setState( { productList: this.props.productList }, () => {
            // if( this.props.selectedLiveEventID ) {
            //     this.setLiveEventProducts();
            // }
            if( this.props.selectedLiveEventProductList.length > 0 ) {
                this.setState({ liveEventProducts: this.props.selectedLiveEventProductList }, () => {
                    this.updateTableSrc();
                });
            } else {
                this.updateTableSrc();
            }
        } );
    }

    componentDidUpdate(prevProps, prevState) {
        if ( !_.isEqual(this.state.liveEventProducts, prevState.liveEventProducts) ) {    
            this.updateCheckboxTableSrc()
        }
    }

    // setLiveEventProducts = () => {

    //     const liveEventList = [...this.props.liveEventList];
    //     liveEventList.forEach(liveEvent => {
    //         if( liveEvent && liveEvent.eventID === this.props.selectedLiveEventID ) {
    //             var liveEventProductList = liveEvent.products;
    //             this.setState({ liveEventProducts: liveEventProductList }, () => {
    //                 this.updateTableSrc();
    //             });
    //         }
    //     });

    // }
    
    
    handleCheckboxClick = (event) => {
        const newSelectedProductID = event.currentTarget.value;
        let newLiveEventProducts = [...this.state.liveEventProducts];
        //if( this.state.liveEventProducts.indexOf(newSelectedProductID) > -1 ) {
        if( event.currentTarget.checked === false ) {
            let i = newLiveEventProducts.length;
            while (i--) {
                if( newLiveEventProducts[i] === newSelectedProductID){
                    newLiveEventProducts.splice(i, 1);
                }
            }
        } else {
            newLiveEventProducts.push(newSelectedProductID);
        }
        this.setState({ liveEventProducts: newLiveEventProducts });
    }

    updateCheckboxTableSrc = () => {
        let tableSrc = [];
        this.state.tableSrc.forEach(product => {
            if( this.state.liveEventProducts.indexOf(product.productID) > -1 )
                product.checkbox.isChecked = true;
            else
                product.checkbox.isChecked = false;
            tableSrc.push(product)
        })
        this.setState({ tableSrc: tableSrc })
    }

    updateTableSrc = () => {

        let tableSrc = [];
        if( this.state.productList ) {
            let data = this.state.productList;
            Object.keys(data).map((key, index) => {
                
                let product = data[key].productInfo;
                let productID = data[key].productID;

                tableSrc.push( {
                    index: (index+1),
                    productID: productID,
                    checkbox: { productID: productID, isChecked: ( this.state.liveEventProducts.indexOf(productID) > -1 ) ? true : false },
                    image: product.productImage ? product.productImage : '',
                    name: product.productName,
                    hashtag: '#'+product.productHashtag,
                    // category: product.productTypeOption.label ? product.productTypeOption.label : "N/A",
                    // brand: product.productBrandName,
                    stock: UtilityFunction.getProductStock(product),
                    price: UtilityFunction.getProductPrice(product)

                } );

                return tableSrc;
            });

            this.setState({ tableSrc: tableSrc });
            if(this.state.tempCount === 0){
                this.setState({ tableSrcTemp: tableSrc});
                this.setState({ tempCount: 1 })
            }
        }

    }

    saveLiveEvent = (event) => {
        
        // let updatedLiveEvent = {};
        // this.props.liveEventList.forEach(liveEvent => {
        //     if( liveEvent.eventID === this.props.selectedLiveEventID ) {
        //         updatedLiveEvent = liveEvent;
        //         updatedLiveEvent.products = this.state.liveEventProducts;
        //     }
        // });

        this.props.closeExistingProductPrompt();
        // this.props.updateLiveEvent(this.props.selectedLiveEventID, updatedLiveEvent);
        this.props.handleDoneSelectedProductData(this.state.liveEventProducts);
    }

    setSearchText = (event) =>{
        let searchText = event.target.value;
        this.setState({searchText: searchText})
        let productList = [];
        let tableSrcProduct = {};
        this.state.tableSrcTemp.forEach(product => {
            if(product.name.includes(searchText) || product.hashtag.includes(searchText)){
                // tableSrcProduct = 
                // if(tableSrcProduct.checkbox.isChecked){
                // product.checkbox.isChecked = true;
                // }
                productList.push(product)
            }
        })
        this.setState({tableSrc: productList})
    }

    filterTableSrc = () => {
        let productList = [];
        this.state.tableSrcTemp.forEach(product => {
            if(product.name.includes(this.state.searchText) || product.hashtag.includes(this.state.searchText))
                productList.push(product)
        })
        this.setState({tableSrc: productList})
    }

    render() {
        const { classes, closeExistingProductPrompt } = this.props;

        if( this.tableCol.length === 0 ) {

            this.tableCol.push({
                width: 80,
                label: '',
                dataKey: 'checkbox',
                checkbox: true,
            });

            this.tableCol.push({
                width: 100,
                label: i18n.t('product.product-image-title'),
                dataKey: 'image',
                image: true,
            });

            if( !UtilityFunction.useMediaQuery('(max-width: 550px)') ) {
                this.tableCol.push({
                    width: 100,
                    flexGrow: 1.0,
                    label: i18n.t('product.product-name'),
                    dataKey: 'name',
                });
            }

            this.tableCol.push({
                width: 130,
                label: i18n.t('product.product-form-input-product-hashtag'),
                dataKey: 'hashtag',
            });

            this.tableCol.push({
                width: 130,
                label: i18n.t('product.product-form-input-product-variations-stock'),
                dataKey: 'stock',
            });

            this.tableCol.push({
                width: 100,
                label: i18n.t('product.price'),
                dataKey: 'price',

            });
        
        }

        return (

            <Dialog
                onClose={closeExistingProductPrompt}
                fullScreen={ UtilityFunction.useMediaQuery('(max-width: 1024px)') }
                aria-labelledby="customized-dialog-title"
                open={true}
                scroll={'body'}
                fullWidth={false}
                maxWidth="md"
            >
                <DialogTitle id="customized-dialog-title" onClose={closeExistingProductPrompt}>
                    <span className="flex flex-1 px-8 py-4">
                        <Trans i18nKey="products.products-title">Products</Trans>
                    </span>
                </DialogTitle>
                <DialogContent>
                    
                    <Paper className={classes.existingProductTableWrapper}>
                        {/* <ProductTable
                            rowCount={this.state.tableSrc.length}
                            rowGetter={({ index }) => this.state.tableSrc[index]}
                            columns={this.tableCol}
                            rowHeight={100}
                            colPaddingRight={15}
                            onCheckboxClick={this.handleCheckboxClick}
                        /> */}
                        <NewProductTable
                            rowCount={this.state.tableSrc.length}
                            rowGetter={({ index }) => this.state.tableSrc[index]}
                            items={this.state.tableSrc}
                            columns={this.tableCol}
                            rowHeight={100}
                            colPaddingRight={15}
                            onCheckboxClick={this.handleCheckboxClick}
                            searchText={this.state.searchText}
                            setSearchText={this.setSearchText}
                        />
                    </Paper>

                </DialogContent>

                <DialogActions>
                    <Button variant="outlined" className={classNames(classes.button, classes.highlightButton)} onClick={this.saveLiveEvent}>
                        <div className={classes.extendedMargin}>
                            <Trans i18nKey="main.save-btn">Save</Trans>
                        </div>
                    </Button>
                </DialogActions>
            
            </Dialog>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        closeExistingProductPrompt      : Actions.closeExistingProductPrompt,
        // updateLiveEvent                 : Actions.updateLiveEvent
        // insertProductToLiveEvent        : Actions.insertProductToLiveEvent,
        // updateProductInLiveEvent        : Actions.updateProductInLiveEvent,
    }, dispatch);
}

function mapStateToProps({liveEventsApp}) {

    return {
        // selectedLiveEventID     : liveEventsApp.liveEventUi.selectedLiveEventID,
        // selectedProductID       : liveEventsApp.liveEventUi.selectedProductID,
        // liveEventList           : liveEventsApp.liveEvents.liveEventList,
    };
}

export default withReducer('liveEventsApp', reducer)( withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)( withTranslation()(ExistingProductPrompt) ) ) );
