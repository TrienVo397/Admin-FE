import {
  DateField,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import { useNavigation, useDelete } from "@refinedev/core";
import { Table, Input, Button, Modal } from "antd";
import React from "react";

export const UserList = () => {
  const { mutate } = useDelete();
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete this user?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        mutate({
          resource: "users",
          id,
        });
      },
    });
  };
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

  const { show } = useNavigation();

  return (
    <List
      createButtonProps={{ children: "Create User" }}
      title="Users"
    >
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => {
            if (record.id) {
              show("users", record.id);
            }
          },
          style: { cursor: "pointer" },
          onMouseEnter: (e) => {
            e.currentTarget.style.backgroundColor = "#f5f5f5";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.backgroundColor = "";
          },
        })}
      >
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
          dataIndex={"created_at"}
          title={"Created at"}
          render={(value: string) => <DateField value={value} />}
        />
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Button danger onClick={e => {
              e.stopPropagation();
              handleDelete(record.id);
            }}>
              Delete
            </Button>
          )}
        />
      </Table>
    </List>
  );
};
