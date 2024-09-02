import React from "react";
import Person from "@material-ui/icons/Person";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import UploadProfilePic from "../components/UploadProfilePic";

const imageSize = 100; //px
const styles = (theme) => ({
  image: {
    width: imageSize,
    height: imageSize,
  },
});

const SignUpAvatar = (props) => {
  const { src, classes, handleFileChange } = props;

  let image;
  if (!src) {
    image = <Person className={classes.image} />;
  } else {
    image = <img src={src} className={classes.image} alt="user avatar" />;
  }
  return (
    <Grid item container xs={12}>
      <Grid item>
        <div className={classes.imageContainer}>{image}</div>
      </Grid>
      <Grid item>
        <UploadProfilePic handleFileChange={handleFileChange} />
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(SignUpAvatar);
