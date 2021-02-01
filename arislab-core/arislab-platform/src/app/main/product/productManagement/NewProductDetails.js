import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { purple } from "@material-ui/core/colors";
import Switch from "@material-ui/core/Switch";
import green from "@material-ui/core/colors/green";
import {
  Save as SaveIcon,
  FileCopy as FileCopyIcon,
  Edit as EditIcon,
  Create as CreateIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from "@material-ui/icons";

import { Button, IconButton, Checkbox } from "@material-ui/core";
import { FuseChipSelect } from "@fuse";
import i18n from "../../../i18n";
import CopyToClipBoard from "react-copy-to-clipboard";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {
  BootstrapInput,
  BootstrapTextInput,
  ArisButton,
} from "../../components/Components";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Trans } from "react-i18next";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { ApiService } from "../../modules/ApiService";
import * as AppConfig from "../../config/AppConfig";

import Dialog from "../../components/Dialog";

const Compress = require("compress.js");
const sizeOption = require("../../config/product/misc/sizeConfig.json");
const sizeOptionEn = require("../../config/product/misc/sizeConfigEn.json");
const colorOption = require("../../config/product/misc/colorConfig.json");
const colorOptionEn = require("../../config/product/misc/colorConfigEn.json");
const productTypeOption = require("../../config/product/misc/productTypeConfig.json");
const productTypeDotplayOption = require("../../config/product/misc/productTypeDotplayConfig.json");
const productTypeVoucherOption = require("../../config/product/misc/productTypeVoucherConfig.json");

const host = AppConfig.API_URL;

const styles = (theme) => ({
  root: {
    "&$checked": {
      color: green[500],
    },
  },
  checked: {},
  colorSwitchBase: {
    color: purple[300],
    "&$colorChecked": {
      color: purple[500],
      "& + $colorBar": {
        backgroundColor: purple[500],
      },
    },
  },
  colorBar: {},
  colorChecked: {},
  iOSSwitchBase: {
    "&$iOSChecked": {
      color: theme.palette.common.white,
      "& + $iOSBar": {
        backgroundColor: "#52d869",
      },
    },
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp,
    }),
  },
  iOSChecked: {
    transform: "translateX(15px)",
    "& + $iOSBar": {
      opacity: 1,
      border: "none",
    },
  },
  iOSBar: {
    borderRadius: 13,
    width: 42,
    height: 26,
    marginTop: -13,
    marginLeft: -21,
    border: "solid 1px",
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  iOSIcon: {
    width: 24,
    height: 24,
  },
  iOSIconChecked: {
    boxShadow: theme.shadows[1],
  },
  selectRoot: {
    padding: 0,
  },
  selectMenu: {
    whiteSpace: "normal",
  },
});

class NewProductDetails extends Component {
  state = {
    enableColorImg: true,
    enableProductImage: this.props.product.enableProductImage || false,
    enabledReserveProduct: !!this.props.product.enabledReserveProduct,
    enableSizeTable: this.props.product.enableSizeTable || false,
    enableSKU: this.props.product.enableSKU || false,
    disableAddress: this.props.product.disableAddress || false,
    isVoucher: this.props.product.isVoucher || false,
    enableShippingRate: this.props.product.enableShippingRate || false,
    productName: this.props.product.productName,
    productHashtag: this.props.product.productHashtag,
    type: this.props.product.individualProductType || "SINGLE",
    productUniversalInfo: {
      price: this.props.product.productUniversalInfo.price || 0,
      stock: this.props.product.productUniversalInfo.stock || 0,
      sku: this.props.product.productUniversalInfo.sku || "",
    },
    multiInputAmount: 1,
    colorOnlyInputAmount: 1,
    sizeTableImage: this.props.product.sizeTableImage || "",
    productColorOptions: this.props.product.productColorOptions,
    productSizeOptions: this.props.product.productSizeOptions,
    productVariations: this.props.product.productVariations,
    isNotAvailable: this.props.product.isNotAvailable,
    shippingRate: {
      firstpiece: this.props.product.shippingRate.firstpiece || 0,
      nextpiece: this.props.product.shippingRate.nextpiece || 0,
    },
    mmelink: "",
    colorImages: [],
    errorMessages: {},
    typeChanged: true,
    disableButton: false,
    isOpen: false,
    storeInfo: this.props.storeInfo,
    isShowEditHashtag: false,
    storePackage: {},
  };

  constructor(props) {
    super(props);
    this.productNameOnPreview = React.createRef();
  }

  colorOnlySize = "__COLOR_ONLY__";

  componentDidMount = () => {
    this.createmmelink();
    let storeID = this.props.storeInfo.storeID;
    this.getStorePackage(storeID);
  };

