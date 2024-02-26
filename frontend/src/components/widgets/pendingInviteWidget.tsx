import {
  Button,
  Group,
  Text,
  Paper,
  NavLink,
  Flex,
  ScrollArea,
  Box,
  Space,
  Avatar,
  Center,
  LoadingOverlay,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { IconChevronRight } from "@tabler/icons-react";
import { MeetingInvitesInterface } from "../../interfaces";
import { useEffect, useState } from "react";
import useApiRequest from "../../hooks/useApiRequest";

interface InvitesWidgetProps {
  invitations: Array<MeetingInvitesInterface>;
  scrollHeight: string;
  loading: boolean;
  error: any;
}

const PendingInvitationWidget: React.FC<InvitesWidgetProps> = ({
  invitations,
  scrollHeight,
  loading,
  error,
}) => {
  const navigate = useNavigate();
  const { sendRequest, resultData } = useApiRequest();
  const [updatedInvites, setUpdatedInvites] =
    useState<MeetingInvitesInterface[]>(invitations);

  const formatMeetingDate = (start_time: string): string => {
    const [date] = (start_time || "").split("T");
    return `${date}`;
  };
  const formatMeetingTime = (start_time: string): string => {
    const [, time] = (start_time || "").split("T");
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const handleAcceptMeeting = (invite_id: number) => {
    sendRequest("patch", `/meetings/invites/accept/${invite_id}/`, null);
    console.log("HANDLE ACCEPT");
    if (resultData != null) {
      console.log(resultData.status);
    } else console.log("data was null");
  };

  const handleRejectMeeting = (invite_id: number) => {
    sendRequest("patch", `/meetings/invites/reject/${invite_id}/`, null);
    console.log("HANDLE REJECT");
    if (resultData != null) {
      console.log(resultData.status);
    } else console.log("data was null");
  };

  useEffect(() => {
    if (invitations?.length > 0) {
      setUpdatedInvites(invitations);
    }
  }, [invitations]);

  useEffect(() => {
    if (resultData != null) {
      if (resultData.status == "A" || resultData.status == "R") {
        const updatedInvitesAfterReject = updatedInvites.filter(
          (invitation) => invitation.id !== resultData.id
        );
        setUpdatedInvites(updatedInvitesAfterReject);
      }
    }
  }, [resultData]);

  return (
    <>
      {updatedInvites && (
        <ScrollArea
          type="always"
          h={scrollHeight}
          w="300px"
          scrollbars="y"
          p={0}
          style={{ position: "relative", boxSizing: "border-box" }}
        >
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "15", blur: 0.5 }}
          />
          {error && <Center>{error}</Center>}
          <Box w="260px">
            <Flex
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "lg",
              }}
              gap="xs"
            >
              {updatedInvites
                .filter((invitation) => !["R", "A"].includes(invitation.status))
                .map((invitation, index) => (
                  <Paper key={index} shadow="xs" p="lg" w={300}>
                    <Group
                      align="flex-start"
                      justify="space-between"
                      wrap="wrap"
                      style={{ width: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          marginInlineStart: "0",
                        }}
                      >
                        <Avatar
                          src={invitation.meeting.author.profile_picture}
                          alt={`${invitation.meeting.author.username}`}
                        />
                        <Text size="m">{`${invitation.meeting.title}`}</Text>
                      </div>
                      {/* <Badge
                    color={invitation.isNew ? "pink" : "gray"}
                    variant="filled"
                  >
                    {invitation.isNew ? "New" : "Viewed"}
                  </Badge> */}
                    </Group>
                    <Group
                      gap="lg"
                      justify="space-between"
                      wrap="wrap"
                      style={{ width: "100%" }}
                    >
                      <div style={{ cursor: "pointer" }}>
                        <NavLink
                          onClick={() =>
                            navigate(`/meeting/${invitation.meeting.id}`)
                          }
                          label={"Details"}
                          rightSection={
                            <IconChevronRight
                              size="0.8rem"
                              stroke={1.5}
                              className="mantine-rotate-rtl"
                            />
                          }
                        />
                        <Text size="sm">{`${formatMeetingDate(
                          invitation.meeting.start_time
                        )} at ${formatMeetingTime(
                          invitation.meeting.start_time
                        )}`}</Text>
                      </div>
                    </Group>
                    <Space h="md" />
                    <Group
                      gap="lg"
                      justify="space-between"
                      style={{ flexGrow: 1 }}
                    >
                      <Button
                        color="green"
                        variant="filled"
                        onClick={() => handleAcceptMeeting(invitation.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        color="red"
                        variant="filled"
                        onClick={() => handleRejectMeeting(invitation.id)}
                      >
                        Decline
                      </Button>
                    </Group>
                  </Paper>
                ))}
            </Flex>
          </Box>
        </ScrollArea>
      )}
    </>
  );
};

export default PendingInvitationWidget;
