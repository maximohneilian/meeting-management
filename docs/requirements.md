# Requirements

## Frontend

### Header

- User profile picture at top right corner
  - should lead to user page when clicked
  - default icon, if no profile picture
- notification bell
  - it shall show how many notifications are new
  - on click it shall open a popup

#### Notification-Popup

- reminder for upcoming meeting
- notification for new invites
  - there shall be two buttons (accept, decline)
  - notification text is hyperlink to meeting page
- all notification shall have a little x to dismiss them

### Navbar

- the navbar shall be on the left side
- meeting dashboard
- templates
- - (create new meeting or template)

### Dashboard

#### Search bar with search category:

- search fields can include:
  - upcoming events
  - past meetings
  - member search (?)

#### List of upcoming events:

- Meeting title
- Meeting Date
- Start-time
- Location
- Hyperlink on the title to go to meeting overview page

#### Calendar:

- '+'mark to allow users to create a new meeting
- Navigate to create a new meeting form
- Highlight today's date and hover to see what events are scheduled
- Click on a date to see events of the day
- user can navigate to meeting details page via clicking on the event

#### List of Past events:

- Show latest 5 events attended
  - Meeting Date
  - Meeting Title
  - Meeting Description
  - Link to overview page of that meeting

#### My groups (nice to have):

- Name of Group
- Name of member
- Contact details (email, zoom address etc.)
- message member button`

### Create Meeting

- whenever this page is entered there shall be an interaction popup initially:
  - create new blank meeting
  - create meeting from existing template
- two versions (edit)
- title
- date
- time
- location
  - text input
  - dynamic search (google maps integration)
  - google link
- rich-text-editor for description
- adding attendees
  - when user clicks into the "invite attendees" search bar:
    - there shall be a dropwdown of categories and groups
  - when user starts typing:
    - there shall be a dynamic search results (filter: general assemby, groups, people)
  - permissions
      - the user shall be able to set the permissions for the attendee (owner, contributer, general)
        - owner: edit everything (owner can change to a different owner)
        - contributor: edit agenda, meeting minutes, action points
        - attendee: default
- add attachements
- meeting reminders
  - the user shall be able to set meeting reminders, and adjust the time frame of how far in advance they want the reminder
- save as template button
- create meeting button
  - onclick, the meeting details are saved to db
  - attendees will receive email and web app notifications

#### For editing an existing meeting

- save buttons
- if owner: all fields editable
- if contributor: only agenda editable

#### Invites to Attendees

##### Send notification? popup

- There shall be a question popUp - "Would you like notification emails to attendees?"
- This popup shall be shown when a new meeting is created
- This popup shall be shown when an existing meeting was edited
- There shall be 3 buttons:
  - Send invitation/update
  - Dont send
  - back to editing

##### Email Invitations

The email shall include the following details:

- general: datetime, location, etc
- guests
- invitee permissions
- link to meeting
- option to accept or reject (magic link)
- attachments: docs, .ics

##### In App Notification

The system shall send a notification to the attendees, which will then activate a notification on their headers

#### Agenda point widget

- the agenda widget shall be a form that includes the following
  - number
  - topic title
  - duration
    - the user shall be able to manually input a num, or adjust a scale (by 5 min increments)
  - delete icon
    - on click, the user shall be able to delete an agenda item
- add button
  - the user shall be able to add a new agenda item
- re-order feature
  - the user shall be able to drag and drop agenda items to re-order them

### View meeting overview

- title
- location
- date and time
- agenda
- if invited: accept or decline (two buttons)
- edit
- if accepted (and if contributor): switch to editable view
- If online meeting, there shall be a button "Attend event" which shall open online meetings link
- If "owner" there shall be an delete button:
  - there shall be an popup asking if you are sure
- Add comment component

### Create meeting minutes

- two versions (edit or readonly view)

#### Edit view

- Initially copy all agenda points and create meeting topics for them
- It shall be possible to add some notes to each point
- For each point it shall be possible to add action points
- Rich rext editing shall be possible
- It shall be possible to delete meeting topics
- It shall be possible to move meeting topics in their order
- It shall be possible to add meeting topics
- There shall be a button to save meeting minutes
- There shall be a button to send meeting minutes
- It shall be possible to edit participant list

#### Readonly view

- export as pdf button
- if logged in user is the owner or a host of the meeting:
  - there shall be an edit button to enter the edit view

### Participant list

- list all the members which participated

### Minutes

- It shall show all the topics which where discussed in the meeting and the notes which were take

## Backend

- notifications
- recently used

### Meeting

#### Serializer

- title
- start_time
- end_time: has to be calculated by adding agenda time to start time
- location
- meeting_url
- description
- reminder

### Comments

- users can leave comments on meeting pages
- the comment compone shall display the following
  - user profile image
  - user full name or username
  - comment text
  - date and time
  - response function

### Change Log

- history of edits made to a meeting

#### Endpoints
