import axios from "axios";
import React, { Component } from "react";
import ReAuthorize from "../components/ReAuthorize";
import { withSnackbar } from "notistack";
import { Link } from "react-router-dom";
import RidesIndex from "../components/RidesIndex";

// material ui
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

class Dash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      first: "",
      last: "",
      profilePicture: null,
      skier: false,
      snowboarder: false,
      complicated: false,
      homeMountain: "",
    };
    this.getProfile = this.getProfile.bind(this);
  }

  getProfile() {
    if (this.props.user) {
      console.log(axios.defaults.headers);
      axios
        .get("/api/user")
        .then((res) => {
          console.log("GET /user", res.data);
          this.setState(res.data);
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          this.props.enqueueSnackbar(JSON.stringify(err), { variant: "error" });
        });
    }
  }
  render() {
    let content;
    if (this.props.user) {
      const { first, last, snowboarder, skier, profilePicture } =
        this.props.user.profile;
      console.log(profilePicture);
      content = (
        <div className="gridReset" style={{ padding: "12px" }}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={24}
            style={{ minHeight: "90vh" }}
          >
            <Grid item>
              <Typography variant="h3">Dashboard</Typography>
              <Typography variant="subtitle1">{first + " " + last}</Typography>
            </Grid>
            {/* <Grid item>
                                <img src={ URL.createObjectURL(new File([profilePicture.buffer], 'profilePicture', {type: profilePicture.mimetype}))} alt="user avatar"/>
                            </Grid> */}
            <Grid item>
              <Button
                component={Link}
                to={"/browse/mtn"}
                variant="contained"
                color="primary"
              >
                Browse mountains
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to={"/browse/rides"}
                variant="contained"
                color="primary"
              >
                Browse rides
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to={"/ride/new"}
                variant="contained"
                color="primary"
              >
                Get a ride
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={this.props.logout}
                variant="contained"
                color="primary"
              >
                Logout
              </Button>
            </Grid>
            <Grid item xs={12}>
              <RidesIndex />
            </Grid>
          </Grid>
        </div>
      );
    } else {
      content = <ReAuthorize login={this.props.login} />;
    }
    return content;
  }
}

export default withSnackbar(Dash);
