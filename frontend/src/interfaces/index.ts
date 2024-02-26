export interface UserInterface {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  profile_picture: string | null,
  address: string,
  about_me: string,
  joined_date: string,
}

export interface GuestContributorInterface {
  id: number,
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  phone: string,
  profile_picture: string | null,
  address: string,
  about_me: string,
  joined_date: string,
  invite_id: number,
  invite_status: string,
}

export interface MeetingDetailsInterface {
  id: number,
  title: string,
  start_time: string,
  duration: number,
  location: string,
  meeting_url: string,
  description: string,
  meeting_files: Array<Files> ,
  template: boolean,
  author: BasicUserInterface,
  agenda_points: AgendaPointInterface[],
  comments: CommentInterface[],
  guests: UserInterface[],
  contributors: UserInterface[],
  meeting_reminders: number[],
}

export interface CreateNewMeetingInterface {
  id: number,
  title: string,
  start_time: string | Date,
  duration: number,
  location: string,
  meeting_url: string,
  description: string,
  meeting_files: Array<Files> ,
  template: boolean,
  meeting_reminders: number[],
  guests: number[],
  contributors: number[],
}

export interface Files {
  id: number,
  file: string,
}

export interface AgendaInterface {
  agenda: AgendaPointInterface[],
}

export interface AgendaPointInterface {
  id: number,
  title: string,
  duration: number,
  description: string,
  notes: string,
  agenda_files: string[],
  order: number,
  meeting_id: number,
}

export interface CommentInterface {
  id: number,
  content: string,
  date_created: string,
  date_modified: string,
  meetingId: number,
  author: UserInterface,
  replies_to: number | null
}

export interface MeetingInvitesInterface {
  id: number,
  invitation_type: string,
  invitee: InviteeInterface[],
  status: string,
  meeting: BasicMeetingInterface,
}

interface BasicMeetingInterface {
  id: number,
  title: string,
  start_time: string,
  author: BasicUserInterface,
}

interface InviteeInterface {
  id: number,
  username: string,
}

export interface BasicUserInterface {
  id: number,
  username: string,
  profile_picture: string,
  first_name: string,
  last_name: string,
}

export interface ChangeInterface {
  id: number,
  text_content: string,
  time: string,
  user: BasicUserInterface,
}