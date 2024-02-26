import { useParams } from "react-router-dom";
import MeetingInfo from "../components/meetingDetails/meetingInfoPaper";
import { Flex, Skeleton } from "@mantine/core";
import AgendaMinutesDisplay from "../components/meetingDetails/agendaMinutesDisplay";
import {
  AgendaPointInterface,
  ChangeInterface,
  CommentInterface,
  GuestContributorInterface,
} from "../interfaces";
import TimelineComponent, {
  ChangeCommentType,
} from "../components/meetingDetails/timeLineComponent";
import ParticipantsList from "../components/meetingDetails/participantsListView";
import useFetch from "../hooks/useFetch";
import { useEffect, useState } from "react";
import { loadSelectedMeeting } from "../store/slices/meetingDetails";
import { useDispatch } from "react-redux";
import MeetingDetailsHeader from "../components/meetingDetails/meetingDetailsHeader";
import { useAppSelector } from "../store/hooks";
import { UserInterface } from "../interfaces";

export default function MeetingDetailViewPage() {
  const { meetingId } = useParams();
  const [endpoint, setEndpoint] = useState(`meetings/${meetingId}`);
  const { resultData: meetingResultData } = useFetch(endpoint);
  const loggedInUser = useAppSelector<any>((state) => state.user.userData);
  const { resultData: changeLogData } = useFetch(
    `changes/meeting/${meetingId}/`
  );
  // const {resultData : commentsResultData, loading: commentsLoading, error: commentsError} = useFetch(`comment/meeting/${meetingId}/`)
  const [changesAndComments, setChangesAndComments] = useState<
    ChangeCommentType[]
  >([]);
  const [inviteId, setInviteId] = useState<number>(0);
  const [inviteStatus, setInviteStatus] = useState<string>("P");
  const [isHostOrContributor, setIsHostOrContributor] = useState(false);

  const [hasNotes, setHasNotes] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setEndpoint(`meetings/${meetingId}`);
  }, [meetingId]);

  //fetching meeting
  useEffect(() => {
    if (meetingResultData) {
      console.log("Meeting data", meetingResultData);
      dispatch(loadSelectedMeeting(meetingResultData));

      const hasNotes = meetingResultData.agenda_points.some(
        (point: AgendaPointInterface) => point.notes
      );
      setHasNotes(hasNotes);

      if (loggedInUser) {
        const guest = meetingResultData.guests.filter(
          (guest : GuestContributorInterface) => guest.id === loggedInUser.id
        )[0];
        if (guest) {
          setInviteId(guest.invite_id);
          setInviteStatus(guest.invite_status);
        } else {
          const contributor = meetingResultData.contributors.filter(
            (contributor : GuestContributorInterface) => contributor.id === loggedInUser.id
          )[0];
          if (contributor) {
            setInviteId(contributor.invite_id);
            setInviteStatus(contributor.invite_status);
          }
        }

        setIsHostOrContributor(
          meetingResultData.contributors
            .map((contributor: UserInterface) => contributor.id)
            .includes(loggedInUser.id) ||
            meetingResultData.author.id === loggedInUser.id
        );
      }
    }
  }, [meetingResultData]);

  //fetching changes
  useEffect(() => {
    console.log("Fetched change data:", changeLogData);
    // console.log("Fetched comments data:", meetingResultData.comments)

    if (changeLogData && meetingResultData) {
      const data = changeLogData.results.map((change: ChangeInterface) => {
        return {
          type: "change",
          content: change.text_content,
          dateTime: change.time,
          user: change.user,
        };
      });
      data.push(
        ...meetingResultData.comments.map((comment: CommentInterface) => {
          return {
            type: "comment",
            content: comment.content,
            dateTime: comment.date_created,
            user: comment.author,
          };
        })
      );
      data.sort((a : ChangeCommentType, b : ChangeCommentType) => a.dateTime < b.dateTime)
      console.log("Comments and changes:", data);
      setChangesAndComments(data);
    }
  }, [changeLogData, meetingResultData]);

  return (
    <Flex direction="column" gap="lg">
      {meetingResultData ? (
        <>
          <MeetingDetailsHeader
            googleMeetLink={meetingResultData.meeting_url}
            hasNotes={hasNotes}
            iniviteId={inviteId}
            invitationStatus={inviteStatus}
            allowEdit={isHostOrContributor}
            changeInvitationStatus={setInviteStatus}
          />
          <MeetingInfo
            meetingDetails={meetingResultData}
            allowEdit={isHostOrContributor}
          />
          <ParticipantsList
            guests={meetingResultData.guests}
            contributors={meetingResultData.contributors}
            allowEdit={isHostOrContributor}
          />
          <AgendaMinutesDisplay
            infoType={hasNotes ? "Minutes" : "Agenda"}
            agendaItems={meetingResultData.agenda_points}
            allowEdit={isHostOrContributor}
          />
          <TimelineComponent items={changesAndComments} />
        </>
      ) : (
        <>
          <Skeleton height={50} width="100%"></Skeleton>
          <Skeleton height={350} width="100%"></Skeleton>
          <Skeleton height={127} width="100%"></Skeleton>
          <Skeleton height={350} width="100%"></Skeleton>
          <Skeleton height={150} width="100%"></Skeleton>
        </>
      )
      }
    </Flex>
  );
}
