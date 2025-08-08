import React from "react";
import { AuthPage } from "@refinedev/antd";
import { AppIcon } from "../app-icon";

export const LoginPage: React.FC = () => {
  return (
    <AuthPage
      type="login"
      title={<AppIcon />}
      formProps={{
        initialValues: {
          username: "",
          password: "",
        },
      }}
      renderContent={(content, title) => {
        return (
          <div
            style={{
              maxWidth: "400px",
              margin: "auto",
              marginTop: "8vh",
            }}
          >
            {title}
            {React.cloneElement(content as React.ReactElement, {
              children: React.Children.map(
                (content as React.ReactElement).props.children,
                (child: React.ReactElement) => {
                  if (child?.props?.name === "email") {
                    // Replace email field with username field
                    return React.cloneElement(child, {
                      name: "username",
                      label: "Username",
                      placeholder: "Enter your username",
                      rules: [
                        {
                          required: true,
                          message: "Username is required",
                        },
                      ],
                    });
                  }
                  return child;
                }
              ),
            })}
          </div>
        );
      }}
    />
  );
};
