import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import {
  AppShell,
  Burger,
  LoadingOverlay,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "../components/layout/sidebar/sidebar";
import Header from "../components/layout/header/header";
import { useEffect } from "react";
// import NotificationBubble from "../components/notifications/notification";
import { useDispatch } from "react-redux";
import { loadUser } from "../store/slices/user";
import useFetch from "../hooks/useFetch";

export default function ProtectedRoute() {
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { resultData, loading } = useFetch("users/me/");

  const isLoggedIn = useAppSelector((state) => state.user.validAccessToken);

  useEffect(() => {
    console.log("Access Token from Redux store:", isLoggedIn);
    if (isLoggedIn === null) {
      navigate("/login", { state: { from: location.pathname } });
    } else if (resultData) {
      console.log("UserDetails:", resultData);
      dispatch(loadUser(resultData));
    }
  }, [isLoggedIn, navigate, resultData, dispatch]);

  return (
    <AppShell
      header={{ height: 50 }}
      navbar={{
        width: 200,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="lg"
    >
      <AppShell.Header>
        <Header
          Burger={
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              style={{ backgroundColor: "var(--mantine-color-white)" }}
            />
          }
        />
      </AppShell.Header>
      <AppShell.Navbar
        style={{
          backgroundColor: theme.colors.green[0],
          padding: "20px 7px",
          justifyContent: "space-between",
        }}
      >
        <Sidebar />
      </AppShell.Navbar>
      <AppShell.Main style={{ backgroundColor: "var(--mantine-color-gray-0)", height:"100%"}}>
        {loading ? (
          <>
            <LoadingOverlay
              visible={loading}
              zIndex={1000}
              overlayProps={{ radius: "sm", blur: 2 }}
              loaderProps={{ type: "bars" }}
            />
          </>
        ) : (
          <>
            <Outlet />
            {/* <NotificationBubble /> */}
          </>
        )}
      </AppShell.Main>
    </AppShell>
  );
}
