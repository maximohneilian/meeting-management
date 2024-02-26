import { ActionIcon } from '@mantine/core';
import { IconSquareX } from '@tabler/icons-react';

type Props = {
  onClick?: () => void;
}

  export default function CancelButton({onClick }: Props) {
    return (
      <ActionIcon onClick={onClick} >
        <IconSquareX stroke={1.5} />
      </ActionIcon>
    );
  }


