import { Anchor, Paper, Space, Text, Timeline, Title } from "@mantine/core";
import AvatarButton from "../buttons/avatarButton";
import { CommentComponent } from "../themeComponents/activityComment";
import { BasicUserInterface } from "../../interfaces";


export type ChangeCommentType = {
  type: string,
  content: string,
  dateTime: string,
  user: BasicUserInterface
}

type Props = {
  items: Array<ChangeCommentType>
}

const MILISECONDS_PER_MINUTES = 60000
const MILISECONDS_PER_HOUR = MILISECONDS_PER_MINUTES * 60
const MILISECONDS_PER_DAY = MILISECONDS_PER_HOUR * 24
const MILISECONDS_PER_WEEK = MILISECONDS_PER_DAY * 7

export default function TimelineComponent({items} : Props) {

  function calculateTimeAgo(time : string) {
    const now = Date.now()
    const timeElapsed = now - Date.parse(time)

    if (timeElapsed < MILISECONDS_PER_MINUTES) {
      return "just now"
    }
    else if (timeElapsed < MILISECONDS_PER_HOUR) {
      return `${Math.floor(timeElapsed/MILISECONDS_PER_MINUTES)} minutes ago`
    }
    else if (timeElapsed < MILISECONDS_PER_DAY) {
      return `${Math.floor(timeElapsed/MILISECONDS_PER_HOUR)} hours ago`
    }
    else if (timeElapsed < MILISECONDS_PER_WEEK) {
      return `${Math.floor(timeElapsed/MILISECONDS_PER_DAY)} days ago`
    }
    else {
      return new Date(time).toLocaleDateString()
    }
  }

  return (
    <Paper>
      <Title order={2}>Activity</Title>
      <Space h="lg"/>
      <Timeline color="teal" active={0} lineWidth={2} bulletSize={24}>
        {items.map((item, index) => 
          <Timeline.Item key={index} bullet={
            <AvatarButton
              avatarType="image"
              image={item.user.profile_picture}
            /> 
          }>
          {item.type === "change" ?
            <>
              <Text size="sm"><Anchor c="inherit" underline="hover" style={{fontWeight:"600"}}>{item.user.username}</Anchor> {item.content}</Text>
              <Text size="xs" c="dimmed" mt={4}>{calculateTimeAgo(item.dateTime)}</Text>
            </>
            :
            <>
              {/* <Text size="sm"><Anchor c="inherit" underline="hover" style={{fontWeight:"600"}}>{item.user.username}</Anchor> {item.content}</Text>
              <Text size="xs" c="dimmed" mt={4}>just now</Text> */}
              <CommentComponent comment={item}/>
            </>
          }
          </Timeline.Item>
        )}
      </Timeline>
    </Paper>
  )
}