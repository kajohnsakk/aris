import React from "react";
import { withStyles, Card, CircularProgress } from "@material-ui/core";

import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import connect from "react-redux/es/connect/connect";
import withReducer from "../../../../store/withReducer";
import * as Actions from "../../store/actions";
import reducer from "../../store/reducers";
import Classnames from "classnames";

import styles from "../../../live/liveEvent/styles/styles";

import BusinessProfile from "./BusinessProfile/BusinessProfile";
import PaymentInfo from "./PaymentInfo/PaymentInfo";
import PackagePaymentInfo from "./PaymentInfo/PackagePaymentInfo";

import _ from "@lodash";

class StorePackageCard extends React.Component {
  state = {
    storeID: "",
    businessProfile: {},
    packagePaymentInfoError: false,
  };

  componentDidMount() {
    this.props.pushTrackingData("View", "View " + this.props.dataLabel);
    this.setState({ storeID: this.props.storeID }, () => {
      this.props.getBusinessProfile({
        storeID: this.state.storeID,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.storeID !== prevProps.storeID) {
      this.setState({ storeID: this.props.storeID }, () => {
        this.props.getBusinessProfile({
          storeID: this.state.storeID,
        });
      });
    }

    if (
      this.props.businessProfile &&
      !_.isEqual(this.props.businessProfile, prevProps.businessProfile)
    ) {
      this.setState({ businessProfile: { ...this.props.businessProfile } });
    }

    if (
      !this.state.businessProfile.hasOwnProperty("storeID") &&
      this.props.businessProfile
    ) {
      this.setState({ businessProfile: { ...this.props.businessProfile } });
    }

    if (
      this.props.packagePaymentInfoError !== this.state.packagePaymentInfoError
    ) {
      this.setState({
        packagePaymentInfoError: this.props.packagePaymentInfoError,
      });
    }
  }

  handleInputChange = (event) => {
    this.setState(
      _.set(
        { ...this.state },
        event.target.name,
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
      )
    );
  };

  saveBusinessProfileSections = (sections, storeInfo) => {
    let updateData = {};
    if (sections === "PAYMENT_INFO") {
      this.props.pushTrackingData("Update", "Update payment info");
      updateData.paymentInfo = this.state.businessProfile.storeInfo.paymentInfo;
    } else if (sections === "PACKAGE_PAYMENT_INFO") {
      this.props.pushTrackingData("Update", "Update package payment info");
      updateData.storePackagePaymentInfo = this.state.businessProfile.storeInfo.storePackagePaymentInfo;
    }

    this.props.saveBusinessProfileSections(storeInfo, {
      storeID: this.state.storeID,
      sections: sections,
    });

    setTimeout(() => {
      this.props.getBusinessProfile({
        storeID: this.state.storeID,
      });
    }, 1000);
  };

  render() {
    const { storeID, businessProfile, packagePaymentInfoError } = this.state;
    const { classes } = this.props;

    return businessProfile.hasOwnProperty("storeID") ? (
      <Card className={Classnames("flex flex-1 lg:mx-0 flex-col")}>
        <div className="flex flex-1 flex-col py-8">
          <BusinessProfile
            storeID={storeID}
            businessProfile={businessProfile}
            storeBusinessProfile={{
              ...businessProfile.storeInfo.businessProfile,
            }}
            companyInfo={businessProfile.storeInfo.companyInfo}
            personalInfo={businessProfile.storeInfo.personalInfo}
            useBusinessFeatures={
              businessProfile.storeInfo.config.useBusinessFeatures
            }
            handleInputChange={this.handleInputChange}
            pushTrackingData={this.props.pushTrackingData}
            saveBusinessProfileSections={this.saveBusinessProfileSections}
          />
        </div>

        <div
          className={"flex flex-1 flex-col py-8"}
          id="package-payment-info"
          style={packagePaymentInfoError ? { border: "1px #F00 solid" } : {}}
        >
          <PackagePaymentInfo
            storeID={storeID}
            storePackagePaymentInfo={
              businessProfile.storeInfo.storePackagePaymentInfo
            }
            useBusinessFeatures={
              this.props.businessProfile
                ? this.props.businessProfile.storeInfo.config
                    .useBusinessFeatures
                : false
            }
            packagePaymentInfoError={packagePaymentInfoError}
            handleInputChange={this.handleInputChange}
            pushTrackingData={this.props.pushTrackingData}
            disappearPackagePaymentInfoError={
              this.props.disappearPackagePaymentInfoError
            }
            saveBusinessProfileSections={this.saveBusinessProfileSections}
          />
        </div>
      </Card>
    ) : (
      <div className={Classnames(classes.loadingPage, "my-64")}>
        <CircularProgress className={classes.highlightText} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBusinessProfile: Actions.getBusinessProfile,
      saveBusinessProfileSections: Actions.saveBusinessProfileSections,
    },
    dispatch
  );
}

function mapStateToProps({ StorePackage }) {
  return {
    businessProfile: StorePackage.businessProfile,
  };
}

export default withReducer("StorePackage", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(StorePackageCard)
    )
  )
);
