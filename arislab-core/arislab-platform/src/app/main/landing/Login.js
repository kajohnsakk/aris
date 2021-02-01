import React, { Component } from "react";

import withReducer from "app/store/withReducer";
import reducer from "../setting/store/reducers";
import * as Actions from "../setting/store/actions";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import _ from "@lodash";
import "../setting/storeManagement/StoreManagement.css";
import Cookies from "js-cookie";
import { UtilityManager } from "../modules/UtilityManager";
// import SaveIcon from '@material-ui/icons/Save';
// import ImageIcon from '@material-ui/icons/Image';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { ApiService } from "../../main/modules/ApiService";
import OTPInput, { ResendOTP } from "otp-input-react";

import { Trans, withTranslation } from "react-i18next";

const styles = theme => ({
  card: {
    backgroundColor: "#fff",
    maxWidth: "100%",
    [theme.breakpoints.up("md")]: {
      paddingBottom: theme.spacing.unit,
      // border: 'solid 1px #ededed',
      overflow: "hidden",
      boxShadow:
        "0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12)",
      borderRadius: "4px",
      border: "2px solid transparent"
    }
  },
  header: {
    background: "#fbfbfb",
    borderBottom: "solid 2px #ededed",
    color: "#8d9095",
    fontWeight: "bolder"
  },
  content: {
    background: "#ffffff",
    paddingTop: 5,
    paddingBottom: 5
  },
  button: {
    background: "#e83490",
    color: "#ffffff",
    fontWeight: "bold",
    border: "0px",
    "&:hover": {
      background: "#e83490",
      color: "#ffffff",
      fontWeight: "bold",
      border: "0px"
    }
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  cardContent: {
    background: "#ffffff",
    // paddingTop: theme.spacing.unit,
    // paddingBottom: theme.spacing.unit,
    padding: "0px",
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing.unit * 2
    }
  }
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      storeID: "",
      error: ""
    };
  }

  componentDidMount() {
    // let cookieValue = Cookies.get('email');
    let cookieValue = Cookies.get("auth0_uid");

    UtilityManager.getInstance()
      .storeInfoLookup(cookieValue)
      .then(resultStoreInfo => {
        this.setState({
          email: resultStoreInfo[0].email,
          storeID: resultStoreInfo[0].storeID
        });

        // this.updateBusinessProfileState();
      });
  }

  updateBusinessProfileState = () => {
    // const storeID = this.state.storeID;
    // this.props.getBusinessProfile({ storeID: storeID });
    // SalesChannelManager.getInstance().getChannelByStoreID(storeID).then((salesChannelResult) => {
    //     this.setState({ channels: salesChannelResult[0].channels, isLoadingSaleChannelData: false, isProcessPageState: true }, () => { this.checkBusinessProfileData(); });
    // });
  };

  checkExternalFunctionIsExist = () => {
    return typeof this.props.handleStepperNextButton === "function";
  };

  handleSavePage = event => {
    event.preventDefault();

    this.props.pushTrackingData("Update", "Update " + this.props.dataLabel);
    if (this.checkExternalFunctionIsExist()) {
      this.props.saveBusinessProfile(this.state.form, {
        storeID: this.props.storeID
      });
      this.props.handleStepperNextButton();
    } else {
      this.props.saveBusinessProfile(this.state.form, {
        storeID: this.props.storeID
      });
    }
  };

  clickNextButton = event => {
    let pinReg = new RegExp(/\d{6}/);
    if (!pinReg.test(this.state.PIN)) {
      return this.setState({ error: "*กรุณาใส่ PIN ให้ถูกต้อง" });
    }
    if (!this.state.isConfirmation) {
      return this.setState({
        isConfirmation: true,
        setPIN: this.state.PIN,
        PIN: "",
        error: ""
      });
    }
    if (this.state.setPIN === this.state.PIN) {
      console.log("correct");

      return this.setState({ error: "" });
    }
  };

  handlePIN = event => {
    this.setState({
      PIN: event
    });
  };

  render() {
    return (
      <div className="flex justify-center my-48">
        <div className="hidden text-right md:mr-48 md:block md:w-1/2">
          <img
            width="128"
            src="assets/images/store-management/stepperImage.png"
            alt="newShop"
            width="60%"
          />
        </div>

        {/* This is the form */}
        <div className="flex md:justify-start md:w-1/2">
          <div className="store-management-body-container min-w-320 w-3/4 md:my-32 lg:rounded overflow-hidden shadow inline-block">
            <div className="flex flex-col p-20 md:w-full h-full">
              <div className="font-bold text-3xl text-center mt-36">
                เข้าสู่ระบบ
              </div>
              <div className="mb-2 text-center text-grey">
                การจัดการการขายของผ่านไลฟ์อัตโนมัติ
              </div>

              <div className="text-white text-center flex flex-col items-center">
                <div className="bg-blue-dark rounded-lg w-2/3 p-12 mt-6">
                  LOGIN WITH FACEBOOK
                </div>
                <div className="bg-green-dark rounded-lg w-2/3 p-12 mt-6">
                  LOGIN WITH LINE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBusinessProfile: Actions.getBusinessProfile,
      saveBusinessProfile: Actions.saveBusinessProfile
      // handleStepperNextButton: Actions.handleStepperNextButton
    },
    dispatch
  );
}

function mapStateToProps({ storeManagement }) {
  return {
    businessProfile: storeManagement.businessProfile
  };
}

export default withReducer("storeManagement", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withTranslation()(Login))
    )
  )
);
