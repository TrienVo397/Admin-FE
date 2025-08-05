import {
  DateField,
  DeleteButton,
  EditButton,
  FilterDropdown,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table, Input, Select, Tag } from "antd";
import React from "react";

export const UserList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    onSearch: (params: Record<string, unknown>) => {
      return [
        {
          field: "username",
          operator: "contains",
          value: params.username,
        },
        {
          field: "full_name",
          operator: "contains",
          value: params.full_name,
        },
        {
          field: "email",
          operator: "contains",
          value: params.email,
        },
        {
          field: "roles",
          operator: "contains",
          value: params.roles,
        }
      ];
    },
  });

  return (
    <List
      createButtonProps={{ children: "Create User" }}
      title="Users"
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column
          dataIndex="username"
          title={"Username"}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search username" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="full_name"
          title={"Full Name"}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search full name" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="email"
          title={"Email"}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search email" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="notes"
          title={"Notes"}
          render={(text: string) => (
            <span style={{
              color: text ? '#333' : '#999',
              fontStyle: text ? 'normal' : 'italic'
            }}>
              {text || 'No notes'}
            </span>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search notes" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="roles"
          title={"Roles"}
          render={(roles: string[]) => (
            <div>
              {roles?.map((role: string) => (
                <Tag key={role} color="blue" style={{ marginBottom: 2 }}>
                  {role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')}
                </Tag>
              )) || <span style={{ color: '#999', fontStyle: 'italic' }}>No roles</span>}
            </div>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: 200 }}
                placeholder="Select role"
                allowClear
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
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex={["created_at"]}
          title={"Created at"}
          render={(value: string) => <DateField value={value} />}
        />
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
