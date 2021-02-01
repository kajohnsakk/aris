import React, { Component } from "react";
import { registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import Cookies from "js-cookie";
import { UtilityManager } from "../../modules/UtilityManager";
import { Trans, withTranslation } from "react-i18next";
import "rc-color-picker/assets/index.css";
import ProductDetails from "./ProductDetails";
import ProductVariation from "./ProductVariation";
import PropTypes from "prop-types";
import { ApiService } from "../../modules/ApiService";
import withReducer from "app/store/withReducer";
import * as Actions from "../store/actions";
import reducer from "../store/reducers";
// import Compress from 'compress.js';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import connect from "react-redux/es/connect/connect";
import { withStyles, Tab, Tabs, Button } from "@material-ui/core";
import { FusePageSimple } from "@fuse";
import _ from "@lodash";
import classNames from "classnames";
const Compress = require("compress.js");
// import { thisExpression } from '@babel/types';

registerPlugin(FilePondPluginImagePreview);

const styles = (theme) => ({
  layoutRoot: {},
  card: {
    maxWidth: "100%",
    border: "solid 1px #ededed",
    paddingBottom: 5,
  },
  header: {
    background: "#ffffff",
    borderBottom: "solid 2px #ededed",
    color: "#8d9095",
    fontWeight: "bolder",
  },
  content: {
    background: "#ffffff",
    paddingTop: 5,
    paddingBottom: 5,
  },
  fabButton: {
    margin: theme.spacing.unit,
    textTransform: "none",
    border: "solid 1px #b7bbbe",
    background: "#fefefe",
    color: "#686868",
    fontWeight: "bolder",
    boxShadow: "none",
    paddingLeft: theme.spacing.unit * 5,
    paddingRight: theme.spacing.unit * 5,
    borderRadius: "17px",
  },
  highlightButton: {
    background: theme.palette.primary.color,
    color: "#ffffff",
    "&:disabled": {
      background: "#dddddd",
      color: "#AAAAAA",
    },
  },
});

class ProductStepper extends Component {
  state = {
    tabValue: 0,
    form: null,
    // tempSelectedType: {},
    // tempSelectedSubCategoryLevel1: {},
    // tempSelectedSubCategoryLevel2: {},
    tempSelectedColor: [],
    tempSelectedSize: [],
    // tempProductFAQDetails: [],
    // tempProductFAQDetailsOption: {},
    // subCategoryLevel1Options: [],
    // subCategoryLevel2Options: [],
    // fieldList: [],
    storeID: "",
    auth0_uid: "",
    email: "",
    // addColor: false,
    // isUpdate: false,
    processProductData: false,
    // newColor: '',
    // detailInfo: true,
    isInit: false,
    individualProductType: "",
    uploadingImage: 0,
  };

  componentDidMount() {
    if (this.props.storeID) {
      this.setState(
        {
          storeID: this.props.storeID,
        },
        () => this.updateProductState()
      );
    } else {
      // let cookieValue = Cookies.get('email');
      let cookieValue = Cookies.get("auth0_uid");

      UtilityManager.getInstance()
        .storeInfoLookup(cookieValue)
        .then((resultStoreInfo) => {
          this.setState(
            {
              auth0_uid: resultStoreInfo[0].auth0_uid,
              email: resultStoreInfo[0].email,
              storeID: resultStoreInfo[0].storeID,
            },
            () => this.updateProductState()
          );
        });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.isInit) {
      if (!_.isEqual(this.props.product.data, this.state.form)) {
        this.initProductFormState();
      }
    }

    if (
      this.state.form &&
      !_.isEqual(
        this.state.form.productInfo.productColorOptions,
        this.state.tempSelectedColor
      )
    ) {
      let form = this.state.form;
      let savedProductVariations = [];
      form.productInfo.productColorOptions.forEach((color, colorIndex) => {
        form.productInfo.productVariations.forEach(
          (variations, variationsIndex) => {
            if (variations.color === color.value) {
              savedProductVariations.push(
                form.productInfo.productVariations[variationsIndex]
              );
            }
          }
        );
      });
      form.productInfo.productVariations = savedProductVariations;
      this.setState({
        form: { ...form },
        tempSelectedColor: this.state.form.productInfo.productColorOptions,
      });
    }

    if (
      this.state.form &&
      !_.isEqual(
        this.state.form.productInfo.productSizeOptions,
        this.state.tempSelectedSize
      )
    ) {
      let form = this.state.form;
      if (form.productInfo.productVariations.length > 0) {
        // Remove 'size' value object from color object in product variation.
        form.productInfo.productColorOptions.forEach((colorItem, index) => {
          let savedSizeData = {};
          this.state.form.productInfo.productSizeOptions.forEach(
            (size, sizeIndex) => {
              if (
                form.productInfo.productVariations.length > 0 &&
                form.productInfo.productVariations[index].hasOwnProperty("size")
              ) {
                if (
                  form.productInfo.productVariations[index][
                    "size"
                  ].hasOwnProperty(size.value)
                ) {
                  savedSizeData[size.value] =
                    form.productInfo.productVariations[index]["size"][
                      size.value
                    ];
                }
              }
            }
          );
          form.productInfo.productVariations[index]["size"] = savedSizeData;
        });
      }

      this.setState({
        form: { ...form },
        tempSelectedSize: this.state.form.productInfo.productSizeOptions,
      });
    }

    if (this.props.product.data !== null && this.state.form !== null) {
      if (this.props.reference === "prompt" && this.state.processProductData) {
        if (
          this.props.productId === "new" &&
          this.props.product.data.productID
        ) {
          this.props.pushTrackingData(
            "Create",
            "Create Product in LIVE: " +
              this.props.product.data.productInfo.productName
          );
          this.props.onDoneProcessData(
            this.props.product.data.productID,
            this.props.product.data
          );

          // this.setState({ isUpdate: true });
          this.setState({ processProductData: false });
        } else if (
          this.props.productId !== "new" &&
          this.props.product.data.productID === "OK" &&
          !_.isEqual(this.props.product.data, prevProps.product.data)
        ) {
          this.props.pushTrackingData(
            "Update",
            "Update Product in LIVE: " +
              this.props.product.data.productInfo.productName
          );
          this.props.onDoneProcessData(
            this.props.productId,
            this.props.product.data
          );

          // this.setState({ isUpdate: true });
          this.setState({ processProductData: false });
        }
      } else if (
        this.props.reference === "page" &&
        this.state.processProductData
      ) {
        if (
          this.props.productId === "new" &&
          this.props.product.data.productID
        ) {
          this.props.pushTrackingData(
            "Create",
            "Create Product: " + this.props.product.data.productInfo.productName
          );
        } else if (
          this.props.productId !== "new" &&
          this.props.product.data.productID === "OK" &&
          !_.isEqual(this.props.product.data, prevProps.product.data)
        ) {
          this.props.pushTrackingData(
            "Update",
            "Update Product: " + this.props.product.data.productInfo.productName
          );
        }
        window.location = "/platform/products";
      }
    }
  }

  componentWillUnmount = () => {
    this.props.clearProductData();
  };

  updateProductState = () => {
    const { productId } = this.props;
    const { storeID } = this.state;

    if (productId === "new") {
      this.props.newProduct(storeID);
    } else {
      this.props.getProduct({
        storeID: storeID,
        productID: productId,
      });
    }
    // this.setState({ isUpdate: false });
    this.setState({ isInit: true });
  };

  initProductFormState = () => {
    let form = this.props.product.data;
    let individualProductType = "SINGLE";
    if (form && form.hasOwnProperty("productInfo")) {
      if (
        form.productInfo &&
        form.productInfo.hasOwnProperty("individualProductType")
      ) {
        if (form.productInfo.individualProductType) {
          individualProductType = form.productInfo.individualProductType;
        }
      }
    }

    this.setState(
      {
        form: form,
        isInit: false,
        individualProductType: individualProductType,
      },
      () => {
        this.setFormValue();
      }
    );
  };

  handleProductType = (event, name) => {
    var form = this.state.form;

    if (form) {
      form.productInfo.productColorOptions = [];
      form.productInfo.productVariations = [];
      form.productInfo.productUniversalInfo.price = 0;
      form.productInfo.productUniversalInfo.stock = 0;
      if (event.value === "COLOR_ONLY") {
        form.productInfo.productSizeOptions = [
          { label: "__COLOR_ONLY__", value: "__COLOR_ONLY__" },
        ];
      } else {
        form.productInfo.productSizeOptions = [];
      }
    }

    this.setState({
      individualProductType: event.value,
      form: _.set({ ...form }, name, event.value),
    });
  };

  setFormValue = () => {
    const { productId } = this.props;
    const { form } = this.state;

    if (productId !== "new" && form !== null) {
      this.handleChangeColor(
        form.productInfo.productColorOptions,
        "productInfo['productColorOptions']"
      );
      this.handleChangeSize(
        form.productInfo.productSizeOptions,
        "productInfo['productSizeOptions']"
      );
    }
  };

  handleSubmitProductForm = (event, tabDataList) => {
    event.preventDefault();

    if (this.state.tabValue < tabDataList.length - 1) {
      this.handleNextStepperBtnClick();
    } else {
      // Save Data
      this.props.pushTrackingData("Click", "Save Product button");
      this.props.pushTrackingData("Click", "17. Save Product");

      this.props.saveProduct(this.state.form.productInfo, {
        storeID: this.props.storeID,
        productID: this.props.productId,
      });
      this.setState({ processProductData: true });
    }
  };

  handleBackStepperBtnClick = () => {
    this.setState({ tabValue: this.state.tabValue - 1 });
  };

  handleNextStepperBtnClick = () => {
    this.setState({ tabValue: this.state.tabValue + 1 });
  };

  handleChangeTab = (event, newIndex) => {
    this.setState({ tabValue: newIndex });
  };

  handleChange = (event) => {
    // if (event.name === '')
    this.setState({
      form: _.set(
        { ...this.state.form },
        event.target.name,
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
      ),
    });
  };

  handleChangeColor = (selectedColor, name) => {
    if (this.state.form) {
      var tempSelectedColor = this.state.form.productInfo.productColorOptions;
    }

    var tempColors = [];
    var productVariations = this.state.form.productInfo.productVariations;

    // push all colors to tempColors
    selectedColor.forEach((color, colorIndex) => {
      tempColors.push({
        color: color.value,
      });
    });

    //compare tempColors with productVariations
    productVariations.forEach((proColor) => {
      tempColors.forEach((tempColor, index) => {
        if (proColor.color === tempColor.color) {
          if (!tempColor.hasOwnProperty("size")) {
            tempColors.splice(index, 1);
            tempColors.push(proColor);
          }
        }
      });
    });

    let colorElementName = "productInfo['productVariations']";
    this.setState({
      form: _.set({ ...this.state.form }, colorElementName, tempColors),
    });

    this.setState({
      tempSelectedColor: tempSelectedColor,
      form: _.set({ ...this.state.form }, name, selectedColor),
    });
  };

  handleChangeSize = (selectedSize, name) => {
    if (this.state.form) {
      var tempSelectedSize = this.state.form.productInfo.productSizeOptions;
    }

    this.setState({
      tempSelectedSize: tempSelectedSize,
      form: _.set({ ...this.state.form }, name, selectedSize),
    });
  };

  blobToFile = (theBlob, fileName) => {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  };

  handleFileChange = (event) => {
    const compress = new Compress();

    if (!event) return;
    event.preventDefault();

    let validExtensions = ["jpg", "png", "jpeg", "gif", "bmp", "jfif"];
    let file = event.target.files[0];
    if (typeof file === "undefined") return;
    let fileName = file.name.toLowerCase();
    var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
    let targetName = event.target.name;
    if (validExtensions.indexOf(fileNameExt) === -1) {
      alert(
        "Only these file types are accepted : " + validExtensions.join(", ")
      );
    } else {
      const files = [...event.target.files];
      compress
        .compress(files, {
          size: 4, // the max size in MB, defaults to 2MB
          quality: 1, // the quality of the image, max is 1,
          maxWidth: 780, // the max width of the output image, defaults to 1920px
          maxHeight: 780, // the max height of the output image, defaults to 1920px
          resize: true, // defaults to true, set false if you do not want to resize the image width and height
        })
        .then((data) => {
          const img1 = data[0];
          const base64str = img1.data;
          const imgExt = img1.ext;
          const file = this.blobToFile(
            Compress.convertBase64ToFile(base64str, imgExt),
            fileName
          );
          // const blob = Compress.convertBase64ToFile(base64str, imgExt)
          // const file = new File(blob, fileName);
          this.setState({
            form: _.set({ ...this.state.form }, targetName, "LOADING"),
            uploadingImage: this.state.uploadingImage + 1,
          });
          ApiService.getInstance()
            .uploadFile(file, (progress) => {})
            .then((url) => {
              this.setState(
                {
                  form: _.set({ ...this.state.form }, targetName, url),
                  uploadingImage: this.state.uploadingImage - 1,
                },
                () => {}
              );
            });
        });
    }
  };

  removeImage = (event) => {
    event.preventDefault();
    let targetName = event.currentTarget.value;
    this.setState({
      form: _.set({ ...this.state.form }, targetName, ""),
    });
  };

  checkNextBtnIsDisabled = (form) => {
    // ค่าที่ต้องเช็ค (ชื่อ, อัพโหลดรูปหลัก, ตัวเลือกสี, ตัวเลือกไซส์ และอัพโหลดรูปครบหมดแล้ว)
    var uploadingImage = this.state.uploadingImage;
    return !(
      form &&
      form.productInfo.productName.length > 0 &&
      (form.productInfo.productImage &&
        form.productInfo.productImage.length > 0) &&
      form.productInfo.productColorOptions.length > 0 &&
      form.productInfo.productSizeOptions.length > 0 &&
      uploadingImage === 0
    );
  };

  checkSaveBtnIsDisabled = (form) => {
    var returnValue = true;
    var countCheckValue = 0;
    var countValidValue = 0;
    var uploadingImage = this.state.uploadingImage;

    if (form && form.productInfo.productVariations) {
      // ค่าที่ต้องเช็ค = จำนวนสี * จำนวนไซส์
      countCheckValue =
        form.productInfo.productColorOptions.length *
        form.productInfo.productSizeOptions.length;

      var productVariations = form.productInfo.productVariations;
      productVariations.forEach((item, index) => {
        if (item.hasOwnProperty("size")) {
          const sizeNames = Object.keys(item.size);
          for (let sizeName of sizeNames) {
            if (
              (item.size[sizeName].value.hasOwnProperty("isNotAvailable") &&
                item.size[sizeName].value.isNotAvailable === true) ||
              (item.size[sizeName].value.hasOwnProperty("price") &&
                item.size[sizeName].value.price > 0 &&
                item.size[sizeName].value.hasOwnProperty("stock") &&
                item.size[sizeName].value.stock > 0)
            ) {
              countValidValue++;
            }
          }
        }
      });
    }

    if (
      countCheckValue > 0 &&
      countValidValue > 0 &&
      countCheckValue === countValidValue &&
      uploadingImage === 0
    ) {
      console.clear();
      console.log(
        "%c Please copy product info below",
        "background: green; color: white; display: block; font-size: 18px;"
      );
      console.log(JSON.stringify(this.state.form.productInfo));
      returnValue = false;
    }

    return returnValue;
  };

  checkSingleSaveBtnIsDisabled = (form) => {
    var returnValue = true;
    var uploadingImage = this.state.uploadingImage;

    if (form && form.productInfo.productUniversalInfo) {
      // ค่าที่ต้องเช็ค (ชื่อ, ราคา, สต็อก, อัพโหลดรูปหลัก และอัพโหลดรูปครบหมดแล้ว)
      if (
        form.productInfo.productName.length > 0 &&
        form.productInfo.productUniversalInfo.price &&
        form.productInfo.productUniversalInfo.stock &&
        (form.productInfo.productImage &&
          form.productInfo.productImage.length > 0) &&
        uploadingImage === 0
      ) {
        console.clear();
        console.log(
          "%c Please copy product info below",
          "background: green; color: white; display: block; font-size: 18px;"
        );
        console.log(JSON.stringify(this.state.form.productInfo));
        returnValue = false;
      }
    }

    return returnValue;
  };

  render() {
    // const params = this.props.match.params;
    // const { productId } = params;
    const { productId, classes } = this.props;
    const { tabValue, storeID, form } = this.state;
    const tabDataList = [
      {
        tabName: "Product info",
        tabI18nKey: "product.product-form-product-info-title",
        tabContent: (
          <ProductDetails
            handleChange={this.handleChange}
            handleChangeColor={this.handleChangeColor}
            handleChangeSize={this.handleChangeSize}
            handleFileChange={this.handleFileChange}
            removeImage={this.removeImage}
            productId={productId}
            reference="page"
            storeID={this.state.storeID}
            onDoneProcessData={this.handleDoneProcessData}
            // triggerParentUpdate={this.handleColorSize}
            form={this.state.form}
            saved={this.saved}
            onCancelBtnClick={this.props.onCancelBtnClick}
            handleProductType={this.handleProductType}

            // This is the part where we set generic template as defualt
            // individualProductType={this.state.individualProductType}
          />
        ),
      },
      {
        tabName: "Product variations",
        tabI18nKey: "product.product-form-product-variations-title",
        tabContent: (
          <ProductVariation
            handleChange={this.handleChange}
            handleFileChange={this.handleFileChange}
            removeImage={this.removeImage}
            // productId={productId}
            storeID={this.state.storeID}
            form={this.state.form}
            onCancelBtnClick={this.props.onCancelBtnClick}
            onDoneProcessData={this.handleDoneProcessData}
            saved={this.saved}
          />
        ),
      },
    ];

    //THERE ARE 2 TYPES: SINGLE OR MULTI
    if (
      this.state.individualProductType === "SINGLE" ||
      this.state.individualProductType === "VOUCHER"
    ) {
      tabDataList.pop();
    }

    return (
      <FusePageSimple
        classes={{
          toolbar: "p-0",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        }}
        content={
          <form
            onSubmit={(event) =>
              this.handleSubmitProductForm(event, tabDataList)
            }
          >
            <div
              className="bg-white flex flex-col"
              style={{ paddingBottom: "200px" }}
            >
              <div
                className="hidden lg:flex border-solid border-b-1"
                style={{ borderColor: "#cbd5e0" }}
              >
                <Tabs
                  value={tabValue}
                  onChange={this.handleChangeTab}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  {tabDataList.map((item, index) => {
                    return (
                      <Tab
                        className="h-64 normal-case"
                        disabled={true}
                        label={
                          <Trans i18nKey={item.tabI18nKey}>
                            {item.tabName}
                          </Trans>
                        }
                        key={item.tabName}
                      />
                    );
                  })}
                </Tabs>
              </div>

              <div className="p-16 sm:p-24">
                {storeID !== "" ? tabDataList[tabValue].tabContent : null}
              </div>

              <div className="text-right">
                {tabValue === 0 ? (
                  <div>
                    {this.state.individualProductType === "SINGLE" ||
                    this.state.individualProductType === "VOUCHER" ? (
                      <Button
                        variant="outlined"
                        type="submit"
                        size="small"
                        className={classNames(
                          classes.fabButton,
                          classes.highlightButton
                        )}
                        disabled={this.checkSingleSaveBtnIsDisabled(form)}
                      >
                        <div className="px-12">
                          <Trans i18nKey="main.save-btn">Save</Trans>
                        </div>
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        type="submit"
                        size="small"
                        className={classNames(
                          classes.fabButton,
                          classes.highlightButton
                        )}
                        disabled={this.checkNextBtnIsDisabled(form)}
                      >
                        <div className="px-12">
                          <Trans i18nKey="main.next-btn">Next</Trans>
                        </div>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="px-12 text-red">
                      <Trans i18nKey="products.product-NA-button">
                        Please select NA button
                      </Trans>
                    </div>
                    <Button
                      size="small"
                      className="mr-8"
                      onClick={(event) => {
                        event.preventDefault();
                        this.handleBackStepperBtnClick();
                      }}
                    >
                      <div className="px-12">
                        &lt;&nbsp; <Trans i18nKey="main.back-btn">Back</Trans>
                      </div>
                    </Button>
                    {/* <Button variant="outlined" type="submit" size="small" className={classNames(classes.fabButton, classes.highlightButton)} disabled={this.checkSaveBtnIsDisabled(form)}> */}
                    <Button
                      variant="outlined"
                      type="submit"
                      size="small"
                      className={classNames(
                        classes.fabButton,
                        classes.highlightButton
                      )}
                      disabled={this.checkSaveBtnIsDisabled(form)}
                    >
                      <div className="px-12">
                        <Trans i18nKey="main.save-btn">Save</Trans>
                      </div>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>
        }
      />
    );
  }
}

ProductStepper.propTypes = {
  classes: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getProduct: Actions.getProduct,
      newProduct: Actions.newProduct,
      saveProduct: Actions.saveProduct,
      clearProductData: Actions.clearProductData,
    },
    dispatch
  );
}

function mapStateToProps({ eCommerceApp }) {
  return {
    product: eCommerceApp.product,
  };
}

export default withReducer("eCommerceApp", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withTranslation()(ProductStepper))
    )
  )
);
