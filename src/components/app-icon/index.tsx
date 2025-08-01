import React from "react";
import appLogo from "./app-logo.png";

export const AppIcon: React.FC = () => {
  return (
    <img
      src={appLogo}
      alt="App Logo"
      style={{
        width: "24px",
        height: "24px",
        objectFit: "contain"
      }}
    />
  );
};
