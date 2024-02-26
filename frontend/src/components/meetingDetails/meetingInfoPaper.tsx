import {
  Text,
  Title,
  Flex,
  Stack,
  useMantineTheme,
  FileInput,
  Space,
  Pill,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import AttachementsPill from "../attachementsPill/attachementsPill";
import CustomPaper from "../themeComponents/customPaper";
import {
  CreateNewMeetingInterface,
  MeetingDetailsInterface,
} from "../../interfaces";
import { modals } from "@mantine/modals";
import CreateEditMeetingForm from "../createmeeting/createEditMeetingForm";
import { useEffect } from "react";
import { useForm } from "@mantine/form";
import useApiRequest from "../../hooks/useApiRequest";
import useFetch from "../../hooks/useFetch";

export default function MeetingInfo({
  meetingDetails,
  allowEdit,
}: {
  meetingDetails: MeetingDetailsInterface;
  allowEdit: boolean;
}) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 70em)");
  const { sendRequest } = useApiRequest();
  const {
    resultData: availableUsersData,
    loading: availableUsersLoading,
    error: availableUsersError,
  } = useFetch("users/");

  useEffect(() => {
    console.log("Rerender meeting paper")
  },[])

  const openEditMeetingForm = () => {
    modals.open({
      title: "Edit meeting",
      size: "xl",
      children: (
        <form
          onSubmit={meetingForm.onSubmit((values) => handleSaveMeeting(values))}
        >
          <CreateEditMeetingForm
            isEdit
            form={meetingForm}
            availableUsers={
              availableUsersData ? availableUsersData.results : []
            }
            usersLoading={availableUsersLoading}
            usersError={availableUsersError}
          />
        </form>
      ),
      modalId: "edit-meeting_modal",
      styles: { header: { display: "none" } },
    });
  };

  const {
    author: _author, // Omitted from the cloned object and marked as unused
    comments: _comments, // Omitted from the cloned object and marked as unused
    agenda_points: _agendaPoints, // Omitted from the cloned object and marked as unused
    ...initialValues
  } = meetingDetails;

  const meetingForm = useForm<CreateNewMeetingInterface>({
    initialValues: {
      ...initialValues,
      start_time:
        initialValues.start_time && new Date(initialValues.start_time),
      guests: initialValues.guests.map((guest) => guest.id),
      contributors: initialValues.contributors.map(
        (contributor) => contributor.id
      ),
    },
    validate: {
      title: (value) => (value.trim() ? null : "* Title is required"),
      start_time: (value) => (value ? null : "* Date and time required"),
    },
  });

  useEffect(() => {
    console.log("meeting details values", meetingDetails);
    console.log("Meeting form values", meetingForm.values);
  }, [meetingForm, meetingDetails]);

  function handleSaveMeeting(values: CreateNewMeetingInterface) {
    console.log("Sumbit Meeting form values:", values);

    const formdata = new FormData();
    formdata.append("title", values.title);
    formdata.append("start_time", new Date(values.start_time).toISOString());
    formdata.append("duration", values.duration.toString());
    formdata.append("location", values.location);
    formdata.append("description", values.description);
    formdata.append("meeting_url", values.meeting_url);

    values.guests.map((guest) => {
      formdata.append("guests", guest.toString());
    });
    values.contributors.map((contributor) => {
      formdata.append("contributors", contributor.toString());
    });
    values.meeting_files.map((file) => {
      if (file instanceof File) {
        formdata.append("files", file);
      }
    });

    console.log("Form data:", formdata);
    sendRequest("patch", "/meetings/new/", formdata);
  }

  const extractDate = (isoString: string): string => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const extractTime = (isoString: string): string => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return "Invalid time";
    }
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const backgroundColor = theme.colors.brand[2];

  const pillStyle = {
    root: {
      backgroundColor,
    },
  };

  return (
    <CustomPaper
      title="General"
      onEditClick={openEditMeetingForm}
      allowEdit={allowEdit}
      render={() => (
        <>
          <Title order={2}>{meetingDetails.title}</Title>
          <Space h="lg" />

          <Stack gap="xl">
            <Flex
              direction="row"
              rowGap="md"
              wrap="wrap"
              style={{ justifyContent: "space-between" }}
            >
              <Stack
                gap={isMobile ? "sm" : "md"}
                style={{ width: isMobile ? "100%" : "auto" }}
              >
                <Title
                  order={3}
                  style={{ minWidth: "10%", color: theme.colors.green[0] }}
                >
                  Date
                </Title>
                <Text>{extractDate(meetingDetails.start_time)}</Text>
              </Stack>

              <Stack
                gap={isMobile ? "sm" : "md"}
                // style={{ width: isMobile ? "100%" : "auto" }}
              >
                <Title
                  order={3}
                  style={{ minWidth: "10%", color: theme.colors.green[0] }}
                >
                  Host:
                </Title>
                <Pill styles={pillStyle}>
                  {meetingDetails.author.first_name &&
                  meetingDetails.author.last_name
                    ? `${meetingDetails.author.first_name} ${meetingDetails.author.last_name}`
                    : meetingDetails.author.username}
                </Pill>
              </Stack>

              <Stack
                gap={isMobile ? "sm" : "md"}
                style={{ width: isMobile ? "100%" : "auto" }}
              >
                <Title
                  order={3}
                  style={{ minWidth: "10%", color: theme.colors.green[0] }}
                >
                  Start
                </Title>
                <Text>{extractTime(meetingDetails.start_time)}</Text>
              </Stack>
              <Stack
                gap={isMobile ? "sm" : "md"}
                style={{
                  width: isMobile ? "100%" : "auto",
                  alignItems: isMobile ? "flex-start" : "auto",
                }}
              >
                <Title
                  order={3}
                  style={{ minWidth: "10%", color: theme.colors.green[0] }}
                >
                  Duration
                </Title>
                <Text>{meetingDetails.duration}</Text>
              </Stack>
              <Stack
                gap={isMobile ? "sm" : "md"}
                style={{
                  width: isMobile ? "100%" : "auto",
                  alignItems: isMobile ? "flex-start" : "auto",
                }}
              >
                <Title
                  order={3}
                  style={{ minWidth: "10%", color: theme.colors.green[0] }}
                >
                  Location
                </Title>
                <Text>{meetingDetails.location}</Text>
              </Stack>
            </Flex>
            <Stack
              justify="flex-start"
              gap={isMobile ? "sm" : "md"}
              style={{ width: isMobile ? "100%" : "auto" }}
            >
              <Title
                order={3}
                style={{ width: "10%", color: theme.colors.green[0] }}
              >
                Description
              </Title>
              <Text style={{ width: isMobile ? "100%" : "auto" }}>
                {meetingDetails.description}
              </Text>
            </Stack>
            <FileInput
              label="Attachments"
              placeholder="Upload files"
              multiple
              disabled
              valueComponent={AttachementsPill}
            />
          </Stack>
        </>
      )}
    />
  );
}
