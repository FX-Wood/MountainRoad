import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Typography from "@material-ui/core/Typography";

// name: 'Crystal Mountain',
// image: crystal,
// website: 'www.crystalmountainresort.com',
// twitter: 'https://twitter.com/crystalmt?lang=en',
// weather: 'https://www.crystalmountainresort.com/the-mountain/mountain-report/weather-conditions/',

const styles = (theme) => ({
  image: {},
});

const MountainCard = (props) => {
  const { name, image, website, twitter, weather } = props.mtn;
  return (
    <Card>
      <CardContent>
        <CardHeader>
          <Typography></Typography>
        </CardHeader>
        <CardMedia image={image} />
        <CardActions>
          <IconButton>
            <ShareIcon />
          </IconButton>
          <IconButton>
            <FavoriteIcon />
          </IconButton>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default withStyles(styles)(MountainCard);
