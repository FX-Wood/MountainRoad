import React from "react";
import LoginFlow from "../views/LoginFlow";

const ReAuthorize = (props) => {
  return (
    <div className="re-authorize">
      <h1>ReAuthorize</h1>
      <LoginFlow login={props.login} />
    </div>
  );
};

export default ReAuthorize;
