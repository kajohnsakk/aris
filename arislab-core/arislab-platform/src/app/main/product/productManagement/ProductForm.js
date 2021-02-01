import React, { Component } from 'react';
import {
    withStyles,
    Button,
    TextField,
    InputAdornment,
    Typography,
    Grid,
    FormControlLabel,
    Checkbox,
    Divider,
} from '@material-ui/core';
import { FuseChipSelect } from '@fuse';
import { orange } from '@material-ui/core/colors';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import _ from '@lodash';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

import { ApiService } from '../../modules/ApiService';

import Cookies from "js-cookie";
import { UtilityManager } from '../../modules/UtilityManager';

import { Trans, withTranslation } from 'react-i18next';

const sizeOption = require('../../config/product/misc/sizeConfig.json');
const colorOption = require('../../config/product/misc/colorConfig.json');
const typeOption = require('../../config/product/misc/typeConfig.json');
const attributeOption = require('../../config/product/misc/attributeConfig.json');

const dataMenOption = require('../../config/product/Men/dataMenConfig.json');
const dataMenTShirtOption = require('../../config/product/Men/dataMenTShirtConfig.json');
const dataMenShirtOption = require('../../config/product/Men/dataMenShirtConfig.json');
const dataMenPoloShirtOption = require('../../config/product/Men/dataMenPoloShirtConfig.json');
const dataMenOuterCoatOption = require('../../config/product/Men/dataMenOuterCoatConfig.json');
const dataMenShortsOption = require('../../config/product/Men/dataMenShortsConfig.json');
const dataMenLongTrouserOption = require('../../config/product/Men/dataMenLongTrouserConfig.json');
const dataMenJeansOption = require('../../config/product/Men/dataMenJeansConfig.json');
const dataMenUnderwearOption = require('../../config/product/Men/dataMenUnderwearConfig.json');

const dataWomenOption = require('../../config/product/Women/dataWomenConfig.json');
const dataWomenShirtOption = require('../../config/product/Women/dataWomenShirtConfig.json');
const dataWomenDressOption = require('../../config/product/Women/dataWomenDressConfig.json');
const dataWomenSkirtOption = require('../../config/product/Women/dataWomenSkirtConfig.json');
const dataWomenPantsOption = require('../../config/product/Women/dataWomenPantsConfig.json');
const dataWomenJacketAndCoatOption = require('../../config/product/Women/dataWomenJacketAndCoatConfig.json');
const dataWomenJumpsuitOption = require('../../config/product/Women/dataWomenJumpsuitConfig.json');
const dataWomenUnderwearOption = require('../../config/product/Women/dataWomenUnderwearConfig.json');
const dataWomenPajamasOption = require('../../config/product/Women/dataWomenPajamasConfig.json');

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
        marginLeft: '10px'
    },
    inputField: {
        padding: '0px 0px'
    }
});

class ProductForm extends Component {

    state = {
        form: null,
        tempSelectedType: {},
        tempSelectedSubCategoryLevel1: {},
        tempSelectedSubCategoryLevel2: {},
        tempSelectedColor: [],
        tempSelectedSize: [],
        tempProductFAQDetails: [],
        tempProductFAQDetailsOption: {},
        subCategoryLevel1Options: [],
        subCategoryLevel2Options: [],
        fieldList: [],
        storeID: '',
        auth0_uid: '',
        email: '',
        addColor: false,
        isUpdate: false,
        newColor: ''
    };

    componentDidMount() {
        if (this.props.storeID) {
            this.setState({
                storeID: this.props.storeID
            }, () => this.updateProductState());

        } else {
            // let cookieValue = Cookies.get('email');
            let cookieValue = Cookies.get('auth0_uid');

            UtilityManager.getInstance().storeInfoLookup(cookieValue).then((resultStoreInfo) => {
                this.setState({
                    auth0_uid: resultStoreInfo[0].auth0_uid,
                    email: resultStoreInfo[0].email,
                    storeID: resultStoreInfo[0].storeID
                }, () => this.updateProductState());
            });
        }
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!_.isEqual(this.props.location, prevProps.location)) {
            this.updateProductState();
        }

        if (
            (this.props.product.data && !this.state.form) ||
            (this.props.product.data && this.state.form && this.props.product.data.storeID !== this.state.form.storeID) ||
            !_.isEqual(this.props.product.data, this.state.form)
        ) {
            this.updateFormState();
        }


