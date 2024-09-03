import axios from "axios";
import React, { Component } from "react";
import { withSnackbar } from "notistack";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import { Route, Link, withRouter } from "react-router-dom";
import RideFlow from "../views/RideFlow";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import RideUpdate from "../components/RideUpdate";
import moment from "moment";

const styles = (theme) => ({
  root: {
    maxWidth: "80%",
    justifySelf: "flexEnd",
  },
  flexibleIndicator: {
    color: theme.palette.secondary.main,
  },
});

class RidesIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rides: [],
      phoneNumber: "",
    };
  }

  getRides = () => {
    axios
      .get("/api/ride")
      .then((res) => {
        console.log("res", res);
        this.setState({
          rides: res.data.data.rides,
          phoneNumber: res.data.data.phoneNumber,
        });
        this.props.enqueueSnackbar(JSON.stringify(res.data.message), {
          variant: "success",
        });
      })
      .catch((err) => {
        console.log("err", err);
        this.props.enqueueSnackbar(JSON.stringify(err.response), {
          variant: "error",
        });
      });
  };

  goToEditRide = (rideID) => {
    console.log("going to edit ride", rideID);
    this.props.history.push("/dash/ride/" + rideID);
  };

  updateRide = (rideID, data) => {
    const url = `/api/ride/${rideID}`;
    axios
      .put(url, data)
      .then((res) => {
        console.log("res", res);
        this.props.enqueueSnackbar(JSON.stringify(res.data.message), {
          variant: "success",
        });
        this.props.history.push("/dash");
        this.getRides();
      })
      .catch((err) => {
        console.log("err", err);
        this.props.enqueueSnackbar(JSON.stringify(err.response), {
          variant: "error",
        });
      });
  };

  deleteRide = (rideID) => {
    console.log("deleteRide", rideID);
    const url = `/api/ride/${rideID}`;
    axios
      .delete(url)
      .then((res) => {
        console.log("res", res);
        this.getRides();
        this.props.enqueueSnackbar(JSON.stringify(res.data.message), {
          variant: "success",
        });
      })
      .catch((err) => {
        console.log("err", err);
        this.props.enqueueSnackbar(JSON.stringify(err.response), {
          variant: "error",
        });
      });
  };

  componentDidMount() {
    console.log("rides index did mount");
    this.getRides();
  }

  render() {
    const { classes } = this.props;

    const rides = this.state.rides.map((ride, i) => {
      const start = new Date(ride.start);
      const mStart = moment(start);
      const end = new Date(ride.end);
      const mEnd = moment(end);
      const { startFlex, endFlex } = ride;
      console.log("start", start);
      console.log("end", end);
      console.log({ startFlex, endFlex });
      return (
        <Grid key={i} item>
          <Card style={{ padding: "2em" }}>
            <Grid container spacing={24}>
              <Grid item>
                <Typography variant="h6">
                  {String(mStart.format("D / MMMM"))}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" color="textSecondary">
                  {ride.mountain.name}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <Typography variant="body1">{ride.note}</Typography>
              </Grid>
            </Grid>
            <Grid item container spacing={24}>
              <Grid item>
                <Typography variant="body1">
                  Start of day: {start.toLocaleTimeString()}
                  {startFlex && (
                    <span className={classes.flexibleIndicator}> Flexible</span>
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1">
                  End of day: {end.toLocaleTimeString()}
                  {endFlex && (
                    <span className={classes.flexibleIndicator}> Flexible</span>
                  )}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1">
                  Contact phone: {this.state.phoneNumber}
                </Typography>
              </Grid>
              <Grid container>
                <Grid item>
                  <Button onClick={() => this.goToEditRide(ride._id)}>
                    <EditIcon />
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={() => this.deleteRide(ride._id)}>
                    <CloseIcon />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      );
    });
    const routes = this.state.rides.map((ride, i) => {
      const url = `/dash/ride/${ride._id}`;
      return (
        <Route
          path={url}
          render={() => {
            return (
              <RideUpdate rideID={ride._id} updateRide={this.updateRide} />
            );
          }}
          key={i}
        />
      );
    });

    return (
      <Grid
        container
        style={{ padding: "80px" }}
        alignContent="center"
        justify="center"
        className={classes.root}
        spacing={40}
      >
        <Grid item>{routes}</Grid>
        <Grid item container spacing={24}>
          {rides}
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(withSnackbar(RidesIndex)));
