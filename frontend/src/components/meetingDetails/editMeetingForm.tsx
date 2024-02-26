import { useForm } from "@mantine/form";
import { useAppSelector } from "../../store/hooks";
import { useEffect } from "react";
// import useFetch from "../../hooks/useFetch";
import { Button} from "@mantine/core";
import { CreateNewMeetingInterface} from "../../interfaces";
import { NEW_MEETING_INITIAL_STATE } from "../../store/slices/newMeeting";
// import { updateMeetingDetails } from "../../store/slices/meetingDetails";
// import { MeetingDetailsInterface } from "../../interfaces";

export default function EditMeetingForm() {
  // const dispatch = useAppDispatch(); //to trigger changes when editing
  const meetingDetails = useAppSelector(
    (state) => state.meetingDetails.selectedMeeting
  );
  // const meetingId = meetingDetails?.id;

  // const { resultData, loading, error } = useFetch(`meeting/${meetingId}`);

  const editMeetingForm = useForm<CreateNewMeetingInterface>({
    initialValues: NEW_MEETING_INITIAL_STATE.data
  });

  useEffect(() => {
    console.log ('testing to see if data is there' , meetingDetails)
    if (meetingDetails) {
      editMeetingForm.setValues({
        title: meetingDetails.title,
        // datetime_start: meetingDetails.start_time,
        duration: meetingDetails.duration,
        location: meetingDetails.location,
        description: meetingDetails.description,
        // attachements: meetingDetails.attachements,
        // guests: meetingDetails.guests,
        // contributors: meetingDetails.contributors,
        // reminder: meetingDetails.contributors,
      });
    }
  }, [meetingDetails, editMeetingForm]);

  const handleFormSubmit = (values: CreateNewMeetingInterface) => {
    // if (meetingDetails?.id) {
    //   const payload: MeetingDetailsInterface = {
    //     id: meetingDetails.id,
    //     title: values.title,
    //     start_time: values.datetime_start,
    //     duration: values.duration,
    //     location: values.location,
    //     description: values.description,
    //     attachements: values.attachements,
    //     guests: values.guests,
    //     contributors: values.contributors,
    //     reminder: values.contributors,
    //   };
    //   dispatch(updateMeetingDetails(payload));
    // }
    console.log("MEETING FORM VALUES", values);
  };

  // if (loading) return <LoadingOverlay visible={loading} />;
  // if (error) return <div>Can not load form:{error.message}</div>;
  return (
    <form
      onSubmit={editMeetingForm.onSubmit((values: CreateNewMeetingInterface) => handleFormSubmit(values))}
    >
      {/* <CreateMeetingForm form={editMeetingForm} /> */}
      <Button type='submit'>Save</Button>
    </form>
  );
}
