import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import history from "../../../../history";
import { ErrorOutline as ErrorOutlineIcon } from "@material-ui/icons";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";

import axios from "axios";
import { Trans, withTranslation } from "react-i18next";

const styles = (theme) => ({
  fontError: {
    color: "#f00",
    display: "flex",
  },
});

const LiveEndDialog = (props) => {
  const { classes, videoID, facebookAccessToken } = props;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const closeLive = async () => {
    try {
      setLoading(true);
      const apiUrl = `https://graph.facebook.com/${videoID}?end_live_video=true&access_token=${facebookAccessToken}`;
      let result = await axios.post(apiUrl);
      if (result.status === 200) {
        history.push("/platform/lives");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Trans i18nKey="live-event.end-stream-message-header">
          Ending Live Stream
        </Trans>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {loading ? (
            <>Stopping...</>
          ) : !error ? (
            <Trans i18nKey="live-event.end-stream-message">
              Are you sure you want to end this live streaming session
            </Trans>
          ) : (
            <div className={classes.fontError}>
              <ErrorOutlineIcon />
              <span>{error}</span>
            </div>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeLive}>
          <Trans i18nKey="main.confirm">Confirm</Trans>
        </Button>
        <Button onClick={props.cancelLiveEndDialog}>
          <Trans i18nKey="main.cancel-btn">Cancel</Trans>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

LiveEndDialog.propTypes = {
  videoID: PropTypes.string.isRequired,
  facebookAccessToken: PropTypes.string.isRequired,
};

export default withTranslation()(
  withStyles(styles, { withTheme: true })(LiveEndDialog)
);
