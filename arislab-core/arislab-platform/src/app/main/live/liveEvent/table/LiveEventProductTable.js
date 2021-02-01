import React from 'react';
// import axios from 'axios';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
// import classNames from 'classnames';
import {
    withStyles,
    // Card,
    // CardContent,
    // Typography,
    // Button,
    // IconButton,
    // Fab,
    Paper,
    Typography,
    // Collapse 
} from '@material-ui/core';
// import { showMessage } from 'app/store/actions/fuse';

// import EditIcon from '@material-ui/icons/Edit';
// import DeleteIcon from '@material-ui/icons/Delete';
// import PlayArrowIcon from '@material-ui/icons/PlayArrow';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import AddIcon from '@material-ui/icons/Add';
// import ViewListIcon from '@material-ui/icons/ViewList';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import _ from '@lodash';

import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

import NewProductTable from './ProductTable';
import styles from '../styles/styles';
import UtilityFunction from '../../../modules/UtilityFunction';
// import { SalesChannelManager } from '../../../context/sales_channel/salesChannelManager';

import { withTranslation, Trans } from 'react-i18next';
import i18n from '../../../../i18n';

const initialState = {
    liveEventProductList: {},
    eventID: ''
};

class LiveEventProductTable extends React.Component {

    state = { ...initialState };
    tableCol = [];

    componentDidMount() {

        this.loadLiveEventProductList();

    }

    componentDidUpdate(prevProps, prevState) {

        if (!_.isEqual(this.props.productList, prevProps.productList)) {
            this.loadLiveEventProductList();
        }

        if (!_.isEqual(this.props.products, prevProps.products)) {
            this.loadLiveEventProductList();
        }

        if (!_.isEqual(this.props.eventID, prevProps.eventID)) {
            this.setState({ eventID: this.props.eventID });
        }
    }

    loadLiveEventProductList = () => {
        const data = this.props.productList;
        const products = this.props.products
        const newProductList = {};
        if(products && typeof products[0] == 'string'){
            Object.keys(data).map((key, index) => {
                if (products.indexOf(data[key].productID) > -1) {
                    newProductList[this.props.products.indexOf(data[key].productID)] = data[key];
                }

                return newProductList;
            });
        }
        if(products && typeof products[0] == 'string'){
            this.setState({ liveEventProductList : newProductList })
        } else {
            this.setState({ liveEventProductList: products });
        }

        // this.props.getLiveEventProductList({ productList: this.props.products});
    };

    handleEditProductBtnClick = productID => {
        this.props.pushTrackingData("Click", "Edit product from LIVE button");
        let eventID = this.state.eventID;
        this.props.openProductInfoFormPrompt(eventID, productID);
    }

    handleDeleteProductBtnClick = productID => {
        //alert('Delete =======> '+productID);

        this.props.pushTrackingData("Click", "Delete product from LIVE button");
        let eventID = this.state.eventID;
        this.props.openDeleteProductPrompt(eventID, productID);
    }

    render() {
        const { classes, rowHeight, tableHeight } = this.props;

        let tableSrc = [];
        if (this.state.liveEventProductList) {
            let data = this.state.liveEventProductList;

            Object.keys(data).map((key, index) => {

                //if( liveEvent.products.indexOf( data[key].productID ) > -1 ) {
                let product = data[key].productInfo;

                tableSrc.push({
                    index: (index + 1),
                    image: product.productImage ? product.productImage : '',
                    name: product.productName,
                    hashtag: '#' + product.productHashtag,
                    stock: UtilityFunction.getProductStock(product),
                    // category: product.productTypeOption.label ? product.productTypeOption.label : "N/A",
                    // brand: product.productBrandName,
                    price: UtilityFunction.getProductPrice(product),
                    productOption: data[key].productID
                });
                //}
                return tableSrc;
            });

        }

        if (this.tableCol.length === 0) {
            // สร้าง Table columns
            this.tableCol.push({
                width: rowHeight ? rowHeight : 40,
                label: '',
                dataKey: 'image',
                image: true,
            });

            if (!UtilityFunction.useMediaQuery('(max-width: 550px)')) {
                this.tableCol.push({
                    width: 100,
                    flexGrow: 1.0,
                    label: i18n.t('product.product-name'),
                    dataKey: 'name',
                });

                this.tableCol.push({
                    width: 100,
                    label: i18n.t('product.product-form-input-product-hashtag'),
                    dataKey: 'hashtag',
                });
            } else {
                this.tableCol.push({
                    width: 100,
                    flexGrow: 1.0,
                    label: i18n.t('product.product-form-input-product-hashtag'),
                    dataKey: 'hashtag',
                });
            }

            this.tableCol.push({
                width: 60,
                label: i18n.t('product.product-form-input-product-variations-stock'),
                dataKey: 'stock',
            });

            this.tableCol.push({
                width: 60,
                label: i18n.t('product.price'),
                dataKey: 'price'
            });

            if (this.props.canEditProducct === true) {
                this.tableCol.push({
                    width: 20,
                    label: '',
                    dataKey: 'productOption',
                    productOption: true,
                });
            }

        }


        return (
            <React.Fragment>
                {tableSrc.length > 0 ? (
                    <Paper className={classes.productTableWrapper} style={tableHeight && { height: tableHeight }} >
                        <NewProductTable
                            rowCount={tableSrc.length}
                            rowGetter={({ index }) => tableSrc[index]}
                            items={tableSrc}
                            onRowClick={this.props.onRowClick !== null ? this.props.onRowClick : null}
                            columns={this.tableCol}
                            rowHeight={rowHeight || 50}
                            colPaddingRight={10}
                            onEditProductBtnClick={this.handleEditProductBtnClick}
                            onDeleteProductBtnClick={this.handleDeleteProductBtnClick}
                            selectedRowIndex={this.props.selectedRowIndex}
                        />
                    </Paper>
                ) : (
                        <div className={classes.productTableWrapper} style={{ height: tableHeight }}>
                            <Typography><Trans i18nKey="live-event.no-product">No product in this LIVE</Trans></Typography>
                        </div>
                    )}

            </React.Fragment>
        );

    }
}

LiveEventProductTable.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // openDeleteLiveEventPrompt   : Actions.openDeleteLiveEventPrompt,
        openDeleteProductPrompt: Actions.openDeleteProductPrompt,
        openProductInfoFormPrompt: Actions.openProductInfoFormPrompt,
        getLiveEventProductList: Actions.getLiveEventProductList,
        // openExistingProductPrompt   : Actions.openExistingProductPrompt,
        // updateLiveEvent             : Actions.updateLiveEvent,
        // getProductsList             : Actions.getProductsList
    }, dispatch);
}

function mapStateToProps({ liveEventsApp }) {
    return {
        productList: liveEventsApp.liveEvents.productList,
        liveEventProductList: liveEventsApp.liveEvents.liveEventProductList
        // productList                 : liveEventsApp.liveProductSlider
    };
}

// ( connect(mapStateToProps, mapDispatchToProps)( withTranslation()(LiveEventProductTable) ) )
export default withReducer('liveEventsApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LiveEventProductTable)))));