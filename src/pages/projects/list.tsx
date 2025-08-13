import {
  DateField,
  FilterDropdown,
  List,
  useTable,
} from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";
import { Table, Input, Tag } from "antd";
import React from "react";

export const ProjectList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    onSearch: (params: Record<string, unknown>) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: params.name,
        },
        {
          field: "note",
          operator: "contains",
          value: params.note,
        }
      ];
    },
  });

  const { show } = useNavigation();

  return (
    <List
      createButtonProps={{ children: "Create Project" }}
      title="Projects"
    >
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => {
            if (record.id) {
              show("projects", record.id);
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
          dataIndex="name"
          title={"Project Name"}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search project name" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="note"
          title={"Note"}
          render={(value: string) => (
            <span title={value}>
              {value?.length > 50 ? `${value.substring(0, 50)}...` : value || "No note"}
            </span>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search note" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="start_date"
          title={"Start Date"}
          render={(value: string) => value ? new Date(value).toLocaleDateString() : "Not set"}
        />
        <Table.Column
          dataIndex="end_date"
          title={"End Date"}
          render={(value: string) => value ? new Date(value).toLocaleDateString() : "Not set"}
        />
        <Table.Column
          dataIndex="created_by"
          title={"Created By"}
          render={(value: string) => (
            <Tag color="green" style={{ fontSize: "11px" }}>
              {value?.substring(0, 8) || "Unknown"}
            </Tag>
          )}
        />
        <Table.Column
          dataIndex={["created_at"]}
          title={"Created at"}
          render={(value: string) => <DateField value={value} />}
        />
      </Table>
    </List>
  );
};
