import React, { Component } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
} from "@material-ui/core";

import withReducer from "app/store/withReducer";
import reducer from "../../store/reducers";
import * as Actions from "../../store/actions";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import _ from "@lodash";

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
    paddingTop: 5,
    paddingBottom: 5,
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
});

class Policy extends Component {
  state = {
    form: null,
  };

  componentDidMount() {
    this.updatePolicyState();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      (this.props.policy && !this.state.form) ||
      (this.props.policy &&
        this.state.form &&
        this.props.storeID !== this.state.form.storeID)
    ) {
      this.updateFormState();
    }
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
    this.setState({ form: this.props.policy });
  };

  updatePolicyState = () => {
    const storeID = this.props.storeID;
    this.props.getPolicy({
      storeID: storeID,
    });
  };

  render() {
    const { storeID, savePolicy, classes } = this.props;
    const { form } = this.state;

    let privacyPolicy = {};
    let returnRefundPolicy = {};
    let shippingPolicy = {};
    let cancellationPolicy = {};

    if (form !== null) {
      privacyPolicy = {
        defaultValue: this.state.form.storeInfo.policies.privacyPolicy,
      };

      returnRefundPolicy = {
        defaultValue: this.state.form.storeInfo.policies.returnRefundPolicy,
      };

      shippingPolicy = {
        defaultValue: this.state.form.storeInfo.policies.shippingPolicy,
      };

      cancellationPolicy = {
        defaultValue: this.state.form.storeInfo.policies.cancellationPolicy,
      };
    }

    return (
      form && (
        <Grid container spacing={24}>
          <Grid item xs={8}>
            <Card className={classes.card}>
              <CardContent className={classes.header}>
                <Trans i18nKey="settings.policies.policies-title">
                  Policies
                </Trans>
              </CardContent>
              <CardContent className={classes.content}>
                <TextField
                  id="outlined-name"
                  name="storeInfo['policies']['privacyPolicy']"
                  label={
                    <Trans i18nKey="settings.policies.policies-form-input-privacy-policy-label">
                      Privacy policy
                    </Trans>
                  }
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  onChange={this.handleChange}
                  {...privacyPolicy}
                />
                <TextField
                  id="outlined-name"
                  name="storeInfo['policies']['returnRefundPolicy']"
                  label={
                    <Trans i18nKey="settings.policies.policies-form-input-return-refund-policy-label">
                      Return & refund policy
                    </Trans>
                  }
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  onChange={this.handleChange}
                  {...returnRefundPolicy}
                />
                <TextField
                  id="outlined-name"
                  name="storeInfo['policies']['shippingPolicy']"
                  label={
                    <Trans i18nKey="settings.policies.policies-form-input-shipping-policy-label">
                      Shipping policy
                    </Trans>
                  }
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  onChange={this.handleChange}
                  {...shippingPolicy}
                />
                <TextField
                  id="outlined-name"
                  name="storeInfo['policies']['cancellationPolicy']"
                  label={
                    <Trans i18nKey="settings.policies.policies-form-input-cancellation-policy-label">
                      Cancellation policy
                    </Trans>
                  }
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  onChange={this.handleChange}
                  {...cancellationPolicy}
                />

                <CardActions>
                  <div className="flex-1 text-center">
                    <Button
                      variant="outlined"
                      className={classes.button}
                      onClick={() =>
                        savePolicy(form, {
                          storeID: storeID,
                        })
                      }
                    >
                      <Trans i18nKey="settings.policies.policies-button-save-label">
                        Save
                      </Trans>
                    </Button>
                  </div>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card className={classes.card}>
              <CardContent className={classes.header}>
                <Trans i18nKey="settings.policies.policies-video-tutorial-title">
                  Video tutorial
                </Trans>
              </CardContent>
              <CardContent className={classes.content} />
            </Card>
          </Grid>
        </Grid>
      )
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPolicy: Actions.getPolicy,
      savePolicy: Actions.savePolicy,
    },
    dispatch
  );
}

function mapStateToProps({ storeManagement }) {
  return {
    policy: storeManagement.policy,
  };
}

export default withReducer("storeManagement", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withTranslation()(Policy))
    )
  )
);
