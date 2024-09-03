import React, { Component } from "react";
import axios from "axios";
import { Route } from "react-router-dom";
import SignUpInitialForm from "../components/SignUpInitialForm";
import SignUpProfileForm from "../components/SignUpProfileForm";
import Grid from "@material-ui/core/Grid";
import Typeography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { withSnackbar } from "notistack";

const styles = (theme) => ({
  signup: {
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    paddingTop: "24px",
    alignItems: "center",
    JustifyContent: "center",
  },
});

class SignupFlow extends Component {
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
      phoneNumber: "",
      homeMountain: "",
    };
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.submitSignup = this.submitSignup.bind(this);
  }

  handleChange(e) {
    console.log("handling change", e.target, this);
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleCheckbox(e) {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  }

  handleFileChange(e) {
    console.log("handling file change", e.target.files, this);
    console.log("name", e.target.name);
    console.log("value", e.target.value);
    URL.revokeObjectURL(this.state[e.target.name]);
    const blob = URL.createObjectURL(e.target.files[0]);
    console.log(blob);
    this.setState({
      [e.target.name]: blob,
    });
  }

  async submitSignup(e) {
    console.log("signing up...");
    e.preventDefault();
    if (!this.state.profilePicture) {
      return this.props.enqueueSnackbar("Please include a photo!", {
        variant: "error",
      });
    }
    if (!this.state.email) {
      return this.props.enqueueSnackbar("Please include an email address!", {
        variant: "error",
      });
    }
    let profilePicture;
    let file;
    try {
      profilePicture = await ((url) => {
        return axios
          .get(url)
          .then((response) => {
            console.log(response);
            return {
              type: response.headers["content-type"],
              data: response.data,
            };
            // return response.data
          })
          .catch((err) => {
            console.log(err);
            this.props.enqueueSnackbar(
              "There was an error loading your photo from disk",
              { variant: "error" },
            );
          });
      })(this.state.profilePicture);
      const file = new File([profilePicture.data], "profilePicture", {
        type: profilePicture.type,
      });
    } catch (err) {
      console.log(err);
      this.props.enqueueSnackbar(
        "There was an error parsing your photo data -- is it the right kind of file?",
        { variant: "error" },
      );
      return null;
    }
    const config = {
      headers: { type: "content-type: multi-part/form" },
    };
    const data = new FormData();
    for (let key in this.state) {
      if (key !== "profilePicture") {
        data.append(key, this.state[key]);
      }
    }

    console.log(file);
    data.append("profilePicture", file);
    axios
      .post("/api/auth/signup", data, config)
      .then((res) => {
        console.log("res.data", res.data);
        if (res.data.type === "error") {
          console.log("error", res.data);
          this.setState({
            message: res.data.message,
          });
        } else {
          console.log("res.data", res.data);
          console.log("token", res.data.token);
          localStorage.setItem("jwtToken", res.data.token);
          this.props.login(res.data);
        }
      })
      .catch((err) => {
        console.log(err, err.response, err.status);
        console.log("catching error");
        let message;
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          message = `${err.response.status}: ${err.response.data.message || err}`;
        } else if (err.request) {
          // The request was made but no response was received
          console.log(err.request);
          message = "404: server not found";
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", err.message);
          message = "Error" + err.message;
        }
        console.log(err);
        if (err.status === "429")
          message = `${err.response.status}: too many requests`;
        // this.setState({ message })
        this.props.enqueueSnackbar(message, { variant: "error" });
        // this.props.liftMessage({ type: 'error', message })
      });
  }

  render() {
    console.log("rendering signupFlow");
    const { classes } = this.props;
    const initialProps = {
      first: this.state.first,
      last: this.state.last,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      password: this.state.password,
      handleChange: this.handleChange,
    };

    const profileProps = {
      profilePicture: this.state.profilePicture,
      skier: this.state.skier,
      snowboarder: this.state.snowboarder,
      complicated: this.state.complicated,
      homeMountain: this.state.homeMountain,
      handleChange: this.handleChange,
      submitSignup: this.submitSignup,
      handleFileChange: this.handleFileChange,
      handleCheckbox: this.handleCheckbox,
    };

    return (
      <Grid className={classes.signup}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          spacing={24}
          style={{ minHeight: "90vh" }}
        >
          <Typeography variant="h3">Sign Up</Typeography>
          <Route
            exact
            path="/signup"
            render={() => <SignUpInitialForm {...initialProps} />}
          />
          <Route
            path="/signup/profile"
            render={() => <SignUpProfileForm {...profileProps} />}
          />
        </Grid>
      </Grid>
    );
  }
}

export default withSnackbar(withStyles(styles)(SignupFlow));
