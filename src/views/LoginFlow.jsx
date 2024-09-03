import axios from "axios";
import React, { Component } from "react";
import { withSnackbar } from "notistack";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

class LoginFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.keyBoardSubmit = this.keyBoardSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  keyBoardSubmit(e) {
    if (e.key === "Enter") {
      this.handleSubmit(e);
    }
  }
  handleSubmit(e) {
    console.log("Logging in...");
    e.preventDefault();
    axios
      .post("/api/auth/login", {
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        if (res.data.type === "error") {
          console.log(res.status, res.data);
          return Error(res.data.message);
        } else {
          console.log(res.status, res.data);
          console.log("token", res.data.token);
          localStorage.setItem("jwtToken", res.data.token);
          return this.props.login(res.data);
        }
      })
      .catch((err) => {
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
        this.props.enqueueSnackbar(message, { variant: "error" });
      });
  }
  render() {
    return (
      <div className="gridReset" style={{ padding: "12px" }}>
        <Grid
          container
          spacing={24}
          direction="column"
          justify="center"
          alignItems="center"
          style={{ minHeight: "90vh" }}
        >
          <Grid item>
            <Typography variant="h3">Log in</Typography>
          </Grid>
          <Grid item>
            <TextField
              onChange={this.handleChange}
              value={this.state.email}
              label="email"
              type="email"
              name="email"
              variant="outlined"
              placeholder="Enter your email..."
            />
          </Grid>
          <Grid item>
            <TextField
              onChange={this.handleChange}
              value={this.state.password}
              onKeyDown={this.keyBoardSubmit}
              label="password"
              type="password"
              name="password"
              variant="outlined"
              placeholder="Enter your password..."
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              Log In!
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withSnackbar(LoginFlow);
