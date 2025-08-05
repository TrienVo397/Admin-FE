import { Show, Edit, useForm } from "@refinedev/antd";
import { useShow, useOne } from "@refinedev/core";
import { Typography, Card, Row, Col, Tag, Space, Form, Input, DatePicker } from "antd";
import { ProjectOutlined, FolderOutlined, CalendarOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons";
import React from "react";
import { Dayjs } from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

export const ProjectShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  // Get creator user information
  const { data: creatorData } = useOne({
    resource: "users",
    id: record?.created_by,
    queryOptions: {
      enabled: !!record?.created_by,
    },
  });

  // Get updater user information if different from creator
  const { data: updaterData } = useOne({
    resource: "users",
    id: record?.updated_by,
    queryOptions: {
      enabled: !!record?.updated_by && record?.updated_by !== record?.created_by,
    },
  });

  const creator = creatorData?.data;
  const updater = updaterData?.data;

  return (
    <Show isLoading={isLoading}>
      {record && (
        <div>
          <Card title="Project Information" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={3}>
                  <ProjectOutlined style={{ marginRight: 8 }} />
                  {record.name}
                  {/* Project Status Indicator */}
                  <Tag 
                    color={
                      record.end_date && new Date(record.end_date) < new Date() 
                        ? "red" 
                        : record.start_date && new Date(record.start_date) <= new Date()
                        ? "green"
                        : "blue"
                    }
                    style={{ marginLeft: 12 }}
                  >
                    {record.end_date && new Date(record.end_date) < new Date() 
                      ? "Ended" 
                      : record.start_date && new Date(record.start_date) <= new Date()
                      ? "Active"
                      : "Planned"}
                  </Tag>
                </Title>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Basic Details">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <Text strong>ID: </Text>
                      <Text code>{record.id}</Text>
                    </div>
                    <div>
                      <ProjectOutlined style={{ marginRight: 8 }} />
                      <Text strong>Name: </Text>
                      <Text>{record.name}</Text>
                    </div>
                    <div>
                      <FolderOutlined style={{ marginRight: 8 }} />
                      <Text strong>Repository: </Text>
                      <Text code>{record.repo_path || "Not specified"}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Project Details">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <FileTextOutlined style={{ marginRight: 8 }} />
                      <Text strong>Note: </Text>
                      <Text>{record.note || "No notes available"}</Text>
                    </div>
                    <div>
                      <Text strong>Current Version: </Text>
                      <Text code>{record.current_version || "None"}</Text>
                    </div>
                    <div>
                      <Text strong>Metadata: </Text>
                      {record.meta_data ? (
                        <div style={{ marginTop: 8 }}>
                          <Card size="small" style={{ backgroundColor: "#f5f5f5" }}>
                            <pre style={{ 
                              fontSize: "11px", 
                              margin: 0, 
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-all"
                            }}>
                              {(() => {
                                try {
                                  return JSON.stringify(JSON.parse(record.meta_data), null, 2);
                                } catch {
                                  return record.meta_data;
                                }
                              })()}
                            </pre>
                          </Card>
                        </div>
                      ) : (
                        <Text type="secondary">No metadata</Text>
                      )}
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Timeline">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      <Text strong>Start Date: </Text>
                      <Text>{record.start_date ? new Date(record.start_date).toLocaleDateString() : "Not set"}</Text>
                    </div>
                    <div>
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      <Text strong>End Date: </Text>
                      <Text>{record.end_date ? new Date(record.end_date).toLocaleDateString() : "Not set"}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Timestamps">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      <Text strong>Created: </Text>
                      <Text>{new Date(record.created_at).toLocaleString()}</Text>
                    </div>
                    <div>
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      <Text strong>Updated: </Text>
                      <Text>{new Date(record.updated_at).toLocaleString()}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Contributors">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <UserOutlined style={{ marginRight: 8 }} />
                      <Text strong>Created By: </Text>
                      <Tag color="blue">
                        {creator?.full_name || creator?.username || record.created_by?.substring(0, 8)}
                      </Tag>
                    </div>
                    <div>
                      <UserOutlined style={{ marginRight: 8 }} />
                      <Text strong>Updated By: </Text>
                      <Tag color="green">
                        {updater?.full_name || updater?.username ||
                          (record.updated_by === record.created_by ? "Same as creator" : record.updated_by?.substring(0, 8))}
                      </Tag>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>
        </div>
      )}
    </Show>
  );
};

export const ProjectEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    onMutationSuccess: () => {
      // Handle successful update
    },
  });

  const handleFinish = (values: Record<string, unknown>) => {
    // Transform dates to ISO strings
    const transformedValues = {
      ...values,
      start_date: values.start_date ? (values.start_date as Dayjs).toISOString() : null,
      end_date: values.end_date ? (values.end_date as Dayjs).toISOString() : null,
      meta_data: values.meta_data ? (() => {
        try {
          // Validate JSON format
          JSON.parse(values.meta_data as string);
          return values.meta_data;
        } catch {
          // If not valid JSON, wrap in quotes to make it a string
          return JSON.stringify(values.meta_data);
        }
      })() : null,
    };
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
              message: "Project name must be at least 2 characters",
            },
            {
              max: 100,
              message: "Project name must not exceed 100 characters",
            },
          ]}
        >
          <Input placeholder="Enter a unique project name" />
        </Form.Item>
        
        <Form.Item
          label={"Note"}
          name="note"
          extra="Optional description or notes about the project"
        >
          <TextArea 
            rows={4} 
            placeholder="Enter project notes or description"
            showCount
            maxLength={500}
          />
        </Form.Item>
        
        <Form.Item
          label={"Repository Path"}
          name="repo_path"
          extra="File system path where the project is located"
        >
          <Input placeholder="e.g., /projects/my-project" />
        </Form.Item>
        
        <Form.Item
          label={"Metadata"}
          name="meta_data"
          extra="Additional project metadata in JSON format (optional)"
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                try {
                  JSON.parse(value);
                  return Promise.resolve();
                } catch {
                  return Promise.reject(new Error("Must be valid JSON format"));
                }
              }
            }
          ]}
        >
          <TextArea
            rows={3}
            placeholder='{"tech_stack": ["React", "Node.js"], "project_type": "web_application"}'
          />
        </Form.Item>
        
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={"Start Date"}
              name="start_date"
              extra="When the project is planned to start"
            >
              <DatePicker 
                style={{ width: "100%" }} 
                placeholder="Select start date"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label={"End Date"}
              name="end_date"
              extra="When the project is planned to end"
              dependencies={['start_date']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || !getFieldValue('start_date')) {
                      return Promise.resolve();
                    }
                    if (value.isAfter(getFieldValue('start_date'))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('End date must be after start date'));
                  },
                }),
              ]}
            >
              <DatePicker 
                style={{ width: "100%" }} 
                placeholder="Select end date"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Edit>
  );
};
