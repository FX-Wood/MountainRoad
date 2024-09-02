import React, { Component } from "react";
import { withSnackbar } from "notistack";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";

import MomentUtils from "@date-io/moment";
import DateFnsUtils from "@date-io/date-fns";
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from "material-ui-pickers";
import axios from "axios";

// Table Ride {
//     id [pk]
//     user int [ref: - User.id]
//     day date
//     depart time
//     arrive time
//     note varchar
//   }

class RideFlow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      startFlex: false,
      end: null,
      endFlex: false,
      note: "",
      offer: 0,
      mountain: "",
      mountains: [],
    };
  }

  handleSubmit = (e) => {
    const url = `api/ride/${this.props.rideID}`;
    console.log("submitting", this.state);
    const { start, startFlex, end, endFlex, note, offer, mountain } =
      this.state;
    const data = { start, startFlex, end, endFlex, note, offer, mountain };
    axios
      .post("/api/ride", data)
      .then((res) => {
        console.log("res", res);
        this.props.enqueueSnackbar(JSON.stringify(res.data.message), {
          variant: "success",
        });
        this.props.history.push("/dash");
      })
      .catch((err) => {
        console.log("err", err);
        this.props.enqueueSnackbar(JSON.stringify(err.response), {
          variant: "error",
        });
      });
  };

  changeStart = (date) => {
    console.log("changeStart");
    this.setState({ start: date });
  };
  changeLeave = (date) => {
    console.log("changeleavedate");
    this.setState({ end: date });
  };

  handleCheckbox = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  getMountains = () => {
    console.log("getting mountains");
    axios
      .get("/api/mountains")
      .then((res) => {
        console.log("got mountains back", res.data);
        this.setState({
          mountains: res.data.data,
        });
      })
      .catch((err) => {
        console.log("error getting mountains");
        console.log(err);
      });
  };

  componentDidMount = () => {
    this.getMountains();
  };

  render() {
    const title = "Post a ride";
    const submit = this.handleSubmit;
    const buttonText = "Post ride";
    const menu = this.state.mountains.map((mtn, i) => {
      return (
        <MenuItem key={i + 1} value={mtn._id}>
          {mtn.name}{" "}
        </MenuItem>
      );
    });
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div className="gridReset" style={{ padding: "12px" }}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
            spacing={24}
            style={{ minHeight: "90vh" }}
          >
            <Grid item>
              <Typography variant="h3">{title}</Typography>
            </Grid>
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    name="startFlex"
                    checked={this.state.startFlex}
                    onChange={this.handleCheckbox}
                  />
                }
                label="flexible"
              />
              <DatePicker
                label="Pick the day"
                value={this.state.start}
                onChange={this.changeStart}
                variant="outlined"
              />
              <TimePicker
                label="pick time to leave"
                value={this.state.start}
                onChange={this.changeStart}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="endFlex"
                    checked={this.state.endFlex}
                    onChange={this.handleCheckbox}
                  />
                }
                label="flexible"
              />
              <TimePicker
                label="pick end of day"
                value={this.state.end}
                onChange={this.changeLeave}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                onChange={this.handleInput}
                value={this.state.note}
                type="text"
                name="note"
                label="note"
                placeholder="Write a quick note about the day"
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
            <Grid item>
              <FormControl variant="outlined">
                <InputLabel
                  // ref={ref => {
                  // this.InputLabelRef = ref;
                  // }}
                  htmlFor="mountain"
                >
                  Mountain
                </InputLabel>
                <Select
                  value={this.state.mountain}
                  onChange={this.handleInput}
                  input={
                    <OutlinedInput
                      labelWidth={65}
                      name="mountain"
                      id="mountain"
                      style={{ width: "200px" }}
                    />
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {menu}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button variant="contained" color="primary" onClick={submit}>
                {buttonText}
              </Button>
            </Grid>
          </Grid>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

export default withSnackbar(RideFlow);
