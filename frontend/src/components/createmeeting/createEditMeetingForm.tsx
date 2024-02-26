import "@mantine/dates/styles.css";
import { UseFormReturnType } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";
import {
  TextInput,
  Input,
  Button,
  Group,
  NumberInput,
  LoadingOverlay,
  Text,
  ActionIcon,
  Stack,
} from "@mantine/core";
import AddMembers from "./addMembers";
import AddReminder from "./addReminder";
import { FileInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
// import axios from 'axios'
import { api } from "../../api";
import { CreateNewMeetingInterface, UserInterface } from "../../interfaces";
import AttachementsPill from "../attachementsPill/attachementsPill";
import axios from "axios";
import googleMeetIcon from "../../assets/images/icons/7089160_google_meet_icon.png";

declare const gapi: any;

export function getUsernamesForUserIds(
  userIDs: number[],
  availableUsers: UserInterface[]
) {
  return userIDs.map(
    (userId) =>
      availableUsers.filter((user: UserInterface) => user.id === userId)[0]
        .username
  );
}

export function getIDsForUsernames(
  userNames: string[],
  availableUsers: UserInterface[]
) {
  return userNames.map(
    (userName) =>
      availableUsers.filter(
        (user: UserInterface) => user.username === userName
      )[0].id
  );
}

export default function CreateEditMeetingForm({
  form,
  availableUsers,
  usersLoading,
  usersError,
  isEdit = false,
}: {
  form: UseFormReturnType<CreateNewMeetingInterface>;
  availableUsers: UserInterface[];
  usersLoading: boolean;
  usersError: any;
  isEdit?: boolean
}) {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const loggedInUser: UserInterface | null = useAppSelector(
    (state) => state.user.userData
  );

  const googleAccessDetails = useAppSelector(
    (state) => state.user.googleAccess
  );
  const [initialGuests, setInitialGuests] = useState<string[]>([]);
  const [initialContributors, setInitialContributors] = useState<string[]>([]);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [selectedContributors, setSelectedContributors] = useState<string[]>(
    []
  );
  const [googleMeetLoading, setGoogleMeetLoading] = useState(false)

  const [initializeMembersBoolean, setInitializeMembersBoolean] =
    useState(true);

  const [googleCalendarId, setGoogleCalendarId] = useState<any>(null);

  useEffect(() => {
    console.log("Rerender meeting form")
  },[])

  //constantly filter users which are available for selection
  useEffect(() => {
    console.log("AVAILABLE USERS", availableUsers)
    if (availableUsers.length > 0) {
      if (initializeMembersBoolean) {
        //set initial guest
        console.log("guest from form ", form.values.guests);
        console.log(
          "Usernames",
          getUsernamesForUserIds(form.values.guests, availableUsers)
        );
        let usernames = getUsernamesForUserIds(
          form.values.guests,
          availableUsers
        );
        setInitialGuests(usernames);

        //set initial contributors
        console.log("contributors from form ", form.values.contributors);
        console.log(
          "Usernames",
          form.values.contributors.map(
            (userId) =>
              availableUsers.filter(
                (user: UserInterface) => user.id === userId
              )[0].username
          )
        );
        usernames = getUsernamesForUserIds(
          form.values.contributors,
          availableUsers
        );
        setInitialContributors(usernames);

        console.log("foo")
        setInitializeMembersBoolean(false);
        setUsers(availableUsers);
      } else {
        let remainingUsers = availableUsers;

        //filter out owner
        if (loggedInUser != null) {
          remainingUsers = remainingUsers.filter(
            (user: UserInterface) => user.id != (loggedInUser as UserInterface).id
          );
        }

        setUsers(remainingUsers);
      }
    }
  }, [availableUsers, form.values]);

  const handleGuestChange = (ids: number[]) => {
    if (!initializeMembersBoolean) {
      form.setFieldValue("guests", ids);
      setSelectedGuests(getUsernamesForUserIds(ids, availableUsers));
    }
  };

  const handleContributorsChange = (ids: number[]) => {
    if (!initializeMembersBoolean) {
      form.setFieldValue("contributors", ids);
      setSelectedContributors(getUsernamesForUserIds(ids, availableUsers));
    }
  };

  const handleReminderChange = (reminderSet: string | number) => {
    form.setFieldValue("reminder", reminderSet);
  };

  function googleOauthSignIn() {
    localStorage.setItem("createMeetingForm", JSON.stringify(form.values));

    // Google's OAuth 2.0 endpoint for requesting an access token
    const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    const googleAuthForm = document.createElement("form");
    googleAuthForm.setAttribute("method", "GET"); // Send as a GET request.
    googleAuthForm.setAttribute("action", oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    const params: any = {
      client_id:
        "314637403291-d9ts6h02d6igbqqhjncmf569qoebfpm8.apps.googleusercontent.com",
      redirect_uri: `${location.protocol}//${location.host}`,
      response_type: "token",
      scope:
        "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/meetings.space.created",
      include_granted_scopes: "true",
      state: "pass-through value",
    };

    // Add googleAuthForm parameters as hidden input values.
    for (const p in params) {
      const input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", p);
      input.setAttribute("value", params[p]);
      googleAuthForm.appendChild(input);
    }

    // Add googleAuthForm to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(googleAuthForm);
    googleAuthForm.submit();
  }

  const createGoogleCalendarEvent = () => {
    const MILISECONDS_PER_MINUTE = 1000 * 60;
    console.log("Create google calender event at ", form.values.start_time)
    const startTime = new Date(form.values.start_time).toISOString();
    const endTimeMiliseconds =
      new Date(form.values.start_time).getTime() +
      form.values.duration * MILISECONDS_PER_MINUTE;
    const endTime = new Date(endTimeMiliseconds).toISOString();

    const event = {
      summary: form.values.title,
      location: form.values.location,
      description: form.values.description,
      start: {
        dateTime: startTime,
        timeZone: "Europe/Berlin",
      },
      end: {
        dateTime: endTime,
        timeZone: "Europe/Berlin",
      },
      conferenceData: {
        createRequest: { requestId: "7qxalsvy0e" },
        conferenceDataVersion: 1,
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
      attendees: form.values.guests.map(
        (guestId) =>
          availableUsers.filter((user) => user.id === guestId)[0].email
      ),
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 15 },
        ],
      },
    };

    const sendPostRequest = async () => {
      const requestConfig = {
        headers: {
          Authorization: `Bearer ${googleAccessDetails.token}`,
          "Content-Type": "application/json",
        },
      };

      try {
        const response = await api.post(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events/",
          event,
          requestConfig
        );

        if (response.data) {
          console.log("Response data", response.data);
          if (response.data.id) {
            setGoogleCalendarId(response.data.id);
          }
        } //else return setResultData("success");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.status);
          console.error(error.response);
          if (error.response?.data) {
            console.log("Error", error.response.data);
            //   if (error.response.data.detail) {
            //     return setError(error.response.data.detail);
            //   } else {
            //     return setError("Server error");
            //   }
            // } else {
            //   return setError("Operation failed");
          }
        } else {
          console.error(error);
        }
      } finally {
        // setLoading(false);
      }
    };

    sendPostRequest();
  };

  const addGoogleMeetConferenceRoom = () => {
    const sendRequest = async () => {
      const requestConfig = {
        headers: {
          Authorization: `Bearer ${googleAccessDetails.token}`,
          "Content-Type": "application/json",
        },
      };

      const space = {
        config: {
          accessType: "TRUSTED",
          entryPointAccess: "ALL",
        },
      };

      try {
        const response = await api.post(
          "https://meet.googleapis.com/v2/spaces/",
          space,
          requestConfig
        );

        if (response.data) {
          console.log("Response data", response.data);
          if (response.data.meetingUri) {
            // console.log("Conference created for event: %s", response.data.htmlLink);
            form.setFieldValue("meeting_url", response.data.meetingUri);
            setGoogleMeetLoading(false)
          }
        } //else return setResultData("success");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.status);
          console.error(error.response);
          if (error.response?.data) {
            console.log("Error", error.response.data);
          }
        } else {
          console.error(error);
        }
      } finally {
        // setLoading(false);
      }
    };

    sendRequest();
  };

  const addGoogleCalendarEventAndConference = () => {
    setGoogleMeetLoading(true)
    addGoogleMeetConferenceRoom();
    createGoogleCalendarEvent();
  };

  useEffect(() => {
    if (googleAccessDetails.token) {
      //TODO: Check for expiry
      addGoogleCalendarEventAndConference();
    }
  }, [googleAccessDetails]);

  useEffect(() => {
    if (googleCalendarId) {
      console.log("Google Calendar Id:", googleCalendarId);
    }
  }, [googleCalendarId]);

  return (
    <>
      <LoadingOverlay
        visible={usersLoading || googleMeetLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Stack gap="md">
        <div>
          <h3>{isEdit? "Edit Meeting": "Create Meeting"}</h3>
        </div>
        <TextInput
          withAsterisk
          placeholder="Meeting Title"
          {...form.getInputProps("title")}
        />
        <Group grow gap={80}>
          <DateTimePicker
            clearable
            placeholder="Start Time"
            {...form.getInputProps("start_time")}
            style={{ width: "40%" }}
          />
          <NumberInput
            defaultValue="60"
            step={5}
            min={15}
            placeholder="Duration"
            {...form.getInputProps("duration")}
            style={{ width: "40%" }}
          />
        </Group>
        <Group grow gap={80}>
          <Input placeholder="Location" {...form.getInputProps("location")} />
          <Input
            placeholder="Meeting url"
            {...form.getInputProps("meeting_url")}
            rightSection={
              <ActionIcon
                variant="subtle"
                onClick={
                  googleAccessDetails
                    ? googleOauthSignIn
                    : addGoogleCalendarEventAndConference
                }
                style={{ pointerEvents: "auto" }}
              >
                <img
                  src={googleMeetIcon}
                  alt="Google Meet"
                  style={{ width: "23px", height: "23px", cursor: "pointer" }}
                />
              </ActionIcon>
            }
          />
        </Group>
        <Input
          placeholder="Description"
          {...form.getInputProps("description")}
        />
        <div>
          <AddMembers
            title="contributors"
            users={users}
            onMembersChange={handleContributorsChange}
            initialValues={initialContributors}
            selectedUsers={selectedGuests}
          />
          <Text>{usersError && `Could not fetch users: ${usersError}`}</Text>
        </div>
        <div>
          <AddMembers
            title="guests"
            users={users}
            onMembersChange={handleGuestChange}
            initialValues={initialGuests}
            selectedUsers={selectedContributors}
          />
          <Text>{usersError && `Could not fetch users: ${usersError}`}</Text>
        </div>
        <div>
          <AddReminder onReminderChange={handleReminderChange} />
        </div>
        <FileInput
          clearable
          label="Upload files"
          multiple
          valueComponent={AttachementsPill}
          {...form.getInputProps("files")}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">{isEdit ? "Save":"Save as Template"}</Button>
        </Group>
      </Stack>
    </>
  );
}
