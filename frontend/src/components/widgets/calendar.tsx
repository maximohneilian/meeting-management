import { Center, Paper, Space } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import "@mantine/dates/styles.css";
import dayjs from "dayjs";
import { useState } from "react";
import AddButton from "../buttons/addButton";
import { useDispatch } from "react-redux";
import { startNewMeetingWithDate } from "../../store/slices/newMeeting";
import { modals } from "@mantine/modals";
import CreateMeetingStepper from "../createmeeting/createMeetingStepper";
import { useMediaQuery } from "@mantine/hooks";



export default function CalendarComponent({
  height,
}: {
  height: string;
}) {
  const [selected, setSelected] = useState<Date[]>([]);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 82em)");

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

  const handleSelect = (date: Date) => {
    setSelected([date]);
    dispatch(startNewMeetingWithDate(date.toISOString()));
  };

  return (
    <Paper
      h={height}
      style={{
        width: isMobile ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Center>
        <Calendar
          getDayProps={(date: Date) => ({
            selected: selected.some((s) => dayjs(date).isSame(s, "date")),
            onClick: () => handleSelect(date),
          })}
          // renderDay={(date) => {
          //   const day = date.getDate();
          //   return (
          //     <Indicator size={6} color="red" offset={-2} disabled={day !== 16}>
          //       <div>{day}</div>
          //     </Indicator>
          //   );
          // }}
        />
      </Center>
      <Space h="md" />
      <Center>
        <AddButton onClick={openCreateMeetingModal} />
      </Center>
    </Paper>
  );
}
