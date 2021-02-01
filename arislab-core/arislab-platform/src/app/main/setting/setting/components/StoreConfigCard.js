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

import SaleChannels from "./SaleChannels/SaleChannels";
import DeliveryInfo from "./DeliveryInfo/DeliveryInfo";
import StoreConfig from "./StoreConfig/StoreConfig";

import _ from "@lodash";

class StoreConfigCard extends React.Component {
  state = {
    storeID: "",
    businessProfile: {},
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
      !_.isEqual(this.state.businessProfile, this.props.businessProfile)
    ) {
      this.setState({ businessProfile: this.props.businessProfile });
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

  saveBusinessProfileSections = (sections, data) => {
    let updateData = {};
    if (sections === "SALE_CHANNELS") {
      this.props.pushTrackingData("Update", "Update sale channels info");
      updateData.businessProfile = this.state.businessProfile.storeInfo.businessProfile;
    } else if (sections === "DELIVERY_INFO") {
      this.props.pushTrackingData("Update", "Update delivery info");
      updateData.delivery = this.state.businessProfile.storeInfo.delivery;
    } else if (sections === "STORE_CONFIG") {
      this.props.pushTrackingData("Update", "Update store config");
      updateData.config = data
        ? data
        : this.state.businessProfile.storeInfo.config;
    }

    this.props.saveBusinessProfileSections(updateData, {
      storeID: this.state.storeID,
      sections: sections,
    });
  };

  setSelectedFacebookPageDataToStore = (facebookName, facebookLogo) => {
    let businessProfile = {
      ...this.state.businessProfile.storeInfo.businessProfile,
    };
    businessProfile.accountDetails.businessName = facebookName;
    businessProfile.logo = facebookLogo;

    this.setState(
      _.set(
        { ...this.state },
        "businessProfile.storeInfo.businessProfile",
        businessProfile
      )
    );
  };

  render() {
    const { storeID, businessProfile } = this.state;
    const { classes } = this.props;

    return businessProfile.hasOwnProperty("storeID") ? (
      <Card className={Classnames("flex flex-1 lg:mx-0 flex-col")}>
        <div className="flex flex-1 flex-col py-8 mb-24">
          <SaleChannels
            storeID={storeID}
            storeBusinessProfile={{
              ...businessProfile.storeInfo.businessProfile,
            }}
            pushTrackingData={this.props.pushTrackingData}
            setSelectedFacebookPageDataToStore={
              this.setSelectedFacebookPageDataToStore
            }
            saveBusinessProfileSections={this.saveBusinessProfileSections}
          />
        </div>

        <div className="flex flex-1 flex-col py-8 mb-24">
          <DeliveryInfo
            storeID={storeID}
            deliveryInfo={{ ...businessProfile.storeInfo.delivery }}
            handleInputChange={this.handleInputChange}
            pushTrackingData={this.props.pushTrackingData}
            saveBusinessProfileSections={this.saveBusinessProfileSections}
          />
        </div>

        <div className="flex flex-1 flex-col py-8 mb-24">
          <StoreConfig
            storeID={storeID}
            configInfo={{ ...businessProfile.storeInfo.config }}
            handleInputChange={this.handleInputChange}
            pushTrackingData={this.props.pushTrackingData}
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

function mapStateToProps({ StoreConfig }) {
  return {
    businessProfile: StoreConfig.businessProfile,
  };
}

export default withReducer("StoreConfig", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(StoreConfigCard)
    )
  )
);
