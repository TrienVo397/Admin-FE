import { Create, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";
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
          label={"Note"}
          name="note"
        >
          <TextArea rows={4} placeholder="Enter project notes or description" />
        </Form.Item>
        <Form.Item
          label={"Repository Path"}
          name="repo_path"
        >
          <Input placeholder="e.g., /projects/my-project" />
        </Form.Item>
        <Form.Item
          label={"Metadata"}
          name="meta_data"
        >
          <TextArea
            rows={3}
            placeholder="Enter metadata as JSON string (optional)"
          />
        </Form.Item>
        <Form.Item
          label={"Start Date"}
          name="start_date"
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label={"End Date"}
          name="end_date"
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Create>
  );
};
