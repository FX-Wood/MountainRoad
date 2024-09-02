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
import Chip from "@material-ui/core/Chip";

const styles = (theme) => ({
  root: {
    maxWidth: "80%",
    justifySelf: "flexEnd",
  },
  flexibleIndicator: {
    color: theme.palette.secondary.main,
  },
});

class RideShow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rides: [],
      users: [],
      mountains: [],
      phoneNumber: "",
      filter: "",
    };
  }
  getMountains = () => {
    return axios
      .get("/api/mountains")
      .then((res) => {
        console.log("got mountains", res);
        this.props.enqueueSnackbar(JSON.stringify(res.data.message), {
          variant: "success",
        });
        this.setState({
          mountains: res.data.data,
        });
      })
      .catch((err) => {
        console.log("err", err);
        this.props.enqueueSnackbar(JSON.stringify(err.response), {
          variant: "error",
        });
      });
  };
  getRides = () => {
    return axios
      .get("/api/share")
      .then((res) => {
        console.log("res", res);
        this.props.enqueueSnackbar(JSON.stringify(res.data.message), {
          variant: "success",
        });
        return res.data.data;
      })
      .catch((err) => {
        console.log("err", err);
        this.props.enqueueSnackbar(JSON.stringify(err.response), {
          variant: "error",
        });
      });
  };
  getUsers = () => {
    return axios
      .get("/api/share/users")
      .then((res) => {
        console.log("res", res);
        this.props.enqueueSnackbar(JSON.stringify(res.data.message), {
          variant: "success",
        });
        return res.data.data;
      })
      .catch((err) => {
        console.log("err", err);
        this.props.enqueueSnackbar(JSON.stringify(err.response), {
          variant: "error",
        });
      });
  };
  joinRides = async () => {
    let ridesRaw = await this.getRides();
    console.log("got rides", ridesRaw);
    const usersRaw = await this.getUsers();
    console.log("got users", usersRaw);

    ridesRaw.forEach((ride) => {
      const doc = usersRaw.find((user) => {
        console.log("ids", user.id, ride.user);
        return user.id == ride.user;
      });
      console.log(doc);
      ride.user = doc;
    });
    console.log(ridesRaw);
    this.setState({
      rides: ridesRaw,
    });
  };

  componentDidMount() {
    console.log("rides index did mount");
    this.joinRides();
    this.getMountains();
  }

  defaultFilter = (arr) => {
    return arr;
  };
  filterByMtn = (ride, mtnName) => {
    console.log(ride, mtnName);
    if (!mtnName) {
      return ride;
    } else {
      return ride.mountain.name === mtnName;
    }
  };
  changeFilter(filterString) {
    console.log("changing filter to", filterString);
    this.setState({
      filter: filterString,
    });
  }
  render() {
    const { classes } = this.props;
    const chips = this.state.mountains.map((mtn, i) => {
      console.log("making chip for", mtn);
      console.log("name", mtn.name);
      return (
        <Grid item>
          <Chip
            key={i}
            onClick={() => this.changeFilter(mtn.name)}
            label={mtn.name}
          />
        </Grid>
      );
    });
    const rides = this.state.rides
      .filter((ride) => this.filterByMtn(ride, this.state.filter))
      .map((ride, i) => {
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
              <Grid container spacing={24} alignItems="baseline">
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
                <Grid item>
                  <Typography variant="body1">
                    Name:{" "}
                    {ride.user.profile.first + " " + ride.user.profile.last}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <Typography variant="body1">{ride.note}</Typography>
              </Grid>
              <Grid item container spacing={24}>
                <Grid item>
                  <Typography variant="body1">
                    Start of day: {mStart.format("h:mm a")}
                    {startFlex && (
                      <span className={classes.flexibleIndicator}>
                        {" "}
                        Flexible
                      </span>
                    )}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    End of day: {mEnd.format("h:mm a")}
                    {endFlex && (
                      <span className={classes.flexibleIndicator}>
                        {" "}
                        Flexible
                      </span>
                    )}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    Contact phone: {ride.user.profile.phoneNumber}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        );
      });

    // const routes = this.state.rides.map((ride, i) => {
    //     const url = `/dash/ride/${ride._id}`
    //     return (
    //         <Route
    //             path={url}
    //             render={() => {
    //                 return (
    //                     <RideUpdate rideID={ride._id} updateRide={this.updateRide}/>
    //                 )
    //             }}
    //             key={i}
    //         />
    //     )
    // })

    return (
      <Grid
        container
        style={{ padding: "80px" }}
        alignContent="center"
        justify="center"
        className={classes.root}
        spacing={40}
      >
        <Typography variant="h3">Folks that need a ride</Typography>
        <Grid container style={{ margin: "1em" }}>
          <Grid item>
            <Chip onClick={() => this.changeFilter("")} label="All" />
          </Grid>
          {chips}
        </Grid>
        {/* <Grid item>
                    {routes}
                </Grid> */}
        <Grid item container spacing={24}>
          {rides}
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(withStyles(styles)(withSnackbar(RideShow)));
