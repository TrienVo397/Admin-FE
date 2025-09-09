import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import React from "react";

const { TextArea } = Input;

export const UserEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({});

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
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
          help="Leave empty to keep current password"
          rules={[
            {
              min: 8,
              message: "Password must be at least 8 characters",
            },
          ]}
        >
          <Input.Password placeholder="Enter new password (optional)" />
        </Form.Item>
      </Form>
    </Edit>
  );
};
