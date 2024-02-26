import { IconCalendarTime, IconMailFilled } from '@tabler/icons-react';
import { rem } from '@mantine/core';
// import { Notifications } from '@mantine/notifications';
import { Notification } from '@mantine/core';
import styles from './notification.module.css'
import { useState } from 'react';


export default function NotificationBubble(){
        const [mtgRemindernotificationsVisible, setReminderNotificationsVisible] = useState(true);
        const [newInvitenotificationsVisible, setInviteNotificationsVisible] = useState(true);

        // upcoming meeting reminder
        const mtgReminderIcon = <IconCalendarTime style={{ width: rem(20), height: rem(20) }} />;

        // new meeting invite
        const mtgInviteIcon = <IconMailFilled style={{ width: rem(20), height: rem(20) }} />;

        const handleReminderCloseNotification = () => {
            setReminderNotificationsVisible(false);
        };
        
        const handleInviteCloseNotification = () => {
            setInviteNotificationsVisible(false);
        };

        return (
            <div className={styles["notification-bubble"]}>
                {mtgRemindernotificationsVisible && (
                <>
                    <Notification
                        icon={mtgReminderIcon}
                        color="yellow"
                        title="Reminder"
                        onClose={handleReminderCloseNotification} 
                    >
                        Your meeting is coming up soon.
                    </Notification>
                </>
            )}
             {newInvitenotificationsVisible && (
                <>
                    <Notification
                        icon={mtgInviteIcon}
                        color="green"
                        title="New Meeting Invite"
                        onClose={handleInviteCloseNotification}
                    >
                        You have been invited to a meeting.
                    </Notification>
                </>
            )}
            </div>
        );
}