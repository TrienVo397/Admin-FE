import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Avatar,
  Layout as AntdLayout,
  Space,
  Switch,
  theme,
  Typography,
} from "antd";
import React, { useContext } from "react";
import { ColorModeContext } from "../../contexts/color-mode";

const { Text } = Typography;
const { useToken } = theme;

type IUser = {
  id: string;
  username: string;
  full_name?: string;
  email: string;
  avatar?: string;
  roles?: string[];
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space >
        {user && <Text strong>Hello, {user.full_name || user.username || "User"}</Text>}
        {user?.avatar && <Avatar src={user.avatar} alt={user.full_name || user.username} />}
      </Space>
      <Switch
        checkedChildren="🌛"
        unCheckedChildren="🔆"
        onChange={() => setMode(mode === "light" ? "dark" : "light")}
        defaultChecked={mode === "dark"}
      />
    </AntdLayout.Header>
  );
};
