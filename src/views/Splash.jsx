import React from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const Splash = ({ user }) => {
  if (user) {
    return <Redirect to={"/dash"} />;
  } else {
    return (
      <div className="gridReset" style={{ padding: "20px" }}>
        <Grid
          container
          justify="center"
          alignItems="center"
          spacing={40}
          style={{ minHeight: "80vh" }}
        >
          <Grid
            item
            container
            direction="column"
            spacing={40}
            style={{ maxWidth: "40%" }}
          >
            <Grid item>
              <Typography variant="h1">MountainRoad</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h3" color="textSecondary">
                Get a ride up to the hill!
              </Typography>
            </Grid>
            <Grid item style={{ maxWidth: "80%" }}>
              <Typography variant="subtitle1">
                Make a post when you are going up to the hill and need a ride.
                If you are going up with empty seats, sign on and offer them to
                other riders!
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            container
            spacing={40}
            direction="column"
            alignContent="center"
            alignItems="flex-start"
            style={{ maxWidth: "40%" }}
          >
            <Grid item>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                color="primary"
                style={{ minWidth: "100px" }}
              >
                Sign Up
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                style={{ minWidth: "100px" }}
              >
                Log in
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default Splash;
