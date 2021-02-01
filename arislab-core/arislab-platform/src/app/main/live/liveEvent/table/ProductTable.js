import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import MoreVert from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Popover from '@material-ui/core/Popover';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import { withTranslation, Trans } from 'react-i18next';


const styles = theme => ({
    table: {
        fontFamily: theme.typography.fontFamily,
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        height: 100
    },
    tableRow: {
        /* cursor: 'pointer', */
        height: 60
    },
    tableRowHover: {
        '&:hover': {
            // backgroundColor: theme.palette.grey[200],
            backgroundColor: theme.palette.primary.main,
            cursor: 'pointer'
        },
    },
    tableCell: {
        flex: 1,
        padding: '10px 0px 10px 0px',
        paddingRight: 10,
        height: 60
    },
    noClick: {
        cursor: 'initial',
    },
    headerCell: {
        borderBottom: '2px solid #ec5286'
    },
    moreBtn: {
        color: '',
        cursor: 'pointer'
    },
    iconSmall: {
        fontSize: 20,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    button: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    buttonArea: {
        padding:  theme.spacing.unit
    },
    deleteBtn: {
        color: '#FF0000'
    },
    selectedRow: {
        // backgroundColor: theme.palette.grey[200],
        backgroundColor: theme.palette.primary.main,
        cursor: 'pointer',
        color: '#FFFFFF !important'
    }
});

class ProductTable extends React.PureComponent {

    state = {
        openPopover: false,
        anchorEl: null,
        selectedProductID: ''
    };

    handlePopoverToggle = (event, productID) => {
        event.preventDefault();

        const anchorTarget = this.state.openPopover ? null : event.currentTarget ;
        const selectedProductID = productID;

        this.setState({ openPopover: !this.state.openPopover, anchorEl: anchorTarget, selectedProductID: selectedProductID });
    };

    handleEditBtn = (event) => {
        event.preventDefault();

        this.props.onEditProductBtnClick(this.state.selectedProductID);
        this.setState({ openPopover: false });
    }

    handleDeleteBtn = (event) => {
        event.preventDefault();

        this.props.onDeleteProductBtnClick(this.state.selectedProductID);
        this.setState({ openPopover: false });
    }


    getRowClassName = ({ index }) => {
        const { classes, rowClassName, onRowClick, selectedRowIndex } = this.props;

        return classNames(classes.tableRow, classes.flexContainer, rowClassName, {
            [classes.tableRowHover]: index !== -1 && onRowClick != null,
            [classes.selectedRow]: index === selectedRowIndex,
        });
    };

    cellRenderer = ({ cellData, columnIndex = null }) => {
        const { columns, classes, rowHeight, onRowClick, colPaddingRight } = this.props;
        return (
            <TableCell
                component="div"
                className={classNames(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]: onRowClick == null,
                })}
                variant="body"
                style={ columns[columnIndex].productOption ? { height: rowHeight, alignItems: 'flex-start' } : { height: rowHeight, paddingRight: colPaddingRight }}
                align={(columnIndex !== null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
            >
                { columns[columnIndex].image 
                    ? ( cellData.length > 0 ? <img alt="Product" className="w-full" src={cellData} /> : <img className="w-full block rounded" src="assets/images/ecommerce/product-image-placeholder.png" alt="Product" /> )
                    : columns[columnIndex].productOption
                        ? ( <MoreVert className={classes.moreBtn} onClick={(e) => this.handlePopoverToggle(e, cellData)} /> )
                        : columns[columnIndex].checkbox
                            ?   <Checkbox
                                    checked={ cellData.isChecked }
                                    onChange={this.props.onCheckboxClick}
                                    value={cellData.productID}
                                    color="primary"
                                    name={cellData.productID}
                                    key={cellData.productID}
                                /> 
                            : cellData
                }
            </TableCell>
        );
    };

    headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
        const { headerHeight, columns, classes, sort } = this.props;
        const direction = {
            [SortDirection.ASC]: 'asc',
            [SortDirection.DESC]: 'desc',
        };

        const inner =
            !columns[columnIndex].disableSort && sort != null ? (
                <TableSortLabel active={dataKey === sortBy} direction={direction[sortDirection]}>
                    {label}
                </TableSortLabel>
            ) : (
                label
            );

        return (
            <TableCell
                component="div"
                className={classNames(classes.tableCell, classes.flexContainer, classes.noClick, classes.headerCell)}
                variant="head"
                style={ columns[columnIndex].productOption ? { height: headerHeight, paddingRight: 0 } : { height: headerHeight }}
                align={columns[columnIndex].numeric || false ? 'right' : 'left'}
            >
                {inner}
            </TableCell>
        );
    };

    render() {
        const { classes, columns, selectedRowIndex, ...tableProps } = this.props;

        return (
            <React.Fragment>
                <AutoSizer>
                    {({ height, width }) => (
                        <Table
                            className={classes.table}
                            height={height}
                            width={width}
                            {...tableProps}
                            rowClassName={this.getRowClassName}
                        >
                            {columns.map(({ cellContentRenderer = null, className, dataKey, ...other }, index) => {

                                let renderer;
                                if (cellContentRenderer != null) {
                                    renderer = cellRendererProps =>
                                        this.cellRenderer({
                                            cellData: cellContentRenderer(cellRendererProps),
                                            columnIndex: index,
                                        });
                                } else {
                                    renderer = this.cellRenderer;
                                }

                                return (
                                    <Column
                                        key={dataKey}
                                        headerRenderer={headerProps =>
                                            this.headerRenderer({
                                                ...headerProps,
                                                columnIndex: index,
                                            })
                                        }
                                        className={classNames(classes.flexContainer, className)}
                                        cellRenderer={renderer}
                                        dataKey={dataKey}
                                        {...other}
                                    />
                                );
                            })}
                        </Table>
                    )}
                </AutoSizer>
                
                <Popover
                    id="simple-popper"
                    open={this.state.openPopover}
                    onClose={(e) => this.handlePopoverToggle(e, '')}
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <div className={classes.buttonArea}>
                        <div className="mb-4">
                            <Button size="small" className={classes.button} onClick={this.handleEditBtn}>
                                <EditIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                <Trans i18nKey="main.edit-btn">Edit</Trans>
                            </Button>
                        </div>
                        <div>
                            <Button size="small" className={classNames(classes.button, classes.deleteBtn)} onClick={this.handleDeleteBtn}>
                                <DeleteIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                <Trans i18nKey="main.delete-btn">Delete</Trans>
                            </Button>
                        </div>
                    </div>
                </Popover>
            </React.Fragment>
            
        );
    }
}

ProductTable.propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            cellContentRenderer: PropTypes.func,
            dataKey: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
        }),
    ).isRequired,
    headerHeight: PropTypes.number,
    onRowClick: PropTypes.func,
    rowClassName: PropTypes.string,
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    sort: PropTypes.func,
};

ProductTable.defaultProps = {
    headerHeight: 50,
    rowHeight: 60,
};

export default ProductTable = withRouter(withStyles(styles) (withTranslation()(ProductTable)) );
