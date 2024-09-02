import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";

const SignUpInitialForm = (props) => {
  const { handleChange, first, last, phoneNumber, email, password, history } =
    props;
  const done = (e) => {
    console.log("done");
    e.preventDefault();
    console.log("history", history);
    history.push("/signup/profile");
  };
  return (
    <>
      <Grid item xs={12} md={6}>
        <TextField
          onChange={handleChange}
          value={first}
          type="text"
          name="first"
          label="First Name"
          placeholder="Enter your first name"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          onChange={handleChange}
          value={last}
          type="text"
          name="last"
          label="Last Name"
          placeholder="Enter your last name"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          onChange={handleChange}
          value={phoneNumber}
          type="text"
          name="phoneNumber"
          label="Phone Number"
          placeholder="For drivers to contact you"
          variant="outlined"
        />
      </Grid>
      <Grid item>
        <TextField
          onChange={handleChange}
          value={email}
          type="email"
          name="email"
          label="Email"
          placeholder="Enter your email address"
          variant="outlined"
        />
      </Grid>
      <Grid item>
        <TextField
          onChange={handleChange}
          value={password}
          type="password"
          name="password"
          label="Password"
          placeholder="Choose a password..."
          variant="outlined"
        />
      </Grid>

      <Grid item>
        <Button component={Link} to="/" variant="contained" color="primary">
          Back
        </Button>
        <Button
          component={Link}
          to="/signup/profile"
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </Grid>
    </>
  );
};

export default SignUpInitialForm;
