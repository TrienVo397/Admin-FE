import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import React from "react";

const { TextArea } = Input;

export const ProjectCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Project Name"}
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Description"}
          name="description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          label={"Status"}
          name="status"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="Select status"
            options={[
              { value: "active", label: "Active" },
              { value: "in_development", label: "In Development" },
              { value: "testing", label: "Testing" },
              { value: "completed", label: "Completed" },
            ]}
          />
        </Form.Item>
        <Form.Item
          label={"Owner ID"}
          name="owner_id"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
      </Form>
    </Create>
  );
};