        if (this.props.product.data !== null && this.state.form !== null) {
            // Process data from "prompt" only
            if (this.props.reference === "prompt" && !this.state.isUpdate) {

                if (this.props.productId === 'new' && this.props.product.data.productID) {
                    this.props.onDoneProcessData(this.props.product.data.productID, this.props.product.data);

                    this.setState({ isUpdate: true });
                } else if (this.props.productId !== 'new' && this.props.product.data.productID === 'OK' && !_.isEqual(this.props.product.data, prevProps.product.data)) {
                    this.props.onDoneProcessData(this.props.productId, this.props.product.data);

                    this.setState({ isUpdate: true });
                }

            }
        }

    }

    handleChangeClick = (event) => {
        window.location.reload();
    }

    updateFormState = () => {
        this.setState(
            { form: this.props.product.data, isUpdate: false },
            this.setFormValue
        );
    };

    setFormValue = () => {
        // const params = this.props.match.params;
        // const { productId } = params;
        const { productId } = this.props;
        const { form } = this.state;

        if (productId !== 'new' && form !== null) {
            this.handleChangeType(form.productInfo.productTypeOption, "productInfo['productTypeOption']");
            this.handleChangeSubCategoryLevel1(form.productInfo.subCategoryLevel1SelectedOption, "productInfo['subCategoryLevel1SelectedOption']");
            this.handleChangeSubCategoryLevel2(form.productInfo.subCategoryLevel2SelectedOption, "productInfo['subCategoryLevel2SelectedOption']");
            this.handleChangeColor(form.productInfo.productColorOptions, "productInfo['productColorOptions']")
            this.handleChangeSize(form.productInfo.productSizeOptions, "productInfo['productSizeOptions']")
        }
    }

    updateProductState = () => {
        // const params = this.props.match.params;
        // const { productId } = params;

        const { productId } = this.props;
        const { storeID } = this.state;

        if (productId === 'new') {
            this.props.newProduct();
        } else {
            this.props.getProduct({
                storeID: storeID,
                productID: productId
            });
        }
        this.setState({ isUpdate: false });
    };

    filterAttributeBySpecificArray = (arrayToFilter) => {
        return attributeOption.filter((attributeItem) => {
            return arrayToFilter.indexOf(attributeItem.attributeName) !== -1
        });
    }

    handleCheckboxChange = name => event => {
        this.setState({
            [name]: event.target.checked
        });
    };

    handleChange = (event) => {
        this.setState({
            form: _.set(
                { ...this.state.form },
                event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value
            )
        });
    };

    handleCustom = (event) => {
        this.handleChangeColor(event.target.value, "productInfo['productColorOptions']")
    };

    handleChangeHashtag = (event) => {
        this.setState({
            form: _.set(
                { ...this.state.form },
                event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value.replace(/\s/g, '')
            )
        });
    };

    handleSelectChange = name => value => {
        this.setState({
            [name]: value,
        });
    };

    handleChipChange = (value, name) => {
        this.setState({
            form: _.set(
                { ...this.state.form },
                name, value
            )
        });
    };

    handleChangeFAQOption = (selectedFAQ, name, FAQAttributeName) => {
        this.setState({
            form: _.set(
                { ...this.state.form },
                name, selectedFAQ.value
            )
        });

        let FAQElementName = "productInfo['productFAQDetailsOption'][" + FAQAttributeName + "]";
        this.setState({
            form: _.set(
                { ...this.state.form },
                FAQElementName, selectedFAQ
            )
        });
    }

    handleChangeType = (selectedType, name) => {
        if (selectedType.value === "fashionCloth_Men") {
            this.setState({
                tempSelectedType: selectedType,
                subCategoryLevel1Options: dataMenOption,
                form: _.set(
                    { ...this.state.form },
                    name, selectedType
                )
            });
        } else if (selectedType.value === "fashionCloth_Women") {
            this.setState({
                tempSelectedType: selectedType,
                subCategoryLevel1Options: dataWomenOption,
                form: _.set(
                    { ...this.state.form },
                    name, selectedType
                )
            });
        }
    }

    handleChangeSubCategoryLevel1 = (subCategoryLevel1SelectedOption, name) => {
        let fieldsAvailableList = [];

        this.setState({
            tempSelectedSubCategoryLevel1: subCategoryLevel1SelectedOption
        });

        if (subCategoryLevel1SelectedOption.value === "men_tShirt") {
            fieldsAvailableList = ['color', 'washingMethod', 'pocket', 'size', 'neckType', 'shirtShape', 'armType', 'texture'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataMenTShirtOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "men_shirt") {
            fieldsAvailableList = ['color', 'washingMethod', 'pocket', 'size', 'coverType', 'neckType', 'shirtShape', 'armType', 'texture'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataMenShirtOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "men_poloShirt") {
            fieldsAvailableList = ['color', 'washingMethod', 'pocket', 'size', 'neckType', 'shirtShape', 'armType', 'texture'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataMenPoloShirtOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "men_outerCoat") {
            fieldsAvailableList = ['color', 'washingMethod', 'pocket', 'size', 'neckType', 'shirtShape', 'armType', 'texture'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataMenOuterCoatOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "men_shorts") {
            fieldsAvailableList = ['color', 'washingMethod', 'pants', 'waistLevel', 'size', 'texture'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataMenShortsOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "men_longTrouser") {
            fieldsAvailableList = ['color', 'washingMethod', 'pantsLength', 'waistLevel', 'size', 'style', 'pantsShape', 'texture'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataMenLongTrouserOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "men_jeans") {
            fieldsAvailableList = ['color', 'washingMethod', 'pantsLength', 'waistLevel', 'size', 'style', 'pantsShape', 'texture'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataMenJeansOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "men_underwear") {
            fieldsAvailableList = ['color', 'washingMethod', 'size', 'texture'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataMenUnderwearOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "men_longjohn") {
            fieldsAvailableList = ['texture', 'warmthLevel'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: '',
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "men_handglove") {
            fieldsAvailableList = ['texture'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: '',
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "women_shirt") {
            fieldsAvailableList = ['texture', 'color', 'pattern', 'armLength', 'usage'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataWomenShirtOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "women_dress") {
            fieldsAvailableList = ['texture', 'color', 'pattern', 'format', 'armLength', 'usage'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataWomenDressOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "women_skirt") {
            fieldsAvailableList = ['texture', 'color', 'pattern', 'format', 'waistHeight', 'usage'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataWomenSkirtOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "women_pants") {
            fieldsAvailableList = ['texture', 'color', 'pattern', 'waistHeight', 'usage'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataWomenPantsOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "women_jacketAndCoat") {
            fieldsAvailableList = ['texture', 'color', 'pattern', 'usage'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataWomenJacketAndCoatOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "women_jumpsuit") {
            fieldsAvailableList = ['texture', 'color', 'pattern', 'armLength', 'usage'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataWomenJumpsuitOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "women_underwear") {
            fieldsAvailableList = ['texture', 'color', 'pattern'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataWomenUnderwearOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        } else if (subCategoryLevel1SelectedOption.value === "women_pajamas") {
            fieldsAvailableList = ['legLength', 'armLength', 'texture', 'size', 'format'];

            let fieldList = this.filterAttributeBySpecificArray(fieldsAvailableList);

            this.setState({
                subCategoryLevel2Options: dataWomenPajamasOption,
                fieldList: fieldList,
                form: _.set(
                    { ...this.state.form },
                    name, subCategoryLevel1SelectedOption
                )
            });
        }
    }

    handleChangeSubCategoryLevel2 = (subCategoryLevel2SelectedOption, name) => {
        this.setState({
            tempSelectedSubCategoryLevel2: subCategoryLevel2SelectedOption,
            form: _.set(
                { ...this.state.form },
                name, subCategoryLevel2SelectedOption
            )
        });
    }

    handleChangeColor = (selectedColor, name) => {
        this.setState({
            tempSelectedColor: selectedColor,
            form: _.set(
                { ...this.state.form },
                name, selectedColor
            )
        })

        selectedColor.forEach((color, colorIndex) => {
            let colorElementName = "productInfo['productVariations'][" + colorIndex + "][color]";
            this.setState({
                form: _.set(
                    { ...this.state.form },
                    colorElementName, color.value
                )
            });
        });
    }

    handleChangeSize = (selectedSize, name) => {
        this.setState({
            tempSelectedSize: selectedSize,
            form: _.set(
                { ...this.state.form },
                name, selectedSize
            )
        })
    }

    setFeaturedImage = (id) => {
        this.setState({ form: _.set({ ...this.state.form }, 'featuredImageId', id) });
    };

    handleFileChange = (event) => {
        if (!event) return;
        event.preventDefault();
        //let frmID = event.target.id;
        // const params = this.props.match.params;
        // const { productId } = params;
        // const { productId } = this.props;
        let validExtensions = ['jpg', 'png', 'jpeg', 'gif', 'bmp']; //array of vali

        let file = event.target.files[0];
        if (typeof file === 'undefined') return;
        let fileName = file.name.toLowerCase();
        var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
        let targetName = event.target.name;
        if (validExtensions.indexOf(fileNameExt) === -1) {

            alert("Only these file types are accepted : " + validExtensions.join(', '));
        }
        else {
            ApiService.getInstance().uploadFile(file, (progress) => {}).then(url => {
                this.setState({
                    form: _.set(
                        { ...this.state.form },
                        targetName,
                        url
                    )
                }, () => {
                });
            });
        }
    }

    handleProductData = (event) => {
        event.preventDefault();

        this.props.saveProduct(this.state.form.productInfo, { storeID: this.props.storeID, productID: this.props.productId });
        // window.location.reload();
        // setTimeout(window.location.reload(), 2000)
    };

    addColor = () => {
        this.setState({
            addColor: !this.state.addColor
        })
        // <colorPicker storeID={this.props.storeID} productID={this.state.productId} />
    }

    changeHandler = (colors) => {
    }

    // submitText=(event)=>{
    //     // if (this.state.newColor !== color){
    //     //     this.setState({
    //     //         newColor: color
    //     //     })
    //     // }
    //     let name = {}

    // }

    colorInput = (event) => {
        this.setState({
            newColor: event.target.value
        })
    }

    submitNewColor = (index) => {
        const name = "productInfo['productColorOptions'][" + index + "]['label']";
        this.setState({
            form: _.set(
                { ...this.state.form },
                name, this.state.newColor
            )
        });
    }


    render() {
        const { classes, productId } = this.props;
        const { form } = this.state;
        const {
            tempSelectedSubCategoryLevel1,
            tempSelectedColor,
            tempSelectedSize,
            tempSelectedType,
            subCategoryLevel1Options,
            subCategoryLevel2Options,
            fieldList
        } = this.state;

        let isSelectedColorAndSize = false;

        let additionalInfo = {};
        let selectedProductFAQOption = {};
        let selectedProductFAQProps = {};

        let productImage;
        let closeupImage1;
        let closeupImage2;
        let closeupImage3;
        let productBrandName;
        let productName;
        let productDescription;
        let productHashtag;
        // let productWeight;
        // let productDeliveryCharge;
        let productTypeOption = {};
        let subCategoryLevel1SelectedOption = {};
        let subCategoryLevel2SelectedOption = {};
        let productColorOptions = [];
        let productSizeOptions = [];
        let productFAQDetails = {};
        let productFAQDetailsOption = {};
        let productVariations = [];

        if (tempSelectedColor.some(c => c.hasOwnProperty('value')) &&
            tempSelectedSize.some(s => s.hasOwnProperty('value'))) {
            isSelectedColorAndSize = true;
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

            if (form.productInfo.hasOwnProperty('productBrandName')) {
                productBrandName = form.productInfo.productBrandName;
            }

            if (form.productInfo.hasOwnProperty('productName')) {
                productName = form.productInfo.productName;
            }

            if (form.productInfo.hasOwnProperty('productDescription')) {
                productDescription = form.productInfo.productDescription;
            }

            if (form.productInfo.hasOwnProperty('productHashtag')) {
                productHashtag = form.productInfo.productHashtag;
            }

            // if (form.productInfo.hasOwnProperty('productWeight')) {
            //     productWeight = form.productInfo.productWeight;
            // }

            // if (form.productInfo.hasOwnProperty('productDeliveryCharge')) {
            //     productDeliveryCharge = form.productInfo.productDeliveryCharge;
            // }

            if (form.productInfo.hasOwnProperty('productTypeOption')) {
                productTypeOption = form.productInfo.productTypeOption;
            }

            if (form.productInfo.hasOwnProperty('subCategoryLevel1SelectedOption')) {
                subCategoryLevel1SelectedOption = form.productInfo.subCategoryLevel1SelectedOption;
            }

            if (form.productInfo.hasOwnProperty('subCategoryLevel2SelectedOption')) {
                subCategoryLevel2SelectedOption = form.productInfo.subCategoryLevel2SelectedOption;
            }

            if (form.productInfo.hasOwnProperty('productColorOptions')) {
                productColorOptions = form.productInfo.productColorOptions;
            }

            if (form.productInfo.hasOwnProperty('productSizeOptions')) {
                productSizeOptions = form.productInfo.productSizeOptions;
            }

            if (form.productInfo.hasOwnProperty('productFAQDetails')) {
                productFAQDetails = form.productInfo.productFAQDetails;
            }

            if (form.productInfo.hasOwnProperty('productFAQDetailsOption')) {
                productFAQDetailsOption = form.productInfo.productFAQDetailsOption;
            }

            if (form.productInfo.hasOwnProperty('productVariations')) {
                productVariations = form.productInfo.productVariations;
            }

        }

        return (
            form && (

                <form onSubmit={this.handleProductData}>
                    <div className="p-16 sm:p-8">
                        {(
                            <div>
                                <Typography variant="h6" gutterBottom>
                                    <Trans i18nKey="product.product.form-images-title">
                                        Images
                                </Trans>
                                </Typography>
                                <div className="mb-16">
                                    <Grid container spacing={0} className="items-center">
                                        <Grid item xs={4}>
                                            <Typography className={classes.mainProductImageTitle}>
                                                <Trans i18nKey="product.product-form-main-image-title">
                                                    Main Image
                                            </Trans>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography className={classes.closeupProductImageTitle}>
                                                <Trans i18nKey="product.product-form-closeup-image-title">
                                                    Closeup Image
                                            </Trans>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4}></Grid>
                                    </Grid>
                                    <Grid container spacing={24} className="items-center">
                                        <Grid item xs={4}>
                                            <label htmlFor="main-image-file">
                                                {productImage ? (
                                                    <img className="border border-solid rounded cursor-pointer" src={productImage} alt="Main" component="span" />
                                                ) : (
                                                        <Button variant="outlined" className={classes.mainAddProductImage} component="span">
                                                            <span>
                                                                <Trans i18nKey="product.product-form-upload-button-title">
                                                                    Upload
                                                    </Trans>
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
                                                    onChange={this.handleFileChange}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={4} className="flex justify-between">
                                            <label htmlFor="closeup-image-file-1" className="w-1/3 p-4">
                                                {closeupImage1 ? (
                                                    <img className="border border-solid rounded cursor-pointer" src={closeupImage1} alt="Closeup 1" component="span" />
                                                ) : (
                                                        <Button variant="outlined" className={classes.mainAddProductImage} component="span">
                                                            <span>
                                                                <Typography className={classes.uploadMainProductImageText}>
                                                                    <Trans i18nKey="product.product-form-upload-button-title">
                                                                        Upload
                                                        </Trans>
                                                                </Typography>
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
                                                    onChange={this.handleFileChange}
                                                />
                                            </div>
                                            <label htmlFor="closeup-image-file-2" className="w-1/3 p-4">
                                                {closeupImage2 ? (
                                                    <img className="border border-solid rounded cursor-pointer" src={closeupImage2} alt="Closeup 2" component="span" />
                                                ) : (
                                                        <Button variant="outlined" className={classes.mainAddProductImage} component="span">
                                                            <span>
                                                                <Typography className={classes.uploadMainProductImageText}>
                                                                    <Trans i18nKey="product.product-form-upload-button-title">
                                                                        Upload
                                                        </Trans>
                                                                </Typography>
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
                                                    onChange={this.handleFileChange}
                                                />
                                            </div>
                                            <label htmlFor="closeup-image-file-3" className="w-1/3 p-4">
                                                {closeupImage3 ? (
                                                    <img className="border border-solid rounded cursor-pointer" src={closeupImage3} alt="Closeup 3" component="span" />
                                                ) : (
                                                        <Button variant="outlined" className={classes.mainAddProductImage} component="span">
                                                            <span>
                                                                <Typography className={classes.uploadMainProductImageText}>
                                                                    <Trans i18nKey="product.product-form-upload-button-title">
                                                                        Upload
                                                        </Trans>
                                                                </Typography>
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
                                                    onChange={this.handleFileChange}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <img src="assets/images/etc/sample-product-image.png" alt="" />
                                        </Grid>

                                    </Grid>
                                    {/*<div className="w-1/3 bg-black">
                                    <label htmlFor="main-image-file">
                                    { productImage ? (
                                        <img className="border border-solid rounded cursor-pointer" src={productImage} alt="Main" component="span"/>
                                    ) : (
                                        <Button variant="outlined" className={classes.mainAddProductImage} component="span">
                                            <span>
                                                <Typography className={classes.uploadMainProductImageText}>Upload</Typography>
                                            </span>
                                        </Button>
                                    ) }
                                    </label>
                                    <div>
                                        <input
                                            accept="image/*"
                                            className="hidden"
                                            id="main-image-file"
                                            type="file"
                                            name="productInfo['productImage']"
                                            onChange={this.handleFileChange}
                                        />
                                    </div>
                                </div>*/}
                                </div>
                                <Divider className="mb-16" />
                                <Typography variant="h6" gutterBottom>
                                    <Trans i18nKey="product.product-form-product-info-title">
                                        Product info
                                </Trans>
                                </Typography>
                                <Grid container spacing={24}>
                                    <Grid item xs={4}>
                                        <TextField
                                            className="mt-8 mb-16"
                                            required
                                            label={
                                                <Trans i18nKey="product.product-form-input-brand-name">
                                                    Brand Name
                                            </Trans>
                                            }
                                            id="productBrandName"
                                            name="productInfo['productBrandName']"
                                            value={productBrandName}
                                            onChange={this.handleChange}
                                            variant="outlined"
                                            fullWidth
                                        />

                                        <TextField
                                            className="mt-8 mb-16"
                                            required
                                            label={
                                                <Trans i18nKey="product.product-form-input-product-name">
                                                    Product Name
                                            </Trans>
                                            }
                                            id="productName"
                                            name="productInfo['productName']"
                                            value={productName}
                                            onChange={this.handleChange}
                                            variant="outlined"
                                            fullWidth
                                        />

                                        <TextField
                                            className="mt-8 mb-16"
                                            id="productDescription"
                                            name="productInfo['productDescription']"
                                            onChange={this.handleChange}
                                            label={
                                                <Trans i18nKey="product.product-form-input-product-description">
                                                    Description
                                            </Trans>
                                            }
                                            type="text"
                                            value={productDescription}
                                            multiline
                                            rows={9}
                                            fullWidth
                                            variant="outlined"
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <TextField

                                            required
                                            className="mt-8 mb-16"
                                            id="productHashtag"
                                            name="productInfo['productHashtag']"
                                            onChange={this.handleChangeHashtag}
                                            label={
                                                <Trans i18nKey="product.product-form-input-product-hashtag">
                                                    Hashtag
                                            </Trans>
                                            }
                                            type="text"
                                            value={productHashtag}
                                            variant="outlined"
                                            fullWidth
                                            inputProps={{
                                                startAdornment: <InputAdornment position="start">#</InputAdornment>,
                                                maxLength: 15
                                            }}
                                        />

                                        {/*<TextField
                                        className="mt-8 mb-16"
                                        id="productWeight"
                                        name="productInfo['productWeight']"
                                        onChange={this.handleChange}
                                        label="Weight"
                                        type="text"
                                        value={productWeight}
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">g</InputAdornment>,
                                        }}
                                    />*/}

                                        <FuseChipSelect
                                            isSearchable={false}
                                            required
                                            className="w-full mt-8 mb-16"
                                            onChange={(value) => this.handleChangeType(value, "productInfo['productTypeOption']")}
                                            placeholder={
                                                <Trans i18nKey="product.product-form-input-product-type-placeholder">
                                                    Choose product type
                                            </Trans>
                                            }
                                            textFieldProps={{
                                                label: 'Product type',
                                                InputLabelProps: {
                                                    shrink: true
                                                },
                                                variant: 'outlined'
                                            }}
                                            value={productTypeOption}
                                            options={typeOption}
                                        />

                                        {tempSelectedType.hasOwnProperty('value') ?
                                            <FuseChipSelect
                                                isSearchable={false}
                                                className="w-full mt-8 mb-16"
                                                onChange={
                                                    (value) => this.handleChangeSubCategoryLevel1(value, "productInfo['subCategoryLevel1SelectedOption']")
                                                }
                                                textFieldProps={{
                                                    InputLabelProps: {
                                                        shrink: true
                                                    },
                                                    variant: 'outlined'
                                                }}
                                                value={subCategoryLevel1SelectedOption}
                                                options={subCategoryLevel1Options}
                                                required
                                            /> : null
                                        }

                                        {tempSelectedSubCategoryLevel1 !== undefined && tempSelectedSubCategoryLevel1.hasOwnProperty('value') ?
                                            (
                                                tempSelectedSubCategoryLevel1.value !== "men_longjohn" && tempSelectedSubCategoryLevel1.value !== "men_handglove" ?
                                                    <FuseChipSelect
                                                        isSearchable={false}
                                                        className="w-full mt-8 mb-16"
                                                        onChange={
                                                            (value) => this.handleChangeSubCategoryLevel2(value, "productInfo['subCategoryLevel2SelectedOption']")
                                                        }
                                                        textFieldProps={{
                                                            InputLabelProps: {
                                                                shrink: true
                                                            },
                                                            variant: 'outlined'
                                                        }}
                                                        value={subCategoryLevel2SelectedOption}
                                                        options={subCategoryLevel2Options}
                                                    /> : null
                                            ) : null
                                        }
                                    </Grid>
                                    <Grid item xs={4}>
                                        {/* <Grid container spacing={16}>
                                <Grid item xs={10}>
                                    <FuseChipSelect
                                        isSearchable={false}

                                        className="w-full mt-8 mb-16"
                                        onChange={(value) => this.handleChangeColor(value, "productInfo['productColorOptions']")}
                                        placeholder={
                                            <Trans i18nKey="product.product-form-input-product-color-placeholder">
                                                Choose color
                                            </Trans>
                                        }
                                        textFieldProps={{
                                            label: 'Color',
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
       
                                        </Grid>
                                        <Grid item xs={2}>
                                                <Button style={{minHeight: '55px', maxHeight: '55px' }} variant="outlined" color="primary" onClick={this.addColor} className='w-full mt-8 mb-16'>
                                                อื่นๆ
                                                </Button>
                                            <Dialog
                                                fullWidth
                                                maxWidth="sm"
                                                open={this.state.addColor}
                                                onClose={this.addColor}
                                                aria-labelledby="alert-dialog-title"
                                                aria-describedby="alert-dialog-description"
                                            >
                                                <DialogTitle id="alert-dialog-title">{"Choose a color"}</DialogTitle>
                                                <DialogContent>
              
                                                    <ColorChooser storeID={this.props.storeID} productID={this.props.productId} />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={this.addColor} color="primary">
                                                        Finish
                                                        </Button>
                                                </DialogActions>
                                            </Dialog>
                                            
                                        </Grid>
                                        </Grid> */}

                                        <FuseChipSelect
                                            isSearchable={false}

                                            className="w-full mt-8 mb-16"
                                            onChange={(value) => this.handleChangeColor(value, "productInfo['productColorOptions']")}
                                            placeholder="Choose color"
                                            textFieldProps={{
                                                label: 'Color',
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

                                        <FuseChipSelect
                                            isSearchable={false}

                                            className="w-full mt-8 mb-16"
                                            onChange={(value) => this.handleChangeSize(value, "productInfo['productSizeOptions']")}
                                            placeholder={
                                                <Trans i18nKey="product.product-form-input-product-size-placeholder">
                                                    Choose size
                                            </Trans>
                                            }
                                            textFieldProps={{
                                                label: 'Size',
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

                                        <TextField
                                            type="number"
                                            className="mt-8 mb-16"
                                            label={
                                                <Trans i18nKey="product.product-form-input-product-delivery-charge">
                                                    Delivery Charge
                                            </Trans>
                                            }
                                            id="productDeliveryCharge"
                                            name="productInfo['productDeliveryCharge']"
                                            // value={productDeliveryCharge}
                                            onChange={this.handleChange}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </Grid>

                                </Grid>

                                {tempSelectedSubCategoryLevel1 !== undefined && tempSelectedSubCategoryLevel1.hasOwnProperty('value') ?
                                    <div>
                                        <Divider />
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            className="mt-12"
                                        >
                                            <Trans i18nKey="product.product-form-product-faq-title">
                                                Product FAQ
                                        </Trans>
                                        </Typography>
                                        <Grid container spacing={24}>
                                            {fieldList.length > 0 ?
                                                (
                                                    fieldList.map((fieldItem, fieldItemKey) => {
                                                        if (productFAQDetails.hasOwnProperty(fieldItem.attributeName)) {
                                                            additionalInfo = {
                                                                value: productFAQDetails[fieldItem.attributeName]['additionalInfo']
                                                            }
                                                        } else {
                                                            additionalInfo = {};
                                                        }

                                                        if (productFAQDetailsOption.hasOwnProperty(fieldItem.attributeName)) {
                                                            selectedProductFAQOption = productFAQDetailsOption[fieldItem.attributeName];
                                                            selectedProductFAQProps = {
                                                                value: selectedProductFAQOption
                                                            };
                                                        } else {
                                                            selectedProductFAQOption = {};
                                                            selectedProductFAQProps = {};
                                                        }

                                                        if (fieldItem.showOnFAQ === true) {
                                                            return (
                                                                <Grid item xs={4} key={`${fieldItem.attributeLabel}_${fieldItemKey}`}>
                                                                    {fieldItem.attributeType === "select" ?
                                                                        <div>
                                                                            <FuseChipSelect
                                                                                className="w-full mt-8 mb-16"
                                                                                onChange={(item) => this.handleChangeFAQOption(item, "productInfo['productFAQDetails'][" + fieldItem.attributeName + "][selectedValue]", fieldItem.attributeName)}
                                                                                placeholder={
                                                                                    <Trans i18nKey="product.product-form-input-product-faq-select-placeholder">
                                                                                        Select
                                                                                </Trans>
                                                                                }
                                                                                textFieldProps={{
                                                                                    label: fieldItem.attributeLabel,
                                                                                    InputLabelProps: {
                                                                                        shrink: true
                                                                                    },
                                                                                    variant: 'outlined'
                                                                                }}
                                                                                {...selectedProductFAQProps}
                                                                                options={fieldItem.attributeValue}
                                                                            />
                                                                            <TextField
                                                                                className="mt-8 mb-16"
                                                                                name={"productInfo['productFAQDetails'][" + fieldItem.attributeName + "][additionalInfo]"}
                                                                                onChange={this.handleChange}
                                                                                label={
                                                                                    <Trans i18nKey="product.product-form-input-product-faq-additional-detail-placeholder">
                                                                                        Additional details
                                                                                </Trans>
                                                                                }
                                                                                type="text"
                                                                                multiline
                                                                                rows={5}
                                                                                variant="outlined"
                                                                                fullWidth
                                                                                {...additionalInfo}
                                                                            />
                                                                        </div>
                                                                        : null
                                                                    }
                                                                </Grid>
                                                            )
                                                        } else {
                                                            return null;
                                                        }
                                                    })
                                                )
                                                : null}
                                        </Grid>
                                    </div>
                                    : null}

                                {isSelectedColorAndSize === true ?
                                    <div>
                                        <Divider />
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            className="my-12"
                                        >
                                            <Trans i18nKey="product.product-form-product-variations-title">
                                                Product variations
                                        </Trans>
                                        </Typography>

                                        {tempSelectedColor.map((color, colorIndex) => {

                                            return (
                                                <Grid container spacing={24} key={colorIndex} className={((colorIndex % 2 === 0) ? "" : "bg-grey-lightest") + " mb-24"}>
                                                    <Grid item xs={12} key={colorIndex}>
                                                        <Grid container
                                                            spacing={24}
                                                            key={color.label}
                                                            alignItems="center"
                                                        >
                                                            <Grid item xs={1} key={'productColor' + colorIndex}>
                                                                <Typography
                                                                    variant="subtitle1"
                                                                    gutterBottom
                                                                // style={{ marginTop: '15%' }}
                                                                // align="center"
                                                                >
                                                                    {color.label}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={3} key="image">
                                                                <label htmlFor={"file-color-" + colorIndex}>
                                                                    {form.productInfo.productVariations.hasOwnProperty(colorIndex) && form.productInfo['productVariations'][colorIndex]['image'] ? (
                                                                        <img className="border border-solid rounded cursor-pointer" src={form.productInfo['productVariations'][colorIndex]['image']} alt={color.label} component="span" />
                                                                    ) : (
                                                                            <Button variant="outlined" component="span">
                                                                                <span>
                                                                                    <Typography>
                                                                                        <Trans i18nKey="product.product-form-upload-button-title">
                                                                                            Upload
                                                                            </Trans>
                                                                                    </Typography>
                                                                                </span>
                                                                            </Button>

                                                                        )}
                                                                </label>

                                                                <div className="mt-8">
                                                                    <Grid container spacing={8}>
                                                                        <Grid item xs={8} key='custom-field'>
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
                                                                                        lineHeight: 0
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item xs={4} key='custom-button'>
                                                                            <Button
                                                                                variant='outlined'
                                                                                name={"productInfo['productColorOptions'][" + colorIndex + "]['label']"}
                                                                                onClick={this.submitNewColor.bind(this, colorIndex)}
                                                                                size="small"
                                                                            >
                                                                                <Typography>
                                                                                    <Trans i18nKey="main.save-btn">
                                                                                        Save
                                                                                </Trans>
                                                                                </Typography>
                                                                            </Button>
                                                                        </Grid>
                                                                    </Grid>
                                                                </div>


                                                                <div>
                                                                    <input
                                                                        accept="image/*"
                                                                        className="hidden"
                                                                        id={"file-color-" + colorIndex}
                                                                        type="file"
                                                                        name={"productInfo['productVariations'][" + colorIndex + "]['image']"}
                                                                        onChange={this.handleFileChange}
                                                                    />
                                                                </div>
                                                            </Grid>
                                                        </Grid>
                                                        {tempSelectedSize.map((size) => {
                                                            const checkPropertiesConditions = (productVariationsObj) => {
                                                                return productVariationsObj.hasOwnProperty(colorIndex) &&
                                                                    productVariationsObj[colorIndex].hasOwnProperty('size') &&
                                                                    productVariationsObj[colorIndex]['size'].hasOwnProperty(size.value) &&
                                                                    productVariationsObj[colorIndex]['size'][size.value].hasOwnProperty('value')
                                                            }

                                                            let priceProps = {};
                                                            let stockProps = {};
                                                            let skuProps = {};
                                                            let isNAProps = {};

                                                            if (checkPropertiesConditions(productVariations) && productId !== "new") {
                                                                priceProps['value'] = productVariations[colorIndex]['size'][size.value]['value']['price'] ? Number(productVariations[colorIndex]['size'][size.value]['value']['price']) : '';
                                                                priceProps['readOnly'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];
                                                                priceProps['disabled'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];

                                                                stockProps['value'] = productVariations[colorIndex]['size'][size.value]['value']['stock'] ? Number(productVariations[colorIndex]['size'][size.value]['value']['stock']) : '';
                                                                stockProps['readOnly'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];
                                                                stockProps['disabled'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];

                                                                skuProps['value'] = productVariations[colorIndex]['size'][size.value]['value']['sku'];
                                                                skuProps['readOnly'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];
                                                                skuProps['disabled'] = productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'];

                                                                isNAProps['checked'] = (productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] === true ? true : false)
                                                            } else {
                                                                priceProps['readOnly'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);
                                                                priceProps['disabled'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);

                                                                stockProps['readOnly'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);
                                                                stockProps['disabled'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);

                                                                skuProps['readOnly'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);
                                                                skuProps['disabled'] = (checkPropertiesConditions(productVariations) ? productVariations[colorIndex]['size'][size.value]['value']['isNotAvailable'] : false);
                                                            }

                                                            return (
                                                                <Grid container spacing={24} key={size.label} className="items-center">
                                                                    <Grid item xs={1} key={size.label}>
                                                                        <Typography
                                                                            variant="subtitle1"
                                                                            gutterBottom
                                                                            style={{ marginTop: '15%' }}
                                                                            align="center"
                                                                        >
                                                                            {size.label}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={3} key="Price">
                                                                        <TextField
                                                                            required
                                                                            type="number"
                                                                            label={
                                                                                <Trans i18nKey="product.product-form-input-product-variations-price">
                                                                                    Price
                                                                            </Trans>
                                                                            }
                                                                            name={"productInfo['productVariations'][" + colorIndex + "][size][" + size.value + "][value][price]"}
                                                                            onChange={this.handleChange}
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            {...priceProps}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={3} key="Stock">
                                                                        <TextField
                                                                            required
                                                                            label={
                                                                                <Trans i18nKey="product.product-form-input-product-variations-stock">
                                                                                    Stock
                                                                            </Trans>
                                                                            }
                                                                            type="number"
                                                                            name={"productInfo['productVariations'][" + colorIndex + "][size][" + size.value + "][value][stock]"}
                                                                            onChange={this.handleChange}
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            {...stockProps}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={3} key="SKU">
                                                                        <TextField
                                                                            // label="Size description"
                                                                            label={
                                                                                <Trans i18nKey="product.product-form-input-product-variations-size-description">
                                                                                    Size description
                                                                            </Trans>
                                                                            }
                                                                            name={"productInfo['productVariations'][" + colorIndex + "][size][" + size.value + "][value][sku]"}
                                                                            onChange={this.handleChange}
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            {...skuProps}
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={1} key="checkbox">
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Checkbox
                                                                                    name={"productInfo['productVariations'][" + colorIndex + "][size][" + size.value + "][value][isNotAvailable]"}
                                                                                    onChange={this.handleChange}
                                                                                    color="primary"
                                                                                    {...isNAProps}
                                                                                />
                                                                            }
                                                                            // label="N/A"
                                                                            label={
                                                                                <Trans i18nKey="product.product-form-input-product-variations-na">
                                                                                    N/A
                                                                            </Trans>
                                                                            }
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            )
                                                        })}
                                                    </Grid>
                                                </Grid>
                                            )
                                        })}
                                    </div>
                                    : null
                                }
                            </div>
                        )}

                        <div className="flex-1 text-center mt-16">
                            <Button
                                variant="outlined"
                                className={classes.button}
                                type="submit"
                            // onClick = {this.handleChangeClick}
                            >
                                <Trans i18nKey="product.product-form-save-button-title">
                                    Save Product
                            </Trans>
                            </Button>
                            <Button className="ml-16" onClick={this.props.onCancelBtnClick}>
                                <Trans i18nKey="product.product-form-cancel-button-title">
                                    Cancel
                            </Trans>
                            </Button>
                        </div>

                    </div>
                </form>

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

export default withReducer('eCommerceApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ProductForm)))));
