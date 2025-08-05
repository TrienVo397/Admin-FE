import { Show } from "@refinedev/antd";
import { useShow, useOne } from "@refinedev/core";
import { Typography, Card, Row, Col, Tag, Space } from "antd";
import { ProjectOutlined, FolderOutlined, CalendarOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons";
import React from "react";

const { Title, Text } = Typography;

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
