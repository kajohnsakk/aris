import React, { Component } from 'react';
import {
    // Icon,
    Table,
    TableBody,
    TableCell,
    TablePagination,
    TableRow,
    Checkbox,
    CircularProgress
} from '@material-ui/core';
import { FuseScrollbars, FuseUtils } from '@fuse';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
// import classNames from 'classnames';
import _ from '@lodash';
import ProductsTableHead from './ProductsTableHead';
import * as Actions from '../store/actions';
import UtilityFunction from '../../modules/UtilityFunction';

import { Trans, withTranslation } from 'react-i18next';
import history from './history';

class ProductsTable extends Component {

    state = {
        order: 'asc',
        orderBy: null,
        selected: [],
        data: this.props.products && this.props.products.length > 0 ? this.props.products : null,
        page: parseInt(new URLSearchParams(this.props.location.search).get("page")) || 0,
        rowsPerPage: parseInt(new URLSearchParams(this.props.location.search).get("row")) || 10,
        isLoading: this.props.products && this.props.products.length > 0 ? false : true,
        disableResetCurrentPage: 0
    };

    componentDidMount() {
        const { storeID } = this.props;
        this.props.getProducts({ storeID: storeID });
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.props.products, prevProps.products) || !_.isEqual(this.props.searchText, prevProps.searchText)) {
            const data = this.getFilteredArray(this.props.products, this.props.searchText);
            this.setState({ data, isLoading: false });
            let page = this.state.page
            while(data.length < page * this.state.rowsPerPage){
                page = page - 1;
            }
            this.setState({ page : page })
        }

        if( this.props.products && this.props.products.length === 0 && this.state.isLoading === true ) {
            this.setState({ data: this.props.products,isLoading: false });
        }
    }

    componentWillUnmount() {
        this.setState({ data: null });
    }

    getFilteredArray = (data, searchText) => {
        if (searchText.length === 0) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, searchText);
        // return _.filter(data, item => item.productInfo.productName.toLowerCase().includes(searchText.toLowerCase()));
    };

    handleRequestSort = (event, property) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({
            order,
            orderBy
        });
    };

    handleSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: this.state.data.map(n => n.productID) }));
            this.props.getSelectedProducts(this.state.data.map(n => n.productID) )
            return;
        }
        this.setState({ selected: [] });
        this.props.getSelectedProducts([])
    };

    handleClick = (item) => {
        this.props.history.push('/platform/products/' + item.productID);
    };

    handleCheck = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        }
        else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        }
        else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        }
        else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        this.setState({ selected: newSelected });
        this.props.getSelectedProducts(newSelected)
    };

    loadPreviousPage = () => {
        let page = this.state.page - 1;
        this.props.history.push(`/platform/products?page=${page}&row=${this.state.rowsPerPage}`) 
        this.setState({ page: page })
    }

    loadNextPage = () => {
        let page = this.state.page + 1;
        this.props.history.push(`/platform/products?page=${page}&row=${this.state.rowsPerPage}`) 
        this.setState({ page: page })
    }

    handleChangePage = (event, page) => {
        
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    render() {
        const { order, orderBy, selected, data, isLoading } = this.state;
        let page = this.state.page;
        let rowsPerPage = this.state.rowsPerPage;
        history.push(`/platform/products?page=${page}&row=${rowsPerPage}`)
        return (
            <div className="w-full flex flex-col">

                <FuseScrollbars id="product-table" className="flex-grow overflow-x-auto mt-12">

                    <Table className="min-w-xl" aria-labelledby="tableTitle">

                        <ProductsTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={this.handleSelectAllClick}
                            onRequestSort={this.handleRequestSort}
                            rowCount={data ? data.length : 0}
                        />

                        { isLoading ? (
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        <div className="my-16 lg:text-center">
                                            <CircularProgress color="primary" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        ) : (
                            data.length > 0 ? (
                                <TableBody>
                                    {_.orderBy(data, [
                                        (o) => {
                                            switch (orderBy) {
                                                case 'categories':
                                                    {
                                                        return o.categories[0];
                                                    }
                                                default:
                                                    {
                                                        return o[orderBy];
                                                    }
                                            }
                                        }
                                    ], [order])
                                        .slice((page) * rowsPerPage, (page) * rowsPerPage + rowsPerPage)
                                        .map(n => {
                                            const isSelected = this.isSelected(n.productID);
                                            return (
                                                <TableRow
                                                    className="h-64 cursor-pointer"
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isSelected}
                                                    tabIndex={-1}
                                                    key={n.productID}
                                                    selected={isSelected}
                                                    onClick={event => this.handleClick(n)}
                                                >
                                                    <TableCell className="w-48 pl-4 sm:pl-12" padding="checkbox">
                                                        <Checkbox
                                                            color="primary"
                                                            checked={isSelected}
                                                            onClick={event => event.stopPropagation()}
                                                            onChange={event => this.handleCheck(event, n.productID)}
                                                            padding="none"
                                                        />
                                                    </TableCell>

                                                    <TableCell className="w-64 px-8" component="th" scope="row" padding="none">
                                                        {n.productInfo.hasOwnProperty('productImage') && n.productInfo.productImage.length > 0 ? (
                                                            <img className="w-full block rounded" src={n.productInfo.productImage} alt={n.name} />
                                                        ) : (
                                                            <img className="w-full block rounded" src="assets//images/ecommerce/product-image-placeholder.png" alt={n.productInfo.productName} />
                                                        )}
                                                    </TableCell>

                                                    <TableCell className="px-16" component="th" scope="row" padding="none">
                                                        {n.productInfo.productName}
                                                    </TableCell>

                                                    <TableCell className="px-8" component="th" scope="row" align="center" padding="none">
                                                        <span>#</span>
                                                        {n.productInfo.productHashtag}
                                                    </TableCell>

                                                    <TableCell className="px-8" component="th" scope="row" align="center" padding="none">
                                                        <span>{ UtilityFunction.getProductPrice(n.productInfo) }</span>
                                                        {/* {n.priceTaxIncl} */}
                                                    </TableCell>

                                                    <TableCell className="px-8" component="th" scope="row" align="center" padding="none">
                                                        {/* {n.quantity} */}
                                                        { UtilityFunction.getProductStock(n.productInfo) }
                                                        {/* <i className={classNames("inline-block w-8 h-8 rounded ml-8", this.getProductStock(n.productInfo) <= 5 && "bg-red", this.getProductStock(n.productInfo) > 5 && this.getProductStock(n.productInfo) <= 25 && "bg-orange", this.getProductStock(n.productInfo) > 25 && "bg-green")} /> */}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            ) : (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={7}>
                                            <div className="my-16 lg:text-center ">
                                                <h1 className="text-grey-darker">
                                                    <Trans i18nKey="products.products-not-found-in-this-store">No products in this store</Trans>
                                                </h1>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                </TableBody >
                            )
                            
                        ) }

                        
                    </Table>
                </FuseScrollbars>

                <TablePagination
                    component="div"
                    count={data ? data.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                        'onClick': this.loadPreviousPage
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                        'onClick': this.loadNextPage
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProducts: Actions.getProducts,
        saveProduct: Actions.saveProduct
    }, dispatch);
}

function mapStateToProps({ eCommerceApp }) {
    return {
        products: eCommerceApp.products.data,
        searchText: eCommerceApp.products.searchText
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ProductsTable)));
