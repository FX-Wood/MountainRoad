import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { SnackbarProvider as Buffet } from "notistack";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

ReactDOM.render(
  <Router>
    <Buffet>
      <App />
    </Buffet>
  </Router>,
  document.getElementById("root"),
);
