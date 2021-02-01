import React, { useState } from "react";
import { Trans } from "react-i18next";
import { Fab, CircularProgress } from "@material-ui/core";

const OtpDialog = (props) => {
  const { email, sendOTP } = props;
  const [loading, setLoading] = useState(false);

  return (
    <div className="mt-20">
      <div className="text-base flex flex-col md:flex-row items-center justify-center">
        <p style={{ color: "#808080" }}>
          <Trans i18nKey="transactions.send-otp-message">
            We will send OTP to
          </Trans>
        </p>
      </div>
      <p className="mt-8 merchant-pink text-xl">{email}</p>
      {loading ? (
        <div className="mt-20">
          <CircularProgress color="primary" className="mr-8" size={50} />
        </div>
      ) : (
        <div />
      )}
      <div className="flex flex-row justify-center mt-32">
        <Fab
          variant="extended"
          aria-label="sendOTP"
          className="merchant-button px-40"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            sendOTP();
          }}
        >
          <Trans i18nKey="transactions.send-otp-button">Send OTP</Trans>
        </Fab>
      </div>
    </div>
  );
};

export default OtpDialog;
