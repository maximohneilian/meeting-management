import { Table } from '@mantine/core';
import { MeetingDetailsInterface } from '../../interfaces';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';


type Props = {
  meetings: Array<MeetingDetailsInterface>
}

export default function MeetingTable ({meetings}: Props) {
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 70em)");

  const formatMeetingDate = (start_time: string): string => {
   return new Date(start_time).toLocaleDateString()
  };
  const formatMeetingTime = (start_time: string): string => {
    return new Date(start_time).toLocaleTimeString("de-DE", {hour: '2-digit', minute:'2-digit'})
  };
  
  
  return (
    <Table highlightOnHover>
      {meetings && 
        <Table.Tbody>
        {
          meetings.map((meeting, index)=> 
          <Table.Tr key={index} style={{fontSize: isMobile ? "var(--mantine-font-size-xs)": "var(--mantine-font-size-sm"}}>
            <Table.Td 
              onClick={() => navigate(`/meeting/${meeting.id}`)} 
              style={{cursor:"pointer", fontWeight:"bold"}}
            >
              {meeting.title}

            </Table.Td>
            <Table.Td style={{textWrap:'pretty'}}>{formatMeetingDate(meeting.start_time)}</Table.Td>
            <Table.Td>{formatMeetingTime(meeting.start_time)}</Table.Td>
            <Table.Td>{meeting.location}</Table.Td>
          </Table.Tr>
          )
        }

        </Table.Tbody>
        }
    </Table>
  );
}





