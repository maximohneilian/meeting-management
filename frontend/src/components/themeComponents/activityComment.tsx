import {
  Paper,
  Text,
  Group,
  Button,
  useMantineTheme,
  Box,
  Textarea,
  Space,
  Popover,
  ActionIcon,
  Anchor,
  Menu,
  rem,
} from "@mantine/core";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { IconDotsVertical, IconEdit, IconMessageReply, IconTrash } from "@tabler/icons-react";
import { ChangeCommentType } from "../meetingDetails/timeLineComponent";

// export type CommentType {
//   comment: CommentInterface;
//   user: UserType;
//   onReply: (content: string, replyTo: number) => void;
//   onEdit?: (content: string, commentId: number) => void;
//   onDelete: () => void;
// }

type CommentProps= {
  comment: ChangeCommentType
}

export function CommentComponent({
  comment,

}: CommentProps) {
  const theme = useMantineTheme();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");
  const [editContent, setEditContent] = useState<string>(comment.content);

  const [replyPopoverOpened, replyPopoverHandlers] = useDisclosure(false);
  const [editPopoverOpened, editPopoverHandlers] = useDisclosure(false);



  const handleReplyClick = (): void => {
    setIsReplying(!isReplying);
    if (isEditing) setIsEditing(false);
  };

  const handleEditClick = (): void => {
    setIsEditing(!isEditing);
    if (isReplying) setIsReplying(false);
  };

  const submitReply = (): void => {
    // onReply(replyContent, comment.id);
    setReplyContent("");
    setIsReplying(false);
  };

  const submitEdit = (): void => {
    // if (onEdit) onEdit(editContent, comment.id);
    setIsEditing(false);
  };

    const handleDelete = () => {
      console.log("Delete action triggered");
      // Add delete logic here
    };

  return (
    <Box maw={600}>
      <Paper
        withBorder
        shadow='sm'
        p='md'
        radius='md'
        style={{ marginBottom: theme.spacing.md }}
      >
        <Group justify='space-between'>
          <Group>
            <Anchor c='inherit' underline='hover' style={{ fontWeight: "600" }}>
              <Text size='sm'> {comment.user.username}</Text>
            </Anchor>
            <Text size='sm' c='dimmed'>
              {comment.user.first_name} {comment.user.last_name}
            </Text>
            <Text size='sm' c='dimmed'>
              {comment.dateTime}
            </Text>
          </Group>
          <Group gap='xs'>
            <Popover
              opened={replyPopoverOpened}
              onClose={replyPopoverHandlers.close}
              position='bottom'
              withArrow
              shadow='sm'
              arrowRadius={2}
            >
              <Popover.Target>
                <ActionIcon
                  onMouseEnter={replyPopoverHandlers.open}
                  onMouseLeave={replyPopoverHandlers.close}
                  onClick={handleReplyClick}
                  variant='subtle'
                >
                  <IconMessageReply
                    style={{ width: "100%", height: "100%" }}
                    stroke={1.5}
                    color='grey'
                  />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown style={{ pointerEvents: "none" }} bg='black'>
                <Text size='sm' c='white'>
                  Reply
                </Text>
              </Popover.Dropdown>
            </Popover>

            <Popover
              opened={editPopoverOpened}
              onClose={editPopoverHandlers.close}
              position='bottom'
              withArrow
              shadow='sm'
              arrowRadius={2}
            >
              <Popover.Target>
                <ActionIcon
                  onMouseEnter={editPopoverHandlers.open}
                  onMouseLeave={editPopoverHandlers.close}
                  onClick={handleEditClick}
                  variant='subtle'
                >
                  <IconEdit
                    style={{ width: "100%", height: "100%" }}
                    stroke={1.5}
                    color='grey'
                  />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown style={{ pointerEvents: "none" }} bg='black'>
                <Text size='sm' c='white'>
                  Edit
                </Text>
              </Popover.Dropdown>
            </Popover>

            <Menu shadow='md' width={200} position='right'>
              <Menu.Target>
                <ActionIcon variant='transparent'>
                  <IconDotsVertical size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  color='red'
                  leftSection={
                    <IconTrash style={{ width: rem(14), height: rem(14) }} />
                  }
                  onClick={handleDelete}
                >
                  Delete comment
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
        <Space h='md' />
        {!isEditing ? (
          <Text size='sm'>{comment.content}</Text>
        ) : (
          <Textarea
            placeholder='Edit your comment...'
            value={editContent}
            onChange={(event) => setEditContent(event.currentTarget.value)}
            required
          />
        )}
        {isReplying && (
          <Box mt='md'>
            <Textarea
              placeholder='Write your reply...'
              value={replyContent}
              onChange={(event) => setReplyContent(event.currentTarget.value)}
              required
            />
            <Space h='md' />
            <Button onClick={submitReply} size='xs'>
              Post Reply
            </Button>
          </Box>
        )}
        {isEditing && (
          <Box mt='md'>
            <Space h='md' />
            <Button onClick={submitEdit} size='xs'>
              Save Edit
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
