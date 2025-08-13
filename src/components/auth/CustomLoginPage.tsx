import React from "react";
import {
  Row,
  Col,
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
  theme,
} from "antd";
import { useLogin, useTranslate } from "@refinedev/core";
import type { LoginFormTypes } from "@refinedev/core";

import { ThemedTitleV2 } from "@refinedev/antd";

const { Title } = Typography;
const { useToken } = theme;

export const CustomLoginPage: React.FC = () => {
  const { token } = useToken();
  const [form] = Form.useForm<LoginFormTypes>();
  const translate = useTranslate();
  
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>();

  const CardTitle = (
    <Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        fontSize: "22px",
        lineHeight: "32px",
        fontWeight: 700,
        overflowWrap: "break-word",
        hyphens: "manual",
        textAlign: "center",
        marginBottom: 0,
      }}
    >
      {translate("pages.login.title", "Sign in to your account")}
    </Title>
  );

  return (
    <Layout
      style={{
        height: "100vh",
        background: `radial-gradient(50% 50% at 50% 50%, ${token.colorPrimary} 0%, ${token.colorPrimaryBg} 100%)`,
        backgroundSize: "cover",
      }}
    >
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
        }}
      >
        <Col xs={22} sm={16} md={12} lg={10} xl={8}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ThemedTitleV2 collapsed={false} />
              </div>
            }
            headStyle={{
              borderBottom: 0,
              padding: "32px 32px 0 32px",
            }}
            bodyStyle={{
              padding: "32px",
            }}
            style={{
              maxWidth: "400px",
              margin: "auto",
              backgroundColor: token.colorBgElevated,
              borderRadius: "8px",
            }}
          >
            {CardTitle}
            <Form<LoginFormTypes>
              layout="vertical"
              form={form}
              onFinish={(values) => login(values)}
              requiredMark={false}
              initialValues={{
                remember: false,
                username: "",
                password: "",
              }}
              style={{ marginTop: "32px" }}
            >
              <Form.Item
                name="username"
                label={translate("pages.login.fields.username", "User Name")}
                rules={[
                  {
                    required: true,
                    message: translate(
                      "pages.login.errors.requiredUsername",
                      "Username is required",
                    ),
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder={translate("pages.login.fields.username", "Username")}
                  autoComplete="username"
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                label={translate("pages.login.fields.password", "Password")}
                rules={[
                  {
                    required: true,
                    message: translate(
                      "pages.login.errors.requiredPassword",
                      "Password is required",
                    ),
                  },
                ]}
              >
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="●●●●●●●●"
                  size="large"
                />
              </Form.Item>
              
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "24px",
                }}
              >
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    {translate("pages.login.buttons.rememberMe", "Remember me")}
                  </Checkbox>
                </Form.Item>
              </div>
              
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isLoading}
                  block
                >
                  {translate("pages.login.signin", "Sign in")}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};
