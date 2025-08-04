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
import { Space, Table, Input, Select } from "antd";
import React from "react";

export const UserList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    onSearch: (params: any) => {
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
          field: "is_active",
          operator: "eq",
          value: params.is_active,
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
          dataIndex="is_active"
          title={"Status"}
          render={(value) => (
            <span style={{ 
              color: value ? '#52c41a' : '#ff4d4f',
              fontWeight: 'bold'
            }}>
              {value ? 'Active' : 'Inactive'}
            </span>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: 200 }}
                placeholder="Select status"
                allowClear
                options={[
                  { value: true, label: "Active" },
                  { value: false, label: "Inactive" },
                ]}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex={["created_at"]}
          title={"Created at"}
          render={(value: any) => <DateField value={value} />}
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
