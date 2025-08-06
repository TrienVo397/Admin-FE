import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, DatePicker } from "antd";
import React from "react";
import { Dayjs } from "dayjs";

const { TextArea } = Input;

export const ProjectEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    onMutationSuccess: () => {
      // Handle successful update
    },
  });

  const handleFinish = (values: Record<string, unknown>) => {
    // Transform dates to ISO strings and validate metadata
    const transformedValues = {
      ...values,
      start_date: values.start_date ? (values.start_date as Dayjs).toISOString() : null,
      end_date: values.end_date ? (values.end_date as Dayjs).toISOString() : null,
      meta_data: values.meta_data ? (() => {
        try {
          // Validate JSON format if provided
          if (values.meta_data) {
            JSON.parse(values.meta_data as string);
          }
          return values.meta_data;
        } catch {
          throw new Error('Invalid JSON format in metadata');
        }
      })() : null,
    };

    // Call the original onFinish with transformed values
    formProps.onFinish?.(transformedValues);
  };

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label={"Project Name"}
          name="name"
          rules={[
            {
              required: true,
              min: 2,
              max: 100,
              message: "Project name must be between 2-100 characters",
            },
          ]}
        >
          <Input placeholder="Enter a descriptive project name" />
        </Form.Item>

        <Form.Item
          label={"Note"}
          name="note"
          rules={[
            {
              max: 1000,
              message: "Note cannot exceed 1000 characters",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Enter project notes or description"
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Form.Item
          label={"Repository Path"}
          name="repo_path"
          rules={[
            {
              max: 500,
              message: "Repository path cannot exceed 500 characters",
            },
          ]}
        >
          <Input
            placeholder="e.g., /projects/my-project or https://github.com/user/repo"
          />
        </Form.Item>

        <Form.Item
          label={"Metadata (JSON)"}
          name="meta_data"
          help="Enter metadata as valid JSON format (optional)"
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch {
                  return Promise.reject(new Error('Please enter valid JSON format'));
                }
              },
            },
          ]}
        >
          <TextArea
            rows={3}
            placeholder='{"key": "value", "type": "web", "framework": "react"}'
          />
        </Form.Item>

        <Form.Item
          label={"Start Date"}
          name="start_date"
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select project start date"
          />
        </Form.Item>

        <Form.Item
          label={"End Date"}
          name="end_date"
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Select project end date"
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};
