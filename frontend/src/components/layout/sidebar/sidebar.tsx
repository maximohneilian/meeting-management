import { useEffect, useState } from "react";
// import Navlink from "./navlink/navlink";
import {
  IconBrandWindows,
  IconTemplate,
  IconCalendarPlus,
  IconLogout,
} from "@tabler/icons-react";
import { Button, NavLink, useMantineTheme } from "@mantine/core";
import "./sidebar.css";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/user";
import { startNewDefaultMeeting } from "../../../store/slices/newMeeting";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import { modals } from "@mantine/modals";
import CreateMeetingStepper from "../../createmeeting/createMeetingStepper";

export default function Sidebar() {
  const [active, setActive] = useState(0);
  const theme = useMantineTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const newMeeting = useAppSelector(state => state.newMeeting)

  const openCreateMeetingModal = () => {
    modals.open({
      title: "New meeting",
      size: "xl",
      children: <CreateMeetingStepper />,
      centered: true,
      styles: { header: { display: "none" } },
      modalId: "new-meeting-modal",
    });
  };

  //navigate to new meeting details page after meeting created
  useEffect(() => {
    if(newMeeting.data.id && newMeeting.createdSuccesfully) {
      dispatch(startNewDefaultMeeting())
      navigate(`/meeting/${newMeeting.data.id}`)
    }
  }, [newMeeting, navigate])

  const linkData = [
    {
      label: "Meeting Overview",
      icon: <IconBrandWindows strokeWidth={1.5} color={theme.white} />,
      to: "/",
    },
    {
      label: "Templates",
      icon: <IconTemplate strokeWidth={1.5} color={theme.white} />,
      to: "/templates",
    },
    // {label: "New Meeting", icon: <IconCalendarPlus strokeWidth={1.5} color={theme.white} />, to: "/meeting/new"},
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(logout());
  };

  return (
    <>
      <div>
        {linkData.map((item, index) => (
          <NavLink
            key={item.label}
            href={item.to}
            label={item.label}
            active={index === active}
            leftSection={item.icon}
            autoContrast
            c={theme.white}
            variant="light"
            className="navlink"
            onClick={() => setActive(index)}
          />
        ))}
        <Button
          fullWidth
          leftSection={
            <IconCalendarPlus strokeWidth={1.5} color={theme.white} />
          }
          color={theme.white}
          justify="start"
          variant="subtle"
          style={{
            fontWeight: "500",
            fontFamily: "var(--mantine-font-family",
            paddingLeft: "15px",
          }}
          onClick={() => {
            dispatch(startNewDefaultMeeting());
            openCreateMeetingModal();
          }}
        >
          New Meeting
        </Button>
      </div>
      <div>
        <Button
          fullWidth
          leftSection={<IconLogout strokeWidth={1.5} color={theme.white} />}
          color={theme.white}
          justify="start"
          variant="subtle"
          style={{ fontWeight: "500", fontFamily: "var(--mantine-font-family" }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </>
  );
}
