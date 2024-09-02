import React from "react";
import { Route, Redirect } from "react-router-dom";

// kudos to Tyler McGinnis for this solution:
// https://stackoverflow.com/questions/43164554/how-to-implement-authenticated-routes-in-react-router-4

const PrivateRoute = ({ component: Component, authorized, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        authorized === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};