  componentWillMount = () => { };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.state.productVariations !== prevState.productVariations ||
      this.props.product.productImage !== prevProps.product.productImage ||
      this.state.sizeTableImage !== prevState.sizeTableImage
    ) {
      this.checkLoadingImage();
    }
  };

  getStorePackage = async (storeID) => {
    let storePackage = await axios.get(
      host + "storePackage/storeID/" + storeID + "/current"
    );
    this.setState({ storePackage: storePackage.data[0] });
    if (storePackage.data[0].packageInfo.name === "Dotplay")
      this.setState({ type: "SINGLE" });
  };

  createmmelink = async () => {
    let channel = await axios.get(
      host + "channels/storeID/" + this.props.storeID + "/details"
    );
    let hashtag = this.state.productHashtag;
    this.setState({
      mmelink: `http://m.me/${channel.data[0].channels.facebook
        }?ref=__${hashtag}`,
    });
  };

  checkLoadingImage = () => {
    var disable = false;

    if (this.props.product.productImage === "LOADING") {
      disable = true;
    }

    if (this.state.sizeTableImage === "LOADING") {
      disable = true;
    }

    if (this.state.productVariations) {
      for (let i = 0; i < this.state.productVariations.length; i++) {
        if (this.state.productVariations[i].hasOwnProperty("image")) {
          if (this.state.productVariations[i].image === "LOADING") {
            disable = true;
          }
        }
      }
    }

    this.setState({ disableButton: disable });
  };

  convertVariationsToOptions = () => { };

  handleSwitch = (name) => (event) => {
    if (name === "disableAddress") {
      this.setState({ disableAddress: !this.state.disableAddress });
    } else {
      this.setState({ [name]: event.target.checked });
    }
  };

  handleChange = (event) => {
    if (
      event.target.name === "type" &&
      this.state.type !== event.target.value
    ) {
      this.setState({
        productUniversalInfo: {
          price: 0,
          stock: 0,
        },
        multiInputAmount: 1,
        colorOnlyInputAmount: 1,
        productColorOptions: [],
        productSizeOptions: [],
        productVariations: [],
        errorMessages: {},
        typeChanged: true,
      });
    }
    this.setState(
      { [event.target.name]: event.target.value },
      this.updateProductVariations
    );
  };

  handleProductName = async (event) => {
    await this.setState({ productName: event.target.value });
    var errorMessages = { ...this.state.errorMessages };

    if (!this.state.productName) {
      errorMessages = {
        ...errorMessages,
        productName: i18n.t("product.error-name"),
      };
      this.setState({ errorMessages: errorMessages });
    } else {
      errorMessages = { ...errorMessages, productName: "" };
      this.setState({ errorMessages: errorMessages });
    }
  };

  handleProductHashtag = async (event) => {
    this.setState({ productHashtag: event.target.value });
  };

  handleObjectChange = async (event, objectName, keyName) => {
    var value = event.target.value;

    if (
      keyName === "price" ||
      keyName === "stock" ||
      keyName == "firstpiece" ||
      keyName == "nextpiece"
    ) {
      value = Number(event.target.value);
      if (value < 0) {
        value = 0;
      }
    }

    this.setState(
      (prevState) => ({
        [objectName]: {
          ...prevState[objectName], // keep all other key-value pairs
          [keyName]: value, // update the value of specific key
        },
      }),
      () => {
        this.handleSellButton();
        this.formValidate();
      }
    );
  };

  handleColorOptionsChange = async (name, object) => {
    var array = [...object];
    var productVariations = [...this.state.productVariations];
    if (productVariations.length > array.length) {
      this.state.productVariations.forEach((variation, index) => {
        let colorIsDeleted = true;
        array.forEach((object) => {
          if (object.value === variation.color) {
            colorIsDeleted = false;
          }
        });
        if (colorIsDeleted) {
          productVariations.splice(index, 1);
        }
      });
    }
    await this.setState(
      { [name]: array, productVariations: productVariations },
      () => this.updateProductVariations()
    );
    this.formValidate();
  };

  handleSizeOptionsChange = async (name, object) => {
    var array = [...object];
    var productVariations = [...this.state.productVariations];
    if (array.length === 0) {
      productVariations = [];
    }
    if (this.state.productVariations.length > 0) {
      if (
        Object.keys(this.state.productVariations[0].size).length > array.length
      ) {
        this.state.productVariations.forEach((variation, index) => {
          for (var size in variation.size) {
            let sizeIsDeleted = true;
            array.forEach((object) => {
              if (object.value === size) {
                sizeIsDeleted = false;
              }
            });
            if (sizeIsDeleted && variation.size.length > 1) {
              delete productVariations[index]["size"][size];
            }
          }
        });
      }
    }
    var sizeLimit = "";
    if (array.length > 10) {
      sizeLimit = i18n.t("product.error-size-limit");
    }
    await this.setState(
      {
        [name]: array,
        productVariations: productVariations,
        errorMessages: { ...this.state.errorMessages, sizeLimit: sizeLimit },
      },
      () => this.updateProductVariations()
    );
    this.formValidate();
  };

  handleColorOnlySelect = async (event, index) => {
    var productColorOptions = [...this.state.productColorOptions];

    var colorOptionObject = { value: event.target.value, label: "" };
    colorOption.forEach((color) => {
      if (color.value === event.target.value) {
        colorOptionObject.label = color.label;
      }
    });
    productColorOptions[index] = colorOptionObject;
    await this.setState({ productColorOptions: productColorOptions }, () =>
      this.updateProductVariations()
    );
    this.formValidate();
  };

  updateProductVariations = () => {
    // ฟังก์ชันสำหรับเวลาเราเพิ่มสีหรือเพิ่มไซส์ ให้ทำการ update object ให้มีค่า เพื่อที่จะได้เรียกค่าที่ไม่ undefined
    var {
      productColorOptions,
      productSizeOptions,
      productVariations,
      type,
    } = this.state;
    if (type === "MULTI") {
      productColorOptions.forEach((color, index) => {
        if (productVariations[index]) {
          productSizeOptions.forEach((size) => {
            if (!productVariations[index].size.hasOwnProperty(size.value)) {
              var sizeObject = {};
              sizeObject[size.value] = {
                value: {
                  price: 0,
                  isNotAvailable: true,
                  stock: 0,
                },
              };
              productVariations[index] = {
                ...productVariations[index],
                image: productVariations[index].image,
                color: color.value,
                size: {
                  ...productVariations[index].size,
                  ...sizeObject,
                },
              };
            }
          });
        } else {
          productSizeOptions.forEach((size, i) => {
            if (i === 0) {
              productVariations[index] = {
                ...productVariations[index],
                image: "",
                color: color.value,
                size: {
                  [size.value]: {
                    value: { price: 0, isNotAvailable: true, stock: 0 },
                  },
                },
              };
            } else {
              productVariations[index] = {
                ...productVariations[index],
                image: "",
                color: color.value,
                size: {
                  ...productVariations[index].size,
                  [size.value]: {
                    value: {
                      price: 0,
                      isNotAvailable: true,
                      stock: 0,
                    },
                  },
                },
              };
            }
          });
        }
      });

      let productSizeOption = this.state.productSizeOptions;
      let filterOption = [];
      let result = [];

      filterOption = i18n.language === "en" ? sizeOptionEn : sizeOption;

      filterOption.forEach(function (key) {
        var found = false;
        productSizeOption = productSizeOption.filter(function (item) {
          if (!found && item.value == key.value) {
            result.push(item);
            found = true;
            return false;
          } else return true;
        });
      });

      this.setState({ productSizeOptions: result });
      if (this.state.typeChanged) {
        this.setState({ productVariations: productVariations });
      } else {
        this.setState(
          { productVariations: productVariations },
          this.formValidate
        );
      }
    } else if (type === "COLOR_ONLY") {
      productColorOptions.forEach((color, index) => {
        if (productVariations[index]) {
        } else {
          productVariations[index] = {
            image: "",
            color: color.value,
            size: {
              [this.colorOnlySize]: {
                value: {
                  price: 0,
                  isNotAvailable: true,
                  stock: 0,
                },
              },
            },
          };
        }
      });
      if (this.state.typeChanged) {
        this.setState({ productVariations: productVariations });
      } else {
        this.setState(
          { productVariations: productVariations },
          this.formValidate
        );
      }
    }
  };

  editColorLabel = (index) => {
    var productColorOptions = [...this.state.productColorOptions];
    // temporary save 'edit' key to productVariations object but not saving to database
    productColorOptions[index] = {
      ...this.state.productColorOptions[index],
      edit: true,
    };
    this.setState({ productColorOptions: productColorOptions });
  };

  handleColorLabel = (event, index) => {
    var productColorOptions = [...this.state.productColorOptions];
    productColorOptions[index] = {
      ...this.state.productColorOptions[index],
      label: event.target.value,
    };
    this.setState({ productColorOptions: productColorOptions });
  };

  saveColorLabel = (index) => {
    var productColorOptions = [...this.state.productColorOptions];
    productColorOptions[index] = {
      ...this.state.productColorOptions[index],
      edit: false,
    };
    this.setState({ productColorOptions: productColorOptions });
  };

  editSizeLabel = (index) => {
    var productSizeOptions = [...this.state.productSizeOptions];
    // temporary save 'edit' key to productVariations object but not saving to database
    productSizeOptions[index] = {
      ...this.state.productSizeOptions[index],
      edit: true,
    };
    this.setState({ productSizeOptions: productSizeOptions });
  };

  handleSizeLabel = (event, index) => {
    var productSizeOptions = [...this.state.productSizeOptions];
    productSizeOptions[index] = {
      ...this.state.productSizeOptions[index],
      label: event.target.value
    };
    this.setState({ productSizeOptions: productSizeOptions });
  };

  saveSizeLabel = (index) => {
    var productSizeOptions = [...this.state.productSizeOptions];
    productSizeOptions[index] = {
      ...this.state.productSizeOptions[index],
      edit: false,
    };
    this.setState({ productSizeOptions: productSizeOptions });
  };

  renderEditColorInput = (index) => {
    const productColorOptions = this.state.productColorOptions;
    if (productColorOptions[index].hasOwnProperty("edit")) {
      if (productColorOptions[index].edit === true) {
        return (
          <React.Fragment>
            <BootstrapInput
              className="w-96 mr-4"
              onChange={(e) => this.handleColorLabel(e, index)}
              value={productColorOptions[index].label}
            />
            <SaveIcon
              className="text-grey-darker"
              onClick={() => this.saveColorLabel(index)}
            />
          </React.Fragment>
        );
      } else if (productColorOptions[index].edit === false) {
        return (
          <React.Fragment>
            <span className="mr-4 text-lg">
              {productColorOptions[index].label}
            </span>
            <CreateIcon
              className="cursor-pointer text-grey-darker"
              fontSize="small"
              onClick={() => this.editColorLabel(index)}
            />
          </React.Fragment>
        );
      }
    } else {
      return (
        <React.Fragment>
          <span className="mr-4 text-lg">
            {productColorOptions[index].label}
          </span>
          <CreateIcon
            className="cursor-pointer text-grey-darker"
            fontSize="small"
            onClick={() => this.editColorLabel(index)}
          />
        </React.Fragment>
      );
    }
  };

  renderEditSizeInput = (index) => {
    const productSizeOptions = this.state.productSizeOptions;
    if (productSizeOptions[index].hasOwnProperty("edit")) {
      if (productSizeOptions[index].edit === true) {
        return (
          <React.Fragment>
            <BootstrapInput
              className="w-96 mr-4"
              onChange={(e) => this.handleSizeLabel(e, index)}
              value={productSizeOptions[index].label}
            />
            <SaveIcon
              className="text-grey-darker"
              onClick={() => this.saveSizeLabel(index)}
            />
          </React.Fragment>
        );
      } else if (productSizeOptions[index].edit === false) {
        return (
          <React.Fragment>
            <span className="mr-8 flex font-bold">
              <span className="hidden sm:block mr-4">
                <Trans i18nKey="product.size">Size</Trans>
              </span>
              <span>{productSizeOptions[index].label}</span>
            </span>
            <CreateIcon
              className="cursor-pointer text-grey-darker"
              fontSize="small"
              onClick={() => this.editSizeLabel(index)}></CreateIcon>
          </React.Fragment>
        );
      }
    } else {
      return (
        <React.Fragment>
          <span className="mr-8 flex font-bold">
            <span className="hidden sm:block mr-4">
              <Trans i18nKey="product.size">Size</Trans>
            </span>
            <span>{productSizeOptions[index].label}</span>
          </span>
          <CreateIcon className="cursor-pointer text-grey-darker"
            fontSize="small"
            onClick={() => this.editSizeLabel(index)}></CreateIcon>
        </React.Fragment>
      );
    }
  }

  uploadColorImage = (event) => {
    const compress = new Compress();

    if (!event) return;
    event.preventDefault();

    const colorValue = event.target.name;
    let validExtensions = ["jpg", "png", "jpeg", "gif", "bmp", "jfif"];
    let file = event.target.files[0];
    if (typeof file === "undefined") return;
    let fileName = file.name.toLowerCase();
    var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
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
          var productVariations = [...this.state.productVariations];
          this.state.productVariations.forEach((variation, index) => {
            if (variation.color === colorValue) {
              productVariations[index]["image"] = "LOADING";
            }
          });
          this.setState({ productVariations: productVariations });
          ApiService.getInstance()
            .uploadFile(file, (progress) => { })
            .then((url) => {
              var productVariations = [...this.state.productVariations];
              this.state.productVariations.forEach((variation, index) => {
                if (variation.color === colorValue) {
                  productVariations[index]["image"] = url;
                }
              });
              this.setState({ productVariations: productVariations });
            });
        });
    }
  };

  uploadSizeTableImage = (event) => {
    const compress = new Compress();

    if (!event) return;
    event.preventDefault();

    let validExtensions = ["jpg", "png", "jpeg", "gif", "bmp", "jfif"];
    let file = event.target.files[0];
    if (typeof file === "undefined") return;
    let fileName = file.name.toLowerCase();
    var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
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
          this.setState({ sizeTableImage: "LOADING" });
          ApiService.getInstance()
            .uploadFile(file, (progress) => { })
            .then((url) => {
              this.setState({ sizeTableImage: url });
            });
        });
    }
  };

  blobToFile = (theBlob, fileName) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  };

  removeImage = (index) => {
    var productVariations = this.state.productVariations;
    delete productVariations[index]["image"];
    this.setState({ productVariations: productVariations });
  };

  removeSizeTableImage = () => {
    this.setState({ sizeTableImage: null });
  };

  handleProductVariations = (index, color, size, valueName, value) => {
    //ฟังก์ชันสำหรับเปลี่ยนค่า product ต่าง ๆ ตามฟอร์ม

    if (valueName === "price" || valueName === "stock") {
      value = Number(value);
      if (value < 0) {
        value = 0;
      }
    }
    var productVariations = [...this.state.productVariations];

    if (productVariations[index]) {
      if (productVariations[index]["size"].hasOwnProperty(size)) {
        if (valueName === "stock") {
          productVariations[index] = {
            ...productVariations[index],
            color: color,
            size: {
              ...productVariations[index]["size"],
              [size]: {
                value: {
                  ...productVariations[index]["size"][size]["value"],
                  [valueName]: value,
                  startingStock: value,
                  isNotAvailable: true,
                },
              },
            },
          };
        } else {
          productVariations[index] = {
            ...productVariations[index],
            color: color,
            size: {
              ...productVariations[index]["size"],
              [size]: {
                value: {
                  ...productVariations[index]["size"][size]["value"],
                  [valueName]: value,
                  isNotAvailable: true,
                },
              },
            },
          };
        }
      } else {
        if (valueName === "stock") {
          productVariations[index] = {
            ...productVariations[index],
            color: color,
            size: {
              ...productVariations[index]["size"],
              [size]: {
                value: {
                  [valueName]: value,
                  startingStock: value,
                  isNotAvailable: true,
                },
              },
            },
          };
        } else {
          productVariations[index] = {
            ...productVariations[index],
            color: color,
            size: {
              ...productVariations[index]["size"],
              [size]: { value: { [valueName]: value, isNotAvailable: true } },
            },
          };
        }
      }
    } else {
      productVariations[index] = {
        ...productVariations[index],
        color: color,
        size: {
          [size]: { value: { [valueName]: value, isNotAvailable: true } },
        },
      };
    }

    if (
      productVariations[index].size[size].value.price > 0 &&
      productVariations[index].size[size].value.stock > 0 &&
      this.checkSizeLimit(productVariations[index])
    ) {
      productVariations[index].size[size].value.isNotAvailable = false;
    }
    this.setState({ productVariations: productVariations });
  };

  toggleSize = (index, size) => {
    var productVariations = [...this.state.productVariations];
    if (
      productVariations[index].size[size].value.price > 0 &&
      productVariations[index].size[size].value.stock > 0 &&
      this.checkSizeLimit(productVariations[index])
    ) {
      productVariations[index].size[
        size
      ].value.isNotAvailable = !productVariations[index].size[size].value
        .isNotAvailable;
    } else if (
      productVariations[index].size[size].value.isNotAvailable === false &&
      !this.checkSizeLimit(productVariations[index])
    ) {
      productVariations[index].size[size].value.isNotAvailable = true;
    }

    this.setState({ productVariations: productVariations });
  };

  checkSizeLimit = (product) => {
    var count = 0;
    for (const size in product.size) {
      if (product.size[size].value.isNotAvailable === false) {
        count++;
      }
    }

    if (count >= 10) {
      return false;
    } else {
      return true;
    }
  };

  checkSizeLimitInverse = () => {
    var count = 0;
    this.state.productVariations.forEach((el, index) => {
      for (const size in el.size) {
        if (el.size[size].value.isNotAvailable === false) {
          count++;
        }
      }
    });
    if (count > 10) {
      return false;
    } else {
      return true;
    }
  };

  handleSellButton = () => {
    const { price, stock } = this.state.productUniversalInfo;
    var isNotAvailable = true;
    if (price > 0 && stock > 0) {
      isNotAvailable = false;
    }
    this.setState({ isNotAvailable: isNotAvailable });
  };

  toggleSellButton = () => {
    const { price, stock } = this.state.productUniversalInfo;
    if (price === 0 || stock === 0) {
      this.setState({ isNotAvailable: true });
    } else {
      this.setState({ isNotAvailable: !this.state.isNotAvailable });
    }
  };

  openDialog = () => {
    this.setState({ isOpen: true });
  };

  closeDialog = () => {
    this.setState({ isOpen: false });
  };

  onConfirm = () => {
    this.saveProduct();
    this.props.pushTrackingData("Click", "Create product button");
    this.setState({ disableButton: true });
  };

  renderInputByType = (type) => {
    const { classes } = this.props;
    if (type === "SINGLE" || type === "VOUCHER") {
      return (
        <div className="flex flex-col">
          <div className="flex justify-between">
            <div className="w-1/2 flex items-center mr-8">
              <span
                className={
                  "mr-8 " + (this.state.errorMessages.stock ? "text-red" : "")
                }
              >
                <Trans i18nKey="products.product-table-title-stock">
                  Stock
                </Trans>
              </span>
              <div className="w-full sm:w-1/2">
                <BootstrapTextInput
                  name="productUniversalInfo['stock']"
                  className={
                    "w-full text-right " +
                    (this.state.errorMessages.stock
                      ? "product-error-color"
                      : "")
                  }
                  type="number"
                  value={Number(
                    this.state.productUniversalInfo.stock
                  ).toString()}
                  onChange={(e) =>
                    this.handleObjectChange(e, "productUniversalInfo", "stock")
                  }
                />
                {this.state.errorMessages.stock ? (
                  <span className="text-red">
                    {this.state.errorMessages.stock}
                  </span>
                ) : (
                    ""
                  )}
              </div>
            </div>
            <div className="w-1/2 flex items-center ml-8">
              <span
                className={
                  "mr-8 " + (this.state.errorMessages.price ? "text-red" : "")
                }
              >
                <Trans i18nKey="products.product-table-title-price">
                  Price
                </Trans>
              </span>
              <div className="w-full sm:w-1/2">
                <BootstrapTextInput
                  name="productUniversalInfo['price']"
                  className={
                    "w-full text-right " +
                    (this.state.errorMessages.price
                      ? "product-error-color"
                      : "")
                  }
                  type="number"
                  value={Number(
                    this.state.productUniversalInfo.price
                  ).toString()}
                  onChange={(e) =>
                    this.handleObjectChange(e, "productUniversalInfo", "price")
                  }
                />
                {this.state.errorMessages.price ? (
                  <span className="text-red">
                    {this.state.errorMessages.price}
                  </span>
                ) : (
                    ""
                  )}
              </div>
            </div>
            <div className="flex items-center">
              <span className="whitespace-no-wrap hidden sm:inline">
                <Trans i18nKey="product.sell">Sell</Trans>
              </span>
              <Checkbox
                classes={{
                  root: classes.root,
                  checked: classes.checked,
                }}
                onChange={() => {
                  this.toggleSellButton();
                }}
                checked={!this.state.isNotAvailable}
              />
            </div>
          </div>
          {this.state.enableSKU ? (
            <div className="flex flex-row items-center mt-16 w-full sm:w-4/5">
              <span className="mr-20">
                <Trans i18nKey="products.product-table-title-sku">SKU</Trans>
              </span>
              <div className="w-full">
                <BootstrapTextInput
                  name="productUniversalInfo['sku']"
                  className={"w-full text-right "}
                  type="text"
                  value={this.state.productUniversalInfo.sku}
                  onChange={(e) =>
                    this.handleObjectChange(e, "productUniversalInfo", "sku")
                  }
                />
              </div>
            </div>
          ) : (
              ""
            )}
        </div>
      );
    } else if (type === "MULTI") {
      var multiInputs = [];
      const options = (
        <div key={-1} className="flex flex-col sm:flex-row pt-6 mb-6">
          <div className="w-full md:p-8">
            <span
              className={
                this.state.errorMessages.productColorOptions ? "text-red" : ""
              }
            >
              <Trans i18nKey="product.color">Color</Trans> *
            </span>
            <div>
              <FuseChipSelect
                isSearchable={true}
                className={
                  "w-full mt-8 mb-16 " +
                  (this.state.errorMessages.productColorOptions
                    ? "product-error-color"
                    : "")
                }
                onChange={(object) => {
                  this.handleColorOptionsChange("productColorOptions", object);
                }}
                placeholder={i18n.t(
                  "product.product-form-input-product-color-placeholder"
                )}
                textFieldProps={{
                  InputLabelProps: {
                    shrink: true,
                  },
                  variant: "outlined",
                }}
                isMulti
                value={this.state.productColorOptions}
                options={i18n.language === "en" ? colorOptionEn : colorOption}
                required
              />
              {this.state.errorMessages.productColorOptions ? (
                <span className="text-red">
                  {this.state.errorMessages.productColorOptions}
                </span>
              ) : (
                  ""
                )}
            </div>
          </div>
          <div className="w-full md:p-8">
            <span
              className={
                this.state.errorMessages.productSizeOptions ? "text-red" : ""
              }
            >
              <Trans i18nKey="product.size">Size</Trans> *
            </span>
            <div>
              <FuseChipSelect
                isSearchable={true}
                className={
                  "w-full mt-8 mb-16 " +
                  (this.state.errorMessages.productSizeOptions
                    ? "product-error-color"
                    : "")
                }
                onChange={(object) => {
                  this.handleSizeOptionsChange("productSizeOptions", object);
                }}
                placeholder={i18n.t(
                  "product.product-form-input-product-size-placeholder"
                )}
                textFieldProps={{
                  InputLabelProps: {
                    shrink: true,
                  },
                  variant: "outlined",
                }}
                isMulti
                value={this.state.productSizeOptions}
                options={i18n.language === "en" ? sizeOptionEn : sizeOption}
                required
              />
              {this.state.errorMessages.productSizeOptions ? (
                <span className="text-red">
                  {this.state.errorMessages.productSizeOptions}
                </span>
              ) : (
                  ""
                )}
              {this.state.errorMessages.sizeLimit ? (
                <span className="text-grey-darker">
                  {this.state.errorMessages.sizeLimit}
                </span>
              ) : (
                  ""
                )}
            </div>
          </div>
        </div>
      );

      for (let i = 0; i < this.state.productColorOptions.length; i++) {
        if (this.state.productSizeOptions.length > 0) {
          multiInputs.push(
            <div
              key={i}
              className={
                "flex flex-col sm:flex-row" +
                (i < this.state.productColorOptions.length - 1
                  ? " pb-16 mb-16 border-b border-grey"
                  : "")
              }
            >
              <div className="flex items-center justify-center w-full mb-6 sm:mb-0 sm:w-1/2">
                {this.state.productVariations[i] ? (
                  !this.state.productVariations[i].hasOwnProperty("image") ||
                    this.state.productVariations[i].image.length === 0 ? (
                      <React.Fragment>
                        <label
                          htmlFor={`${this.state.productColorOptions[i].value
                            }-img`}
                          className="new-product-new-image cursor-pointer"
                        >
                          <Button component="span">
                            <svg
                              className="cursor-pointer"
                              width="102"
                              height="102"
                              viewBox="0 0 102 102"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                x="0.5"
                                y="0.5"
                                width="101"
                                height="101"
                                rx="4.5"
                                fill="white"
                                stroke="#999999"
                                strokeDasharray="5 5"
                              />
                              <mask
                                id="mask0"
                                mask-type="alpha"
                                maskUnits="userSpaceOnUse"
                                x="0"
                                y="0"
                                width="102"
                                height="102"
                              >
                                <rect
                                  width="102"
                                  height="102"
                                  rx="5"
                                  fill="white"
                                />
                              </mask>
                              <g mask="url(#mask0)">
                                <path
                                  d="M103.44 28.0729L104.619 22.9055C104.658 22.7373 104.559 22.568 104.393 22.5196L98.5138 20.7911C98.3483 20.7421 98.1732 20.8307 98.1147 20.9931L96.3097 25.9766C95.6012 26.3931 95.0044 26.9755 94.5707 27.6736L93.7138 27.4217C93.5411 27.3709 93.3599 27.4698 93.3091 27.6425L92.6904 29.7471C92.6396 29.9198 92.7384 30.1009 92.9111 30.1517L93.8118 30.4165C93.8239 31.1889 94.0119 31.9483 94.3616 32.6371L93.1821 37.8044C93.1434 37.9727 93.2427 38.1419 93.4084 38.1903L99.2781 39.9161C99.4436 39.9651 99.6187 39.8765 99.6772 39.7141L101.482 34.7306C103.795 33.3803 104.654 30.4603 103.44 28.0729ZM93.7808 29.7245L93.4087 29.6151L93.8436 28.136L94.2157 28.2454L93.7808 29.7245ZM98.6248 21.4998L103.897 23.05L102.926 27.2764C101.586 25.4927 99.2335 24.8011 97.1411 25.5755L98.6248 21.4998ZM99.1502 39.1956L93.8778 37.6454L94.8486 33.419C96.1889 35.2027 98.5415 35.8944 100.634 35.1199L99.1502 39.1956ZM97.6428 34.6041C95.294 33.9135 93.9497 31.4495 94.6403 29.1007C95.3309 26.7518 97.7948 25.4076 100.144 26.0981C102.493 26.7887 103.837 29.2527 103.146 31.6015C102.454 33.9492 99.9915 35.2927 97.6428 34.6041Z"
                                  fill="#EFEFEF"
                                />
                                <path
                                  d="M100.006 26.5805C100.005 26.5802 100.004 26.5799 100.003 26.5796C97.9207 25.9712 95.7391 27.1626 95.1255 29.2431C94.5131 31.3259 95.7052 33.5109 97.7881 34.1233C99.8709 34.7357 102.056 33.5436 102.668 31.4607C103.281 29.3778 102.089 27.1929 100.006 26.5805ZM98.2902 33.571L98.4419 33.055C98.4927 32.8823 98.3938 32.7011 98.2211 32.6504C98.0484 32.5996 97.8672 32.6984 97.8165 32.8711L97.6648 33.3871C96.2219 32.7986 95.3917 31.2769 95.6778 29.7452L96.1969 29.8978C96.3696 29.9486 96.5508 29.8497 96.6016 29.677C96.6523 29.5043 96.5535 29.3231 96.3808 29.2724L95.8586 29.1188C96.447 27.676 97.9688 26.8458 99.5005 27.1319L99.3479 27.651C99.2971 27.8237 99.3959 28.0048 99.5686 28.0556C99.7413 28.1064 99.9225 28.0075 99.9733 27.8349L100.126 27.3157C101.569 27.9042 102.399 29.4259 102.113 30.9577L101.597 30.806C101.424 30.7552 101.243 30.8541 101.192 31.0268C101.141 31.1995 101.24 31.3806 101.413 31.4314L101.932 31.584C101.344 33.0269 99.8219 33.8571 98.2902 33.571Z"
                                  fill="#EFEFEF"
                                />
                                <path
                                  d="M98.9858 30.0385L97.3972 29.5714C97.2245 29.5207 97.0433 29.6195 96.9925 29.7922C96.9418 29.9649 97.0406 30.1461 97.2133 30.1969L98.4892 30.572L98.252 31.3788C98.2012 31.5515 98.3001 31.7327 98.4728 31.7835C98.6454 31.8342 98.8266 31.7354 98.8774 31.5627L99.2066 30.4432C99.2573 30.2705 99.1585 30.0893 98.9858 30.0385Z"
                                  fill="#EFEFEF"
                                />
                                <path
                                  d="M39.9936 6.96298C39.99 6.95698 39.9862 6.95105 39.9823 6.94524L36.6155 2.26532C36.585 2.22175 36.5463 2.18458 36.5016 2.15581L33.7037 0.386639C33.5131 0.264773 33.2598 0.320531 33.1379 0.511127C33.1159 0.545501 33.0992 0.582951 33.0883 0.622272C33.0686 0.710204 32.4823 2.70706 30.4487 2.28466C28.4175 1.79562 28.744 -0.25949 28.7597 -0.348318C28.7973 -0.571391 28.647 -0.782722 28.4239 -0.820357C28.3856 -0.8268 28.3465 -0.827796 28.3078 -0.823238L25.0237 -0.405203C24.971 -0.3983 24.9201 -0.381209 24.8739 -0.354839L19.8619 2.43375C19.6678 2.5499 19.6045 2.80145 19.7207 2.99556C19.7243 3.00156 19.728 3.00749 19.7319 3.0133L22.3037 7.12035L20.2424 16.3132C20.1929 16.534 20.3317 16.7531 20.5525 16.8026L33.2227 19.6435C33.4434 19.693 33.6625 19.5542 33.712 19.3335L35.7732 10.1406L39.8524 7.5248C40.0465 7.40865 40.1097 7.15715 39.9936 6.96298ZM36.0167 8.99875L36.4325 7.14418C36.482 6.92345 36.3432 6.70436 36.1224 6.65487C35.9017 6.60538 35.6826 6.74421 35.6331 6.96494L32.9947 18.7318L21.1199 16.0692L23.7583 4.30231C23.8078 4.08159 23.669 3.8625 23.4482 3.813C23.2275 3.76351 23.0084 3.90234 22.9589 4.12307L22.5422 5.98164L20.6424 2.9404L25.2111 0.388214L27.9157 0.0459363C27.8675 1.7125 29.1795 3.10259 30.8461 3.15073C32.0768 3.18626 33.2058 2.47085 33.6992 1.34275L35.9987 2.80707L39.0282 7.06294L36.0167 8.99875Z"
                                  fill="#EFEFEF"
                                />
                                <path
                                  d="M88.767 7.38011C88.6779 7.39988 88.5994 7.45252 88.5473 7.52752C88.1312 8.11905 87.7322 8.4605 87.3673 8.54427C86.5632 8.72889 85.6754 7.67221 84.5692 6.33005C84.3736 6.09526 84.172 5.85066 83.9633 5.60769C81.9209 3.20878 76.8726 -0.375868 76.6546 -0.54584C76.5153 -0.645728 76.3251 -0.634742 76.1982 -0.519384C73.4591 1.97411 74.8177 6.13733 74.8736 6.29976L74.8913 6.2957L78.0679 15.2588C78.1305 15.4327 78.3138 15.5319 78.4937 15.4892L80.2047 15.0964C80.4004 15.0515 80.5226 14.8564 80.4777 14.6608L78.812 7.40566C81.6388 8.86745 83.8433 11.7289 84.1589 12.1449L84.5216 13.7249C84.5666 13.9206 84.7616 14.0428 84.9572 13.9978L95.8895 11.488C96.0852 11.4431 96.2074 11.248 96.1625 11.0524L95.7802 9.38741C94.8584 6.11962 89.0158 7.32672 88.767 7.38011ZM79.6985 14.4668L78.6569 14.7059L75.7329 6.55001C76.5077 6.5693 77.2725 6.72986 77.9897 7.02387L79.6985 14.4668ZM75.4912 5.82234L75.477 5.82559C75.268 4.96365 74.7094 2.10846 76.4843 0.239121C77.5355 1.00094 81.6728 4.04515 83.4182 6.07593C83.6269 6.3189 83.8277 6.55996 84.0189 6.79202C85.2916 8.32344 86.3007 9.535 87.5406 9.25034C88.0614 9.13078 88.5609 8.74013 89.0651 8.06125C89.8633 7.91531 93.9448 7.27289 94.9519 9.22329L84.6785 11.5819C83.8542 10.5255 79.9271 5.68404 75.4912 5.82234ZM95.3742 10.8679L85.1611 13.2127L84.9439 12.2668L95.1571 9.92204L95.3742 10.8679Z"
                                  fill="#EEEEEE"
                                />
                                <path
                                  d="M64.7355 12.1951L62.7152 8.3916L62.4679 6.89444C62.4337 6.68773 62.2384 6.54783 62.0317 6.58198L49.9945 8.5706C49.7878 8.60475 49.6479 8.80003 49.6821 9.00673L49.9294 10.5039L49.2398 14.7551C49.2335 14.7959 49.2339 14.8374 49.2409 14.878L51.3847 27.8546C51.4189 28.0613 51.6142 28.2012 51.8209 28.1671L58.1539 27.1208C58.3363 27.0941 58.473 26.9401 58.4781 26.7558L58.5669 23.0345L59.8555 26.5283C59.9195 26.7012 60.0985 26.803 60.2798 26.7696L66.6054 25.7246C66.8121 25.6905 66.952 25.4952 66.9178 25.2885L64.774 12.3118C64.7675 12.2711 64.7545 12.2317 64.7355 12.1951ZM52.7382 8.88634L53.0639 8.83254L53.1981 9.64475L52.8724 9.69855L52.7382 8.88634ZM50.4925 9.25735L51.9897 9.01001L52.1238 9.82222L50.6267 10.0696L50.4925 9.25735ZM49.9994 14.8142L50.6449 10.8317L51.6555 10.6648C51.6922 11.6084 51.6103 13.9751 50.0167 14.919L49.9994 14.8142ZM57.8569 21.0639L57.7195 26.4236L52.0715 27.3567L50.1459 15.7013C52.4126 14.6193 52.4668 11.5958 52.4116 10.5399L56.0197 9.94376L57.8569 21.0639ZM55.8942 9.18395L53.9479 9.50549L53.8162 8.70825L55.7625 8.38671L55.8942 9.18395ZM60.2839 7.63974L61.7811 7.3924L61.9153 8.20461L60.4181 8.45195L60.2839 7.63974ZM59.2097 7.81721L59.5354 7.76341L59.6695 8.57562L59.3402 8.63004L59.2097 7.81721ZM56.5148 8.26242L58.4612 7.94088L58.5953 8.75309L56.6453 9.07525L56.5148 8.26242ZM58.0415 17.5037L56.7727 9.82321L57.7084 9.66862L58.6867 15.5899C58.6959 15.6461 58.9749 16.8227 58.0415 17.5037ZM66.1074 25.0379L60.4593 25.971L58.6055 20.9403L58.1726 18.3202C59.2076 17.7577 59.7243 16.561 59.4241 15.4219L58.4526 9.54183L60.3765 9.224C60.6638 10.2416 61.6876 13.087 64.1818 13.3824L66.1074 25.0379ZM64.0532 12.6039C62.2482 12.2215 61.4057 10.0075 61.1332 9.10283L62.1438 8.93588L64.0359 12.4991L64.0532 12.6039Z"
                                  fill="#EFEFEF"
                                />
                                <path
                                  d="M18.4714 24.8566C18.2001 24.7979 17.922 24.7776 17.6451 24.7961C17.4942 24.8086 17.3705 24.9206 17.343 25.0694L17.1421 25.9212C16.4129 26.1826 15.6199 26.2078 14.8756 25.9931C14.6569 25.9416 14.484 25.9008 14.3882 25.8541L12.7301 23.3307C12.5996 23.1538 12.405 23.035 12.188 22.9996C11.0295 22.7265 8.07492 23.4079 6.48496 23.8977C4.59622 24.4859 1.10084 24.2612 1.06667 24.26L0.993514 24.2634C-0.873019 24.5675 -1.24632 25.9608 -1.17964 26.6862C-1.27832 29.2088 4.00497 30.6026 5.21576 30.8881L16.8733 33.6366C17.0535 33.6791 17.2341 33.5675 17.2766 33.3872L17.6867 31.6477C17.9032 31.4915 18.0725 31.2788 18.1762 31.0328C18.1813 31.0168 18.1851 31.0004 18.1877 30.9838L19.3419 26.0885C19.4768 25.4726 19.147 25.0159 18.4714 24.8566ZM4.73427 24.8939L4.98039 25.7788C5.03332 25.9577 5.22132 26.0599 5.40028 26.007C5.57924 25.954 5.6814 25.766 5.62847 25.5871L5.41053 24.8019C5.71332 24.7596 6.0046 24.7077 6.27861 24.6414L6.62742 25.6021C6.68818 25.7771 6.87926 25.8696 7.05417 25.8088C7.22908 25.7481 7.32167 25.557 7.2609 25.3821C7.2597 25.3786 7.25841 25.3751 7.25707 25.3717L6.92686 24.4636C7.19339 24.3852 7.46644 24.3083 7.74852 24.237L8.17655 25.3439C8.2355 25.5194 8.42558 25.614 8.60114 25.555C8.77669 25.4961 8.87125 25.306 8.81231 25.1304C8.80862 25.1194 8.80433 25.1086 8.7995 25.098L8.3937 24.0722C8.71802 23.9971 9.04483 23.926 9.35877 23.8656L9.86083 25.1553C9.9255 25.3289 10.1186 25.4171 10.2921 25.3524C10.4657 25.2878 10.5539 25.0947 10.4892 24.9211C10.4883 24.9186 10.4873 24.916 10.4863 24.9135L10.0383 23.7744C10.6902 23.6367 11.3598 23.6027 12.0223 23.6737C12.0703 23.6784 12.1175 23.6895 12.1626 23.7068L13.1795 25.2384C11.4836 26.6625 9.38536 27.5215 7.17772 27.6956C6.3441 27.1886 5.46097 26.768 4.54199 26.4402C3.71657 26.1834 2.99309 25.6729 2.47447 24.9813C3.16101 24.9915 3.94801 24.9704 4.73427 24.8939ZM1.05791 24.9401C1.1395 24.9593 1.36068 24.9563 1.66173 24.9653C2.2762 25.9763 3.23734 26.7295 4.36599 27.0843C5.42739 27.3896 7.5215 28.6482 8.95357 29.5439L7.52413 29.2069C1.60839 27.8362 -0.0569688 26.9509 -0.508722 26.4999C-0.514532 26.1885 -0.387356 25.1815 1.05791 24.9401ZM16.7016 32.9037L5.52707 30.269C4.08648 29.9501 0.716072 28.9177 -0.246338 27.5057C0.708035 28.0166 2.75993 28.7967 7.38443 29.887C8.46794 30.1425 9.56124 30.4003 10.6083 30.6058C11.5928 30.8138 12.5233 31.0022 13.3567 31.1642C15.3782 31.5616 16.7975 31.8101 16.8146 31.8107C16.8595 31.8245 16.9053 31.8353 16.9517 31.843L16.7016 32.9037ZM17.542 30.8006C17.5001 30.8906 17.3104 31.2421 16.9416 31.1551C16.9188 31.1497 15.7041 30.9391 13.9281 30.5962C15.0858 28.5059 17.2578 28.236 18.1498 28.2223L17.542 30.8006ZM13.2366 30.4607C12.4896 30.3121 11.6676 30.1459 10.8079 29.9639C10.5436 29.7844 9.41767 29.0367 8.13856 28.2666C10.1247 27.9388 11.9887 27.091 13.5409 25.8094L13.8715 26.3214C13.9094 26.3785 13.9639 26.4226 14.0277 26.4478C14.249 26.5313 14.4757 26.5997 14.7063 26.6526C15.4896 26.8372 16.6248 26.9464 17.5856 26.4219C17.6685 26.3764 17.7283 26.2978 17.7502 26.2058L17.9265 25.4585C18.0526 25.4624 18.1781 25.4781 18.3012 25.5055C18.7483 25.6109 18.7087 25.8083 18.6812 25.9396L18.3076 27.5533C17.3942 27.555 14.5816 27.7807 13.2366 30.4607Z"
                                  fill="#EFEFEF"
                                />
                              </g>
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M61.1454 48.608C60.2091 44.0638 56.0366 40.6523 51.0242 40.6523C47.0446 40.6523 43.5882 42.8125 41.8669 45.9737C37.722 46.3952 34.4998 49.754 34.4998 53.824C34.4998 58.1838 38.204 61.727 42.762 61.727H60.6635C64.4641 61.727 67.5487 58.7766 67.5487 55.1412C67.5487 51.6639 64.7257 48.8451 61.1454 48.608ZM60.664 59.0928H42.7625C39.7193 59.0928 37.2544 56.735 37.2544 53.8241C37.2544 51.1239 39.3613 48.8716 42.1566 48.595L43.6301 48.4501L44.3186 47.1988C45.6268 44.7883 48.1881 43.2868 51.0248 43.2868C54.6326 43.2868 57.7447 45.7367 58.447 49.1218L58.8601 51.0976L60.967 51.2425C63.1152 51.3742 64.7951 53.0997 64.7951 55.1413C64.7951 57.3146 62.9361 59.0928 60.664 59.0928ZM49.028 52.507H45.5165L51.0247 47.2383L56.5329 52.507H53.0214V56.4585H49.028V52.507Z"
                                fill="#BDBDBD"
                              />
                            </svg>
                          </Button>
                        </label>
                        <input
                          accept="image/*"
                          className="hidden"
                          id={`${this.state.productColorOptions[i].value}-img`}
                          type="file"
                          name={this.state.productColorOptions[i].value}
                          onChange={this.uploadColorImage}
                        />
                      </React.Fragment>
                    ) : this.state.productVariations[i]["image"] === "LOADING" ? (
                      <CircularProgress className="pink" />
                    ) : (
                        <div className="relative table">
                          <div className="absolute" style={{ right: 0 }}>
                            <IconButton
                              color="secondary"
                              aria-label="close"
                              value="productInfo['productImage']"
                              className="p-4 lg:p-8 white"
                              onClick={() => this.removeImage(i)}
                            >
                              <CloseIcon />
                            </IconButton>
                          </div>
                          <img
                            style={{
                              minWidth: "128px",
                              maxHeight: "128px",
                              maxWidth: "128px",
                              objectFit: "cover",
                            }}
                            className="border border-solid rounded cursor-pointer"
                            src={this.state.productVariations[i].image}
                            alt="Main"
                            component="span"
                          />
                        </div>
                      )
                ) : (
                    ""
                  )}

                <div className="flex justify-center sm:justify-start items-center w-full h-full">
                  <span className="ml-8 sm:mr-8">
                    {this.renderEditColorInput(i)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                {this.state.productSizeOptions.map((sizeOption, index) => {
                  return (
                    <div key={index} className="flex w-full mt-12">
                      <div
                        className={
                          this.state.enableSKU
                            ? "flex items-start w-2/5 justify-center pt-12 sm:pt-24 lg:pt-16"
                            : "flex items-center w-2/5 justify-center"
                        }
                      >
                        {this.renderEditSizeInput(index)}
                      </div>
                      {this.state.productVariations[i] ? (
                        this.state.productVariations[i].size.hasOwnProperty(
                          sizeOption.value
                        ) ? (
                            <div className="flex flex-col">
                              <div className="flex flex-row">
                                <React.Fragment>
                                  <div className="flex items-center">
                                    <span className="mr-8">
                                      <Trans i18nKey="products.product-table-title-stock">
                                        Stock
                                    </Trans>
                                    </span>
                                    <BootstrapTextInput
                                      name="productStock"
                                      className="w-full mr-8 "
                                      type="number"
                                      value={
                                        Number(
                                          this.state.productVariations[i].size[
                                            sizeOption.value
                                          ].value.stock
                                        ).toString() || 0
                                      }
                                      onChange={(e) =>
                                        this.handleProductVariations(
                                          i,
                                          this.state.productColorOptions[i].value,
                                          sizeOption.value,
                                          "stock",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="flex items-center">
                                    <span className="mr-8">
                                      <Trans i18nKey="products.product-table-title-price">
                                        Price
                                    </Trans>
                                    </span>
                                    <BootstrapTextInput
                                      name="productPrice"
                                      className="w-full"
                                      type="number"
                                      value={
                                        Number(
                                          this.state.productVariations[i].size[
                                            sizeOption.value
                                          ].value.price
                                        ).toString() || 0
                                      }
                                      onChange={(e) =>
                                        this.handleProductVariations(
                                          i,
                                          this.state.productColorOptions[i].value,
                                          sizeOption.value,
                                          "price",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="sm:w-2/5 sm:ml-12 text-center">
                                    <span className="whitespace-no-wrap hidden sm:inline">
                                      <Trans i18nKey="product.sell">Sell</Trans>
                                    </span>
                                    <Checkbox
                                      classes={{
                                        root: classes.root,
                                        checked: classes.checked,
                                      }}
                                      onChange={() => {
                                        this.toggleSize(i, sizeOption.value);
                                      }}
                                      checked={
                                        !this.state.productVariations[i].size[
                                          sizeOption.value
                                        ].value.isNotAvailable
                                      }
                                    />
                                  </div>
                                </React.Fragment>
                              </div>
                              {this.state.enableSKU ? (
                                <div className="flex flex-row items-center w-full mt-8">
                                  <span className="mr-20">
                                    <Trans i18nKey="product.sku">SKU</Trans>
                                  </span>
                                  <BootstrapTextInput
                                    name="productPrice"
                                    className="w-full mr-12"
                                    type="text"
                                    value={
                                      this.state.productVariations[i].size[
                                        sizeOption.value
                                      ].value.sku || ""
                                    }
                                    onChange={(e) =>
                                      this.handleProductVariations(
                                        i,
                                        this.state.productColorOptions[i].value,
                                        sizeOption.value,
                                        "sku",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              ) : (
                                  ""
                                )}
                            </div>
                          ) : (
                            ""
                          )
                      ) : (
                          ""
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
      }
      return [options, multiInputs];
    } else if (type === "COLOR_ONLY") {
      var colorOnlyInputs = [];
      const option = (
        <div key={-1} className="w-full md:p-8">
          <span
            className={
              this.state.errorMessages.productColorOptions ? "text-red" : ""
            }
          >
            <Trans i18nKey="product.color">Color</Trans> *
          </span>
          <div>
            <FuseChipSelect
              isSearchable={true}
              className={
                "w-full mt-8 mb-16 " +
                (this.state.errorMessages.productColorOptions
                  ? "product-error-color"
                  : "")
              }
              onChange={(object) => {
                this.handleColorOptionsChange("productColorOptions", object);
              }}
              placeholder={i18n.t(
                "product.product-form-input-product-color-placeholder"
              )}
              textFieldProps={{
                InputLabelProps: {
                  shrink: true,
                },
                variant: "outlined",
              }}
              isMulti
              error
              value={this.state.productColorOptions}
              options={i18n.language === "en" ? colorOptionEn : colorOption}
              required
            />
            {this.state.errorMessages.productColorOptions ? (
              <span className="text-red">
                {this.state.errorMessages.productColorOptions}
              </span>
            ) : (
                ""
              )}
          </div>
        </div>
      );
      for (let i = 0; i < this.state.productColorOptions.length; i++) {
        colorOnlyInputs.push(
          <div
            key={i}
            className={
              "flex justify-between" +
              (i < this.state.productColorOptions.length - 1
                ? " pb-16 mb-16 border-b border-grey"
                : "")
            }
          >
            {this.state.productVariations[i] ? (
              !this.state.productVariations[i].hasOwnProperty("image") ||
                this.state.productVariations[i].image.length === 0 ? (
                  <React.Fragment>
                    <label
                      htmlFor={`${this.state.productColorOptions[i].value}-img`}
                      className="new-product-new-image cursor-pointer"
                    >
                      <Button component="span">
                        <svg
                          className="cursor-pointer"
                          width="102"
                          height="102"
                          viewBox="0 0 102 102"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="101"
                            height="101"
                            rx="4.5"
                            fill="white"
                            stroke="#999999"
                            strokeDasharray="5 5"
                          />
                          <mask
                            id="mask0"
                            mask-type="alpha"
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="102"
                            height="102"
                          >
                            <rect width="102" height="102" rx="5" fill="white" />
                          </mask>
                          <g mask="url(#mask0)">
                            <path
                              d="M103.44 28.0729L104.619 22.9055C104.658 22.7373 104.559 22.568 104.393 22.5196L98.5138 20.7911C98.3483 20.7421 98.1732 20.8307 98.1147 20.9931L96.3097 25.9766C95.6012 26.3931 95.0044 26.9755 94.5707 27.6736L93.7138 27.4217C93.5411 27.3709 93.3599 27.4698 93.3091 27.6425L92.6904 29.7471C92.6396 29.9198 92.7384 30.1009 92.9111 30.1517L93.8118 30.4165C93.8239 31.1889 94.0119 31.9483 94.3616 32.6371L93.1821 37.8044C93.1434 37.9727 93.2427 38.1419 93.4084 38.1903L99.2781 39.9161C99.4436 39.9651 99.6187 39.8765 99.6772 39.7141L101.482 34.7306C103.795 33.3803 104.654 30.4603 103.44 28.0729ZM93.7808 29.7245L93.4087 29.6151L93.8436 28.136L94.2157 28.2454L93.7808 29.7245ZM98.6248 21.4998L103.897 23.05L102.926 27.2764C101.586 25.4927 99.2335 24.8011 97.1411 25.5755L98.6248 21.4998ZM99.1502 39.1956L93.8778 37.6454L94.8486 33.419C96.1889 35.2027 98.5415 35.8944 100.634 35.1199L99.1502 39.1956ZM97.6428 34.6041C95.294 33.9135 93.9497 31.4495 94.6403 29.1007C95.3309 26.7518 97.7948 25.4076 100.144 26.0981C102.493 26.7887 103.837 29.2527 103.146 31.6015C102.454 33.9492 99.9915 35.2927 97.6428 34.6041Z"
                              fill="#EFEFEF"
                            />
                            <path
                              d="M100.006 26.5805C100.005 26.5802 100.004 26.5799 100.003 26.5796C97.9207 25.9712 95.7391 27.1626 95.1255 29.2431C94.5131 31.3259 95.7052 33.5109 97.7881 34.1233C99.8709 34.7357 102.056 33.5436 102.668 31.4607C103.281 29.3778 102.089 27.1929 100.006 26.5805ZM98.2902 33.571L98.4419 33.055C98.4927 32.8823 98.3938 32.7011 98.2211 32.6504C98.0484 32.5996 97.8672 32.6984 97.8165 32.8711L97.6648 33.3871C96.2219 32.7986 95.3917 31.2769 95.6778 29.7452L96.1969 29.8978C96.3696 29.9486 96.5508 29.8497 96.6016 29.677C96.6523 29.5043 96.5535 29.3231 96.3808 29.2724L95.8586 29.1188C96.447 27.676 97.9688 26.8458 99.5005 27.1319L99.3479 27.651C99.2971 27.8237 99.3959 28.0048 99.5686 28.0556C99.7413 28.1064 99.9225 28.0075 99.9733 27.8349L100.126 27.3157C101.569 27.9042 102.399 29.4259 102.113 30.9577L101.597 30.806C101.424 30.7552 101.243 30.8541 101.192 31.0268C101.141 31.1995 101.24 31.3806 101.413 31.4314L101.932 31.584C101.344 33.0269 99.8219 33.8571 98.2902 33.571Z"
                              fill="#EFEFEF"
                            />
                            <path
                              d="M98.9858 30.0385L97.3972 29.5714C97.2245 29.5207 97.0433 29.6195 96.9925 29.7922C96.9418 29.9649 97.0406 30.1461 97.2133 30.1969L98.4892 30.572L98.252 31.3788C98.2012 31.5515 98.3001 31.7327 98.4728 31.7835C98.6454 31.8342 98.8266 31.7354 98.8774 31.5627L99.2066 30.4432C99.2573 30.2705 99.1585 30.0893 98.9858 30.0385Z"
                              fill="#EFEFEF"
                            />
                            <path
                              d="M39.9936 6.96298C39.99 6.95698 39.9862 6.95105 39.9823 6.94524L36.6155 2.26532C36.585 2.22175 36.5463 2.18458 36.5016 2.15581L33.7037 0.386639C33.5131 0.264773 33.2598 0.320531 33.1379 0.511127C33.1159 0.545501 33.0992 0.582951 33.0883 0.622272C33.0686 0.710204 32.4823 2.70706 30.4487 2.28466C28.4175 1.79562 28.744 -0.25949 28.7597 -0.348318C28.7973 -0.571391 28.647 -0.782722 28.4239 -0.820357C28.3856 -0.8268 28.3465 -0.827796 28.3078 -0.823238L25.0237 -0.405203C24.971 -0.3983 24.9201 -0.381209 24.8739 -0.354839L19.8619 2.43375C19.6678 2.5499 19.6045 2.80145 19.7207 2.99556C19.7243 3.00156 19.728 3.00749 19.7319 3.0133L22.3037 7.12035L20.2424 16.3132C20.1929 16.534 20.3317 16.7531 20.5525 16.8026L33.2227 19.6435C33.4434 19.693 33.6625 19.5542 33.712 19.3335L35.7732 10.1406L39.8524 7.5248C40.0465 7.40865 40.1097 7.15715 39.9936 6.96298ZM36.0167 8.99875L36.4325 7.14418C36.482 6.92345 36.3432 6.70436 36.1224 6.65487C35.9017 6.60538 35.6826 6.74421 35.6331 6.96494L32.9947 18.7318L21.1199 16.0692L23.7583 4.30231C23.8078 4.08159 23.669 3.8625 23.4482 3.813C23.2275 3.76351 23.0084 3.90234 22.9589 4.12307L22.5422 5.98164L20.6424 2.9404L25.2111 0.388214L27.9157 0.0459363C27.8675 1.7125 29.1795 3.10259 30.8461 3.15073C32.0768 3.18626 33.2058 2.47085 33.6992 1.34275L35.9987 2.80707L39.0282 7.06294L36.0167 8.99875Z"
                              fill="#EFEFEF"
                            />
                            <path
                              d="M88.767 7.38011C88.6779 7.39988 88.5994 7.45252 88.5473 7.52752C88.1312 8.11905 87.7322 8.4605 87.3673 8.54427C86.5632 8.72889 85.6754 7.67221 84.5692 6.33005C84.3736 6.09526 84.172 5.85066 83.9633 5.60769C81.9209 3.20878 76.8726 -0.375868 76.6546 -0.54584C76.5153 -0.645728 76.3251 -0.634742 76.1982 -0.519384C73.4591 1.97411 74.8177 6.13733 74.8736 6.29976L74.8913 6.2957L78.0679 15.2588C78.1305 15.4327 78.3138 15.5319 78.4937 15.4892L80.2047 15.0964C80.4004 15.0515 80.5226 14.8564 80.4777 14.6608L78.812 7.40566C81.6388 8.86745 83.8433 11.7289 84.1589 12.1449L84.5216 13.7249C84.5666 13.9206 84.7616 14.0428 84.9572 13.9978L95.8895 11.488C96.0852 11.4431 96.2074 11.248 96.1625 11.0524L95.7802 9.38741C94.8584 6.11962 89.0158 7.32672 88.767 7.38011ZM79.6985 14.4668L78.6569 14.7059L75.7329 6.55001C76.5077 6.5693 77.2725 6.72986 77.9897 7.02387L79.6985 14.4668ZM75.4912 5.82234L75.477 5.82559C75.268 4.96365 74.7094 2.10846 76.4843 0.239121C77.5355 1.00094 81.6728 4.04515 83.4182 6.07593C83.6269 6.3189 83.8277 6.55996 84.0189 6.79202C85.2916 8.32344 86.3007 9.535 87.5406 9.25034C88.0614 9.13078 88.5609 8.74013 89.0651 8.06125C89.8633 7.91531 93.9448 7.27289 94.9519 9.22329L84.6785 11.5819C83.8542 10.5255 79.9271 5.68404 75.4912 5.82234ZM95.3742 10.8679L85.1611 13.2127L84.9439 12.2668L95.1571 9.92204L95.3742 10.8679Z"
                              fill="#EEEEEE"
                            />
                            <path
                              d="M64.7355 12.1951L62.7152 8.3916L62.4679 6.89444C62.4337 6.68773 62.2384 6.54783 62.0317 6.58198L49.9945 8.5706C49.7878 8.60475 49.6479 8.80003 49.6821 9.00673L49.9294 10.5039L49.2398 14.7551C49.2335 14.7959 49.2339 14.8374 49.2409 14.878L51.3847 27.8546C51.4189 28.0613 51.6142 28.2012 51.8209 28.1671L58.1539 27.1208C58.3363 27.0941 58.473 26.9401 58.4781 26.7558L58.5669 23.0345L59.8555 26.5283C59.9195 26.7012 60.0985 26.803 60.2798 26.7696L66.6054 25.7246C66.8121 25.6905 66.952 25.4952 66.9178 25.2885L64.774 12.3118C64.7675 12.2711 64.7545 12.2317 64.7355 12.1951ZM52.7382 8.88634L53.0639 8.83254L53.1981 9.64475L52.8724 9.69855L52.7382 8.88634ZM50.4925 9.25735L51.9897 9.01001L52.1238 9.82222L50.6267 10.0696L50.4925 9.25735ZM49.9994 14.8142L50.6449 10.8317L51.6555 10.6648C51.6922 11.6084 51.6103 13.9751 50.0167 14.919L49.9994 14.8142ZM57.8569 21.0639L57.7195 26.4236L52.0715 27.3567L50.1459 15.7013C52.4126 14.6193 52.4668 11.5958 52.4116 10.5399L56.0197 9.94376L57.8569 21.0639ZM55.8942 9.18395L53.9479 9.50549L53.8162 8.70825L55.7625 8.38671L55.8942 9.18395ZM60.2839 7.63974L61.7811 7.3924L61.9153 8.20461L60.4181 8.45195L60.2839 7.63974ZM59.2097 7.81721L59.5354 7.76341L59.6695 8.57562L59.3402 8.63004L59.2097 7.81721ZM56.5148 8.26242L58.4612 7.94088L58.5953 8.75309L56.6453 9.07525L56.5148 8.26242ZM58.0415 17.5037L56.7727 9.82321L57.7084 9.66862L58.6867 15.5899C58.6959 15.6461 58.9749 16.8227 58.0415 17.5037ZM66.1074 25.0379L60.4593 25.971L58.6055 20.9403L58.1726 18.3202C59.2076 17.7577 59.7243 16.561 59.4241 15.4219L58.4526 9.54183L60.3765 9.224C60.6638 10.2416 61.6876 13.087 64.1818 13.3824L66.1074 25.0379ZM64.0532 12.6039C62.2482 12.2215 61.4057 10.0075 61.1332 9.10283L62.1438 8.93588L64.0359 12.4991L64.0532 12.6039Z"
                              fill="#EFEFEF"
                            />
                            <path
                              d="M18.4714 24.8566C18.2001 24.7979 17.922 24.7776 17.6451 24.7961C17.4942 24.8086 17.3705 24.9206 17.343 25.0694L17.1421 25.9212C16.4129 26.1826 15.6199 26.2078 14.8756 25.9931C14.6569 25.9416 14.484 25.9008 14.3882 25.8541L12.7301 23.3307C12.5996 23.1538 12.405 23.035 12.188 22.9996C11.0295 22.7265 8.07492 23.4079 6.48496 23.8977C4.59622 24.4859 1.10084 24.2612 1.06667 24.26L0.993514 24.2634C-0.873019 24.5675 -1.24632 25.9608 -1.17964 26.6862C-1.27832 29.2088 4.00497 30.6026 5.21576 30.8881L16.8733 33.6366C17.0535 33.6791 17.2341 33.5675 17.2766 33.3872L17.6867 31.6477C17.9032 31.4915 18.0725 31.2788 18.1762 31.0328C18.1813 31.0168 18.1851 31.0004 18.1877 30.9838L19.3419 26.0885C19.4768 25.4726 19.147 25.0159 18.4714 24.8566ZM4.73427 24.8939L4.98039 25.7788C5.03332 25.9577 5.22132 26.0599 5.40028 26.007C5.57924 25.954 5.6814 25.766 5.62847 25.5871L5.41053 24.8019C5.71332 24.7596 6.0046 24.7077 6.27861 24.6414L6.62742 25.6021C6.68818 25.7771 6.87926 25.8696 7.05417 25.8088C7.22908 25.7481 7.32167 25.557 7.2609 25.3821C7.2597 25.3786 7.25841 25.3751 7.25707 25.3717L6.92686 24.4636C7.19339 24.3852 7.46644 24.3083 7.74852 24.237L8.17655 25.3439C8.2355 25.5194 8.42558 25.614 8.60114 25.555C8.77669 25.4961 8.87125 25.306 8.81231 25.1304C8.80862 25.1194 8.80433 25.1086 8.7995 25.098L8.3937 24.0722C8.71802 23.9971 9.04483 23.926 9.35877 23.8656L9.86083 25.1553C9.9255 25.3289 10.1186 25.4171 10.2921 25.3524C10.4657 25.2878 10.5539 25.0947 10.4892 24.9211C10.4883 24.9186 10.4873 24.916 10.4863 24.9135L10.0383 23.7744C10.6902 23.6367 11.3598 23.6027 12.0223 23.6737C12.0703 23.6784 12.1175 23.6895 12.1626 23.7068L13.1795 25.2384C11.4836 26.6625 9.38536 27.5215 7.17772 27.6956C6.3441 27.1886 5.46097 26.768 4.54199 26.4402C3.71657 26.1834 2.99309 25.6729 2.47447 24.9813C3.16101 24.9915 3.94801 24.9704 4.73427 24.8939ZM1.05791 24.9401C1.1395 24.9593 1.36068 24.9563 1.66173 24.9653C2.2762 25.9763 3.23734 26.7295 4.36599 27.0843C5.42739 27.3896 7.5215 28.6482 8.95357 29.5439L7.52413 29.2069C1.60839 27.8362 -0.0569688 26.9509 -0.508722 26.4999C-0.514532 26.1885 -0.387356 25.1815 1.05791 24.9401ZM16.7016 32.9037L5.52707 30.269C4.08648 29.9501 0.716072 28.9177 -0.246338 27.5057C0.708035 28.0166 2.75993 28.7967 7.38443 29.887C8.46794 30.1425 9.56124 30.4003 10.6083 30.6058C11.5928 30.8138 12.5233 31.0022 13.3567 31.1642C15.3782 31.5616 16.7975 31.8101 16.8146 31.8107C16.8595 31.8245 16.9053 31.8353 16.9517 31.843L16.7016 32.9037ZM17.542 30.8006C17.5001 30.8906 17.3104 31.2421 16.9416 31.1551C16.9188 31.1497 15.7041 30.9391 13.9281 30.5962C15.0858 28.5059 17.2578 28.236 18.1498 28.2223L17.542 30.8006ZM13.2366 30.4607C12.4896 30.3121 11.6676 30.1459 10.8079 29.9639C10.5436 29.7844 9.41767 29.0367 8.13856 28.2666C10.1247 27.9388 11.9887 27.091 13.5409 25.8094L13.8715 26.3214C13.9094 26.3785 13.9639 26.4226 14.0277 26.4478C14.249 26.5313 14.4757 26.5997 14.7063 26.6526C15.4896 26.8372 16.6248 26.9464 17.5856 26.4219C17.6685 26.3764 17.7283 26.2978 17.7502 26.2058L17.9265 25.4585C18.0526 25.4624 18.1781 25.4781 18.3012 25.5055C18.7483 25.6109 18.7087 25.8083 18.6812 25.9396L18.3076 27.5533C17.3942 27.555 14.5816 27.7807 13.2366 30.4607Z"
                              fill="#EFEFEF"
                            />
                          </g>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M61.1454 48.608C60.2091 44.0638 56.0366 40.6523 51.0242 40.6523C47.0446 40.6523 43.5882 42.8125 41.8669 45.9737C37.722 46.3952 34.4998 49.754 34.4998 53.824C34.4998 58.1838 38.204 61.727 42.762 61.727H60.6635C64.4641 61.727 67.5487 58.7766 67.5487 55.1412C67.5487 51.6639 64.7257 48.8451 61.1454 48.608ZM60.664 59.0928H42.7625C39.7193 59.0928 37.2544 56.735 37.2544 53.8241C37.2544 51.1239 39.3613 48.8716 42.1566 48.595L43.6301 48.4501L44.3186 47.1988C45.6268 44.7883 48.1881 43.2868 51.0248 43.2868C54.6326 43.2868 57.7447 45.7367 58.447 49.1218L58.8601 51.0976L60.967 51.2425C63.1152 51.3742 64.7951 53.0997 64.7951 55.1413C64.7951 57.3146 62.9361 59.0928 60.664 59.0928ZM49.028 52.507H45.5165L51.0247 47.2383L56.5329 52.507H53.0214V56.4585H49.028V52.507Z"
                            fill="#BDBDBD"
                          />
                        </svg>
                      </Button>
                    </label>
                    <input
                      accept="image/*"
                      className="hidden"
                      id={`${this.state.productColorOptions[i].value}-img`}
                      type="file"
                      name={this.state.productColorOptions[i].value}
                      onChange={this.uploadColorImage}
                    />
                  </React.Fragment>
                ) : this.state.productVariations[i]["image"] === "LOADING" ? (
                  <CircularProgress className="pink" />
                ) : (
                    <div className="relative table">
                      <div className="absolute" style={{ right: 0 }}>
                        <IconButton
                          color="secondary"
                          aria-label="close"
                          className="p-4 lg:p-8 white"
                          onClick={() => this.removeImage(i)}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                      <img
                        style={{
                          minWidth: "128px",
                          maxHeight: "128px",
                          maxWidth: "128px",
                        }}
                        className="border border-solid rounded cursor-pointer"
                        src={this.state.productVariations[i].image}
                        alt="Main"
                        component="span"
                      />
                    </div>
                  )
            ) : (
                ""
              )}
            <div className="w-1/5 flex items-center justify-center">
              <span className="ml-8 sm:mr-8 flex items-center">
                {this.renderEditColorInput(i)}
              </span>
            </div>
            {this.state.productVariations[i] ? (
              <div className="flex flex-col text-right justify-center items-end sm:items-center sm:flex-row sm:justify-end ">
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <div className="flex items-center">
                      <span className="mr-16 w-1/2">
                        <Trans i18nKey="products.product-table-title-stock">
                          Stock
                        </Trans>
                      </span>
                      <BootstrapTextInput
                        name="productStock"
                        className="w-1/2 mr-0 sm:mr-8"
                        type="number"
                        value={Number(
                          this.state.productVariations[i].size[
                            this.colorOnlySize
                          ].value.stock
                        ).toString()}
                        onChange={(e) =>
                          this.handleProductVariations(
                            i,
                            this.state.productColorOptions[i].value,
                            this.colorOnlySize,
                            "stock",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="mr-16 w-1/2">
                        <Trans i18nKey="products.product-table-title-price">
                          Price
                        </Trans>
                      </span>
                      <BootstrapTextInput
                        name="productPrice"
                        className="w-1/2"
                        type="number"
                        value={Number(
                          this.state.productVariations[i].size[
                            this.colorOnlySize
                          ].value.price
                        ).toString()}
                        onChange={(e) =>
                          this.handleProductVariations(
                            i,
                            this.state.productColorOptions[i].value,
                            this.colorOnlySize,
                            "price",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="sm:w-2/5 text-center">
                      <span className="sm:inline">
                        <Trans i18nKey="product.sell">Sell</Trans>
                      </span>
                      <Checkbox
                        classes={{
                          root: classes.root,
                          checked: classes.checked,
                        }}
                        onChange={() => {
                          this.toggleSize(i, this.colorOnlySize);
                        }}
                        checked={
                          !this.state.productVariations[i].size[
                            this.colorOnlySize
                          ].value.isNotAvailable
                        }
                      />
                    </div>
                  </div>
                  {this.state.enableSKU ? (
                    <div className="flex flex-row items-center w-5/6 mt-8 ml-auto mr-32">
                      <span className="mr-16">
                        <Trans i18nKey="product.sku">SKU</Trans>
                      </span>
                      <BootstrapTextInput
                        name="productPrice"
                        className="w-full"
                        type="text"
                        value={
                          this.state.productVariations[i].size[
                            this.colorOnlySize
                          ].value.sku || ""
                        }
                        onChange={(e) =>
                          this.handleProductVariations(
                            i,
                            this.state.productColorOptions[i].value,
                            this.colorOnlySize,
                            "sku",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  ) : (
                      ""
                    )}
                </div>
              </div>
            ) : (
                ""
              )}
          </div>
        );
      }
      return [option, colorOnlyInputs];
    }
  };

  formValidate = () => {
    var errorMessages = { ...this.state.errorMessages };
    var valid = true;

    if (!this.state.productName) {
      errorMessages = {
        ...errorMessages,
        productName: i18n.t("product.error-name"),
      };
      this.setState({ errorMessages: errorMessages });
      valid = false;
    } else {
      errorMessages = { ...errorMessages, productName: "" };
      this.setState({ errorMessages: errorMessages });
    }

    if (
      this.state.productColorOptions.length === 0 &&
      this.state.type !== "SINGLE" &&
      this.state.type !== "VOUCHER"
    ) {
      errorMessages = {
        ...errorMessages,
        productColorOptions: i18n.t("product.error-color"),
      };
      this.setState({ errorMessages: errorMessages });
      valid = false;
    } else {
      errorMessages = { ...errorMessages, productColorOptions: "" };
      this.setState({ errorMessages: errorMessages });
    }

    if (
      this.state.productSizeOptions.length === 0 &&
      this.state.type === "MULTI"
    ) {
      errorMessages = {
        ...errorMessages,
        productSizeOptions: i18n.t("product.error-size"),
      };
      this.setState({ errorMessages: errorMessages });
      valid = false;
    } else {
      errorMessages = { ...errorMessages, productSizeOptions: "" };
      this.setState({ errorMessages: errorMessages });
    }

    if (this.state.isNotAvailable === true && (this.state.type === "SINGLE" || this.state.type === "VOUCHER")) {
      valid = true;
    }

    return valid;
  };

  saveProduct = async () => {
    if (!this.formValidate()) {
      return;
    }

    var productColorOptions = this.state.productColorOptions;
    for (let i = 0; i < productColorOptions.length; i++) {
      delete productColorOptions[i]["edit"];
    }
    var productData = {};
    const type = this.state.type;
    if (type === "SINGLE" || type === "VOUCHER") {
      productData = {
        productBrandName: "",
        productName: this.state.productName,
        productDescription: "",
        productWeight: 0,
        productTypeOption: {},
        subCategoryLevel1SelectedOption: {},
        subCategoryLevel2SelectedOption: {},
        productColorOptions: [],
        productSizeOptions: [],
        productFAQDetails: {},
        productFAQDetailsOption: {},
        productVariations: [],
        productHashtag: this.state.productHashtag,
        enabledReserveProduct: this.state.enabledReserveProduct,
        closeupImage: {},
        individualProductType: this.state.type,
        productUniversalInfo: {
          price: this.state.productUniversalInfo.price,
          stock: this.state.productUniversalInfo.stock,
          startingStock: this.state.productUniversalInfo.stock,
          sku: this.state.productUniversalInfo.sku,
        },
        shippingRate: {
          firstpiece: this.state.shippingRate.firstpiece,
          nextpiece: this.state.shippingRate.nextpiece,
        },
        productImage: this.props.product.productImage || "",
        sizeTableImage: this.state.sizeTableImage || "",
        enableProductImage: this.state.enableProductImage,
        enableSizeTable: this.state.enableSizeTable,
        enableSKU: this.state.enableSKU,
        enableShippingRate: this.state.enableShippingRate,
        disableAddress: this.state.disableAddress,
        isVoucher: type === "VOUCHER",
        isNotAvailable: this.state.isNotAvailable,
      };
    } else if (type === "MULTI") {
      productData = {
        productBrandName: "",
        productName: this.state.productName,
        productDescription: "",
        productWeight: 0,
        productTypeOption: {},
        subCategoryLevel1SelectedOption: {},
        subCategoryLevel2SelectedOption: {},
        productColorOptions: productColorOptions,
        productSizeOptions: this.state.productSizeOptions,
        productFAQDetails: {},
        productFAQDetailsOption: {},
        productVariations: this.state.productVariations,
        productHashtag: this.state.productHashtag,
        enabledReserveProduct: this.state.enabledReserveProduct,
        closeupImage: {},
        individualProductType: this.state.type,
        productUniversalInfo: {
          price: 0,
          stock: 0,
          startingStock: 0,
          sku: "",
        },
        shippingRate: {
          firstpiece: this.state.shippingRate.firstpiece,
          nextpiece: this.state.shippingRate.nextpiece,
        },
        productImage: this.props.product.productImage || "",
        sizeTableImage: this.state.sizeTableImage || "",
        enableProductImage: this.state.enableProductImage,
        enableSizeTable: this.state.enableSizeTable,
        enableSKU: this.state.enableSKU,
        enableShippingRate: this.state.enableShippingRate,
        disableAddress: this.state.disableAddress,
        isVoucher: type === "VOUCHER",
        isNotAvailable: this.state.isNotAvailable,
      };
    } else if (type === "COLOR_ONLY") {
      const colorOnlySizeOptions = [
        {
          label: "__COLOR_ONLY__",
          value: "__COLOR_ONLY__",
        },
      ];
      productData = {
        productBrandName: "",
        productName: this.state.productName,
        productDescription: "",
        productWeight: 0,
        productTypeOption: {},
        subCategoryLevel1SelectedOption: {},
        subCategoryLevel2SelectedOption: {},
        productColorOptions: productColorOptions,
        productSizeOptions: colorOnlySizeOptions,
        productFAQDetails: {},
        productFAQDetailsOption: {},
        productVariations: this.state.productVariations,
        productHashtag: this.state.productHashtag,
        enabledReserveProduct: this.state.enabledReserveProduct,
        closeupImage: {},
        individualProductType: this.state.type,
        productUniversalInfo: {
          price: 0,
          stock: 0,
          startingStock: 0,
          sku: "",
        },
        shippingRate: {
          firstpiece: this.state.shippingRate.firstpiece,
          nextpiece: this.state.shippingRate.nextpiece,
        },
        productImage: this.props.product.productImage || "",
        sizeTableImage: this.state.sizeTableImage || "",
        enableProductImage: this.state.enableProductImage,
        enableSizeTable: this.state.enableSizeTable,
        enableSKU: this.state.enableSKU,
        enableShippingRate: this.state.enableShippingRate,
        disableAddress: this.state.disableAddress,
        isVoucher: type === "VOUCHER",
        isNotAvailable: this.state.isNotAvailable,
      };
    }

    await this.props.saveProduct(productData, {
      storeID: this.props.storeID,
      productID: this.props.productID || this.props.productIDFromLive,
    });

    if (this.props.productIDFromLive) {
      this.props.onDoneProcessData(this.props.productID, productData);
      this.props.pushTrackingData("Create", "Create product from live");
    } else {
      this.props.pushTrackingData("Create", "Create product");
      setTimeout(function () {
        window.location.href = "/platform/products";
      }, 1000);
    }
  };

  onEditHashtagClick = (isCancaled = false) => {
    const data = {
      isShowEditHashtag: !this.state.isShowEditHashtag,
    };

    if (isCancaled) {
      data.productHashtag = this.props.product.productHashtag;
    }

    this.setState(data);
  };

  renderPreview = () => {
    var top = 0;
    if (this.state.enableProductImage && this.props.product.productImage) {
      top = 0;
    } else if (
      this.state.enableProductImage &&
      !this.props.product.productImage
    ) {
      top = 47;
    } else if (!this.state.enableProductImage) {
      top = 47;
    }

    var productImage;
    if (this.props.product.productImage === "LOADING") {
      productImage = <CircularProgress className="pink m-24" />;
    } else if (this.props.product.productImage) {
      productImage = (
        <img
          alt="Product"
          src={this.props.product.productImage}
          style={{ maxWidth: "128px", maxHeight: "128px" }}
        />
      );
    } else {
      productImage = "";
    }

    var sizeTable;
    if (this.state.sizeTableImage === "LOADING") {
      sizeTable = <CircularProgress className="pink m-24" />;
    } else if (this.state.sizeTableImage) {
      sizeTable = (
        <img
          alt="Size Chart"
          src={this.state.sizeTableImage}
          style={{ maxWidth: "265px" }}
        />
      );
    } else {
      sizeTable = "";
    }

    var price = 0;
    if (this.state.type === "SINGLE" || this.state.type === "VOUCHER") {
      price = this.state.productUniversalInfo.price;
    } else {
      var priceArray = [];
      this.state.productVariations.forEach((variation) => {
        for (let size of Object.keys(variation.size)) {
          priceArray.push(Number(variation.size[size].value.price));
        }
      });
      price = Math.min.apply(null, priceArray.filter(Boolean));
      if (price === Infinity) {
        price = 0;
      }
    }

    return (
      <div className="absolute" style={{ top: 100, left: 42, width: "489px" }}>
        {this.state.enableProductImage && this.state.productName ? (
          <div className="absolute">{productImage}</div>
        ) : (
            ""
          )}

        {this.state.enableSizeTable ? (
          this.state.sizeTableImage ? (
            <div className="absolute" style={{ top: 145 - top }}>
              {sizeTable}
            </div>
          ) : (
              ""
            )
        ) : (
            ""
          )}

        <div
          id="order"
          className="absolute bg-black text-red p-6 pr-16"
          style={{ top: 110 - top }}
        >
          <Trans i18nKey="product.to-order-type">To order type</Trans> #
          {this.state.productHashtag}
        </div>

        <div
          id="price"
          className="absolute bg-black text-red p-4"
          style={{ top: 80 - top }}
        >
          {price} <Trans i18nKey="main.baht">Baht</Trans>
        </div>

        {!this.state.enableProductImage || !this.props.product.productImage ? (
          this.state.productName ? (
            <div
              id="name"
              className="absolute overflow-hidden whitespace-no-wrap p-4"
              style={{ maxWidth: "267px" }}
            >
              <span>{this.state.productName}</span>
            </div>
          ) : (
              ""
            )
        ) : (
            ""
          )}
      </div>
    );
  };

  render() {
    const { classes, history } = this.props;
    const card = " shadow-md rounded-lg bg-white p-20 px-12 sm:px-32 ";
    const cardHeader = "text-lg font-bold border-b border-grey pt-6 pb-16 ";
    const cardContent = " pb-8 pt-16 ";
    let typeOption = productTypeOption;
    if (
      this.state.storePackage &&
      this.state.storePackage.packageInfo &&
      this.state.storePackage.packageInfo.name === "Dotplay"
    )
      typeOption = productTypeDotplayOption;
    if (
      this.state.storePackage &&
      this.state.storePackage.packageInfo &&
      this.state.storePackage.packageInfo.name === "Voucher"
    )
      typeOption = productTypeVoucherOption;
    return (
      <div
        id="product-overflow-visible"
        className={
          "lg:px-16 main-product " +
          (this.props.productIDFromLive ? "my-12" : "my-24")
        }
      >
        <Dialog
          title=""
          isOpen={this.state.isOpen}
          onClose={this.closeDialog}
          setIsOpen={this.setState}
          maxWidth="xs"
          onConfirm={this.onConfirm}
          button={
            <>
              <Button style={{ color: "#000" }} onClick={this.closeDialog}>
                <Trans i18nKey="main.cancel-btn">Cancel</Trans>
              </Button>
              <Button
                variant="contained"
                onClick={this.onConfirm}
                color="primary"
              >
                {this.state.disableButton ? (
                  <CircularProgress className="text-white" size="1em" />
                ) : (
                    <Trans i18nKey="main.confirm">Confirm</Trans>
                  )}
              </Button>
            </>
          }
        >
          <Trans i18nKey="main.confirm-change">Confirm update?</Trans>
        </Dialog>
        {this.props.productIDFromLive ? (
          ""
        ) : (
            <div className={card + "mb-16"}>
              <span
                className="text-lg font-bold hover:text-grey cursor-pointer"
                onClick={() => {
                  history.push("/platform/products");
                }}
              >
                <Trans i18nKey="products.products-title">Products</Trans>
              </span>
              <span>
                {" "}
                {this.props.productID === "new" ? (
                  <Trans i18nKey="products.create-new-product-title">
                    Create New Product
                  </Trans>
                ) : (
                    <Trans i18nKey="products.edit-product-title">
                      Edit Product
                    </Trans>
                  )}
              </span>
            </div>
          )}
        <div className="flex">
          <div
            className="hidden md:flex md:flex-col shadow-md rounded-lg bg-white p-16 w-2/5 relative"
            style={{ height: "min-content", width: "min-conten" }}
          >
            <div className="text-lg font-bold mb-12">
              <Trans i18nKey="product.product-preview">
                Live overlay preview
              </Trans>
            </div>
            {this.renderPreview()}
            <svg
              width="327"
              height="581"
              viewBox="0 0 327 581"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xlink="http://www.w3.org/1999/xlink"
            >
              <path
                d="M5 0.5H305.109C307.594 0.5 309.609 2.51472 309.609 5V569C309.609 571.485 307.594 573.5 305.109 573.5H5C2.51472 573.5 0.5 571.485 0.5 569V5C0.5 2.51472 2.51472 0.5 5 0.5Z"
                fill="#FAFAFA"
                stroke="#E0E0E0"
              />
              <rect
                opacity="0.4"
                x="17.8501"
                y="156.294"
                width="274.613"
                height="230.539"
                fill="url(#pattern0)"
              />
              <path
                d="M27.7905 29.0571H30.8227V29.7471H26.9424V23.3486H27.7905V29.0571ZM32.6904 29.7471H31.8466V23.3486H32.6904V29.7471ZM36.3554 28.6265L38.1836 23.3486H39.1064L36.7334 29.7471H35.9863L33.6176 23.3486H34.5361L36.3554 28.6265ZM43.5844 26.7896H40.8115V29.0571H44.0327V29.7471H39.9677V23.3486H43.9887V24.043H40.8115V26.0996H43.5844V26.7896Z"
                fill="white"
              />
              <defs>
                <pattern
                  id="pattern0"
                  patternContentUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <use
                    href="#image0"
                    transform="translate(0 -0.000526873) scale(0.00325733 0.00388005)"
                  />
                </pattern>
                <image
                  id="image0"
                  width="307"
                  height="258"
                  href="data:image/png;base64,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"
                />
              </defs>
            </svg>
          </div>
          <div className="w-full md:ml-16">
            {/* <div className={card}>
              <div className={cardHeader}> */}
            <div className={card + "mt-16"}>
              <div className={cardHeader + "flex flex-row items-center"}>
                <Trans i18nKey="product.product-general-details">
                  General details
                </Trans>
                {this.state.storeInfo.config.enabledReserveProduct && (
                  <div className="ml-auto flex flex-row items-center">
                    <div className="text-lg font-light">
                      <Trans i18nKey="product.reserve-products">
                        Reserve Products
                      </Trans>{" "}
                      :{" "}
                    </div>
                    <Switch
                      classes={{
                        switchBase: classes.iOSSwitchBase,
                        bar: classes.iOSBar,
                        icon: classes.iOSIcon,
                        iconChecked: classes.iOSIconChecked,
                        checked: classes.iOSChecked,
                      }}
                      disableRipple
                      checked={this.state.enabledReserveProduct}
                      onChange={this.handleSwitch("enabledReserveProduct")}
                      value="enabledReserveProduct"
                    />
                  </div>
                )}
              </div>
              <div className={cardContent + "flex"}>
                <div className="w-full">
                  <div className="flex w-full mb-12 flex-col sm:flex-row">
                    <div className="w-1/3 sm:w-1/5 flex items-center sm:justify-end sm:mr-24">
                      <Trans i18nKey="product.product-image">
                        Product image
                      </Trans>
                    </div>
                    <div className="flex flex-col w-full sm:w-1/2 items-start">
                      <Switch
                        classes={{
                          switchBase: classes.iOSSwitchBase,
                          bar: classes.iOSBar,
                          icon: classes.iOSIcon,
                          iconChecked: classes.iOSIconChecked,
                          checked: classes.iOSChecked,
                        }}
                        disableRipple
                        checked={this.state.enableProductImage}
                        onChange={this.handleSwitch("enableProductImage")}
                        value="enableProductImage"
                      />
                      {this.state.enableProductImage ? (
                        this.props.product.productImage ? (
                          this.props.product.productImage === "LOADING" ? (
                            <CircularProgress className="pink m-24" />
                          ) : (
                              <div className="relative">
                                <div className="absolute" style={{ right: 0 }}>
                                  <IconButton
                                    color="secondary"
                                    aria-label="close"
                                    value="productInfo['productImage']"
                                    className="p-4 lg:p-8 white"
                                    onClick={this.props.removeImage}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </div>
                                <img
                                  style={{
                                    maxWidth: "300px",
                                    maxHeight: "350px",
                                  }}
                                  className="border border-solid rounded cursor-pointer object-cover"
                                  src={this.props.product.productImage}
                                  alt="Main"
                                  component="span"
                                />
                              </div>
                            )
                        ) : (
                            <React.Fragment>
                              <label
                                htmlFor="main-image-file"
                                className="cursor-pointer"
                              >
                                <Button component="span">
                                  {i18n.language.includes("en") ? (
                                    <svg
                                      width="102"
                                      height="36"
                                      viewBox="0 0 102 36"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <rect
                                        x="0.5"
                                        y="0.5"
                                        width="101"
                                        height="35"
                                        rx="4.5"
                                        fill="white"
                                        stroke="#999999"
                                        strokeDasharray="5 5"
                                      />
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M28.7009 16.285C28.0788 13.2662 25.307 11 21.9773 11C19.3336 11 17.0375 12.435 15.894 14.535C13.1406 14.815 11 17.0462 11 19.75C11 22.6462 13.4607 25 16.4886 25H28.3807C30.9055 25 32.9545 23.04 32.9545 20.625C32.9545 18.315 31.0793 16.4425 28.7009 16.285ZM28.3809 23.25H16.4888C14.4672 23.25 12.8298 21.6838 12.8298 19.75C12.8298 17.9563 14.2294 16.46 16.0863 16.2763L17.0652 16.18L17.5225 15.3488C18.3916 13.7475 20.093 12.75 21.9775 12.75C24.3742 12.75 26.4416 14.3775 26.9081 16.6263L27.1825 17.9388L28.5821 18.035C30.0092 18.1225 31.1252 19.2688 31.1252 20.625C31.1252 22.0688 29.8903 23.25 28.3809 23.25ZM20.6512 18.8755H18.3186L21.9776 15.3755L25.6367 18.8755H23.3041V21.5005H20.6512V18.8755Z"
                                        fill="#BDBDBD"
                                      />
                                      <path
                                        d="M47.2586 21.28C47.9866 21.28 48.5426 21.104 48.9266 20.752C49.3186 20.4 49.5146 19.876 49.5146 19.18V14.272H50.4986V19.168C50.4986 20.128 50.2186 20.86 49.6586 21.364C49.1066 21.868 48.3066 22.12 47.2586 22.12C46.2026 22.12 45.3946 21.868 44.8346 21.364C44.2826 20.86 44.0066 20.128 44.0066 19.168V14.272H44.9906V19.18C44.9906 19.876 45.1866 20.4 45.5786 20.752C45.9706 21.104 46.5306 21.28 47.2586 21.28ZM57.5773 19.072C57.5773 20.08 57.3533 20.84 56.9053 21.352C56.4573 21.864 55.8213 22.12 54.9973 22.12C54.2533 22.12 53.6213 21.94 53.1013 21.58V24.592H52.1173V16.312H52.9573L53.0293 16.912C53.2933 16.664 53.5813 16.484 53.8933 16.372C54.2133 16.252 54.5853 16.192 55.0093 16.192C55.8413 16.192 56.4773 16.424 56.9173 16.888C57.3573 17.344 57.5773 18.072 57.5773 19.072ZM54.7333 21.328C55.3733 21.328 55.8413 21.148 56.1373 20.788C56.4413 20.42 56.5933 19.848 56.5933 19.072C56.5933 18.328 56.4533 17.796 56.1733 17.476C55.8933 17.148 55.4213 16.984 54.7573 16.984C54.0773 16.984 53.5253 17.212 53.1013 17.668V20.764C53.5253 21.14 54.0693 21.328 54.7333 21.328ZM60.0037 13.912V20.668C60.0037 20.9 60.0397 21.064 60.1117 21.16C60.1917 21.248 60.3197 21.292 60.4957 21.292C60.6797 21.292 60.8597 21.268 61.0357 21.22V22C60.8277 22.08 60.5677 22.12 60.2557 22.12C59.8557 22.12 59.5477 22.016 59.3317 21.808C59.1237 21.592 59.0197 21.248 59.0197 20.776V13.912H60.0037ZM64.237 16.192C66.133 16.192 67.081 17.18 67.081 19.156C67.081 20.14 66.849 20.88 66.385 21.376C65.929 21.872 65.213 22.12 64.237 22.12C63.261 22.12 62.541 21.872 62.077 21.376C61.621 20.88 61.393 20.14 61.393 19.156C61.393 17.18 62.341 16.192 64.237 16.192ZM64.237 21.28C64.909 21.28 65.385 21.112 65.665 20.776C65.953 20.44 66.097 19.9 66.097 19.156C66.097 18.412 65.953 17.872 65.665 17.536C65.377 17.2 64.901 17.032 64.237 17.032C63.573 17.032 63.097 17.2 62.809 17.536C62.521 17.872 62.377 18.412 62.377 19.156C62.377 19.9 62.517 20.44 62.797 20.776C63.085 21.112 63.565 21.28 64.237 21.28ZM72.1909 21.352C71.9429 21.616 71.6389 21.812 71.2789 21.94C70.9269 22.06 70.4949 22.12 69.9829 22.12C69.4069 22.12 68.9269 21.972 68.5429 21.676C68.1669 21.38 67.9789 20.956 67.9789 20.404C67.9789 19.852 68.1589 19.42 68.5189 19.108C68.8789 18.788 69.4309 18.628 70.1749 18.628H72.1549V18.28C72.1549 17.96 72.1109 17.712 72.0229 17.536C71.9349 17.352 71.7749 17.22 71.5429 17.14C71.3109 17.06 70.9749 17.02 70.5349 17.02C69.8709 17.02 69.2389 17.124 68.6389 17.332V16.516C69.2069 16.3 69.8829 16.192 70.6669 16.192C71.4829 16.192 72.0909 16.36 72.4909 16.696C72.8909 17.024 73.0909 17.552 73.0909 18.28V22H72.2629L72.1909 21.352ZM70.1989 19.384C69.7589 19.384 69.4389 19.468 69.2389 19.636C69.0469 19.796 68.9509 20.052 68.9509 20.404C68.9509 20.732 69.0589 20.968 69.2749 21.112C69.4909 21.248 69.8109 21.316 70.2349 21.316C71.0429 21.316 71.6829 21.04 72.1549 20.488V19.384H70.1989ZM74.4711 19.24C74.4711 18.24 74.7031 17.484 75.1671 16.972C75.6311 16.452 76.2751 16.192 77.0991 16.192C77.4671 16.192 77.7991 16.236 78.0951 16.324C78.3911 16.412 78.6751 16.548 78.9471 16.732V13.912H79.9311V22H79.0911L79.0191 21.4C78.7551 21.648 78.4631 21.832 78.1431 21.952C77.8311 22.064 77.4631 22.12 77.0391 22.12C76.2071 22.12 75.5711 21.892 75.1311 21.436C74.6911 20.972 74.4711 20.24 74.4711 19.24ZM77.3151 16.984C76.6751 16.984 76.2031 17.168 75.8991 17.536C75.6031 17.896 75.4551 18.464 75.4551 19.24C75.4551 19.984 75.5951 20.52 75.8751 20.848C76.1551 21.168 76.6271 21.328 77.2911 21.328C77.9711 21.328 78.5231 21.1 78.9471 20.644V17.548C78.5231 17.172 77.9791 16.984 77.3151 16.984Z"
                                        fill="#333333"
                                      />
                                    </svg>
                                  ) : (
                                      <svg
                                        className="cursor-pointer"
                                        width="102"
                                        height="36"
                                        viewBox="0 0 102 36"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <rect
                                          x="0.5"
                                          y="0.5"
                                          width="101"
                                          height="35"
                                          rx="4.5"
                                          fill="white"
                                          stroke="#999999"
                                          strokeDasharray="5 5"
                                        />
                                        <path
                                          fillRule="evenodd"
                                          clipRule="evenodd"
                                          d="M28.7009 16.285C28.0788 13.2662 25.307 11 21.9773 11C19.3336 11 17.0375 12.435 15.894 14.535C13.1406 14.815 11 17.0462 11 19.75C11 22.6462 13.4607 25 16.4886 25H28.3807C30.9055 25 32.9545 23.04 32.9545 20.625C32.9545 18.315 31.0793 16.4425 28.7009 16.285ZM28.3809 23.25H16.4888C14.4672 23.25 12.8298 21.6838 12.8298 19.75C12.8298 17.9563 14.2294 16.46 16.0863 16.2763L17.0652 16.18L17.5225 15.3488C18.3916 13.7475 20.093 12.75 21.9775 12.75C24.3742 12.75 26.4416 14.3775 26.9081 16.6263L27.1825 17.9388L28.5821 18.035C30.0092 18.1225 31.1252 19.2688 31.1252 20.625C31.1252 22.0688 29.8903 23.25 28.3809 23.25ZM20.6512 18.8755H18.3186L21.9776 15.3755L25.6367 18.8755H23.3041V21.5005H20.6512V18.8755Z"
                                          fill="#BDBDBD"
                                        />
                                        <path
                                          d="M44.2882 16.24C43.5202 16.24 42.8202 16.344 42.1882 16.552V15.736C42.5002 15.632 42.8602 15.552 43.2682 15.496C43.6842 15.432 44.1082 15.4 44.5402 15.4C45.6282 15.4 46.4202 15.676 46.9162 16.228C47.4122 16.78 47.6602 17.628 47.6602 18.772C47.6602 19.892 47.4122 20.732 46.9162 21.292C46.4202 21.844 45.6402 22.12 44.5762 22.12C44.1122 22.12 43.6602 22.08 43.2202 22C42.7882 21.912 42.4122 21.8 42.0922 21.664V18.4H44.4682L44.5162 19.204H43.0762V21.04C43.5402 21.2 44.0322 21.28 44.5522 21.28C45.0802 21.28 45.4962 21.2 45.8002 21.04C46.1042 20.88 46.3242 20.62 46.4602 20.26C46.6042 19.892 46.6762 19.396 46.6762 18.772C46.6762 18.124 46.6002 17.62 46.4482 17.26C46.2962 16.892 46.0482 16.632 45.7042 16.48C45.3682 16.32 44.8962 16.24 44.2882 16.24ZM45.6496 12.844V13.72H48.8776L48.8296 14.428H44.8216V12.844H45.6496ZM51.2056 22H50.2336L48.7456 15.52H49.7536L50.8216 20.62L52.1896 16.336V15.52H52.9216L54.3856 20.62L55.4416 15.52H56.4376L54.9616 22H53.9776L52.6456 17.44L51.2056 22ZM58.2461 16.312C58.2461 15.792 58.1461 15.404 57.9461 15.148C57.7541 14.884 57.4301 14.656 56.9741 14.464V13.672H60.2981V14.464H58.2221C58.6061 14.672 58.8701 14.928 59.0141 15.232C59.1581 15.536 59.2301 15.996 59.2301 16.612V20.608C59.2301 20.808 59.2741 20.956 59.3621 21.052C59.4581 21.148 59.6021 21.196 59.7941 21.196H60.4781V22H59.3501C59.0061 22 58.7341 21.896 58.5341 21.688C58.3421 21.472 58.2461 21.192 58.2461 20.848V16.312ZM62.5467 17.62H64.6947C65.2067 17.62 65.5667 17.516 65.7747 17.308C65.9827 17.092 66.0867 16.76 66.0867 16.312V15.52H67.0707V16.3C67.0707 17.22 66.7267 17.788 66.0387 18.004C66.4147 18.124 66.6667 18.32 66.7947 18.592C66.9307 18.856 66.9987 19.204 66.9987 19.636V22H66.0147V19.756C66.0147 19.412 65.9707 19.144 65.8827 18.952C65.8027 18.76 65.6627 18.624 65.4627 18.544C65.2707 18.464 64.9947 18.424 64.6347 18.424H62.5467V22H61.5627V15.52H62.5467V17.62ZM71.2199 16.24C70.4679 16.24 69.7759 16.344 69.1439 16.552V15.736C69.4479 15.632 69.7999 15.552 70.1999 15.496C70.5999 15.432 70.9999 15.4 71.3999 15.4C72.3119 15.4 72.9759 15.592 73.3919 15.976C73.8159 16.352 74.0279 16.952 74.0279 17.776V22H73.0439V19.024H70.9799C70.4279 19.024 70.0239 19.116 69.7679 19.3C69.5199 19.484 69.3959 19.78 69.3959 20.188C69.3959 20.588 69.5079 20.872 69.7319 21.04C69.9639 21.2 70.3399 21.28 70.8599 21.28C71.1719 21.28 71.4439 21.248 71.6759 21.184V22C71.3719 22.08 71.0119 22.12 70.5959 22.12C69.9399 22.12 69.4159 21.964 69.0239 21.652C68.6319 21.332 68.4359 20.844 68.4359 20.188C68.4359 19.564 68.6439 19.08 69.0599 18.736C69.4759 18.384 70.0959 18.208 70.9199 18.208H73.0439V17.704C73.0439 17.328 72.9879 17.036 72.8759 16.828C72.7639 16.62 72.5759 16.472 72.3119 16.384C72.0559 16.288 71.6919 16.24 71.2199 16.24ZM78.7072 15.4C79.3792 15.4 79.9352 15.52 80.3752 15.76C80.8232 15.992 81.1512 16.304 81.3592 16.696C81.5672 17.08 81.6712 17.508 81.6712 17.98V22H80.6872V17.992C80.6872 17.448 80.5272 17.02 80.2072 16.708C79.8952 16.396 79.3872 16.24 78.6832 16.24C77.8992 16.24 77.3312 16.46 76.9792 16.9C76.6272 17.332 76.4512 17.972 76.4512 18.82C76.4512 19.708 76.5952 20.34 76.8832 20.716C77.1792 21.092 77.6272 21.28 78.2272 21.28C78.5872 21.28 78.8632 21.248 79.0552 21.184V22C78.7912 22.08 78.4592 22.12 78.0592 22.12C77.2752 22.12 76.6472 21.848 76.1752 21.304C75.7032 20.752 75.4672 19.924 75.4672 18.82C75.4672 17.74 75.7352 16.9 76.2712 16.3C76.8152 15.7 77.6272 15.4 78.7072 15.4Z"
                                          fill="#333333"
                                        />
                                      </svg>
                                    )}
                                </Button>
                              </label>
                              <input
                                accept="image/*"
                                className="hidden"
                                id="main-image-file"
                                type="file"
                                name="productInfo['productImage']"
                                onChange={this.props.handleFileChange}
                              />
                            </React.Fragment>
                          )
                      ) : (
                          ""
                        )}
                    </div>
                  </div>
                  <div className="flex w-full mb-12 flex-col sm:flex-row ">
                    <div className="sm:w-1/5 mb-4 sm:mb-0 flex items-center mr-24 justify-start sm:justify-end">
                      <Trans i18nKey="product.product-type">Product type</Trans>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <Select
                        className="w-full"
                        classes={{ selectMenu: classes.selectMenu }}
                        value={this.state.type}
                        onChange={this.handleChange}
                        input={<BootstrapInput name="type" />}
                      >
                        {typeOption.map((option, index) => {
                          var key = "";
                          if (i18n.language.includes("en")) {
                            key = "en";
                          } else {
                            key = "th";
                          }
                          return (
                            <MenuItem key={index} value={option.value}>
                              {option[key]}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row w-full mb-12 justify-between sm:justify-start">
                    <div
                      className={
                        "sm:w-1/5 mb-4 sm:mb-0 flex items-center mr-24 justify-start sm:justify-end " +
                        (this.state.errorMessages.productName ? "text-red" : "")
                      }
                    >
                      <Trans i18nKey="product.product-form-input-product-name">
                        Product name
                      </Trans>{" "}
                      *
                    </div>
                    <div className="w-full sm:w-1/2">
                      <BootstrapTextInput
                        name="productName"
                        className={
                          "w-full " +
                          (this.state.errorMessages.productName
                            ? "product-error-color"
                            : "")
                        }
                        value={this.state.productName}
                        onChange={this.handleProductName}
                        error={true}
                      />
                      <div className="text-red mt-4">
                        {this.state.errorMessages.productName}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row w-full mb-12 justify-between sm:justify-start">
                    <div
                      className={
                        "sm:w-1/5 mb-4 sm:mb-0 flex items-center mr-24 justify-start sm:justify-end " +
                        (this.state.errorMessages.productName ? "text-red" : "")
                      }
                    >
                      <Trans i18nKey="product.product-cf">CF number</Trans>
                    </div>
                    <div className="w-full sm:w-1/2">
                      {this.state.isShowEditHashtag ? (
                        <>
                          <BootstrapTextInput
                            name="productHashtag"
                            className={
                              this.state.errorMessages.productHashtag
                                ? "product-error-color"
                                : ""
                            }
                            value={this.state.productHashtag}
                            onChange={this.handleProductHashtag}
                            error={true}
                          />
                          <IconButton
                            aria-label="confirm-hashtag"
                            onClick={() => this.onEditHashtagClick()}
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            aria-label="close-hashtag"
                            onClick={() => this.onEditHashtagClick(true)}
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      ) : (
                          <>
                            <span className="bg-grey-lighter">
                              #{this.state.productHashtag}
                            </span>
                            {this.state.storeInfo.config
                              .enabledEditProductHashtag && (
                                <IconButton
                                  aria-label="edit-hashtag"
                                  onClick={() => this.onEditHashtagClick()}
                                >
                                  <EditIcon />
                                </IconButton>
                              )}
                          </>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={card + "mt-16"}>
              <div className={cardHeader + "flex flex-row items-center"}>
                <Trans i18nKey="product.product-type">Product type</Trans>
                <div className="ml-auto flex flex-row items-center">
                  <div className="text-lg font-light">SKU : </div>
                  <Switch
                    classes={{
                      switchBase: classes.iOSSwitchBase,
                      bar: classes.iOSBar,
                      icon: classes.iOSIcon,
                      iconChecked: classes.iOSIconChecked,
                      checked: classes.iOSChecked,
                    }}
                    disableRipple
                    checked={this.state.enableSKU}
                    onChange={this.handleSwitch("enableSKU")}
                    value="enableSKU"
                  />
                </div>
              </div>
              <div className={cardContent + "flex flex-col"}>
                {this.renderInputByType(this.state.type)}
              </div>
            </div>
            <div className={card + "mt-16"}>
              <div className={cardHeader}>
                <Trans i18nKey="product.size-chart">Size chart</Trans>
              </div>
              <div className={cardContent + "flex flex-col"}>
                <div className="flex w-full">
                  <div className="w-1/2 sm:w-1/5 flex items-center justify-end mr-24">
                    <Trans i18nKey="product.size-chart-image">
                      Size chart image
                    </Trans>
                  </div>
                  <div className="w-full">
                    <Switch
                      classes={{
                        switchBase: classes.iOSSwitchBase,
                        bar: classes.iOSBar,
                        icon: classes.iOSIcon,
                        iconChecked: classes.iOSIconChecked,
                        checked: classes.iOSChecked,
                      }}
                      disableRipple
                      checked={this.state.enableSizeTable}
                      onChange={this.handleSwitch("enableSizeTable")}
                    />
                  </div>
                </div>
                <div className="flex w-full">
                  <div className="w-1/2 sm:w-1/5 flex items-center justify-end mr-24" />
                  <div className="w-full">
                    {this.state.enableSizeTable ? (
                      this.state.sizeTableImage ? (
                        this.state.sizeTableImage === "LOADING" ? (
                          <CircularProgress className="pink m-24" />
                        ) : (
                            <div className="relative w-3/4">
                              <div className="absolute" style={{ right: 0 }}>
                                <IconButton
                                  color="primary"
                                  aria-label="close"
                                  value="productInfo['productImage']"
                                  className="p-6 lg:p-8 white"
                                  onClick={this.removeSizeTableImage}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </div>
                              <img
                                className="border border-solid rounded cursor-pointer w-full"
                                src={this.state.sizeTableImage}
                                alt="Main"
                                component="span"
                              />
                            </div>
                          )
                      ) : (
                          <React.Fragment>
                            <label
                              htmlFor="sizeTableImage"
                              className="cursor-pointer"
                            >
                              <Button component="span">
                                {i18n.language.includes("en") ? (
                                  <svg
                                    width="102"
                                    height="36"
                                    viewBox="0 0 102 36"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <rect
                                      x="0.5"
                                      y="0.5"
                                      width="101"
                                      height="35"
                                      rx="4.5"
                                      fill="white"
                                      stroke="#999999"
                                      strokeDasharray="5 5"
                                    />
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M28.7009 16.285C28.0788 13.2662 25.307 11 21.9773 11C19.3336 11 17.0375 12.435 15.894 14.535C13.1406 14.815 11 17.0462 11 19.75C11 22.6462 13.4607 25 16.4886 25H28.3807C30.9055 25 32.9545 23.04 32.9545 20.625C32.9545 18.315 31.0793 16.4425 28.7009 16.285ZM28.3809 23.25H16.4888C14.4672 23.25 12.8298 21.6838 12.8298 19.75C12.8298 17.9563 14.2294 16.46 16.0863 16.2763L17.0652 16.18L17.5225 15.3488C18.3916 13.7475 20.093 12.75 21.9775 12.75C24.3742 12.75 26.4416 14.3775 26.9081 16.6263L27.1825 17.9388L28.5821 18.035C30.0092 18.1225 31.1252 19.2688 31.1252 20.625C31.1252 22.0688 29.8903 23.25 28.3809 23.25ZM20.6512 18.8755H18.3186L21.9776 15.3755L25.6367 18.8755H23.3041V21.5005H20.6512V18.8755Z"
                                      fill="#BDBDBD"
                                    />
                                    <path
                                      d="M47.2586 21.28C47.9866 21.28 48.5426 21.104 48.9266 20.752C49.3186 20.4 49.5146 19.876 49.5146 19.18V14.272H50.4986V19.168C50.4986 20.128 50.2186 20.86 49.6586 21.364C49.1066 21.868 48.3066 22.12 47.2586 22.12C46.2026 22.12 45.3946 21.868 44.8346 21.364C44.2826 20.86 44.0066 20.128 44.0066 19.168V14.272H44.9906V19.18C44.9906 19.876 45.1866 20.4 45.5786 20.752C45.9706 21.104 46.5306 21.28 47.2586 21.28ZM57.5773 19.072C57.5773 20.08 57.3533 20.84 56.9053 21.352C56.4573 21.864 55.8213 22.12 54.9973 22.12C54.2533 22.12 53.6213 21.94 53.1013 21.58V24.592H52.1173V16.312H52.9573L53.0293 16.912C53.2933 16.664 53.5813 16.484 53.8933 16.372C54.2133 16.252 54.5853 16.192 55.0093 16.192C55.8413 16.192 56.4773 16.424 56.9173 16.888C57.3573 17.344 57.5773 18.072 57.5773 19.072ZM54.7333 21.328C55.3733 21.328 55.8413 21.148 56.1373 20.788C56.4413 20.42 56.5933 19.848 56.5933 19.072C56.5933 18.328 56.4533 17.796 56.1733 17.476C55.8933 17.148 55.4213 16.984 54.7573 16.984C54.0773 16.984 53.5253 17.212 53.1013 17.668V20.764C53.5253 21.14 54.0693 21.328 54.7333 21.328ZM60.0037 13.912V20.668C60.0037 20.9 60.0397 21.064 60.1117 21.16C60.1917 21.248 60.3197 21.292 60.4957 21.292C60.6797 21.292 60.8597 21.268 61.0357 21.22V22C60.8277 22.08 60.5677 22.12 60.2557 22.12C59.8557 22.12 59.5477 22.016 59.3317 21.808C59.1237 21.592 59.0197 21.248 59.0197 20.776V13.912H60.0037ZM64.237 16.192C66.133 16.192 67.081 17.18 67.081 19.156C67.081 20.14 66.849 20.88 66.385 21.376C65.929 21.872 65.213 22.12 64.237 22.12C63.261 22.12 62.541 21.872 62.077 21.376C61.621 20.88 61.393 20.14 61.393 19.156C61.393 17.18 62.341 16.192 64.237 16.192ZM64.237 21.28C64.909 21.28 65.385 21.112 65.665 20.776C65.953 20.44 66.097 19.9 66.097 19.156C66.097 18.412 65.953 17.872 65.665 17.536C65.377 17.2 64.901 17.032 64.237 17.032C63.573 17.032 63.097 17.2 62.809 17.536C62.521 17.872 62.377 18.412 62.377 19.156C62.377 19.9 62.517 20.44 62.797 20.776C63.085 21.112 63.565 21.28 64.237 21.28ZM72.1909 21.352C71.9429 21.616 71.6389 21.812 71.2789 21.94C70.9269 22.06 70.4949 22.12 69.9829 22.12C69.4069 22.12 68.9269 21.972 68.5429 21.676C68.1669 21.38 67.9789 20.956 67.9789 20.404C67.9789 19.852 68.1589 19.42 68.5189 19.108C68.8789 18.788 69.4309 18.628 70.1749 18.628H72.1549V18.28C72.1549 17.96 72.1109 17.712 72.0229 17.536C71.9349 17.352 71.7749 17.22 71.5429 17.14C71.3109 17.06 70.9749 17.02 70.5349 17.02C69.8709 17.02 69.2389 17.124 68.6389 17.332V16.516C69.2069 16.3 69.8829 16.192 70.6669 16.192C71.4829 16.192 72.0909 16.36 72.4909 16.696C72.8909 17.024 73.0909 17.552 73.0909 18.28V22H72.2629L72.1909 21.352ZM70.1989 19.384C69.7589 19.384 69.4389 19.468 69.2389 19.636C69.0469 19.796 68.9509 20.052 68.9509 20.404C68.9509 20.732 69.0589 20.968 69.2749 21.112C69.4909 21.248 69.8109 21.316 70.2349 21.316C71.0429 21.316 71.6829 21.04 72.1549 20.488V19.384H70.1989ZM74.4711 19.24C74.4711 18.24 74.7031 17.484 75.1671 16.972C75.6311 16.452 76.2751 16.192 77.0991 16.192C77.4671 16.192 77.7991 16.236 78.0951 16.324C78.3911 16.412 78.6751 16.548 78.9471 16.732V13.912H79.9311V22H79.0911L79.0191 21.4C78.7551 21.648 78.4631 21.832 78.1431 21.952C77.8311 22.064 77.4631 22.12 77.0391 22.12C76.2071 22.12 75.5711 21.892 75.1311 21.436C74.6911 20.972 74.4711 20.24 74.4711 19.24ZM77.3151 16.984C76.6751 16.984 76.2031 17.168 75.8991 17.536C75.6031 17.896 75.4551 18.464 75.4551 19.24C75.4551 19.984 75.5951 20.52 75.8751 20.848C76.1551 21.168 76.6271 21.328 77.2911 21.328C77.9711 21.328 78.5231 21.1 78.9471 20.644V17.548C78.5231 17.172 77.9791 16.984 77.3151 16.984Z"
                                      fill="#333333"
                                    />
                                  </svg>
                                ) : (
                                    <svg
                                      className="cursor-pointer"
                                      width="102"
                                      height="36"
                                      viewBox="0 0 102 36"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <rect
                                        x="0.5"
                                        y="0.5"
                                        width="101"
                                        height="35"
                                        rx="4.5"
                                        fill="white"
                                        stroke="#999999"
                                        strokeDasharray="5 5"
                                      />
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M28.7009 16.285C28.0788 13.2662 25.307 11 21.9773 11C19.3336 11 17.0375 12.435 15.894 14.535C13.1406 14.815 11 17.0462 11 19.75C11 22.6462 13.4607 25 16.4886 25H28.3807C30.9055 25 32.9545 23.04 32.9545 20.625C32.9545 18.315 31.0793 16.4425 28.7009 16.285ZM28.3809 23.25H16.4888C14.4672 23.25 12.8298 21.6838 12.8298 19.75C12.8298 17.9563 14.2294 16.46 16.0863 16.2763L17.0652 16.18L17.5225 15.3488C18.3916 13.7475 20.093 12.75 21.9775 12.75C24.3742 12.75 26.4416 14.3775 26.9081 16.6263L27.1825 17.9388L28.5821 18.035C30.0092 18.1225 31.1252 19.2688 31.1252 20.625C31.1252 22.0688 29.8903 23.25 28.3809 23.25ZM20.6512 18.8755H18.3186L21.9776 15.3755L25.6367 18.8755H23.3041V21.5005H20.6512V18.8755Z"
                                        fill="#BDBDBD"
                                      />
                                      <path
                                        d="M44.2882 16.24C43.5202 16.24 42.8202 16.344 42.1882 16.552V15.736C42.5002 15.632 42.8602 15.552 43.2682 15.496C43.6842 15.432 44.1082 15.4 44.5402 15.4C45.6282 15.4 46.4202 15.676 46.9162 16.228C47.4122 16.78 47.6602 17.628 47.6602 18.772C47.6602 19.892 47.4122 20.732 46.9162 21.292C46.4202 21.844 45.6402 22.12 44.5762 22.12C44.1122 22.12 43.6602 22.08 43.2202 22C42.7882 21.912 42.4122 21.8 42.0922 21.664V18.4H44.4682L44.5162 19.204H43.0762V21.04C43.5402 21.2 44.0322 21.28 44.5522 21.28C45.0802 21.28 45.4962 21.2 45.8002 21.04C46.1042 20.88 46.3242 20.62 46.4602 20.26C46.6042 19.892 46.6762 19.396 46.6762 18.772C46.6762 18.124 46.6002 17.62 46.4482 17.26C46.2962 16.892 46.0482 16.632 45.7042 16.48C45.3682 16.32 44.8962 16.24 44.2882 16.24ZM45.6496 12.844V13.72H48.8776L48.8296 14.428H44.8216V12.844H45.6496ZM51.2056 22H50.2336L48.7456 15.52H49.7536L50.8216 20.62L52.1896 16.336V15.52H52.9216L54.3856 20.62L55.4416 15.52H56.4376L54.9616 22H53.9776L52.6456 17.44L51.2056 22ZM58.2461 16.312C58.2461 15.792 58.1461 15.404 57.9461 15.148C57.7541 14.884 57.4301 14.656 56.9741 14.464V13.672H60.2981V14.464H58.2221C58.6061 14.672 58.8701 14.928 59.0141 15.232C59.1581 15.536 59.2301 15.996 59.2301 16.612V20.608C59.2301 20.808 59.2741 20.956 59.3621 21.052C59.4581 21.148 59.6021 21.196 59.7941 21.196H60.4781V22H59.3501C59.0061 22 58.7341 21.896 58.5341 21.688C58.3421 21.472 58.2461 21.192 58.2461 20.848V16.312ZM62.5467 17.62H64.6947C65.2067 17.62 65.5667 17.516 65.7747 17.308C65.9827 17.092 66.0867 16.76 66.0867 16.312V15.52H67.0707V16.3C67.0707 17.22 66.7267 17.788 66.0387 18.004C66.4147 18.124 66.6667 18.32 66.7947 18.592C66.9307 18.856 66.9987 19.204 66.9987 19.636V22H66.0147V19.756C66.0147 19.412 65.9707 19.144 65.8827 18.952C65.8027 18.76 65.6627 18.624 65.4627 18.544C65.2707 18.464 64.9947 18.424 64.6347 18.424H62.5467V22H61.5627V15.52H62.5467V17.62ZM71.2199 16.24C70.4679 16.24 69.7759 16.344 69.1439 16.552V15.736C69.4479 15.632 69.7999 15.552 70.1999 15.496C70.5999 15.432 70.9999 15.4 71.3999 15.4C72.3119 15.4 72.9759 15.592 73.3919 15.976C73.8159 16.352 74.0279 16.952 74.0279 17.776V22H73.0439V19.024H70.9799C70.4279 19.024 70.0239 19.116 69.7679 19.3C69.5199 19.484 69.3959 19.78 69.3959 20.188C69.3959 20.588 69.5079 20.872 69.7319 21.04C69.9639 21.2 70.3399 21.28 70.8599 21.28C71.1719 21.28 71.4439 21.248 71.6759 21.184V22C71.3719 22.08 71.0119 22.12 70.5959 22.12C69.9399 22.12 69.4159 21.964 69.0239 21.652C68.6319 21.332 68.4359 20.844 68.4359 20.188C68.4359 19.564 68.6439 19.08 69.0599 18.736C69.4759 18.384 70.0959 18.208 70.9199 18.208H73.0439V17.704C73.0439 17.328 72.9879 17.036 72.8759 16.828C72.7639 16.62 72.5759 16.472 72.3119 16.384C72.0559 16.288 71.6919 16.24 71.2199 16.24ZM78.7072 15.4C79.3792 15.4 79.9352 15.52 80.3752 15.76C80.8232 15.992 81.1512 16.304 81.3592 16.696C81.5672 17.08 81.6712 17.508 81.6712 17.98V22H80.6872V17.992C80.6872 17.448 80.5272 17.02 80.2072 16.708C79.8952 16.396 79.3872 16.24 78.6832 16.24C77.8992 16.24 77.3312 16.46 76.9792 16.9C76.6272 17.332 76.4512 17.972 76.4512 18.82C76.4512 19.708 76.5952 20.34 76.8832 20.716C77.1792 21.092 77.6272 21.28 78.2272 21.28C78.5872 21.28 78.8632 21.248 79.0552 21.184V22C78.7912 22.08 78.4592 22.12 78.0592 22.12C77.2752 22.12 76.6472 21.848 76.1752 21.304C75.7032 20.752 75.4672 19.924 75.4672 18.82C75.4672 17.74 75.7352 16.9 76.2712 16.3C76.8152 15.7 77.6272 15.4 78.7072 15.4Z"
                                        fill="#333333"
                                      />
                                    </svg>
                                  )}
                              </Button>
                            </label>
                            <input
                              accept="image/*"
                              className="hidden"
                              id="sizeTableImage"
                              type="file"
                              onChange={this.uploadSizeTableImage}
                            />
                          </React.Fragment>
                        )
                    ) : (
                        ""
                      )}
                  </div>
                </div>

                {this.state.enableSizeTable ? (
                  <div className="flex w-full" />
                ) : (
                    ""
                  )}
              </div>
            </div>
            <div className={card + "mt-16"}>
              <div className={cardHeader}>
                <Trans i18nKey="product.delivery-settings">
                  Delivery Settings
                </Trans>
              </div>
              <div className={cardContent + "flex flex-col"}>
                <div className="flex w-full">
                  <div className="w-3/4 sm:w-1/5 flex items-center justify-end mr-24">
                    <Trans i18nKey="product.disable-address">
                      Enable On Delivery Address
                    </Trans>
                  </div>
                  <div className="w-full">
                    <Switch
                      classes={{
                        switchBase: classes.iOSSwitchBase,
                        bar: classes.iOSBar,
                        icon: classes.iOSIcon,
                        iconChecked: classes.iOSIconChecked,
                        checked: classes.iOSChecked,
                      }}
                      disableRipple
                      checked={!this.state.disableAddress}
                      onChange={this.handleSwitch("disableAddress")}
                    />
                  </div>
                </div>
                <div className="flex w-full mt-12">
                  <div className="w-3/4 sm:w-1/5 flex items-center justify-start mr-24">
                    <Trans i18nKey="product.enable-shipping">
                      Enable Product Shipping Rate
                    </Trans>
                  </div>
                  <div className="w-full">
                    <Switch
                      classes={{
                        switchBase: classes.iOSSwitchBase,
                        bar: classes.iOSBar,
                        icon: classes.iOSIcon,
                        iconChecked: classes.iOSIconChecked,
                        checked: classes.iOSChecked,
                      }}
                      disableRipple
                      checked={this.state.enableShippingRate}
                      onChange={this.handleSwitch("enableShippingRate")}
                    />
                  </div>
                </div>
                {this.state.enableShippingRate ? (
                  <div className="flex flex-col sm:ml-20">
                    <div className="flex flex-col sm:flex-row w-full mt-12">
                      <div className="w-full sm:w-1/5 flex items-center mr-12">
                        <Trans i18nKey="product.first-piece-title">
                          First Piece
                        </Trans>
                      </div>
                      <div className="w-full sm:w-1/4 mt-12 sm:mt-0 flex flex-row">
                        <span className={"mr-8 flex items-center"}>
                          <Trans i18nKey="products.product-table-title-price">
                            Price
                          </Trans>
                        </span>
                        <BootstrapTextInput
                          name="shippingRate['firstpiece']"
                          className={"w-full text-right"}
                          type="number"
                          value={Number(
                            this.state.shippingRate.firstpiece
                          ).toString()}
                          onChange={(e) =>
                            this.handleObjectChange(
                              e,
                              "shippingRate",
                              "firstpiece"
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row w-full mt-12">
                      <div className="w-full sm:w-1/5 flex items-center mr-12">
                        <Trans i18nKey="product.additional-piece-title">
                          Additional Piece
                        </Trans>
                      </div>
                      <div className="w-full sm:w-1/4 mt-12 sm:mt-0 flex flex-row">
                        <span className={"mr-8 flex items-center"}>
                          <Trans i18nKey="products.product-table-title-price">
                            Price
                          </Trans>
                        </span>
                        <BootstrapTextInput
                          name="shippingRate['nextpiece']"
                          className={"w-full text-right"}
                          type="number"
                          value={Number(
                            this.state.shippingRate.nextpiece
                          ).toString()}
                          onChange={(e) =>
                            this.handleObjectChange(
                              e,
                              "shippingRate",
                              "nextpiece"
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                    ""
                  )}
              </div>
            </div>
            <div className={card + "mt-16"}>
              <div className={cardHeader}>m.me link</div>
              <div className={cardContent + "flex flex-col"}>
                <div className="flex flex-row mt-16">
                  <div className="mx-8">m.me link : </div>
                  <div className="border-b-1 mx-8 px-8 w-3/5">
                    {this.state.mmelink}
                  </div>
                  <CopyToClipBoard
                    text={this.state.mmelink}
                    onCopy={() => this.props.showCopyMessage()}
                  >
                    <FileCopyIcon className="text-grey-darker cursor-pointer mx-8" />
                  </CopyToClipBoard>
                </div>
              </div>
            </div>
            <div className="sticky">
              <div className="flex justify-end mt-16">
                {this.props.productIDFromLive ? (
                  <div
                    className="flex items-center mr-12 cursor-pointer"
                    onClick={() => {
                      this.props.onCancelBtnClick();
                      this.props.pushTrackingData(
                        "Click",
                        "Cancel product button"
                      );
                    }}
                  >
                    <Trans i18nKey="main.cancel-btn">Cancel</Trans>
                  </div>
                ) : (
                    ""
                  )}
                <Button
                  href="/platform/products"
                  style={{ borderRadius: "30px" }}
                >
                  <Trans i18nKey="main.back-btn">Back</Trans>
                </Button>
                <ArisButton
                  className="mx-6 py-12 px-24"
                  onClick={() =>
                    this.props.productID === "new"
                      ? this.onConfirm()
                      : this.openDialog()
                  }
                  disabled={this.state.disableButton}
                >
                  <span className="flex">
                    {this.state.disableButton ? (
                      <CircularProgress className="text-white" size="1em" />
                    ) : (
                        <Trans i18nKey="main.save-btn">Save</Trans>
                      )}
                  </span>
                </ArisButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(NewProductDetails));
