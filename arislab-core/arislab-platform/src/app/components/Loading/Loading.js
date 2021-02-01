import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";

const styles = {};

const Loading = (props) => {
  const { classes } = props;
  return <CircularProgress {...props} />;
};

export default withStyles(styles)(Loading);
