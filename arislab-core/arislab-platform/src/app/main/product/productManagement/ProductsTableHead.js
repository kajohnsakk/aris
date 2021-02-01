import React from 'react';
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
        id: 'image',
        align: 'center',
        disablePadding: true,
        label: i18n.t('products.product-table-title-image'),
        sort: false,
        className: 'px-8'
    },
    {
        id: 'name',
        align: 'left',
        disablePadding: true,
        label: i18n.t('products.product-table-title-name'),
        sort: true,
        className: 'px-16'
    },
    {
        id: 'hashtag',
        align: 'center',
        disablePadding: true,
        label: i18n.t('products.product-table-title-hashtag'),
        sort: true,
        width:'120px',
        className: 'px-8'
    },
    {
        id: 'priceTaxIncl',
        align: 'center',
        disablePadding: true,
        label: i18n.t('products.product-table-title-price'),
        sort: true,
        width:'150px',
        className: 'px-8'
    },
    {
        id: 'stock',
        align: 'center',
        disablePadding: true,
        label: i18n.t('products.product-table-title-stock'),
        sort: true,
        width:'150px',
        className: 'px-8'
    }
];

const styles = theme => ({
    actionsButtonWrapper: {
        background: theme.palette.background.paper
    }
});

class ProductsTableHead extends React.Component {
    state = {
        // selectedProductsMenu: null
    };

    createSortHandler = property => event => {

        this.props.onRequestSort(event, property);
    };

    // openSelectedProductsMenu = (event) => {
    //     this.setState({ selectedProductsMenu: event.currentTarget });
    // };

    // closeSelectedProductsMenu = () => {
    //     this.setState({ selectedProductsMenu: null });
    // };

    render() {
        const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;
        // const { selectedProductsMenu } = this.state;

        return (
            <TableHead>
                <TableRow className="h-64">
                    <TableCell padding="checkbox" className="relative pl-4 sm:pl-12 px-8">
                        <Checkbox
                            color="primary"
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                        {/* {numSelected > 0 && (
                            <div className={classNames("flex items-center justify-center absolute w-64 pin-t pin-l ml-68 h-64 z-10", classes.actionsButtonWrapper)}>
                                <IconButton
                                    aria-owns={selectedProductsMenu ? 'selectedProductsMenu' : null}
                                    aria-haspopup="true"
                                    onClick={this.openSelectedProductsMenu}
                                >
                                    <Icon>more_horiz</Icon>
                                </IconButton>
                                <Menu
                                    id="selectedProductsMenu"
                                    anchorEl={selectedProductsMenu}
                                    open={Boolean(selectedProductsMenu)}
                                    onClose={this.closeSelectedProductsMenu}
                                >
                                    <MenuList>
                                        <MenuItem
                                            onClick={() => {
                                                this.closeSelectedProductsMenu();
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
                    {rows.map(row => {
                        return (
                            <TableCell
                                key={row.id}
                                align={row.align}
                                padding={row.disablePadding ? 'none' : 'default'}
                                sortDirection={orderBy === row.id ? order : false}
                                style={ row.width ? {width: row.width} : null }
                                className={ row.className ? row.className : null }
                            >
                                {row.sort ? (
                                    <Tooltip
                                        title="Sort"
                                        placement={row.align === "right" ? 'bottom-end' : 'bottom-start'}
                                        enterDelay={300}
                                    >
                                        <TableSortLabel
                                            active={orderBy === row.id}
                                            direction={order}
                                            onClick={this.createSortHandler(row.id)}
                                        >
                                            {row.label}
                                        </TableSortLabel>
                                    </Tooltip>
                                ) : (
                                    row.label
                                )}
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

export default withStyles(styles, { withTheme: true })(withTranslation()(ProductsTableHead));
