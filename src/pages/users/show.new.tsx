import { Show } from "@refinedev/antd";
import { useShow, useList } from "@refinedev/core";
import { Typography, Card, Row, Col, Tag, Table, Space } from "antd";
import { UserOutlined, MailOutlined, CalendarOutlined, ProjectOutlined } from "@ant-design/icons";
import React from "react";

const { Title, Text } = Typography;

export const UserShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;

  const record = data?.data;

  // Get projects associated with this user
  const { data: projectsData, isLoading: projectsLoading } = useList({
    resource: "projects",
    filters: [
      {
        field: "owner_id",
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
      render: (text: string) => (
        <Space>
          <ProjectOutlined />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 300 }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = {
          active: "green",
          in_development: "orange",
          testing: "blue",
          completed: "purple",
        };
        return (
          <Tag color={colors[status as keyof typeof colors] || "default"}>
            {status === "in_development" ? "In Development" : 
             status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Tech Stack",
      dataIndex: "tech_stack",
      key: "tech_stack",
      render: (techStack: string[]) => (
        <>
          {techStack?.map((tech) => (
            <Tag key={tech} color="blue">
              {tech}
            </Tag>
          ))}
        </>
      ),
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
                <Card size="small" title="Status">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <Text strong>Status: </Text>
                      <Tag color={record.is_active ? "green" : "red"}>
                        {record.is_active ? "Active" : "Inactive"}
                      </Tag>
                    </div>
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
                      <Text strong>Active Projects: </Text>
                      <Tag color="green">
                        {userProjects.filter(p => p.status === "active").length}
                      </Tag>
                    </div>
                    <div>
                      <Text strong>In Development: </Text>
                      <Tag color="orange">
                        {userProjects.filter(p => p.status === "in_development").length}
                      </Tag>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Card>

          <Card title="Associated Projects" loading={projectsLoading}>
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
                  No projects assigned to this user
                </Title>
              </div>
            )}
          </Card>
        </div>
      )}
    </Show>
  );
};

export const UserEdit = () => {
  return (
    <div>
      <p>User Edit - Coming Soon</p>
    </div>
  );
};
