import {
  Refine,
  Authenticated,
} from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  useNotificationProvider,
  ThemedLayoutV2,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { localDataProvider } from "./providers/localDataProvider";
import { apiDataProvider } from "./providers/apiDataProvider";
import { authProvider } from "./providers/authProvider";
import { config } from "./config";
import { App as AntdApp } from "antd";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import routerBindings, {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { UserOutlined, ProjectOutlined } from "@ant-design/icons";
import {
  UserList,
  UserCreate,
  UserEdit,
  UserShow,
} from "./pages/users";
import {
  ProjectList,
  ProjectCreate,
  ProjectShow,
  ProjectEdit,
} from "./pages/projects";

import { AppIcon } from "./components/app-icon";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header, HoverExpandSider, CustomLoginPage } from "./components";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={config.USE_MOCK_DATA ? localDataProvider : apiDataProvider}
                authProvider={config.USE_MOCK_DATA ? undefined : authProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                resources={[
                  {
                    name: "users",
                    list: "/users",
                    create: "/users/create",
                    edit: "/users/edit/:id",
                    show: "/users/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Users",
                      icon: <UserOutlined />,
                    },
                  },
                  {
                    name: "projects",
                    list: "/projects",
                    create: "/projects/create",
                    edit: "/projects/edit/:id",
                    show: "/projects/show/:id",
                    meta: {
                      canDelete: true,
                      label: "Projects",
                      icon: <ProjectOutlined />,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "fCotI0-lfG9co-5GCXK7",
                  title: { text: "SkyTest", icon: <AppIcon /> },
                }}
              >
                <Routes>
                  <Route
                    element={
                      config.USE_MOCK_DATA ? (
                        <ThemedLayoutV2
                          Header={() => <Header sticky />}
                          Sider={(props) => <HoverExpandSider {...props} fixed />}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      ) : (
                        <Authenticated
                          key="authenticated-inner"
                          fallback={<CatchAllNavigate to="/login" />}
                        >
                          <ThemedLayoutV2
                            Header={() => <Header sticky />}
                            Sider={(props) => <HoverExpandSider {...props} fixed />}
                          >
                            <Outlet />
                          </ThemedLayoutV2>
                        </Authenticated>
                      )
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="users" />}
                    />
                    <Route path="/users">
                      <Route index element={<UserList />} />
                      <Route path="create" element={<UserCreate />} />
                      <Route path="edit/:id" element={<UserEdit />} />
                      <Route path="show/:id" element={<UserShow />} />
                    </Route>
                    <Route path="/projects">
                      <Route index element={<ProjectList />} />
                      <Route path="create" element={<ProjectCreate />} />
                      <Route path="edit/:id" element={<ProjectEdit />} />
                      <Route path="show/:id" element={<ProjectShow />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>

                  {/* Authentication Routes - Only show when not using mock data */}
                  {!config.USE_MOCK_DATA && (
                    <Route
                      element={
                        <Authenticated key="authenticated-outer" fallback={<Outlet />}>
                          <NavigateToResource />
                        </Authenticated>
                      }
                    >
                      <Route
                        path="/login"
                        element={<CustomLoginPage />}
                      />
                    </Route>
                  )}
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler handler={({ resource }) => { // tab title
                  const resourceLabel = resource?.meta?.label || resource?.label || resource?.name;
                  let title = "SkyTest";

                  if (resourceLabel) {
                    title = `${resourceLabel} | ${title}`;
                  }

                  return title;
                }} />
              </Refine>
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
