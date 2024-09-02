import React from "react";
import { Link } from "react-router-dom";
import SignUpAvatar from "../components/SignupAvatar";
import Grid from "@material-ui/core/Grid";

// form elements
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";

const signupProfileForm = (props) => {
  const {
    profilePicture,
    skier,
    snowboarder,
    complicated,
    homeMountain,
    handleChange,
    handleCheckbox,
    handleFileChange,
    submitSignup,
    classes,
  } = props;
  return (
    <>
      <Grid item xs={12}>
        <SignUpAvatar
          src={profilePicture}
          handleFileChange={handleFileChange}
        />
      </Grid>
      <Grid item xs={12}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                name="skier"
                checked={skier}
                onChange={handleCheckbox}
              />
            }
            label="skier"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="snowboarder"
                checked={snowboarder}
                onChange={handleCheckbox}
              />
            }
            label="snowboarder"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="complicated"
                checked={complicated}
                onChange={handleCheckbox}
              />
            }
            label="it's complicated"
          />
        </FormGroup>
      </Grid>
      <Grid item>
        <TextField
          name="homeMountain"
          label="Home Mountain"
          onChange={handleChange}
          value={homeMountain}
          type="text"
          placeholder="where the heart is"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={6}>
        <Button
          component={Link}
          to="/signup"
          variant="contained"
          color="primary"
        >
          Back
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button variant="contained" color="primary" onClick={submitSignup}>
          Finish signing up
        </Button>
      </Grid>
    </>
  );
};

export default signupProfileForm;
