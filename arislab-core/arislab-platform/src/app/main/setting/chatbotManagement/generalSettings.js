import React, { Component } from "react";
import {
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  // TextField,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";

// import _ from '@lodash';

// import { ChatbotSettingsManager } from '../../context/chatbot_settings/chatbotSettingsManager';
import { SalesChannelManager } from "../../context/sales_channel/salesChannelManager";
import { Trans, withTranslation } from "react-i18next";

const styles = (theme) => ({
  layoutRoot: {},
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
});

class GeneralSettings extends Component {
  state = {
    storeID: "",
    channelInfo: {},
    isSaving: false,
  };

  componentDidMount() {
    const { storeID, channelInfo } = this.props;

    this.setState({
      storeID: storeID,
    });

    this.updateChannelInfoState(channelInfo);
  }

  handleCheckboxChange = (name) => (event) => {
    this.setState({
      [name]: event.target.checked,
    });
  };

  updateChannelInfoState = (channelInfoObj) => {
    this.setState({
      channelInfo: channelInfoObj,
      botStatus: channelInfoObj["status"] === "active" ? true : false,
    });
  };

  handleSaveButton = (event) => {
    event.preventDefault();

    const { channelInfo, botStatus } = this.state;

    this.setState({
      isSaving: true,
    });

    let channelID = channelInfo["id"];
    let newChannelBody = channelInfo;

    if (botStatus === true) {
      newChannelBody["status"] = "active";
    } else if (botStatus === false) {
      newChannelBody["status"] = "off";
    }

    SalesChannelManager.getInstance()
      .addChannelToConvolab(channelID, newChannelBody)
      .then((resultAddChannelToConvolab) => {
        this.setState({
          isSaving: false,
        });
      })
      .catch((error) => {
        console.log(
          `There's an error occured while adding change bot status to external service :`,
          error
        );
      });
  };

  render() {
    const { classes } = this.props;
    const { isSaving, botStatus } = this.state;

    let botStatusObj = {};

    if (botStatus !== undefined) {
      botStatusObj = {
        defaultChecked: botStatus,
      };
    }

    return (
      <Grid container spacing={24}>
        <Grid item xs={8}>
          <Card className={classes.card}>
            <CardContent className={classes.header}>
              <Trans i18nKey="settings.chatbot.chatbot-general-settings-title">
                General Settings
              </Trans>
            </CardContent>

            <CardContent>
              {botStatus !== undefined ? (
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <Switch
                        onChange={this.handleCheckboxChange("botStatus")}
                        color="primary"
                        {...botStatusObj}
                      />
                    }
                    labelPlacement="start"
                    label={
                      <Trans i18nKey="settings.chatbot.chatbot-general-form-input-bot-switch-label">
                        Bot status
                      </Trans>
                    }
                  />
                </FormGroup>
              ) : null}
            </CardContent>

            <CardActions>
              <div className="flex-1 text-center">
                {isSaving === true ? (
                  <Button
                    variant="outlined"
                    className={classes.button}
                    disabled
                  >
                    <Trans i18nKey="settings.chatbot.chatbot-message-button-saving-label">
                      Saving
                    </Trans>
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    className={classes.button}
                    onClick={this.handleSaveButton}
                  >
                    <Trans i18nKey="settings.chatbot.chatbot-message-button-save-label">
                      Save
                    </Trans>
                  </Button>
                )}
              </div>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.card}>
            <CardContent className={classes.header}>
              <Trans i18nKey="settings.chatbot.chatbot-message-video-tutorial-title">
                Video tutorial
              </Trans>
            </CardContent>
            <CardContent className={classes.content} />
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withTranslation()(GeneralSettings)
);
