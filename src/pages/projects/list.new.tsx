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

export const ProjectList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
    onSearch: (params: any) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: params.name,
        },
        {
          field: "description",
          operator: "contains", 
          value: params.description,
        },
        {
          field: "status",
          operator: "eq",
          value: params.status,
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
          dataIndex="description"
          title={"Description"}
          render={(value: string) => (
            <span title={value}>
              {value?.length > 50 ? `${value.substring(0, 50)}...` : value}
            </span>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Input placeholder="Search description" />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="status"
          title={"Status"}
          render={(value) => (
            <span style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: 
                value === 'active' ? '#f6ffed' :
                value === 'in_development' ? '#fff7e6' : '#fff1f0',
              color:
                value === 'active' ? '#52c41a' :
                value === 'in_development' ? '#fa8c16' : '#ff4d4f'
            }}>
              {value === 'in_development' ? 'In Development' : 
               value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: 200 }}
                placeholder="Select status"
                allowClear
                options={[
                  { value: "active", label: "Active" },
                  { value: "in_development", label: "In Development" },
                  { value: "testing", label: "Testing" },
                  { value: "completed", label: "Completed" },
                ]}
              />
            </FilterDropdown>
          )}
        />
        <Table.Column
          dataIndex="owner_id"
          title={"Owner ID"}
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
