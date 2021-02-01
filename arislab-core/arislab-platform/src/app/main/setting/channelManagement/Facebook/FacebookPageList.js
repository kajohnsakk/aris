import React, { Component } from "react";
import {
  TableCell,
  TableRow,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { FuseChipSelect } from "@fuse";
import _ from "@lodash";

// import { FacebookPageJson } from '../../../modules/FacebookService';
import { SalesChannelManager } from "../../../context/sales_channel/salesChannelManager";

import { Trans, withTranslation } from "react-i18next";

const styles = (theme) => ({});

class FacebookPageList extends Component {
  state = {
    pages: [],
    pageList: [],
    form: null,
    isSaving: false,
    isError: false,
    errorCode: "",
    errorMessage: "",
    isDialogOpen: false,
  };

  componentDidMount() {
    let pageList = this.props.pages.map((page, i) => {
      return {
        value: page.id,
        label: `${page.name} (${page.id})`,
      };
    });

    let facebookSelectedPage = this.props.selectedPage;

    this.setState({
      pageList: pageList,
    });

    this.handleChipChange(
      facebookSelectedPage,
      "channels['facebookSelectedPage']"
    );

    this.componentDidRender();
  }

  componentDidUpdate() {
    this.componentDidRender();
  }

  componentDidRender() {}

  handleChipChange = (value, name) => {
    this.setState({
      form: _.set({ ...this.state.form }, name, value),
    });
  };

  handleSavePage = (event) => {
    event.preventDefault();
    const { form } = this.state;
    if (this.props.hasOwnProperty("pages") && this.props.pages) {
      this.setState({
        isSaving: true,
      });

      let pageInfo = this.props.pages.filter((page) => {
        return page.id === form["channels"]["facebookSelectedPage"]["value"];
      });

      let channelID = "facebook_" + pageInfo[0]["id"];
      let convolab_channelBody = {
        id: "facebook_" + pageInfo[0]["id"],
        channel_type: "facebook",
        name: pageInfo[0]["name"],
        token: pageInfo[0]["access_token"],
        channel_id: pageInfo[0]["id"],
        status: "active",
        created_at: Date.now(),
        user_count: 0,
        message_count: 0,
        bot_id: "origin",
        entity_link: [],
        last_refresh: Date.now(),
      };

      if (
        this.props.hasOwnProperty("channelInfo") &&
        this.props.channelInfo.hasOwnProperty("id")
      ) {
        // Each store can add only 1 page to Convolab Platform
        // This condition to prevent user from adding multiple pages to Convolab Platform
        let channelID = this.props.channelInfo["id"];
        SalesChannelManager.getInstance()
          .removeChannelFromConvolab(channelID)
          .then((resultRemoveChannelFromConvolab) => {});
      }

      SalesChannelManager.getInstance()
        .addChannelToConvolab(channelID, convolab_channelBody)
        .then((resultAddChannelToConvolab) => {
          let updateChannelBody = {
            facebook: pageInfo[0]["id"],
            facebookSelectedPage: form["channels"]["facebookSelectedPage"],
            facebookSelectedPageAccessToken: pageInfo[0]["access_token"],
          };

          SalesChannelManager.getInstance()
            .getChannelInfo(channelID)
            .then((resultGetChannelInfo) => {
              if (resultGetChannelInfo.length > 0) {
                this.setState({
                  isSaving: false,
                  isError: true,
                  errorCode: "sales-channels-modal-error-duplicate-page",
                  errorMessage: "Duplicate page",
                  isDialogOpen: true,
                });
              } else {
                SalesChannelManager.getInstance()
                  .updateChannel(this.props.storeID, updateChannelBody)
                  .then((resultUpdateChannel) => {
                    this.setState({
                      isSaving: false,
                      isError: false,
                      errorCode: "",
                      errorMessage: "",
                      isDialogOpen: false,
                    });
                  });
              }
            });
        });
    }
  };

  handleClickCloseButton = (event) => {
    this.setState({
      isDialogOpen: false,
    });
  };

  render() {
    const {
      form,
      isSaving,
      isError,
      errorCode,
      errorMessage,
      isDialogOpen,
    } = this.state;
    const { classes } = this.props;

    let facebookSelectedPage = {};

    if (form !== null && form.hasOwnProperty("channels")) {
      if (form.channels.hasOwnProperty("facebookSelectedPage")) {
        facebookSelectedPage = form.channels.facebookSelectedPage;
      }
    }

    return (
      <TableRow>
        <TableCell>
          <FuseChipSelect
            value={facebookSelectedPage}
            placeholder={
              <Trans i18nKey="settings.salesChannels.sales-channels-input-facebook-page-placeholder">
                Choose facebook page
              </Trans>
            }
            textFieldProps={{
              InputLabelProps: {
                shrink: true,
              },
              variant: "outlined",
            }}
            onChange={(value) =>
              this.handleChipChange(value, "channels['facebookSelectedPage']")
            }
            options={this.state.pageList}
          />
        </TableCell>
        <TableCell>
          {isSaving === true ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              disabled
            >
              <Trans i18nKey="settings.salesChannels.sales-channels-button-saving-label">
                Saving
              </Trans>
            </Button>
          ) : (
            <Button
              id="btnSubmit_page"
              onClick={this.handleSavePage}
              variant="contained"
              color="primary"
              className={classes.button}
            >
              <Trans i18nKey="settings.salesChannels.sales-channels-button-save-label">
                Save
              </Trans>
            </Button>
          )}

          {isError === true ? (
            <Dialog
              open={isDialogOpen}
              fullWidth={true}
              maxWidth={"sm"}
              aria-labelledby="customized-dialog-title"
            >
              <DialogTitle id="customized-dialog-title">
                <Trans
                  i18nKey={`settings.salesChannels.sales-channels-modal-error-title`}
                >
                  Error
                </Trans>
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                  <Trans i18nKey={`settings.salesChannels.${errorCode}`}>
                    {errorMessage}
                  </Trans>
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={this.handleClickCloseButton}
                  className={classes.linkButton}
                  autoFocus
                >
                  <Trans
                    i18nKey={`settings.salesChannels.sales-channels-modal-error-close-button`}
                  >
                    Close
                  </Trans>
                </Button>
              </DialogActions>
            </Dialog>
          ) : null}
        </TableCell>
      </TableRow>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withTranslation()(FacebookPageList)
);
