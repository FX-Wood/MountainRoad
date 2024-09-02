import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";

const styles = {
  root: {
    flexGrow: 1,
  },
  header: {
    flexGrow: 1,
    marginLeft: 20,
    textDecoration: "none",
  },
  appBarBtn: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function ButtonAppBar(props) {
  const { classes } = props;
  let buttons;
  if (props.user) {
    buttons = (
      <>
        <Button
          className={classes.appBarBtn}
          component={Link}
          to={"/dash"}
          color="inherit"
        >
          Dashboard
        </Button>
        <Button
          className={classes.appBarBtn}
          component={Link}
          to={"/browse/mtn"}
          color="inherit"
        >
          Browse mountains
        </Button>
        <Button
          className={classes.appBarBtn}
          component={Link}
          to={"/browse/rides"}
          color="inherit"
        >
          Browse rides
        </Button>
        <Button
          className={classes.appBarBtn}
          component={Link}
          to={"/ride/new"}
          color="inherit"
        >
          Get a ride
        </Button>
        <Button
          className={classes.appBarBtn}
          onClick={props.logout}
          color="inherit"
        >
          Logout
        </Button>
      </>
    );
  } else {
    buttons = (
      <>
        <Button
          component={Link}
          to="/signup"
          className={classes.appBarBtn}
          color="inherit"
        >
          Sign Up
        </Button>
        <Button
          component={Link}
          to="/login"
          className={classes.appBarBtn}
          color="inherit"
        >
          Log in
        </Button>
      </>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            color="inherit"
            className={classes.header}
          >
            MountainRoad
          </Typography>
          {buttons}
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);
