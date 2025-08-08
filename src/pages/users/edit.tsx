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
        <Form.Item
          label={"Notes"}
          name="notes"
        >
          <TextArea rows={3} placeholder="Enter notes about this user" />
        </Form.Item>
        <Form.Item
          label={"Roles"}
          name="roles"
          rules={[
            {
              required: true,
              message: "Please select at least one role",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select user roles"
            options={[
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
              { value: "tester", label: "Tester" },
              { value: "developer", label: "Developer" },
              { value: "analyst", label: "Analyst" },
              { value: "project_manager", label: "Project Manager" },
              { value: "team_lead", label: "Team Lead" },
            ]}
          />
        </Form.Item>
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
