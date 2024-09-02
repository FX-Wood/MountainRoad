import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  input: {
    display: "none",
  },
});

const UploadProfilePic = (props) => {
  const { handleFileChange, classes } = props;
  return (
    <>
      <input
        type="file"
        id="sign-up-profile-image-upload"
        accept="image/*"
        name="profilePicture"
        className={classes.input}
        onChange={handleFileChange}
      />
      <label htmlFor="sign-up-profile-image-upload">
        <Button component={"span"} variant="contained" color="primary">
          Upload Picture
        </Button>
      </label>
    </>
  );
};

export default withStyles(styles)(UploadProfilePic);
