import React from "react";

const PageNotFound: React.FC = () => {
  const message = "Page not found or Unauthorized";
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ fontSize: "18px", color: "#ff0000" }}>{message}</h1>
    </div>
  );
};

export default PageNotFound;
