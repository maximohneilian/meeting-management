import { ActionIcon, Button, Group, Menu, Paper, Text, useMantineTheme } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import googleMeetIcon from "../../assets/images/icons/7089160_google_meet_icon.png";
import {
  IconCheck,
  IconFileTypePdf,
  IconMenu2,
  IconPencilPlus,
  IconX,
} from "@tabler/icons-react";
import useApiRequest from "../../hooks/useApiRequest";
import { useEffect } from "react";

export default function MeetingDetailsHeader({
  hasNotes,
  googleMeetLink,
  iniviteId,
  invitationStatus,
  allowEdit,
  changeInvitationStatus,
}: {
  hasNotes: boolean;
  googleMeetLink: string;
  iniviteId: number,
  invitationStatus: string,
  allowEdit: boolean,
  changeInvitationStatus: (status : string) => void,
}) {
  const navigate = useNavigate();
  const { sendRequest, resultData } = useApiRequest();
  const theme = useMantineTheme()


  const handleAcceptMeeting = (invite_id: number) => {
    sendRequest("patch", `/meetings/invites/accept/${invite_id}/`, null);
    console.log("HANDLE ACCEPT");
  };

  const handleRejectMeeting = (invite_id: number) => {
    sendRequest("patch", `/meetings/invites/reject/${invite_id}/`, null);
    console.log("HANDLE REJECT");
  };

  useEffect(() => {
    if (resultData) {
      console.log("Result:", resultData.status);
      changeInvitationStatus(resultData.status)
    }
  },[resultData])

  return (
    <Group justify="space-between">
      <Group>
        {googleMeetLink && (
          <Button
            radius="xl"
            onClick={() => window.open(googleMeetLink, "_blank")}
            leftSection={
              <img
                src={googleMeetIcon}
                alt="Google Meet"
                style={{ width: "23px", height: "23px", cursor: "pointer" }}
              />
            }
          >
            Join with Google Meet
          </Button>
        )}
      </Group>
      {iniviteId > 0 &&
        <Paper py={4} px={20} style={{backgroundColor: theme.colors.green[8]}} radius="xl">
          <Group gap={25}>
            <Text fz="var(--mantine-font-size-sm)" fw={600}>Will you go?</Text>
            <Group>
              <ActionIcon variant={invitationStatus === "A" ? "outline" : "subtle"} radius="xl" color={theme.colors.green[2]} onClick={() => handleAcceptMeeting(iniviteId)}>
                <IconCheck color={theme.colors.green[2]}/>
              </ActionIcon>
              <ActionIcon variant={invitationStatus === "A" ? "subtle" : "outline" } radius="xl" color={theme.colors.red[6]} onClick={() => handleRejectMeeting(iniviteId)}>
                <IconX color={theme.colors.red[6]}/>
              </ActionIcon>
            </Group>
          </Group>
        </Paper >
      }
      <Group>
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <IconMenu2 />
          </Menu.Target>
          <Menu.Dropdown color="green">
            <Menu.Label>Meeting</Menu.Label>
            <Menu.Item
              leftSection={<IconFileTypePdf size={18} />}
              disabled={!hasNotes}
              onClick={() => navigate("pdf/", { relative: "path" })}
            >
              Download Summary
            </Menu.Item>
            <Menu.Item
              leftSection={<IconPencilPlus size={18} />}
              disabled={hasNotes || !allowEdit}
              onClick={() => navigate("createminutes/", { relative: "path" })}
            >
              Take notes
            </Menu.Item>
            {hasNotes && allowEdit &&
              <Menu.Item
                leftSection={<IconPencilPlus size={18} />}
                onClick={() => navigate("createminutes/", { relative: "path" })}
              >
                Edit notes
              </Menu.Item>
            }
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
