import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const LoginForm = ({ login, logout, openSnackbar }) => {
  // form control values
  const [values, setValues] = useState({ email: "", password: "" });

  // setter for form values
  const handleChange = (e) => {
    e.persist();
    setValues((previousValues) => ({
      ...previousValues,
      [e.target.name]: e.target.value,
    }));
  };

  // focus on first input on first mount
  const firstInput = useRef();
  useEffect(() => {
    firstInput.current.focus();
  }, []); // no implicit return

  const emailController = useRef();
  const passwordController = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!values.email) {
      openSnackbar("please enter a valid email address", {
        variant: "warning",
      });
    }
    if (!values.password) {
      openSnackbar("please enter a valid password", { variant: "warning" });
    }
    if (values.email && values.password) {
      axios
        .post("/api/auth/login", values)
        .then((res) => {
          if (res.data.type === "error") {
            throw new Error(res.data);
          } else {
            localStorage.setItem("jwtToken", res.data.token);
            login(res.data);
          }
        })
        .catch((err) => {
          let message;
          if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            message = `${err.response.status}: ${err.response.data.message || err}`;
          } else if (err.request) {
            // The request was made but no response was received
            message = "404: server not found";
          } else {
            // Something happened in setting up the request that triggered an Error
            message = "Error: " + err;
          }
          // handle too many requests
          if (err.status === "429") {
            message = `${err.response.status}: too many requests`;
          }
          openSnackbar(message, { variant: "error" });
        });
    }
  };

  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit}
      spacing={24}
      direction="column"
      justify="center"
      alignItems="center"
      style={{ minHeight: "90vh" }}
    >
      <Grid item>
        <Typography variant="h3" children={"Log in"} />
      </Grid>

      <Grid item>
        <TextField
          inputRef={firstInput}
          onChange={handleChange}
          value={values.email}
          label="email"
          type="email"
          name="email"
          placeholder="Enter your email..."
          autocomplete="username"
          variant="outlined"
        />
      </Grid>

      <Grid item>
        <TextField
          onChange={handleChange}
          value={values.password}
          label="password"
          type="password"
          name="password"
          variant="outlined"
          placeholder="Enter your password..."
          autocomplete="current-password"
        />
      </Grid>

      <Grid item>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          children={"Log In!"}
        />
      </Grid>
    </Grid>
  );
};

export default LoginForm;
