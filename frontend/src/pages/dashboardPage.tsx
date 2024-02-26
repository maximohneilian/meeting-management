import { Center, Grid, GridCol } from "@mantine/core";
import MeetingWidget from "../components/widgets/meetingsWidget";
import CalendarComponent from "../components/widgets/calendar";
import PendingInvitationWidget from "../components/widgets/pendingInviteWidget";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { MeetingDetailsInterface } from "../interfaces";
import { MeetingInvitesInterface } from "../interfaces";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setGoogleAccessToken } from "../store/slices/user";
import { setNewMeeting } from "../store/slices/newMeeting";
import { modals } from "@mantine/modals";
import CreateMeetingStepper from "../components/createmeeting/createMeetingStepper";

export default function DashboardPage() {
  const [meetings, setMeetings] = useState<MeetingDetailsInterface[]>([]);
  const [invitations, setInvites] = useState<MeetingInvitesInterface[]>([]);
  const isMobile = useMediaQuery("(max-width: 70em)");
  const [columnHeight, setColumnHeight] = useState(isMobile ? "30em" : "25em");
  const { hash } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //on redirect after google login
  useEffect(() => {
    // console.log("hash", hash)
    if (hash) {
      console.log("hash", hash);
      const accessTokenElement = hash
        .split("&")
        .filter((element) => element.startsWith("access_token="))[0];
      const accessToken = accessTokenElement.split("=")[1];
      console.log("Google Access Token", accessToken);
      dispatch(setGoogleAccessToken(accessToken));

      const createMeetingForm = localStorage.getItem("createMeetingForm");
      if (createMeetingForm) {
        dispatch(setNewMeeting(JSON.parse(createMeetingForm)));
        navigate("#");
        modals.open({
          title: "New meeting",
          size: "xl",
          modalId: "new-meeting-modal",
          children: <CreateMeetingStepper />,
          centered: true,
          styles: { header: { display: "none" } },
        });
      }
    }
  }, [hash]);

  useEffect(() => {
    setColumnHeight(isMobile ? "auto" : "23em");
  }, [isMobile]);

  const {
    resultData: meetingsData,
    loading: meetingsLoading,
    error: meetingsError,
  } = useFetch("meetings/");
  const {
    resultData: invitesData,
    loading: invitesLoading,
    error: invitesError,
  } = useFetch("meetings/invites/");

  useEffect(() => {
    console.log(meetings);
    if (
      meetingsData != null &&
      invitesData != null &&
      meetingsData.results &&
      invitesData.results
    ) {
      console.log("meetings", meetingsData.results);
      setMeetings(meetingsData.results);
      setInvites(invitesData.results);
    }
  }, [meetingsData, invitesData, meetings]);

  return (
    <Grid
      style={{ position: "relative" }}
      justify="center"
      align="center"
      gutter="xl"
    >
      <>
        <GridCol span={{ base: 12, lg: 8 }}>
          <MeetingWidget
            type="upcoming"
            meetings={meetings}
            height={columnHeight}
            loading={meetingsLoading}
            error={meetingsError}
          />
        </GridCol>
        <GridCol span={{ base: 12, lg: 3 }}>
          <Center>
            <CalendarComponent height={columnHeight} />
          </Center>
        </GridCol>
        <GridCol span={{ base: 12, lg: 8 }}>
          <MeetingWidget
            type="past"
            meetings={meetings}
            height={columnHeight}
            loading={meetingsLoading}
            error={meetingsError}
          />
        </GridCol>

        <GridCol span={{ base: 12, lg: 3 }}>
          <Center w="100%">
            <PendingInvitationWidget
              scrollHeight={columnHeight}
              invitations={invitations}
              loading={invitesLoading}
              error={invitesError}
            />
          </Center>
        </GridCol>
      </>
    </Grid>
  );
}
