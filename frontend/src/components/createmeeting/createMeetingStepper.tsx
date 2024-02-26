import {
  Stepper,
  Group,
  Button,
  LoadingOverlay,
  Text,
  Center,
  ScrollArea,
  Flex,
  Title,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import CreateEditMeetingForm from "./createEditMeetingForm";
import AgendaPointWidget from "../agenda/agendaPointWidget";
import { useForm } from "@mantine/form";
import useApiRequest from "../../hooks/useApiRequest";
import {
  AgendaInterface,
  AgendaPointInterface,
  CreateNewMeetingInterface,
} from "../../interfaces";
import { setNewMeeting, setMeetingSuccesfullyCreated } from "../../store/slices/newMeeting";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import useFetch from "../../hooks/useFetch";
import { IconCalendarCheck } from "@tabler/icons-react";
import {  closeModal } from "@mantine/modals";

const initialAgendaPoints: Array<AgendaPointInterface> = [
  {
    id: 1,
    title: "",
    description: "",
    notes: "",
    agenda_files: [],
    order: 1,
    meeting_id: 1,
    duration: 10,
  },
];

export default function CreateMeetingStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(activeStep);
  const newMeeting = useAppSelector((state) => state.newMeeting);
  const dispatch = useDispatch();

  const meetingFormRef = useRef<HTMLFormElement>(null);
  const agendaFormRef = useRef<HTMLFormElement>(null);
  const { sendRequest, resultData, error, loading } = useApiRequest();
  const {
    resultData: availableUsersData,
    loading: availableUsersLoading,
    error: availableUsersError,
  } = useFetch("users/");

  //**************************************************/
  //Stepper
  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 3 || nextStep < 0;

    if (isOutOfBounds) {
      return;
    }

    setActiveStep(nextStep);
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
  };

  // Allow the user to freely go back and forth between visited steps.
  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && activeStep !== step;

  function handleContinue() {
    if (activeStep === 0) {
      if (meetingFormRef.current) {
        meetingFormRef.current.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    } else if (activeStep === 1) {
      if (agendaFormRef.current) {
        agendaFormRef.current.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    }
    else if (activeStep === 2) {
      console.log("New meeting id:", newMeeting.data.id)
      if(newMeeting.data.id > 0) {
        dispatch(setMeetingSuccesfullyCreated())
        closeModal("new-meeting-modal")
      }
      else {
        "Unexpected behaviour: No meeting Id found."
      }
    }
  }

  //incrementing step after positive response is received
  useEffect(() => {
    if (!loading && !error && resultData && activeStep < 2) {
      handleStepChange(activeStep + 1);

      if ("start_time" in resultData && "id" in resultData) {
        //if a meeting has been received as response
        dispatch(setNewMeeting(resultData));
      }
    }

    if (error) {
      console.log("error", error);
    }
  }, [resultData, error],);

  //**************************************************/
  //Create meeting form
  const meetingForm = useForm<CreateNewMeetingInterface>({
    initialValues: {
      ...newMeeting.data,
      start_time: newMeeting.data.start_time && new Date(newMeeting.data.start_time),
    },
    validate: {
      title: (value) => (value.trim() ? null : "* Title is required"),
      start_time: (value) => (value ? null : "* Date and time required"),
    },
  });

  useEffect(() =>{
    console.log("new meeting values", newMeeting.data)
    console.log("Meeting form values", meetingForm.values)
  },[meetingForm, newMeeting])


  function handleMeetingSubmit(values: CreateNewMeetingInterface) {
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
    sendRequest("post", "/meetings/new/", formdata);
  }

  //********************************************** */
  //Create Agenda Form
  const agendaForm = useForm<AgendaInterface>({
    initialValues: {
      agenda: initialAgendaPoints,
    },
  });

  function handleAgendaSubmit(values: AgendaInterface) {
    values.agenda.map((agendaPoint, index) => {
      const formData = new FormData();
      formData.append("title", agendaPoint.title);
      formData.append("duration", agendaPoint.duration.toString());
      formData.append("description", agendaPoint.description);
      formData.append("order", (index + 1).toString());
      console.log("Sumbit agenda:", formData)

      sendRequest(
        "post",
        `agenda-points/new/${newMeeting.data.id.toString()}/`,
        formData
      );
    });
  }

  return (
    <>
      <Stepper
        active={activeStep}
        onStepClick={setActiveStep}
        orientation="horizontal"
        size="sm"
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          gap: "var(--mantine-spacing-xl)",
          position: "relative",
          overflow: "auto",
        }}
        styles={{
          content: { height: "38rem" },
        }}
      >
        <Stepper.Step
          label="Create Meeting"
          description="General meeting setup"
          allowStepSelect={shouldAllowSelectStep(0)}
        >
          <form
            onSubmit={meetingForm.onSubmit((values) =>
              handleMeetingSubmit(values)
            )}
            ref={meetingFormRef}
          >
            <CreateEditMeetingForm
              form={meetingForm}
              availableUsers={
                availableUsersData ? availableUsersData.results : []
              }
              usersLoading={availableUsersLoading}
              usersError={availableUsersError}
            />
          </form>
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Center>
            <Text c="red">{error}</Text>
          </Center>
        </Stepper.Step>
        <Stepper.Step
          label="Add Meeting Agenda"
          description="What shall be discussed"
          allowStepSelect={shouldAllowSelectStep(0)}
        >
          <form
            onSubmit={agendaForm.onSubmit((values) =>
              handleAgendaSubmit(values)
            )}
            ref={agendaFormRef}
          >
            <ScrollArea h={"38rem"} scrollbarSize={8}>
              <AgendaPointWidget form={agendaForm} />
            </ScrollArea>
          </form>
        </Stepper.Step>
        <Stepper.Step
          label="Complete"
          description="Review"
          allowStepSelect={shouldAllowSelectStep(0)}
        >
          <Flex justify="center" direction="column" align="center" h={"38rem"} gap={20}>
            <IconCalendarCheck color="green" size={150}/>
            <Title order={2}>Meeting succesfully created</Title>
          </Flex>
        </Stepper.Step>
      </Stepper>

      <Group justify="center" mt="xl">
        <Button
          variant="default"
          onClick={() => handleStepChange(activeStep - 1)}
        >
          Back
        </Button>
        <Button onClick={handleContinue}>{activeStep < 2 ? "Continue" : "Go to meeting"}</Button>
      </Group>
    </>
  );
}
