import React, { Component } from "react";
import { TextField, Button, InputAdornment } from "@material-ui/core";

import withReducer from "app/store/withReducer";
import reducer from "../../store/reducers";
import * as Actions from "../../store/actions";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import _ from "@lodash";
import { UtilityManager } from "../../../modules/UtilityManager";
import Cookies from "js-cookie";
import { withTranslation, Trans } from "react-i18next";

const styles = (theme) => ({
  card: {
    maxWidth: "100%",
    border: "solid 1px #ededed",
    paddingBottom: 5,
  },
  header: {
    background: "#fbfbfb",
    borderBottom: "solid 2px #ededed",
    color: "#8d9095",
    fontWeight: "bolder",
  },
  content: {
    background: "#ffffff",
    paddingTop: "2.5rem",
    paddingBottom: 10,
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
      border: "0px",
    },
  },
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  formControl: {
    marginBottom: "2.5rem",
  },
  group: {
    margin: "1%",
  },
  disabledInput: {
    background: "#dddddd",
    color: "#AAAAAA",
  },
});

class Delivery extends Component {
  state = {
    form: null,
    storeID: "",
    storeConfig: {},
  };

  componentDidMount() {
    if (this.props.storeID) {
      this.updateDeliveryState();
    } else {
      // let cookieValue = Cookies.get('email');
      let cookieValue = Cookies.get("auth0_uid");

      UtilityManager.getInstance()
        .storeInfoLookup(cookieValue)
        .then((resultStoreInfo) => {
          this.setState({
            storeID: resultStoreInfo[0].storeID,
          });

          this.props.getDelivery({
            storeID: resultStoreInfo[0].storeID,
          });

          this.props.getStoreConfig({
            storeID: resultStoreInfo[0].storeID,
          });
        });
    }

    this.props.pushTrackingData("View", "View " + this.props.dataLabel);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.delivery && !this.state.form) {
      this.updateFormState();
    }

