import React, { Component } from "react";
import {
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import _ from "@lodash";

import { ChatbotSettingsManager } from "../../context/chatbot_settings/chatbotSettingsManager";
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

class MessageSettings extends Component {
  state = {
    storeID: "",
    form: null,
    channelInfo: {},
    isSaving: false,
  };

  componentDidMount() {
    const { storeID, channelInfo } = this.props;

    this.setState({
      storeID: storeID,
    });

    this.updateChannelInfoState(channelInfo);

    ChatbotSettingsManager.getInstance()
      .getChatbotConfig(storeID)
      .then((resultGetChatbotConfig) => {
        if (resultGetChatbotConfig.length > 0) {
          // If exists just update them into state
          this.updateFormState(resultGetChatbotConfig[0]);
        } else {
          // Create new chatbotConfig if not exists
          let newChatbotConfigBody = {
            storeID: storeID,
            config: {
              general: {
                botStatus: "active",
              },
              message: {
                CLASSIFY_FAILED_MSG: "",
                PRIVATE_REPLY_MSG: "",
              },
            },
          };

          ChatbotSettingsManager.getInstance()
            .saveChatbotConfig(storeID, newChatbotConfigBody)
            .then((resultAddNewChatbotConfig) => {
              this.updateFormState(newChatbotConfigBody);
            })
            .catch((error) => {
              console.log("saveChatbotConfig error ", error);
            });
        }
      });
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

  updateFormState = (formData) => {
    this.setState({
      form: formData,
    });
  };

  updateChannelInfoState = (channelInfoObj) => {
    this.setState({
      channelInfo: channelInfoObj,
    });
  };

  handleSaveButton = (event) => {
    event.preventDefault();

    const { form, storeID, channelInfo } = this.state;

    this.setState({
      isSaving: true,
    });

    if (
      form.hasOwnProperty("config") &&
      form.config.hasOwnProperty("message")
    ) {
      // Update classify failed message & private reply message to chatbotConfig first

      ChatbotSettingsManager.getInstance()
        .saveChatbotConfig(storeID, form)
        .then((resultSaveChatbotConfig) => {
          let channelID = channelInfo["id"];
          let newChannelBody = channelInfo;

          newChannelBody["facebook_reply_comment_text"] =
            form["config"]["message"]["PRIVATE_REPLY_MSG"];

          // Write new private reply message to Chatbot instance
          SalesChannelManager.getInstance()
            .addChannelToConvolab(channelID, newChannelBody)
            .then((resultAddChannelToConvolab) => {
              this.setState({
                isSaving: false,
              });
            })
            .catch((error) => {
              console.log(
                `There's an error occured while adding private reply message to external service :`,
                error
              );
            });
        })
        .catch((error) => {
          console.log(
            `There's an error occured while saving chatbot config : `,
            error
          );
        });
    }
  };

  render() {
    const { classes } = this.props;
    const { form, isSaving } = this.state;

    let classifyFailedMsg = {};
    let privateReplyMsg = {};

    if (form !== null) {
      if (
        form.hasOwnProperty("config") &&
        form.config.hasOwnProperty("message")
      ) {
        classifyFailedMsg = {
          defaultValue: form["config"]["message"]["CLASSIFY_FAILED_MSG"],
        };

        privateReplyMsg = {
          defaultValue: form["config"]["message"]["PRIVATE_REPLY_MSG"],
        };
      }
    }

    return (
      form && (
        <Grid container spacing={24}>
          <Grid item xs={8}>
            <Card className={classes.card}>
              <CardContent className={classes.header}>
                <Trans i18nKey="settings.chatbot.chatbot-message-settings-title">
                  Chatbot Message Settings
                </Trans>
              </CardContent>

              <CardContent>
                <TextField
                  id="outlined-name"
                  name="config['message']['CLASSIFY_FAILED_MSG']"
                  label={
                    <Trans i18nKey="settings.chatbot.chatbot-message-form-input-classify-failed-message-label">
                      Classify failed message
                    </Trans>
                  }
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={this.handleChange}
                  {...classifyFailedMsg}
                />
              </CardContent>

              <CardContent>
                <TextField
                  id="outlined-name"
                  name="config['message']['PRIVATE_REPLY_MSG']"
                  label={
                    <Trans i18nKey="settings.chatbot.chatbot-message-form-input-private-reply-message-label">
                      Private reply message
                    </Trans>
                  }
                  margin="dense"
                  variant="outlined"
                  fullWidth
                  required
                  onChange={this.handleChange}
                  {...privateReplyMsg}
                />
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
      )
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withTranslation()(MessageSettings)
);
