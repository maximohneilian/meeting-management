import { createSlice } from "@reduxjs/toolkit";
import { CreateNewMeetingInterface } from "../../interfaces";

export const NEW_MEETING_INITIAL_STATE: {
  createdSuccesfully: boolean;
  data: CreateNewMeetingInterface;
} = {
  createdSuccesfully: false,
  data: {
    id: 0,
    title: "",
    start_time: "",
    duration: 60,
    location: "",
    meeting_url: "",
    description: "",
    meeting_files: [],
    template: false,
    meeting_reminders: [],
    guests: [],
    contributors: [],
  },
};

const newMeetingSlice = createSlice({
  name: "newMeeting",
  initialState: NEW_MEETING_INITIAL_STATE,
  reducers: {
    startNewMeetingWithDate: (state, action) => {
      console.log("Start new meeting creation");
      Object.assign(state, NEW_MEETING_INITIAL_STATE);
      if (action?.payload) {
        console.log("Create new meeting on the", action?.payload);
        state.data.start_time = action.payload;
      }
    },
    startNewDefaultMeeting: (state) => {
      console.log("Start new meeting creation");
      Object.assign(state, NEW_MEETING_INITIAL_STATE);
    },
    setNewMeeting: (state, action) => {
      console.log("Meeting with Id " + action.payload.id, " created");
      state.data = action.payload
      //dont set succesfully created here! otherwise redirection will take place straight after meeting creation / before agenda
    },
    setMeetingSuccesfullyCreated: (state) => {
      console.log("Meeting sucessfully created");
      state.createdSuccesfully = true;
    },
  },
});

export const {
  startNewMeetingWithDate,
  startNewDefaultMeeting,
  setNewMeeting,
  setMeetingSuccesfullyCreated,
} = newMeetingSlice.actions;

export default newMeetingSlice.reducer;
