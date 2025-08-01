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
          field: "title",
          operator: "contains",
          value: params.title,
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
      createButtonProps={{ children: "Create" }}
      title="Projects"
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column
          dataIndex="title"
          title={"Project Name"}
         
        />
        <Table.Column
          dataIndex=""
          title={"No. of users"}
         
        />
        <Table.Column
          dataIndex="status"
          title={"Status"}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Select
                style={{ width: 200 }}
                placeholder="Select status"
                allowClear
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "rejected", label: "Rejected" },
                ]}
              />
            </FilterDropdown>
          )}
        />
        {/* <Table.Column
          dataIndex="content"
          title={"Content"}
          render={(value: any) => {
            if (!value) return "-";
            return <MarkdownField value={value.slice(0, 80) + "..."} />;
          }}
        /> */}
        {/* <Table.Column
          dataIndex={"category"}
          title={"Category"}
          render={(value) =>
            categoryIsLoading ? (
              <>Loading...</>
            ) : (
              categoryData?.data?.find((item) => item.id === value?.id)?.title
            )
          }
        /> */}
        <Table.Column
          dataIndex={["createdAt"]}
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
