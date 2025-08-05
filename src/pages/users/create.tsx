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
