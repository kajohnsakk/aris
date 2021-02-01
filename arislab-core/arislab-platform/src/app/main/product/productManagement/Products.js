import React, { Component } from "react";
import { FusePageSimple } from "@fuse";
import { withStyles, Icon, Button } from "@material-ui/core";
import withReducer from "app/store/withReducer";
import ProductsTable from "./ProductsTable";
import DeleteProductDialog from "./DeleteProductDialog";
import reducer from "../store/reducers";
import { Link, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import connect from "react-redux/es/connect/connect";
import * as Actions from "../store/actions";
import { ArisButton } from "../../components/Components";

import Cookies from "js-cookie";
import { UtilityManager } from "../../modules/UtilityManager";
import UtilityFunction from "../../modules/UtilityFunction";
import { Trans, withTranslation } from "react-i18next";
import i18n from "../../../i18n";
import "./product.css";
import classnames from "classnames";

const styles = (theme) => ({
  card: {
    backgroundColor: "#fff",
    maxWidth: "100%",
    [theme.breakpoints.up("lg")]: {
      paddingBottom: theme.spacing.unit,
      overflow: "hidden",
      boxShadow:
        "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
      borderRadius: "4px",
      border: "2px solid transparent",
    },
  },
  cardContent: {
    background: "#ffffff",
    padding: "0px",
    [theme.breakpoints.up("lg")]: {
      padding: theme.spacing.unit * 2,
    },
  },
  header: {
    background: "#fbfbfb",
    borderBottom: "solid 2px #ededed",
    color: "#8d9095",
    fontWeight: "bolder",
  },
  content: {
    background: "#ffffff",
    paddingTop: 5,
    paddingBottom: 5,
  },
  button: {
    fontFamily: "kanit",
    fontWeight: 300,
    background:
      "linear-gradient(to right, rgba(237,53,144,1) 0%, rgba(241,70,84,1) 50%, rgba(252,177,78,1) 100%)",
    color: "#ffffff",
    border: "0px",
    textTransform: "none",
    "&:hover": {
      background:
        "linear-gradient(90deg, rgba(235, 77, 156, 0.76) 0%, rgb(240, 89, 101) 50%, rgb(253, 183, 92) 100%)",
      color: "#ffffff",
      border: "0px",
    },
  },
  invertedButton: {
    background: "#ffffff",
    color: "#e83490",
    border: "1px solid #e83490",
    "&:hover": {
      background: "#ffffff",
      color: "#e83490",
      border: "1px solid #e83490",
    },
    "&:disabled": {
      background: "rgba(0, 0, 0, 0.12)",
      color: "#e83490",
      border: "1px solid rgba(0, 0, 0, 0.12)",
      cursor: "auto",
    },
  },
});

class Products extends Component {
  state = {
    auth0_uid: "",
    email: "",
    storeID: "",
    isDisplayProductDeleted: false,
    selectedProducts: [],
    deleteItems: false,
  };
  pageCategory = "Products";

  componentDidMount() {
    let cookieValue = Cookies.get("auth0_uid");

    UtilityManager.getInstance()
      .storeInfoLookup(cookieValue)
      .then((resultStoreInfo) => {
        this.setState({
          auth0_uid: resultStoreInfo[0].auth0_uid,
          email: resultStoreInfo[0].email,
          storeID: resultStoreInfo[0].storeID,
        });

        UtilityFunction.tagManagerPushDataLayer(
          this.pageCategory,
          "View",
          "View products page",
          UtilityFunction.getExistValue(
            resultStoreInfo[0].auth0_uid,
            "Anonymous"
          )
        );
      });
  }

  componentWillUnmount() {
    this.pushTrackingData("Leave", "Leave products page");
  }

  pushTrackingData = (pageAction, pageLabel) => {
    let auth0_uid = UtilityFunction.getExistValue(
      this.state.auth0_uid,
      "Anonymous"
    );
    UtilityFunction.tagManagerPushDataLayer(
      this.pageCategory,
      pageAction,
      pageLabel,
      auth0_uid
    );
  };

  handleOnClick = () => {
    this.pushTrackingData("Click", "Delete product button");
    this.setState({
      isDisplayProductDeleted: true,
    });
  };

  getSelectedProducts = (products) => {
    this.setState({
      selectedProducts: products,
    });
  };

  deleteProducts = (event) => {
    this.pushTrackingData("Delete", "Product");
    this.props.deleteProductAPI(this.state.selectedProducts);
    this.setState({
      isDisplayProductDeleted: false,
    });
  };

  setDeleteItemsTrue = (event) => {
    this.setState({
      deleteItems: true,
    });
  };

  cancelDelete = (event) => {
    this.setState({
      isDisplayProductDeleted: false,
    });
  };

  render() {
    const { classes, searchText, setSearchText } = this.props;
    const { storeID } = this.state;

    return (
      <FusePageSimple
        classes={{}}
        content={
          <div className="my-32 lg:px-16">
            <div className="py-16 px-36 bg-white rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex flex-1">
                  <div className="text-4xl font-bold mt-6">
                    <Trans i18nKey="products.products-title">Products</Trans>
                  </div>
                </div>
                <div className="flex flex-1 h-32 justify-end">
                  <div className="flex items-center border border-2 border-teal py-2 rounded-full h-32">
                    <Icon className="ml-8 mr-4" color="action">
                      search
                    </Icon>
                    <input
                      className="appearance-none bg-transparent border-none w-full text-grey-darker mr-3 py-1 px-2 leading-tight focus:outline-none"
                      type="text"
                      placeholder={i18n.t(
                        "orders.order-input-search-placeholder"
                      )}
                      value={searchText}
                      onChange={setSearchText}
                    />
                  </div>
                  <Button
                    component={Link}
                    to="/platform/products/new"
                    className={classnames(
                      classes.button,
                      "mx-6 px-16 rounded-full"
                    )}
                    onClick={() => {
                      this.pushTrackingData("Click", "Create product button");
                      this.pushTrackingData("Click", "16. Create Product");
                    }}
                  >
                    <span className="hidden lg:flex">
                      <Trans i18nKey="products.product-button-add-new">
                        Add Product
                      </Trans>
                    </span>
                    <span className="flex lg:hidden">
                      <Trans i18nKey="main.new-btn">Add</Trans>
                    </span>
                  </Button>
                  <ArisButton
                    secondary
                    className="px-16"
                    onClick={this.handleOnClick}
                    disabled={this.state.selectedProducts.length === 0}
                  >
                    <span className="hidden lg:flex">
                      <Trans i18nKey="products.product-button-delete-items">
                        Delete product(s)
                      </Trans>
                    </span>
                    <span className="flex lg:hidden">
                      <Trans i18nKey="main.delete-btn">Delete</Trans>
                    </span>
                  </ArisButton>
                </div>
              </div>
              {storeID !== "" ? (
                <ProductsTable
                  storeID={storeID}
                  getSelectedProducts={this.getSelectedProducts}
                />
              ) : null}
            </div>

            {this.state.isDisplayProductDeleted ? (
              <DeleteProductDialog
                selectedProducts={this.state.selectedProducts}
                deleteItems={this.state.deleteItems}
                setDeleteItemsTrue={this.setDeleteItemsTrue}
                deleteProducts={this.deleteProducts}
                cancelDelete={this.cancelDelete}
              />
            ) : null}
          </div>
        }
        innerScroll
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setSearchText: Actions.setProductsSearchText,
      deleteProductAPI: Actions.deleteProductAPI,
    },
    dispatch
  );
}

function mapStateToProps({ eCommerceApp }) {
  return {
    searchText: eCommerceApp.products.searchText,
  };
}

export default withReducer(
  "eCommerceApp",
  reducer
)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Products))
    )
  )
);
