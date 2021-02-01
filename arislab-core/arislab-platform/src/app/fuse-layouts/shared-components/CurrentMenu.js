import React, { Component } from "react";
import {
  Avatar,
  Button,
  Icon,
  ListItemIcon,
  ListItemText,
  Popover,
  MenuItem,
  Typography,
} from "@material-ui/core";
import * as Actions from "../../main/setting/store/actions";
import reducer from "../../main/setting/store/reducers";
import { connect } from "react-redux";
import * as authActions from "app/auth/store/actions";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { UtilityManager } from "../../main/modules/UtilityManager";
import Cookies from "js-cookie";
import withReducer from "app/store/withReducer";
import { withRouter } from "react-router-dom";
import { withTranslation, Trans } from "react-i18next";
import PersonOutlineIcon from "@material-ui/icons/PersonOutline";
import _ from "@lodash";
class CurrentMenu extends Component {
  state = {
    userMenu: null,
    auth0_uid: "",
    email: "",
    storeID: "",
    storeInfo: null,
    accLogo: "",
    accName: "",
  };

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
        this.updateBusinessProfileState();
      });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!_.isEqual(this.props.businessProfile, this.state.storeInfo)) {
      this.updateFormState();
    }

    if (this.state.accLogo === "") {
      if (
        this.props.businessProfile &&
        this.state.accLogo === "" &&
        this.state.accName === ""
      ) {
        if (
          this.props.businessProfile &&
          this.props.businessProfile.hasOwnProperty("storeInfo")
        ) {
          if (
            this.props.businessProfile.storeInfo &&
            this.props.businessProfile.storeInfo.hasOwnProperty(
              "businessProfile"
            )
          ) {
            if (
              this.props.businessProfile.storeInfo.businessProfile &&
              this.props.businessProfile.storeInfo.businessProfile.hasOwnProperty(
                "logo"
              )
            ) {
              if (
                this.state.accLogo === "" &&
                this.props.businessProfile.storeInfo.businessProfile.logo
                  .length > 0
              ) {
                this.setState({
                  accLogo: this.props.businessProfile.storeInfo.businessProfile
                    .logo,
                });
              }
            }
            if (
              this.props.businessProfile.storeInfo.businessProfile &&
              this.props.businessProfile.storeInfo.businessProfile.hasOwnProperty(
                "accountDetails"
              )
            ) {
              if (
                this.props.businessProfile.storeInfo.businessProfile
                  .accountDetails &&
                this.props.businessProfile.storeInfo.businessProfile.accountDetails.hasOwnProperty(
                  "name"
                )
              ) {
                if (
                  this.props.businessProfile.storeInfo.businessProfile
                    .accountDetails.name
                ) {
                  this.setState({
                    accName: this.props.businessProfile.storeInfo
                      .businessProfile.accountDetails.name,
                  });
                }
              }
            }
          }
        }
      }
    } else {
      if (this.props.businessProfile) {
        if (this.props.businessProfile.hasOwnProperty("storeInfo")) {
          if (
            this.props.businessProfile.storeInfo.hasOwnProperty(
              "businessProfile"
            )
          ) {
            if (
              this.props.businessProfile.storeInfo.businessProfile.hasOwnProperty(
                "logo"
              )
            ) {
              if (
                this.state.accLogo !==
                this.props.businessProfile.storeInfo.businessProfile.logo
              ) {
                this.setState({
                  accLogo: this.props.businessProfile.storeInfo.businessProfile
                    .logo,
                });
              }
            }
          }
        }
      }
    }
  }

  updateFormState = () => {
    this.setState({ storeInfo: this.props.businessProfile });
  };

  userMenuClick = (event) => {
    this.setState({ userMenu: event.currentTarget });
  };

  userMenuClose = () => {
    this.setState({ userMenu: null });
  };

  redirectLogout = (event) => {
    window.location.href = `${window.location.origin}/logout`;
  };

  updateBusinessProfileState = () => {
    this.props.getBusinessProfile({
      storeID: this.state.storeID,
    });
  };

  render() {
    const { userMenu } = this.state;

    return (
      <React.Fragment>
        {this.state.storeInfo &&
        this.state.storeInfo.registeredTimestamp > 0 ? (
          <Button
            id="user-menu"
            className="min-w-48 h-40 p-0 lg:h-64 lg:py-6 lg:px-8"
            onClick={this.userMenuClick}
          >
            {this.state.accLogo.length > 0 ? (
              <Avatar className="" alt="user photo" src={this.state.accLogo} />
            ) : (
              <Avatar className="" alt="user photo">
                <PersonOutlineIcon />
              </Avatar>
            )}

            <div className="hidden lg:flex flex-col ml-12 items-start">
              <Typography
                component="span"
                className="normal-case font-600 flex"
              >
                {this.state.accName}
              </Typography>
              <Typography
                className="text-11 capitalize"
                color="textSecondary"
              />
            </div>

            <Icon className="text-16 ml-12 hidden lg:flex" variant="action">
              keyboard_arrow_down
            </Icon>
          </Button>
        ) : (
          <Avatar className="" alt="user photo">
            <PersonOutlineIcon />
          </Avatar>
        )}

        <Popover
          open={Boolean(userMenu)}
          anchorEl={userMenu}
          onClose={this.userMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          classes={{
            paper: "py-8",
          }}
        >
          <React.Fragment>
            <MenuItem
              component={Link}
              to="/platform/setting"
              onClick={this.userMenuClose}
            >
              <ListItemIcon>
                <Icon>settings</Icon>
              </ListItemIcon>
              <ListItemText
                className="pl-0"
                primary={<Trans i18nKey="userMenu.settings">Settings</Trans>}
              />
            </MenuItem>
            {this.props.businessProfile &&
            this.props.businessProfile.isDeveloperStore ? (
              <MenuItem
                component={Link}
                to="/developer/store/access"
                onClick={this.userMenuClose}
              >
                <ListItemIcon>
                  <Icon>code</Icon>
                </ListItemIcon>
                <ListItemText
                  className="pl-0"
                  primary={
                    <Trans i18nKey="userMenu.developer-tools">
                      Developer Tools
                    </Trans>
                  }
                />
              </MenuItem>
            ) : null}
            <MenuItem
              onClick={() => {
                this.redirectLogout();

                // logout();
                this.userMenuClose();
              }}
            >
              <ListItemIcon>
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText
                className="pl-0"
                primary={<Trans i18nKey="userMenu.logout">Logout</Trans>}
              />
            </MenuItem>
          </React.Fragment>
        </Popover>
      </React.Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getBusinessProfile: Actions.getBusinessProfile,
      logout: authActions.logoutUser,
    },
    dispatch
  );
}

function mapStateToProps({ storeManagement }) {
  return {
    businessProfile: storeManagement.businessProfile,
  };
}

export default withReducer("storeManagement", reducer)(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(CurrentMenu))
  )
);
