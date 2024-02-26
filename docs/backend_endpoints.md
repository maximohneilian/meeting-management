# Endpoints

## Meeting

### /meetings/

- GET: List all meetings for currently logged in user

### /meetings/new/

- POST: Create new meeting
    - Create meeting invites for each invitee

### /meetings/<int:id>/

- GET: Get the details of a meeting by providing the id of the meeting
- PATCH: Update a meeting by id (allowed for author and contributors?)
- DELETE: Delete a meeting by id (allowed only for author?)

### /meetings/invites/<int:meeting_id>/

- PATCH: Update invitee list for a specific meeting

### /meetings/invite/accept/<int:invite_id>/

- PATCH: Accept invite

### /meetings/invite/reject/<int:invite_id>/

- PATCH: Reject invite

## Agenda points

### /agenda-points/new/<int:meeting_id>/

- POST: Create new agenda point for a meeting

### /agenda-points/meeting/<int:meeting_id>/

- GET: Get the list of agenda points for a single meeting

### /agenda-points/<int:id>/

- GET: Get a specific agenda point by ID and display all the information
- PATCH: Update an agenda point by id (allowed for author and contributors)
- DELETE: Delete an agenda point by id (allowed for author and contributors)

### /agenda-points/voting/new/<int:agenda_point_id>/

- POST: Create new voting for agenda point
    - Create voting options

### /agenda-points/voting/<int:agenda_point_id>/

- GET: Get a specific voting by agenda ID

### /agenda-points/voting/<int:id>/

- PATCH: Update voting by ID
- DELETE: Delete voting by ID

### /agenda-points/voting/voting-option/new/<int:voting_id>/

- POST: Create new voting option for voting

### /agenda-points/voting/voting-option/<int:id>/

- PATCH: Update a voting option by ID
- DELETE: Delete a voting option by ID

## Comments

### /comments/new/<int:meeting_id>/

- POST: Create a new comment for a meeting

### /comments/meeting/<int:meeting_id>/

- GET: Get the list of comments for a single meeting

### /comments/<int:id>/

- GET: Get a specific comment by ID and display all the information
- PATCH: Update a comment by id (allowed only for author)
- DELETE: Delete a comment by id (allowed only for author)

## Reminders

### /reminders/new/

- POST: Create new notification

### /reminders/pending/

- GET: List all pending notifications of logged in user

### /reminders/dismiss/<int:id>/

- DELETE: Delete logged in user's reminders by ID





