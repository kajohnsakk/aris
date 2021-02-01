import React, { Component } from 'react';
import {
    withStyles,
    Button,
    TextField,
    InputAdornment,
    Typography,
    IconButton,
    CircularProgress
} from '@material-ui/core';
import { FuseChipSelect } from '@fuse';
import { orange } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {
    withRouter
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
// import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

// import { ApiService } from '../../modules/ApiService';

// import Cookies from "js-cookie";
// import { UtilityManager } from '../../modules/UtilityManager';

import { Trans, withTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import 'rc-color-picker/assets/index.css';
// import { thisExpression } from '@babel/types';

const sizeOption = require('../../config/product/misc/sizeConfig.json');
const colorOption = require('../../config/product/misc/colorConfig.json');
const productTypeOption = require('../../config/product/misc/productTypeConfig.json')

const styles = theme => ({
    card: {
        maxWidth: '100%',
        border: 'solid 1px #ededed',
        paddingBottom: 5
    },
    header: {
        background: '#fbfbfb',
        borderBottom: 'solid 2px #ededed',
        color: '#8d9095',
        fontWeight: 'bolder'
    },
    content: {
        background: '#ffffff',
        paddingTop: 5,
        paddingBottom: 5,
    },
    button: {
        background: '#e83490',
        color: '#ffffff',
        fontWeight: 'bold',
        border: '0px',
        '&:hover': {
            background: '#e83490',
            color: '#ffffff',
            fontWeight: 'bold',
            border: '0px'
        }
    },
    productImageFeaturedStar: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: orange[400],
        opacity: 0
    },
    productImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            boxShadow: theme.shadows[5],
            '& $productImageFeaturedStar': {
                opacity: .8
            }
        },
        '&.featured': {
            pointerEvents: 'none',
            boxShadow: theme.shadows[3],
            '& $productImageFeaturedStar': {
                opacity: 1
            },
            '&:hover $productImageFeaturedStar': {
                opacity: 1
            }
        }
    },
    mainProductImageTitle: {
        color: theme.palette.primary.color,
        fontWeight: 800,
        fontSize: '16px'
    },
    closeupProductImageTitle: {
        color: "#faa85e",
        fontWeight: 800,
        fontSize: '16px',
        // marginLeft: '10px'
    },
    inputField: {
        padding: '0px 0px'
    },
    highlightText: {
        color: theme.palette.primary.color,
        fontWeight: 'bolder'
    },
});

class ProductDetails extends Component {

    state = {
        form: null,
        fieldList: [],
        storeID: '',
        email: '',
    };

