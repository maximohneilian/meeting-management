import React, { useEffect, useState } from "react";
import {
  Title,
  Text,
  Paper,
  Pagination,
  Center,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import MeetingTable from "../themeComponents/meetingTables";
import { MeetingDetailsInterface } from "../../interfaces";

interface MeetingWidgetProps {
  meetings: Array<MeetingDetailsInterface>;
  type: "past" | "upcoming";
  height: string;
  loading: boolean;
  error: any;
}

const MINUTE_IN_MS: number = 60000;

const MeetingWidget: React.FC<MeetingWidgetProps> = ({
  meetings,
  type,
  height,
  loading,
  error,
}) => {
  const [activePage, setPage] = useState(1);
  const [filteredMeetings, setFilteredMeetings] = useState([meetings]);

  function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) {
      return [];
    }
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
  }

  //every minute the meetings shall be refreshed
  useEffect(() => {
    setInterval(filterAndPaginateMeetings, MINUTE_IN_MS);
    filterAndPaginateMeetings();
  }, [meetings]);

  function filterAndPaginateMeetings() {
    const now = Date.now();

    const filtered = meetings.filter((meeting) => {
      const startTime = meeting.start_time ?? "";
      const meetingDateTime = Date.parse(startTime);
      type === "past" ? meetingDateTime < now : meetingDateTime >= now;
      return type === "past" ? meetingDateTime < now : meetingDateTime >= now;
    });

    const paginated = chunk(filtered, 4);

    const updatedMeetings = paginated.map((page: MeetingDetailsInterface[]) => {
      return page.map((meeting: MeetingDetailsInterface) => {
        const [date, time] = (meeting.start_time || "").split("T");
        const [hours, minutes] = time.split(":");

        return {
          ...meeting,
          meetingDate: date,
          startTime: `${hours}:${minutes}`,
        };
      });
    });

    setFilteredMeetings(updatedMeetings);
  }

  return (
    <>
      {filteredMeetings && (
        <Paper h={height} style={{ position: "relative" }}>
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "15", blur: 0.5 }}
          />
          <Stack justify="space-between" style={{ height: "100%" }}>
            <Stack justify="flex-start" gap="xs">
              <Title
                order={2}
                style={{
                  color: type === "past" ? "gray" : "green",
                }}
                mb="1rem"
              >
                {type === "past" ? "Past Meetings" : "Upcoming Meetings"}
              </Title>
              {error && (
                <Center style={{ height: "100%" }}>
                  <Text size="xl" c="red">
                    {error.message}
                  </Text>
                </Center>
              )}
              {!error &&
              !loading &&
              meetings.length != 0 &&
              filteredMeetings.length > 0 ? (
                <>
                  <MeetingTable meetings={filteredMeetings[activePage - 1]} />
                </>
              ) : (
                <Text>No {type} meetings found.</Text>
              )}
            </Stack>
            <Center>
              <Pagination
                total={Math.ceil(filteredMeetings.length)}
                value={activePage}
                onChange={setPage}
                color="green"
                size="sm"
                withEdges
              />
            </Center>
          </Stack>
        </Paper>
      )}
    </>
  );
};

export default MeetingWidget;
