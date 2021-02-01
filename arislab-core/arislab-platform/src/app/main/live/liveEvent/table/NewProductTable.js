import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Popover from '@material-ui/core/Popover';
import Icon from '@material-ui/core/Icon';
import { withTranslation, Trans } from 'react-i18next';
import i18n from '../../../../i18n';


const styles = theme => ({
    customBorder: {
        borderBottomWidth: "2px",
        borderColor: "#EB3390"
    },
    customBorder2: {
        borderBottomWidth: "0.5px",
        borderColor: "gray"
    },
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
        padding: theme.spacing.unit
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

class NewProductTable extends React.PureComponent {

    state = {
        openPopover: false,
        anchorEl: null,
        selectedProductID: '',
        searchText: ''
    };

    handlePopoverToggle = (event, productID) => {
        event.preventDefault();

        const anchorTarget = this.state.openPopover ? null : event.currentTarget;
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

    render() {
        const { classes, setSearchText } = this.props;
        let searchText = this.props.searchText;

        return (
            <React.Fragment>
            
                <div>
                    <div className="w-full flex items-center border border-2 border-black py-2 rounded-full h-32">
                        <Icon className="ml-8 mr-4" color="action">search</Icon>
                        <input
                            className="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
                            type="text"
                            placeholder={i18n.t('orders.order-input-search-placeholder')}
                            value={searchText}
                            onChange={(event) => setSearchText(event)}
                        />
                    </div>
                    <table className="w-full content-center" cellspacing="0">
                        <thead>
                            <tr>
                                <th className={classNames('w-1/10 border-b', classes.customBorder)}></th>
                                <th className={classNames('w-1/5 border-b py-16', classes.customBorder)}>Image</th>
                                <th className={classNames('w-1/5 border-b py-16', classes.customBorder)}>Product Name</th>
                                <th className={classNames('w-1/5 border-b py-16', classes.customBorder)}>Hashtag</th>
                                <th className={classNames('w-1/5 border-b py-16', classes.customBorder)}>Stock</th>
                                <th className={classNames('w-1/5 border-b py-16', classes.customBorder)}>Price</th>
                            </tr>
                        </thead>

                        <tbody align='center'>

                            {this.props.items.map((listValue, index) => {
                                return (
                                    <tr key={index}>
                                        <td className={classNames('w-1/10 border-b', classes.customBorder2)}> 
                                            <Checkbox 
                                                checked={listValue.checkbox.isChecked} 
                                                onChange={this.props.onCheckboxClick} 
                                                value={listValue.checkbox.productID}
                                                color="primary"
                                                name={listValue.checkbox.productID}
                                                key={listValue.checkbox.productID}
                                            /> 
                                        </td>
                                        <td className={classNames('w-1/5 border-b py-16', classes.customBorder2)}> {listValue.image ? 
                                            <img alt="Product" className="w-full" src={listValue.image} style={{ width: '50px' }} /> 
                                            : 
                                            <img style={{ width: '50px' }} className="w-full block rounded" src="assets/images/ecommerce/product-image-placeholder.png" alt="Product" />} 
                                        </td>
                                        <td className={classNames('w-1/5 border-b py-16', classes.customBorder2)}> {listValue.name} </td>
                                        <td className={classNames('w-1/5 border-b py-16', classes.customBorder2)}> {listValue.hashtag} </td>
                                        <td className={classNames('w-1/5 border-b py-16', classes.customBorder2)}> {listValue.stock} </td>
                                        <td className={classNames('w-1/5 border-b py-16', classes.customBorder2)}> {listValue.price} </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        
                    </table>
                </div>

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

NewProductTable.propTypes = {
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

NewProductTable.defaultProps = {
    headerHeight: 50,
    rowHeight: 60,
};

export default NewProductTable = withRouter(withStyles(styles)(withTranslation()(NewProductTable)));
