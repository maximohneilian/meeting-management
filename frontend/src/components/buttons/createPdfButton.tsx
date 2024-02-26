import { Button } from "@mantine/core";
import { IconFileTypePdf } from "@tabler/icons-react";



export default function CreatePdfButton({onClick}: {onClick?: () => void}) {
  return (
    <Button variant="filled" radius="xl" rightSection={<IconFileTypePdf />} onClick={onClick}>
      Download Summary
    </Button>
  );
}
