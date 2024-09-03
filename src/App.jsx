import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { withRouter, Link, Route, Switch, Redirect } from "react-router-dom";
import { withSnackbar } from "notistack";

// Pages
import Splash from "./views/Splash";
import LoginForm from "./components/auth/LoginForm";
import SignupFlow from "./views/SignupFlow";
import Dash from "./views/Dash";
import BrowseMountains from "./views/BrowseMountains";
import RideFlow from "./views/RideFlow";
import RideShow from "./views/RideShow";

// Components
import AppBar from "./components/AppBar";
// material UI
import CssBaseline from "@material-ui/core/CssBaseline";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import theme from "./utilities/theme";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      user: null,
      mountains: [],
      message: "",
      lockedResult: "",
    };
    this.addMountain = this.addMountain.bind(this);
    this.liftTokenToState = this.liftTokenToState.bind(this);
    this.liftMessageToState = this.liftMessageToState.bind(this);
    this.checkForLocalToken = this.checkForLocalToken.bind(this);
    this.logout = this.logout.bind(this);
  }

  addMountain(mountain) {
    this.setState({ mountain });
  }

  liftTokenToState({ token, user, message }, referringURL) {
    console.log(
      "[App.jsx]: lifting token to state",
      { token, user, message },
      { referringURL },
    );
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const path = referringURL || "/dash";
    this.props.enqueueSnackbar(JSON.stringify(message), { variant: "success" });
    this.setState({ token, user, message });
    this.props.history.push(path);
  }

  liftMessageToState(message, { variant }) {
    console.log("[App.jsx]: lifting error to state", message);
    this.props.enqueueSnackbar(JSON.stringify(message), { variant });
    this.setState({ message });
  }

  logout() {
    console.log("[App.jsx] logout(): logging out", {
      localStorage: localStorage,
    });
    // Remove the token from localStorage
    localStorage.removeItem("jwtToken");
    // Remove the user and token from state
    this.setState({
      token: "",
      user: null,
    });
    this.props.history.push("/");
  }

  checkForLocalToken(destinationUrl) {
    console.log(
      '[App.jsx]: checkForLocalToken(), localStorage["jwtToken"]',
      localStorage["jwtToken"],
    );
    const currentLocation = this.props.history.location;
    console.log({ currentLocation });
    const destination = destinationUrl || "/dash";
    let token = localStorage.getItem("jwtToken");
    if (!token || token === "undefined") {
      // If there is no token, remove the entry in localStorage
      localStorage.removeItem("jwtToken");
      this.setState({
        token: "",
        user: null,
      });
    } else {
      // If found, send token to be verified
      axios
        .post("/auth/me/from/token", { token })
        .then((res) => {
          if (res.data.type === "error") {
            console.log(
              "there was an older token sir, and it didn't check out",
              res.data,
            );
            // if error, remove the bad token and display an error
            localStorage.removeItem("jwtToken");
            this.props.enqueueSnackbar(JSON.stringify(res.data), {
              variant: "error",
            });
            // clear token from state as well
            this.setState({
              token: "",
              user: null,
            });
          } else {
            // Upon receipt, store token
            localStorage.setItem("jwtToken", res.data.token);
            // append token to all axios headers
            axios.defaults.headers.common["Authorization"] =
              `Bearer ${res.data.token}`;
            // show success message
            this.props.enqueueSnackbar("Login successful", {
              variant: "success",
            });
            // redirect to page
            this.props.history.push(destination);
            // Put token in state
            this.setState({
              token: res.data.token,
              user: res.data.user,
            });
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          this.props.enqueueSnackbar(JSON.stringify(err), { variant: "error" });
        });
    }
  }

  componentDidMount() {
    console.log(
      "[App.jsx]: componentDidMount(), this.state",
      JSON.stringify(this.state),
    );
    this.checkForLocalToken();
  }

  render() {
    console.log(theme);
    let user = this.state.user;

    const authProps = {
      login: this.liftTokenToState,
      logout: this.logout,
      openSnackbar: this.liftMessageToState,
    };

    let content;
    if (this.state.user) {
      content = (
        <Switch>
          <Route exact path="/" render={() => <Splash user={user} />} />
          <Route path="/signup" render={() => <SignupFlow {...authProps} />} />
          <Route
            exact
            path="/login"
            render={() => <LoginForm {...authProps} />}
          />
          <Route
            path="/dash"
            render={() => (
              <Dash
                user={user}
                login={this.liftTokenToState}
                logout={this.logout}
              />
            )}
          />
          <Route
            exact
            path="/browse/mtn"
            render={() => (
              <BrowseMountains
                user={user}
                addMountain={this.addMountain}
                {...authProps}
              />
            )}
          />
          <Route exact path="/ride/new" component={RideFlow} />
          <Route
            exact
            path="/browse/rides"
            render={() => <RideShow user={user} />}
          />
        </Switch>
      );
    } else {
      content = (
        <>
          <Route exact path="/" render={() => <Splash user={user} />} />
          <Route path="/signup" render={() => <SignupFlow {...authProps} />} />
          <Route path="/login" render={() => <LoginForm {...authProps} />} />
        </>
      );
    }
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar user={user} logout={this.logout} />
        {content}
      </MuiThemeProvider>
    );
  }
}

export default withRouter(withSnackbar(App));
