import { Show } from "@refinedev/antd";
import { useShow, useList, useNavigation } from "@refinedev/core";
import { Typography, Card, Row, Col, Tag, Table, Space } from "antd";
import { UserOutlined, MailOutlined, CalendarOutlined, ProjectOutlined } from "@ant-design/icons";
import React from "react";

const { Title, Text } = Typography;

export const UserShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const { show } = useNavigation();

  const record = data?.data;

  // Get projects created by this user
  const { data: projectsData, isLoading: projectsLoading } = useList({
    resource: "projects",
    filters: [
      {
        field: "created_by",
        operator: "eq",
        value: record?.id,
      },
    ],
  });

  const userProjects = projectsData?.data || [];

  const projectColumns = [
    {
      title: "Project Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Record<string, unknown>) => (
        <Space>
          <ProjectOutlined />
          <a
            onClick={() => show("projects", record.id as string)}
            style={{ fontWeight: "bold", cursor: "pointer" }}
          >
            {text}
          </a>
        </Space>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      render: (text: string) => (
        <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 300 }}>
          {text}
        </Text>
      ),
    },
    
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      render: (date: string) => date ? new Date(date).toLocaleDateString() : "Not set",
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      render: (date: string) => date ? new Date(date).toLocaleDateString() : "Not set",
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <Show isLoading={isLoading}>
      {record && (
        <div>
          <Card title="User Information" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={3}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  {record.full_name}
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
                      <UserOutlined style={{ marginRight: 8 }} />
                      <Text strong>Username: </Text>
                      <Text>{record.username}</Text>
                    </div>
                    <div>
                      <MailOutlined style={{ marginRight: 8 }} />
                      <Text strong>Email: </Text>
                      <Text>{record.email}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card size="small" title="Profile Information">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <Text strong>Notes: </Text>
                      <Text>{record.notes || "No notes available"}</Text>
                    </div>
                    <div>
                      <Text strong>Roles: </Text>
                      <div style={{ marginTop: 4 }}>
                        {record.roles?.map((role: string) => (
                          <Tag key={role} color="blue" style={{ marginBottom: 4 }}>
                            {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                          </Tag>
                        )) || <Text type="secondary">No roles assigned</Text>}
                      </div>
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

              <Col xs={24} sm={24} md={8}>
                <Card size="small" title="Project Statistics">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <Text strong>Total Projects: </Text>
                      <Tag color="blue">{userProjects.length}</Tag>
                    </div>
                    <div>
                      <Text strong>Projects Created: </Text>
                      <Tag color="green">{userProjects.length}</Tag>
                    </div>
                    <div>
                      <Text strong>Recent Projects: </Text>
                      <Tag color="purple">
                        {userProjects.filter(p => {
                          const created = new Date(p.created_at);
                          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                          return created > thirtyDaysAgo;
                        }).length}
                      </Tag>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>

          <Card title="Created Projects" loading={projectsLoading}>
            {userProjects.length > 0 ? (
              <Table
                dataSource={userProjects}
                columns={projectColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <ProjectOutlined style={{ fontSize: "48px", color: "#d9d9d9" }} />
                <Title level={4} style={{ color: "#999", marginTop: "16px" }}>
                  No projects created by this user
                </Title>
              </div>
            )}
          </Card>
        </div>
      )}
    </Show>
  );
};
