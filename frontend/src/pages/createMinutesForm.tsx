import {
  Text,
  Title,
  Flex,
  useMantineTheme,
  Stack,
  Divider,
  Button,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import CustomPaper from "../components/themeComponents/customPaper";
import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { AgendaPointInterface } from "../interfaces";
import useApiRequest from "../hooks/useApiRequest";
import { useNavigate } from "react-router-dom";
import MinutesItemEditor from "../components/agenda/minutesItemEditor";
import { IconDeviceFloppy } from "@tabler/icons-react";

export default function CreateMinutesForm() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 70em)");
  const { sendRequest } = useApiRequest();
  const [agendaItems, setAgendaItems] = useState<AgendaPointInterface[]>([]);
  const navigate = useNavigate();

  const meetingDetails = useAppSelector(
    (state) => state.meetingDetails.selectedMeeting
  );

  useEffect(() => {
    console.log("Meeting details:", meetingDetails)
    if (meetingDetails && meetingDetails.agenda_points) {
      setAgendaItems([...meetingDetails.agenda_points].sort((a, b) => a.order - b.order));
    }
  }, [meetingDetails]);
  
  

  const handleSubmitNotes = async () => {
    if (!meetingDetails) return;

    try {
      const patchRequests = agendaItems.map(({ id, notes }) =>
        sendRequest("patch", `/agenda-points/${id}/`, { notes })
      );

      await Promise.all(patchRequests);
      console.log("All notes submitted successfully");

      navigate(`/meeting/${meetingDetails.id}`);
    } catch (error) {
      console.error("Error submitting notes:", error);
    }
  };

  const handleSaveNote = (index: number, newNote: string) => {
    const updatedAgendaItems = agendaItems.map((item, i) => {
      if (i === index) {
        return { ...item, notes: newNote };
      }
      return item;
    });
    setAgendaItems(updatedAgendaItems);
  };

  return (
    <>
      {agendaItems && (
        <CustomPaper
          title={"Agenda"}
          allowEdit={false}
          render={() => (
            <Flex direction="column" gap="sm">
              {agendaItems.map(({ id, title, notes }, index) => (
                <Flex
                  key={id}
                  direction="column"
                  gap="md"
                  style={{ marginTop: index > 0 ? "2rem" : "0" }}
                >
                  <Flex
                    direction={isMobile ? "column" : "row"}
                    align="flex-start"
                    gap="xl"
                    style={{ width: "100%" }}
                  >
                    <Stack
                      gap={isMobile ? "sm" : "md"}
                      style={{ width: isMobile ? "100%" : "30%" }}
                    >
                      <Title order={3} style={{ color: theme.colors.green[6] }}>
                        Topic:
                      </Title>
                      <Text>{title}</Text>
                    </Stack>

                    <Stack
                      gap={isMobile ? "sm" : "md"}
                      style={{ width: isMobile ? "100%" : "70%" }}
                    >
                      <Title order={3} style={{ color: theme.colors.green[6] }}>
                        Note:
                      </Title>
                      <MinutesItemEditor
                        content={notes}
                        onUpdate={(newNote) => handleSaveNote(index, newNote)}
                      />
                    </Stack>
                  </Flex>
                  <Flex
                    direction={isMobile ? "column" : "row"}
                    align="flex-end"
                    gap="xl"
                    style={{ width: "100%" }}
                  >
                    <Stack
                      gap={isMobile ? "sm" : "md"}
                      style={{ width: isMobile ? "100%" : "30%" }}
                    >
                      {index === agendaItems.length - 1 && (
                        <Button onClick={handleSubmitNotes} variant="filled" radius="xl" rightSection={<IconDeviceFloppy/>} style={{width:'25vh'}}>
                          Save Notes
                        </Button>
                      )}
                      {index < agendaItems.length - 1 && <Divider my="sm" />}
                    </Stack>
                  </Flex>
                </Flex>
              ))}
            </Flex>
          )}
        />
      )}
    </>
  );
}