    render() {
        const { classes } = this.props;
        let productImage;
        let individualProductType;
        let loadIndividualData;
        let closeupImage1;
        let closeupImage2;
        let closeupImage3;
        let productName;
        let productHashtag;
        let productColorOptions = [];
        let productSizeOptions = [];
        let universalPrice = 0;
        let universalStock = 0;
        let form = this.state.form;
        if (this.props.form !== null && this.props.form.hasOwnProperty('productInfo')) {
            if (this.props.form.productInfo && this.props.form.productName !== "") {
                form = this.props.form
            }
        }
        if (form !== null && form.hasOwnProperty('productInfo')) {
            if (form.productInfo.hasOwnProperty('productImage')) {
                productImage = form.productInfo.productImage;
            }
            if (form.productInfo.hasOwnProperty('closeupImage')) {
                if (form.productInfo.closeupImage.hasOwnProperty('image1')) {
                    closeupImage1 = form.productInfo.closeupImage.image1;
                }
                if (form.productInfo.closeupImage.hasOwnProperty('image2')) {
                    closeupImage2 = form.productInfo.closeupImage.image2;
                }
                if (form.productInfo.closeupImage.hasOwnProperty('image3')) {
                    closeupImage3 = form.productInfo.closeupImage.image3;
                }
            }

            if (form.productInfo.hasOwnProperty('individualProductType')) {
                productTypeOption.map((item, index) => {
                    if (form.productInfo.individualProductType === item.value) {
                        individualProductType = item;
                        loadIndividualData = item.value;
                    }

                    return true;
                })
            }

            if (form.productInfo.hasOwnProperty('productName')) {
                productName = form.productInfo.productName;
            }
            if (form.productInfo.hasOwnProperty('productHashtag')) {
                productHashtag = form.productInfo.productHashtag;
            }
            if (form.productInfo.hasOwnProperty('productColorOptions')) {
                productColorOptions = form.productInfo.productColorOptions;
            }
            if (form.productInfo.hasOwnProperty('productSizeOptions')) {
                productSizeOptions = form.productInfo.productSizeOptions;
            }

            if (form.productInfo.hasOwnProperty('productUniversalInfo')) {
                if (form.productInfo.productUniversalInfo && form.productInfo.productUniversalInfo.hasOwnProperty('price')) {
                    universalPrice = form.productInfo.productUniversalInfo.price;
                }
                if (form.productInfo.productUniversalInfo && form.productInfo.productUniversalInfo.hasOwnProperty('stock')) {
                    universalStock = form.productInfo.productUniversalInfo.stock;
                }
            }
        }

        return (
            this.props.form && (
                <div className="flex mb-24 flex-col bg-white">
                    <div className='flex bg-white'>
                        <div className="hidden lg:block w-1/4 p-16 justify-center">
                            <img src="assets/images/examples/overlayEG.png" className="w-full" alt="" />
                        </div>
                        <div className='w-full lg:w-3/4 lg:p-16' >

                            <div className="flex flex-col mb-16 lg:flex-row">
                                <div className="flex flex-col w-full mb-16 md:p-8 lg:w-1/3 lg:mb-0">
                                    <div className="mb-4">
                                        <Typography className={classes.mainProductImageTitle}>
                                            <Trans i18nKey="product.product-form-main-image-title">
                                                Main Image
                                                </Trans> *
                                            </Typography>
                                    </div>
                                    <div className="w-1/3 lg:w-full">
                                        <label htmlFor="main-image-file">
                                            {productImage ? (
                                                productImage === "LOADING" ? (
                                                    <div className="w-full text-center py-32">
                                                        <CircularProgress className={classes.highlightText} />
                                                    </div>
                                                ) : (
                                                        <div className="relative">
                                                            <div className="absolute" style={{ right: 0 }}>
                                                                <IconButton aria-label="close" value="productInfo['productImage']" className="p-4 lg:p-8" onClick={this.props.removeImage}>
                                                                    <CloseIcon />
                                                                </IconButton>
                                                            </div>
                                                            <img className="border border-solid rounded cursor-pointer" src={productImage} alt="Main" component="span" />
                                                        </div>
                                                    )
                                            ) : (
                                                    <Button className={classes.mainAddProductImage} component="span">
                                                        <span>
                                                            <img alt="Upload icon" src={'/assets/images/store-management/upload.png'} />
                                                        </span>
                                                    </Button>
                                                )}
                                        </label>
                                        <div>
                                            <input
                                                accept="image/*"
                                                className="hidden"
                                                id="main-image-file"
                                                type="file"
                                                name="productInfo['productImage']"
                                                onChange={this.props.handleFileChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col w-full md:p-8 lg:w-2/3">
                                    <div>
                                        <Typography className={classes.closeupProductImageTitle}>
                                            <Trans i18nKey="product.product-form-closeup-image-title">
                                                Closeup Image
                                                </Trans>
                                        </Typography>
                                    </div>
                                    <div className="flex">
                                        <label htmlFor="closeup-image-file-1" className="w-1/3 p-4">
                                            {closeupImage1 ? (
                                                closeupImage1 === "LOADING" ? (
                                                    <div className="w-full text-center py-32">
                                                        <CircularProgress className={classes.highlightText} />
                                                    </div>
                                                ) : (
                                                        <div className="relative">
                                                            <div className="absolute" style={{ right: 0 }}>
                                                                <IconButton aria-label="close" value="productInfo['closeupImage']['image1']" className="p-4 lg:p-8" onClick={this.props.removeImage}>
                                                                    <CloseIcon />
                                                                </IconButton>
                                                            </div>
                                                            <img className="border border-solid rounded cursor-pointer" src={closeupImage1} alt="Closeup 1" component="span" />
                                                        </div>
                                                    )
                                            ) : (
                                                    <Button className={classes.mainAddProductImage} component="span">
                                                        <span>
                                                            <img alt="Upload icon" src={'/assets/images/store-management/upload.png'} />
                                                        </span>
                                                    </Button>
                                                )}
                                        </label>
                                        <div>
                                            <input
                                                accept="image/*"
                                                className="hidden"
                                                id="closeup-image-file-1"
                                                type="file"
                                                name="productInfo['closeupImage']['image1']"
                                                onChange={this.props.handleFileChange}
                                            />
                                        </div>
                                        <label htmlFor="closeup-image-file-2" className="w-1/3 p-4">
                                            {closeupImage2 ? (
                                                closeupImage2 === "LOADING" ? (
                                                    <div className="w-full text-center py-32">
                                                        <CircularProgress className={classes.highlightText} />
                                                    </div>
                                                ) : (
                                                        <div className="relative">
                                                            <div className="absolute" style={{ right: 0 }}>
                                                                <IconButton aria-label="close" value="productInfo['closeupImage']['image2']" className="p-4 lg:p-8" onClick={this.props.removeImage}>
                                                                    <CloseIcon />
                                                                </IconButton>
                                                            </div>
                                                            <img className="border border-solid rounded cursor-pointer" src={closeupImage2} alt="Closeup 2" component="span" />
                                                        </div>
                                                    )
                                            ) : (
                                                    <Button className={classes.mainAddProductImage} component="span">
                                                        <span>
                                                            <img alt="Upload icon" src={'/assets/images/store-management/upload.png'} />
                                                        </span>
                                                    </Button>
                                                )}
                                        </label>
                                        <div>
                                            <input
                                                accept="image/*"
                                                className="hidden"
                                                id="closeup-image-file-2"
                                                type="file"
                                                name="productInfo['closeupImage']['image2']"
                                                onChange={this.props.handleFileChange}
                                            />
                                        </div>
                                        <label htmlFor="closeup-image-file-3" className="w-1/3 p-4">
                                            {closeupImage3 ? (
                                                closeupImage3 === "LOADING" ? (
                                                    <div className="w-full text-center py-32">
                                                        <CircularProgress className={classes.highlightText} />
                                                    </div>
                                                ) : (
                                                        <div className="relative">
                                                            <div className="absolute" style={{ right: 0 }}>
                                                                <IconButton aria-label="close" value="productInfo['closeupImage']['image3']" className="p-4 lg:p-8" onClick={this.props.removeImage}>
                                                                    <CloseIcon />
                                                                </IconButton>
                                                            </div>
                                                            <img className="border border-solid rounded cursor-pointer" src={closeupImage3} alt="Closeup 3" component="span" />
                                                        </div>
                                                    )
                                            ) : (
                                                    <Button className={classes.mainAddProductImage} component="span">
                                                        <span>
                                                            <img alt="Upload icon" src={'/assets/images/store-management/upload.png'} />
                                                        </span>
                                                    </Button>
                                                )}
                                        </label>
                                        <div>
                                            <input
                                                accept="image/*"
                                                className="hidden"
                                                id="closeup-image-file-3"
                                                type="file"
                                                name="productInfo['closeupImage']['image3']"
                                                onChange={this.props.handleFileChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='flex'>
                                <div className="w-full md:p-8">
                                    <Typography>
                                        <Trans i18nKey="product.product-type">
                                            Product Type
                                            </Trans> *
                                        </Typography>
                                    <FuseChipSelect
                                        isSearchable={false}
                                        className="w-full mt-8 mb-16"
                                        name="productInfo['individualProductType']"
                                        value={individualProductType}
                                        onChange={(event) => this.props.handleProductType(event, "productInfo['individualProductType']")}
                                        placeholder={i18n.t('product.product-type-placeholder')}
                                        textFieldProps={{
                                            InputLabelProps: {
                                                shrink: true
                                            },
                                            variant: 'outlined'
                                        }}
                                        options={productTypeOption}
                                        required
                                    />
                                </div>
                            </div>

                            {/* This is generic template */}
                            {(this.props.individualProductType && (this.props.individualProductType === 'SINGLE' || this.props.individualProductType === 'VOUCHER') || loadIndividualData === "SINGLE") ? (
                                <div className="flex flex-1 flex-col">
                                    <div className="flex flex-1 flex-col md:flex-row">
                                        <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.product-form-input-product-name">
                                                    Product Name
                                                    </Trans> *
                                                </Typography>
                                            <TextField
                                                className="mt-8 mb-16"
                                                required
                                                id="productName"
                                                name="productInfo['productName']"
                                                value={productName}
                                                onChange={this.props.handleChange}
                                                variant="outlined"
                                                fullWidth
                                                placeholder={i18n.t('product.product-form-input-product-name')}
                                            />
                                        </div>
                                        <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.product-form-input-product-hashtag">
                                                    Hashtag
                                                </Trans>
                                            </Typography>
                                            <TextField
                                                className="mt-8 mb-16"
                                                id="productHashtag"
                                                name="productInfo['productHashtag']"
                                                type="text"
                                                value={productHashtag}
                                                variant="outlined"
                                                fullWidth
                                                inputProps={{
                                                    readOnly: true,
                                                    startadornment: <InputAdornment position="start">#</InputAdornment>,
                                                    maxLength: 15
                                                }}
                                                placeholder={i18n.t('product.product-form-input-product-hashtag')}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col md:flex-row">
                                        <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.product-form-input-product-variations-price">
                                                    Price
                                                    </Trans> *
                                                </Typography>
                                            <TextField
                                                className="mt-8 mb-16"
                                                required
                                                placeholder="Price"
                                                value={universalPrice}
                                                type="number"
                                                name={"productInfo['productUniversalInfo'][price]"}
                                                onChange={this.props.handleChange}
                                                variant="outlined"
                                                fullWidth
                                                inputProps={{ min: "0" }}
                                            />
                                        </div>
                                        <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.product-form-input-product-variations-stock">
                                                    Stock
                                                    </Trans> *
                                                </Typography>
                                            <TextField
                                                className="mt-8 mb-16"
                                                value={universalStock}
                                                required
                                                placeholder="Stock"
                                                type="number"
                                                name={"productInfo['productUniversalInfo'][stock]"}
                                                onChange={this.props.handleChange}
                                                variant="outlined"
                                                fullWidth
                                                inputProps={{ min: "0" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                    null
                                )}

                            {/* This is apparel template*/}
                            {(this.props.individualProductType && this.props.individualProductType === "MULTI") || loadIndividualData === 'MULTI' ? (
                                <div className="flex flex-1 flex-col">
                                    <div className="flex flex-1 flex-col md:flex-row">
                                        <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.product-form-input-product-name">
                                                    Product Name
                                                    </Trans> *
                                                </Typography>
                                            <TextField
                                                className="mt-8 mb-16"
                                                required
                                                id="productName"
                                                name="productInfo['productName']"
                                                value={productName}
                                                onChange={this.props.handleChange}
                                                variant="outlined"
                                                fullWidth
                                                placeholder={i18n.t('product.product-form-input-product-name')}
                                            />
                                        </div>
                                        <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.product-form-input-product-hashtag">
                                                    Hashtag
                                                    </Trans>
                                            </Typography>
                                            <TextField
                                                className="mt-8 mb-16"
                                                id="productHashtag"
                                                name="productInfo['productHashtag']"
                                                type="text"
                                                value={productHashtag}
                                                variant="outlined"
                                                fullWidth
                                                inputProps={{
                                                    readOnly: true,
                                                    startadornment: <InputAdornment position="start">#</InputAdornment>,
                                                    maxLength: 15
                                                }}
                                                placeholder={i18n.t('product.product-form-input-product-hashtag')}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col md:flex-row">
                                        <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.color">
                                                    Color
                                                    </Trans> *
                                                </Typography>
                                            <FuseChipSelect
                                                isSearchable={false}
                                                className="w-full mt-8 mb-16"
                                                onChange={(value) => this.props.handleChangeColor(value, "productInfo['productColorOptions']")}
                                                placeholder={i18n.t('product.product-form-input-product-color-placeholder')}
                                                textFieldProps={{
                                                    InputLabelProps: {
                                                        shrink: true
                                                    },
                                                    variant: 'outlined'
                                                }}
                                                isMulti
                                                value={productColorOptions}
                                                options={colorOption}
                                                required
                                            />
                                        </div>
                                        <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.size">
                                                    Size
                                                    </Trans> *
                                                </Typography>
                                            <FuseChipSelect
                                                isSearchable={true}
                                                className="w-full mt-8 mb-16"
                                                onChange={(value) => this.props.handleChangeSize(value, "productInfo['productSizeOptions']")}
                                                placeholder={i18n.t("product.product-form-input-product-size-placeholder")}
                                                textFieldProps={{
                                                    InputLabelProps: {
                                                        shrink: true
                                                    },
                                                    variant: 'outlined'
                                                }}
                                                isMulti
                                                value={productSizeOptions}
                                                options={sizeOption}
                                                required
                                                variant="fixed"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                    null
                                )}

                            {/* This is color only template */}
                            {(this.props.individualProductType && this.props.individualProductType === "COLOR_ONLY") || loadIndividualData === 'COLOR_ONLY' ? (
                                <div className="flex flex-1 flex-col">
                                    <div className="flex flex-1 flex-col md:flex-row">
                                        <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.product-form-input-product-name">
                                                    Product Name
                                                    </Trans> *
                                                </Typography>
                                            <TextField
                                                className="mt-8 mb-16"
                                                required
                                                id="productName"
                                                name="productInfo['productName']"
                                                value={productName}
                                                onChange={this.props.handleChange}
                                                variant="outlined"
                                                fullWidth
                                                placeholder={i18n.t('product.product-form-input-product-name')}
                                            />
                                        </div>
                                        <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.product-form-input-product-hashtag">
                                                    Hashtag
                                                    </Trans>
                                            </Typography>
                                            <TextField
                                                className="mt-8 mb-16"
                                                id="productHashtag"
                                                name="productInfo['productHashtag']"
                                                type="text"
                                                value={productHashtag}
                                                variant="outlined"
                                                fullWidth
                                                inputProps={{
                                                    readOnly: true,
                                                    startadornment: <InputAdornment position="start">#</InputAdornment>,
                                                    maxLength: 15
                                                }}
                                                placeholder={i18n.t('product.product-form-input-product-hashtag')}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col md:flex-row">
                                        <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.color">
                                                    Color
                                                    </Trans> *
                                                </Typography>
                                            <FuseChipSelect
                                                isSearchable={false}
                                                className="w-full mt-8 mb-16"
                                                onChange={(value) => this.props.handleChangeColor(value, "productInfo['productColorOptions']")}
                                                placeholder={i18n.t('product.product-form-input-product-color-placeholder')}
                                                textFieldProps={{
                                                    InputLabelProps: {
                                                        shrink: true
                                                    },
                                                    variant: 'outlined'
                                                }}
                                                isMulti
                                                value={productColorOptions}
                                                options={colorOption}
                                                required
                                            />
                                        </div>
                                        {/* <div className="w-full md:p-8">
                                            <Typography>
                                                <Trans i18nKey="product.size">
                                                    Size
                                                    </Trans> *
                                                </Typography>
                                            <FuseChipSelect
                                                isSearchable={false}
                                                className="w-full mt-8 mb-16"
                                                onChange={(value) => this.props.handleChangeSize(value, "productInfo['productSizeOptions']")}
                                                placeholder={i18n.t("product.product-form-input-product-size-placeholder")}
                                                textFieldProps={{
                                                    InputLabelProps: {
                                                        shrink: true
                                                    },
                                                    variant: 'outlined'
                                                }}
                                                isMulti
                                                value={productSizeOptions}
                                                options={sizeOption}
                                                required
                                            />
                                        </div> */}
                                    </div>
                                </div>
                            ) : (
                                    null
                                )}

                        </div>
                    </div>
                </div>
            )
        );
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProduct: Actions.getProduct,
        newProduct: Actions.newProduct,
        // saveProduct: Actions.saveProduct
    }, dispatch);
}

function mapStateToProps({ eCommerceApp }) {
    return {
        product: eCommerceApp.product
    }
}

export default withReducer('eCommerceApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ProductDetails)))));