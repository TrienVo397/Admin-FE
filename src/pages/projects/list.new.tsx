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
import { Space, Table, Input, Tag } from "antd";
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
        },
        {
          field: "repo_path",
          operator: "contains",
          value: params.repo_path,
        }
      ];
    },
  });

  return (
    <List
      createButtonProps={{ children: "Create Project" }}
      title="Projects"
    >
      <Table {...tableProps} rowKey="id">
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
          dataIndex="repo_path"
          title={"Repository Path"}
          render={(value: string) => (
            <Tag color="blue" style={{ fontSize: "11px" }}>
              {value || "Not specified"}
            </Tag>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search repository path" />
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