    if (!_.isEqual(this.props.storeConfig, prevProps.storeConfig)) {
      this.setState({ storeConfig: this.props.storeConfig.config });
    }
  }

  componentWillUnmount() {
    this.props.pushTrackingData("Leave", "Leave " + this.props.dataLabel);
  }

  handleChange = (event) => {
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

  updateFormState = () => {
    this.setState({ form: this.props.delivery });
  };

  updateDeliveryState = () => {
    const storeID = this.props.storeID;
    this.props.getDelivery({
      storeID: storeID,
    });

    this.props.getStoreConfig({
      storeID: storeID,
    });
  };

  render() {
    var storeID;
    if (this.props.storeID) {
      storeID = this.props.storeID;
    } else {
      storeID = this.state.storeID;
    }

    const { saveDelivery, classes } = this.props;
    const { form } = this.state;

    let priceFirstPiece = "0";
    let priceAdditionalPiece = "0";

    if (form !== null) {
      if (form) {
        if (form.hasOwnProperty("price")) {
          if (form.price.firstPiece !== "") {
            priceFirstPiece = form.price.firstPiece;
          }

          if (form.price.additionalPiece !== "") {
            priceAdditionalPiece = form.price.additionalPiece;
          }
        }
      }
    }

    return (
      <div className="text-center content-center">
        <div className="store-management-body-container w-full lg:w-2/3 md:my-32 rounded overflow-hidden shadow inline-block">
          <div className="px-24 sm:px-40 py-20 store-management-header">
            <div className="font-bold text-xl mb-2 text-left">
              <Trans i18nKey="settings.delivery.delivery-details">
                Delivery details
              </Trans>
            </div>
          </div>
          <form className="py-40 px-24">
            <div className="w-full block align-top mb-32">
              <Trans i18nKey="settings.delivery.delivery-message">
                Please enter your delivery charges for the first piece and
                pieces after.
              </Trans>
            </div>
            <div className="w-full block align-top mb-32">
              <div className="w-full sm:w-1/2 px-12 align-top mx-auto">
                <div className="mb-12">
                  <Trans i18nKey="settings.delivery.first-piece-title">
                    First piece
                  </Trans>
                </div>
                <div className="pb-12">
                  <TextField
                    id="first-piece"
                    label={
                      <Trans i18nKey="settings.delivery.price-title">
                        Price
                      </Trans>
                    }
                    variant="outlined"
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">THB</InputAdornment>
                      ),
                    }}
                    type="number"
                    name="price['firstPiece']"
                    value={Number(priceFirstPiece).toString()}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div className="w-full sm:w-1/2 px-12 align-top mx-auto">
                <div className="mb-12">
                  <Trans i18nKey="settings.delivery.additional-piece-title">
                    Additional piece
                  </Trans>
                </div>
                <div>
                  <TextField
                    id="additional-piece"
                    label={
                      <Trans i18nKey="settings.delivery.price-title">
                        Price
                      </Trans>
                    }
                    variant="outlined"
                    fullWidth
                    required
                    // className={classes.disabledInput}
                    disabled={
                      this.state.storeConfig.hasOwnProperty("useCart") &&
                      !this.state.storeConfig.useCart
                        ? true
                        : false
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">THB</InputAdornment>
                      ),
                      // classes : {
                      //     input: classes.disabledInput
                      // }
                    }}
                    type="number"
                    name="price['additionalPiece']"
                    value={Number(priceAdditionalPiece).toString()}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="w-full block">
              <Button
                variant="outlined"
                className={classes.button}
                onClick={() => {
                  saveDelivery(form, { storeID: storeID });
                  this.props.pushTrackingData("Click", "Save delivery button");
                  this.props.pushTrackingData(
                    "Update",
                    "Update " + this.props.dataLabel
                  );
                }}
              >
                <Trans i18nKey="main.save-btn">Save</Trans>
              </Button>
            </div>
          </form>
        </div>
      </div>

      // <Grid container spacing={24}>
      //     <Grid item xs={8}>
      //         <Card className={classes.card}>
      //             <CardContent className={classes.header}>
      //                 <Trans i18nKey="settings.delivery.delivery-title">
      //                     Delivery
      //                 </Trans>
      //             </CardContent>
      //             <CardContent className={classes.content}>

      //                 <FormControl variant="outlined" className={classes.formControl} fullWidth={true}>
      //                     <FormLabel component="legend" className="mb-16">
      //                         <Trans i18nKey="settings.delivery.first-piece-title">First piece</Trans>
      //                     </FormLabel>
      //                     <TextField
      //                         id="first-piece"
      //                         label={<Trans i18nKey="settings.delivery.price-title">Price</Trans>}
      //                         variant="outlined"
      //                         fullWidth
      //                         required
      //                         InputProps={{
      //                             endAdornment: <InputAdornment position="end">THB</InputAdornment>
      //                         }}
      //                         type="number"
      //                         name="storeInfo[delivery][price][firstPiece]"
      //                         value={priceFirstPiece}
      //                         onChange={this.handleChange}
      //                     />
      //                 </FormControl>

      //                 <FormControl variant="outlined" className={classes.formControl} fullWidth={true}>
      //                     <FormLabel component="legend" className="mb-16">
      //                         <Trans i18nKey="settings.delivery.additional-piece-title">Additional piece</Trans>
      //                     </FormLabel>
      //                     <TextField
      //                         id="first-piece"
      //                         label={<Trans i18nKey="settings.delivery.price-title">Price</Trans>}
      //                         variant="outlined"
      //                         fullWidth
      //                         required
      //                         InputProps={{
      //                             endAdornment: <InputAdornment position="end">THB</InputAdornment>
      //                         }}
      //                         type="number"
      //                         name="storeInfo[delivery][price][additionalPiece]"
      //                         value={priceAdditionalPiece}
      //                         onChange={this.handleChange}
      //                     />
      //                 </FormControl>

      //                 <CardActions>
      //                     <div className="flex-1 text-center">
      //                         <Button
      //                             variant="outlined"
      //                             className={classes.button}
      //                             onClick={() => saveDelivery(form, {
      //                                 storeID: storeID,
      //                             })}
      //                         >
      //                             <Trans i18nKey="main.save-btn">
      //                                 Save
      //                             </Trans>
      //                         </Button>
      //                     </div>
      //                 </CardActions>
      //             </CardContent>
      //         </Card>
      //     </Grid>
      //     <Grid item xs={4}>
      //         <Card className={classes.card}>
      //             <CardContent className={classes.header}>
      //                 <Trans i18nKey="main.video-tutorial-title">
      //                     Video tutorial
      //                 </Trans>
      //             </CardContent>
      //             <CardContent className={classes.content}>

      //             </CardContent>
      //         </Card>
      //     </Grid>
      // </Grid>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getStoreConfig: Actions.getStoreConfig,
      getDelivery: Actions.getDelivery,
      saveDelivery: Actions.saveDelivery,
    },
    dispatch
  );
}

function mapStateToProps({ storeManagement }) {
  return {
    delivery: storeManagement.delivery,
    storeConfig: storeManagement.storeConfig,
  };
}

export default withReducer("storeManagement", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withTranslation()(Delivery))
    )
  )
);
