import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MeetingDetailsInterface } from "../../interfaces";


interface MeetingsState {
  meetings: MeetingDetailsInterface[];
  selectedMeeting: MeetingDetailsInterface | undefined;
  isLoading: boolean;
  isUpdating: boolean;
}

const initialState: MeetingsState = {
  meetings: [],
  selectedMeeting: undefined,
  isLoading: false,
  isUpdating: false,
};

const meetingDetailsSlice = createSlice({
  name: "meetingDetails",
  initialState,
  reducers: {
    createMeeting: (state, action: PayloadAction<MeetingDetailsInterface>) => {
      state.meetings = [...state.meetings, action.payload];
    },
    loadMeetings: (state, action: PayloadAction<MeetingDetailsInterface[]>) => {
      state.meetings = action.payload;
    },
    loadSelectedMeeting: (state, action: PayloadAction<MeetingDetailsInterface>) => {
      state.selectedMeeting = action.payload;
      console.log("checking data", action.payload);
    },
    updateMeetingDetails: (state, action: PayloadAction<MeetingDetailsInterface>) => {
      state.meetings = state.meetings.map((meeting) =>
        meeting.id === action.payload.id
          ? { ...meeting, ...action.payload }
          : meeting
      );
    },
    resetSelectedMeeting: (state) => {
      state.selectedMeeting = undefined;
    },
  },
});

export const {
  createMeeting,
  loadMeetings,
  loadSelectedMeeting,
  updateMeetingDetails,
  resetSelectedMeeting,
} = meetingDetailsSlice.actions;

export default meetingDetailsSlice.reducer;
