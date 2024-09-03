import React, { Component } from "react";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first: "",
      last: "",
      email: "",
      password: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSubmit(e) {
    console.log("signing up...");
    e.preventDefault();
    axios
      .post("auth/signup", this.state)
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
          this.props.liftToken(res.data);
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
        this.props.liftMessage({ message });
      });
  }
  render() {
    console.log("rendering signup");
    let component;

    if (this.props.clicked) {
      component = (
        <div className="signup">
          <h3>Create a new account: </h3>
          <form onSubmit={this.handleSubmit}>
            <TextField
              onChange={this.handleChange}
              value={this.state.first}
              type="text"
              name="first"
              placeholder="Enter your first name"
              variant="outlined"
            />
            <TextField
              onChange={this.handleChange}
              value={this.state.last}
              type="text"
              name="last"
              placeholder="Enter your last name"
              variant="outlined"
            />
            <TextField
              onChange={this.handleChange}
              value={this.state.email}
              type="email"
              name="email"
              placeholder="Enter your email address"
              variant="outlined"
            />
            <TextField
              onChange={this.handleChange}
              value={this.state.password}
              type="password"
              name="password"
              placeholder="Choose a password..."
              variant="outlined"
            />
            <TextField type="submit" value="Sign Up!" variant="outlined" />
          </form>
        </div>
      );
    } else {
      component = (
        <Button
          onClick={(e) => this.props.toggleForm("signup")}
          variant="contained"
          color="primary"
        >
          Sign Up
        </Button>
      );
    }
    return component;
  }
}
