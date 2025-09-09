import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import React from "react";

const { TextArea } = Input;

export const UserCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Username"}
          name="username"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Email"}
          name="email"
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Full Name"}
          name="full_name"
        >
          <Input />
        </Form.Item>
  {/* Removed Notes and Roles fields */}
        <Form.Item
          label={"Password"}
          name="password"
          rules={[
            {
              required: true,
              min: 8,
              message: "Password must be at least 8 characters",
            },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>
      </Form>
    </Create>
  );
};
