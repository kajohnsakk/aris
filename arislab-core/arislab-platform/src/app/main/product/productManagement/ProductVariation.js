import React, { Component } from 'react';
import {
    withStyles,
    Button,
    TextField,
    Typography,
    FormControlLabel,
    Checkbox,
    IconButton,
    CircularProgress,
    Divider
} from '@material-ui/core';
import _ from '@lodash';
import { Trans, withTranslation } from 'react-i18next';
import connect from 'react-redux/es/connect/connect';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
// import { ApiService } from '../../modules/ApiService';
import {
    withRouter
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import CloseIcon from '@material-ui/icons/Close';

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
    productImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            boxShadow: theme.shadows[5],
        },
        '&.featured': {
            pointerEvents: 'none',
            boxShadow: theme.shadows[3],
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
        marginLeft: '10px'
    },
    inputField: {
        padding: '0px 0px'
    },
    highlightText: {
        color: theme.palette.primary.color,
        fontWeight: 'bolder'
    },
});

const attributeOption = require('../../config/product/misc/attributeConfig.json');


class ProductVariation extends Component {

    state = {
        form: null,
        newColor: '',
        isUpdate: false
    }


    componentDidMount() {
        if (this.state.form === null) {
            this.updateFormState();
        }

    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (!_.isEqual(this.props.location, prevProps.location)) {
        //     this.updateProductState();

        // }

        // if (this.props.product.data !== null && this.state.form !== null) {
        //     // Process data from "prompt" only
        //     if (this.props.reference === "prompt" && !this.state.isUpdate) {

        //         if (this.props.productId === 'new' && this.props.product.data.productID) {
        //             // console.log('==================== Insert Product to live event ==========================');
        //             this.props.onDoneProcessData(this.props.product.data.productID, this.props.product.data);

        //             this.setState({ isUpdate: true });
        //         } else if (this.props.productId !== 'new' && this.props.product.data.productID === 'OK' && !_.isEqual(this.props.product.data, prevProps.product.data)) {
        //             // console.log('==================== Update Product to live event ==========================');
        //             this.props.onDoneProcessData(this.props.productId, this.props.product.data);

        //             this.setState({ isUpdate: true });
        //         }

        //     }
        // }

    }

    colorInput = (event) => {
        this.setState({
            newColor: event.target.value
        })
    }

    submitNewColor = (index) => {
        const name = "productInfo['productColorOptions'][" + index + "]['label']";
        this.setState({
            form: _.set(
                { ...this.props.form },
                name, this.state.newColor
            )
        });
    }


    updateFormState = () => {
        this.setState(
            { form: this.props.product.data, isUpdate: false },
            this.setFormValue
        );
    };

    filterAttributeBySpecificArray = (arrayToFilter) => {
        return attributeOption.filter((attributeItem) => {
            return arrayToFilter.indexOf(attributeItem.attributeName) !== -1
        });
    }

    handleSelectChange = name => value => {
        this.setState({
            [name]: value,
        });
    };

    // handleProductData = (event) => {
    //     event.preventDefault();

    //     this.props.saveProduct(this.props.form.productInfo, { storeID: this.props.storeID, productID: this.props.productId });
    // };

    // handleChange = (event) => {
    //     // console.log('handleCHange ', event.tar)
    //     this.setState({
    //         form: _.set(
    //             { ...this.props.form },
    //             event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value
    //         )
    //     });
    // };

    setFeaturedImage = (id) => {
        this.setState({ form: _.set({ ...this.state.form }, 'featuredImageId', id) });
    };

    // handleFileChange = (event) => {
    //     if (!event) return;
    //     event.preventDefault();

    //     const { productId } = this.props;
    //     let validExtensions = ['jpg', 'png', 'jpeg', 'gif', 'bmp'];

    //     console.log('file is ', event.target.files[0]);
    //     let file = event.target.files[0];
    //     if (typeof file === 'undefined') return;
    //     let fileName = file.name.toLowerCase();
    //     var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
    //     let targetName = event.target.name;
    //     if (validExtensions.indexOf(fileNameExt) == -1) {

    //         alert("Only these file types are accepted : " + validExtensions.join(', '));
    //     }
    //     else {
    //         ApiService.getInstance().uploadFile(file, (progress) => {
    //             console.log("Upload progress: " + progress);
    //         }).then(url => {
    //             console.log("File uploaded as: ", url);
    //             this.setState({
    //                 form: _.set(
    //                     { ...this.state.form },
    //                     targetName,
    //                     url
    //                 )
    //             }, () => {

    //             });
    //         });
    //     }
    // }


    render() {
        let productVariations = [];
        const { form, classes } = this.props;

        let colorsize = false;

        if (this.props.form.productInfo.productColorOptions.length > 0 && this.props.form.productInfo.productSizeOptions.length > 0) {
            colorsize = true;
        }



        if (form !== null && form.hasOwnProperty('productInfo')) {

            if (form.productInfo.hasOwnProperty('productVariations')) {
                productVariations = form.productInfo.productVariations;
            }

        }


        return (
            form && (
                <div>
                    <div>
                        {colorsize === true ?
                            <div>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    className="my-12"
                                >
                                    <Trans i18nKey="product.product-form-product-variations-title">
                                        Product variations
                                    </Trans>
                                </Typography>

                                {this.props.form.productInfo.productColorOptions.map((color, colorIndex) => {

                                    return (
                                        <div key={"variation_" + colorIndex}>
                                            <div className="flex flex-col bg-white lg:flex-row" key={colorIndex}>
                                                <div className="flex lg:w-1/2 lg:p-8" key={'color_'+colorIndex}>
                                                    <div className="w-1/4 justify-center items-center p-8">
                                                        <label htmlFor={"file-color-" + colorIndex}>
                                                            {form.productInfo.productVariations.hasOwnProperty(colorIndex) && form.productInfo['productVariations'][colorIndex]['image'] ? (
                                                                form.productInfo['productVariations'][colorIndex]['image'] === "LOADING" ? (
                                                                    <div className="w-full text-center py-32">
                                                                        <CircularProgress className={classes.highlightText} />
                                                                    </div>
                                                                ) : (
                                                                    <div className="relative">
                                                                        <div className="absolute" style={{ right: 0 }}>
                                                                            <IconButton aria-label="close" value={"productInfo['productVariations'][" + colorIndex + "]['image']"} className="p-4 lg:p-8" onClick={this.props.removeImage}>
                                                                                <CloseIcon />
                                                                            </IconButton>
                                                                        </div>
                                                                        <img className="border border-solid rounded cursor-pointer" src={form.productInfo['productVariations'][colorIndex]['image']} alt={color.label} component="span" />
                                                                    </div>
                                                                )
                                                            ) : (
                                                                    <Button component="span">
                                                                        <span>
                                                                            <img alt="Upload icon" src={'/assets/images/store-management/upload.png'} />
                                                                        </span>
                                                                    </Button>
                                                                )
                                                            }
                                                        </label>
                                                    </div>

                                                    <div className="w-3/4 items-center p-8">
                                                        <div>
                                                            <Typography
                                                                variant="subtitle1"
                                                                gutterBottom
                                                            >
                                                                {color.label}
                                                            </Typography>
                                                        </div>
                                                        <div className="flex flex-1">
                                                            <TextField
                                                                label={<Trans i18nKey="product.change-color-name">Change color name</Trans>}
                                                                variant='outlined'
                                                                name={"productInfo['productColorOptions'][" + colorIndex + "]['label']"}
                                                                onChange={this.colorInput}
                                                                inputProps={{
                                                                    style: {
                                                                        padding: 6,
                                                                        lineHeight: 0
                                                                    }
                                                                }}
                                                                InputLabelProps={{
                                                                    style: {
                                                                        padding: 0,
                                                                        lineHeight: 0,
                                                                        fontSize: '14px'
                                                                    }
                                                                }}
                                                            />
                                                            <Button
                                                                variant='outlined'
                                                                name={"productInfo['productColorOptions'][" + colorIndex + "]['label']"}
                                                                onClick={this.submitNewColor.bind(this, colorIndex)}
                                                                size="small"
                                                                className="ml-24"
                                                            >
                                                                <Typography>
                                                                    <Trans i18nKey="main.save-btn">
                                                                        Save
                                                                    </Trans>
                                                                </Typography>
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <input
                                                            accept="image/*"
                                                            className="hidden"
                                                            id={"file-color-" + colorIndex}
                                                            type="file"
                                                            name={"productInfo['productVariations'][" + colorIndex + "]['image']"}
                                                            onChange={this.props.handleFileChange}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col pt-28 items-center lg:w-1/2 lg:p-8" key={'size_of_color_'+colorIndex}>
                                                    {this.props.form.productInfo.productSizeOptions.map((size, sizeIndex) => {
                                                        const checkPropertiesConditions = (productVariationsObj) => {
                                                            
                                                            return productVariationsObj.hasOwnProperty(colorIndex) &&
                                                                productVariationsObj[colorIndex].hasOwnProperty('size') &&
                                                                productVariationsObj[colorIndex]['size'].hasOwnProperty(size.value) &&
                                                                productVariationsObj[colorIndex]['size'][size.value].hasOwnProperty('value')
                                                        }

                                                        let priceProps = {};
                                                        let stockProps = {};
                                                        // let skuProps = {};
                                                        let isNAProps = {};
                                                        
                                                        if ( checkPropertiesConditions(productVariations) ) {
                                                            priceProps['defaultValue'] = productVariations[colorIndex]['size'][size.value]['value']['price'] ? Number(productVariations[colorIndex]['size'][size.value]['value']['price']) : 0;
                                                            priceProps['readOnly'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];
                                                            priceProps['disabled'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];

                                                            stockProps['defaultValue'] = productVariations[colorIndex]['size'][size.value]['value']['stock'] ? Number(productVariations[colorIndex]['size'][size.value]['value']['stock']) : 0;
                                                            stockProps['readOnly'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];
                                                            stockProps['disabled'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];

                                                            // skuProps['value'] = productVariations[colorIndex]['size'][size.value]['value']['sku'];
                                                            // skuProps['readOnly'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];
                                                            // skuProps['disabled'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];

                                                            isNAProps['checked'] = (productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] === true ? true : false)
                                                        } else {
                                                            priceProps['defaultValue'] = 0;
                                                            priceProps['readOnly'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);
                                                            priceProps['disabled'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);

                                                            stockProps['defaultValue'] = 0;
                                                            stockProps['readOnly'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);
                                                            stockProps['disabled'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);

                                                            // skuProps['readOnly'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);
                                                            // skuProps['disabled'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);
                                                        
                                                            isNAProps['checked'] = false;
                                                        }


                                                        return (
                                                            <div className="w-full flex flex-row mb-8 items-center" key={sizeIndex}>

                                                                <div className="flex w-1/6 justify-center" key={'size_name_'+sizeIndex}>
                                                                    <Typography>
                                                                        {/* {size.label} */}
                                                                        {(size.label==="__COLOR_ONLY__") ? "" : size.label}
                                                                    </Typography>
                                                                </div>
                                                                <div className="flex w-1/3 px-8" key={'price_of_size_'+sizeIndex}>
                                                                    <TextField
                                                                        required
                                                                        type="number"
                                                                        label={
                                                                            <Trans i18nKey="product.product-form-input-product-variations-price">
                                                                                Price
                                                                            </Trans>
                                                                        }
                                                                        name={"productInfo['productVariations'][" + colorIndex + "][size][" + size.value + "][value][price]"}
                                                                        onChange={this.props.handleChange}
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        {...priceProps}
                                                                        inputProps={{ min: "0" }}
                                                                    />
                                                                </div>
                                                                <div className="flex w-1/3 px-8" key={'stock_of_size_'+sizeIndex}>
                                                                    <TextField
                                                                        required
                                                                        label={
                                                                            <Trans i18nKey="product.product-form-input-product-variations-stock">
                                                                                Stock
                                                                            </Trans>
                                                                        }
                                                                        type="number"
                                                                        name={"productInfo['productVariations'][" + colorIndex + "][size][" + size.value + "][value][stock]"}
                                                                        onChange={this.props.handleChange}
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        {...stockProps}
                                                                        inputProps={{ min: "0" }}
                                                                    />
                                                                </div>
                                                                <div className="flex w-1/6 px-8" key={'avariable_of_size_'+sizeIndex}>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                name={"productInfo['productVariations'][" + colorIndex + "][size][" + size.value + "][value][isNotAvailable]"}
                                                                                onChange={this.props.handleChange}
                                                                                color="primary"
                                                                                {...isNAProps}
                                                                            />
                                                                        }
                                                                        label={
                                                                            <Trans i18nKey="product.product-form-input-product-variations-na">
                                                                                N/A
                                                                            </Trans>
                                                                        }
                                                                    />
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <Divider className="my-16" />
                                        </div>
                                    )
                                })}
                            </div>
                            : <Typography><Trans i18nKey="product.not-select-color-and-size">Please select a color and a size.</Trans></Typography>

                        }
                    </div>

                    {/* <Grid>
                        <div className="flex-1 text-center mt-16">
                            <Button
                                variant="outlined"
                                className={classes.button}
                                type="submit"
                                onClick={this.props.onDoneProcessData}
                            >
                                <Trans i18nKey="product.product-form-save-button-title">
                                    Save Product
                                </Trans>
                            </Button>
                            {typeof this.props.onCancelBtnClick === 'undefined' ? null :
                                <Button className="ml-16" onClick={() => this.props.onCancelBtnClick()}>
                                    <Trans i18nKey="product.product-form-cancel-button-title">
                                        Cancel
                                    </Trans>
                                </Button>}
                        </div>
                    </Grid> */}
                </div>
            )
        );
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProduct: Actions.getProduct,
        newProduct: Actions.newProduct,
        saveProduct: Actions.saveProduct
    }, dispatch);
}

function mapStateToProps({ eCommerceApp }) {
    return {
        product: eCommerceApp.product
    }
}

export default withReducer('eCommerceApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ProductVariation)))));