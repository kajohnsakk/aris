import React, { Component } from 'react';
import {
    TableHead,
    TableSortLabel,
    TableCell,
    TableRow,
    Checkbox,
    Tooltip,
    // IconButton,
    // Icon,
    // Menu,
    // MenuList,
    // MenuItem,
    // ListItemIcon,
    // ListItemText,
    withStyles
} from '@material-ui/core';
// import classNames from 'classnames';
import { withTranslation } from 'react-i18next';
import i18n from '../../../i18n';

const rows = [
    {
        id: 'orderID',
        align: 'center',
        disablePadding: true,
        className: '',
        label: i18n.t('orders.order-table-title-id'),
        sort: false
    },
    {
        id: 'orderDate',
        align: 'center',
        disablePadding: true,
        className: '',
        label: i18n.t('orders.ordered-on'),
        sort: true
    },
    {
        id: 'customer',
        align: 'center',
        disablePadding: true,
        className: '',
        label: i18n.t('orders.order-table-title-customer'),
        sort: false
    },
    // {
    //     id: 'deliveryTo',
    //     align: 'center',
    //     disablePadding: false,
    //     label: i18n.t('orders.order-table-title-delivery-to'),
    //     sort: true
    // },
    {
        id: 'items',
        align: 'center',
        className: '',
        disablePadding: true,
        label: i18n.t('orders.order-table-title-items'),
        sort: false
    },
    // {
    //     id: 'totalItems',
    //     align: 'center',
    //     className: '',
    //     disablePadding: true,
    //     label: i18n.t('orders.order-table-title-total-items'),
    //     sort: false
    // },
    {
        id: 'price',
        align: 'center',
        className: '',
        disablePadding: true,
        label: i18n.t('orders.order-table-title-grand-total-price'),
        sort: false
    },
    {
        id: 'paymentStatus',
        align: 'center',
        className: '',
        disablePadding: true,
        label: i18n.t('orders.order-table-title-payment-status'),
        sort: true
    },
    // {
    //     id: 'contactInfo',
    //     align: 'left',
    //     disablePadding: false,
    //     label: i18n.t('orders.order-table-title-contact-info'),
    //     sort: true
    // }
    // {
    //     id: 'paymentMethod',
    //     align: 'center',
    //     className: '',
    //     disablePadding: true,
    //     label: i18n.t('orders.order-table-title-payment-method'),
    //     sort: true
    // },
    {
        id: 'shipping',
        align: 'center',
        className: '',
        disablePadding: true,
        label: i18n.t('orders.order-table-title-shipping'),
        sort: true
    },
    {
        id: 'trackingNumber',
        align: 'center',
        className: '',
        disablePadding: true,
        label: i18n.t('orders.order-table-title-tracking'),
        sort: true
    }
];

const styles = theme => ({
    actionsButtonWrapper: {
        background: theme.palette.background.paper
    },
    cellsOnly: {
        width: "0.11111%"
    },
    cellsWithCheckbox: {
        width: "0.1%"
    }
});

class OrdersTableHead extends Component {

    state = {
        selectedOrdersMenu: null
    };

    createSortHandler = property => event => {
        this.props.onRequestSort(event, property);
    };

    openSelectedOrdersMenu = (event) => {
        this.setState({ selectedOrdersMenu: event.currentTarget });
    };

    closeSelectedOrdersMenu = () => {
        this.setState({ selectedOrdersMenu: null });
    };

    render() {
        const { order, orderBy, onSelectAllClick, numSelected, rowCount, classes, isLoading } = this.props;
        // const { selectedOrdersMenu } = this.state;
        const tableCellClassName = this.props.status === "SUCCESS" ? classes.cellsWithCheckbox : classes.cellsOnly;

        return (
            <TableHead>
                <TableRow className="">
                    {this.props.status === "SUCCESS" ? (
                        <TableCell padding="checkbox" className={tableCellClassName + " relative pl-4 sm:pl-12"}>
                            <Checkbox
                                color="primary"
                                className="flex justify-center"
                                disabled={rowCount === 0 || isLoading}
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                checked={numSelected === rowCount && rowCount !== 0}
                                onChange={onSelectAllClick}
                            />
                            {/* {numSelected > 0 && (
                            <div className={classNames("flex items-center justify-center absolute w-64 pin-t pin-l ml-68 h-64 z-10", classes.actionsButtonWrapper)}>
                                <IconButton
                                    aria-owns={selectedOrdersMenu ? 'selectedOrdersMenu' : null}
                                    aria-haspopup="true"
                                    onClick={this.openSelectedOrdersMenu}
                                >
                                    <Icon>more_horiz</Icon>
                                </IconButton>
                                <Menu
                                    id="selectedOrdersMenu"
                                    anchorEl={selectedOrdersMenu}
                                    open={Boolean(selectedOrdersMenu)}
                                    onClose={this.closeSelectedOrdersMenu}
                                >
                                    <MenuList>
                                        <MenuItem
                                            onClick={() => {
                                                this.closeSelectedOrdersMenu();
                                            }}
                                        >
                                            <ListItemIcon className={classes.icon}>
                                                <Icon>delete</Icon>
                                            </ListItemIcon>
                                            <ListItemText inset primary="Remove" />
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </div>
                        )} */}
                        </TableCell>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}

                    {rows.map(row => {
                        // console.log(row.id)
                        return (
                            <TableCell
                                key={row.id}
                                align={row.align}
                                padding={row.disablePadding ? "none" : "default"}
                                sortDirection={orderBy === row.id ? order : false}
                                className={tableCellClassName}
                                // className={row.className}
                            >
                                {/* {row.sort && ( */}
                                {
                                    <Tooltip title="Sort" placement={row.align === "right" ? "bottom-end" : "bottom-start"} enterDelay={300}>
                                        <TableSortLabel
                                            active={orderBy === row.id}
                                            direction={order}
                                            className="main-font text-base"
                                            onClick={this.createSortHandler(row.id)}
                                        >
                                            {row.label}
                                        </TableSortLabel>
                                    </Tooltip>
                                }
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

export default withStyles(styles, { withTheme: true })(withTranslation()(OrdersTableHead));
