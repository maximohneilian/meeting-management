import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import {
  Center,
  Collapse,
  Flex,
  Input,
  NumberInput,
  TextInput,
  Stack,
  ActionIcon,
  useMantineTheme,
  Button,
} from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconGripVertical,
  IconTrashOff,
} from "@tabler/icons-react";
// import FakeInputField from "./fakeInputField/fakeInpuField";
import RichTextEditorComponent from "../themeComponents/richTextEditor";
import { useDisclosure } from "@mantine/hooks";
import { UseFormReturnType } from "@mantine/form";
import { useElementSize } from "@mantine/hooks";
import { ReactElement, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AgendaInterface } from "../../interfaces";

// ---------------------------------------------------------------------------
// Portal
const portal = document.createElement("div");
document.body.appendChild(portal);

export function mergeRefs(...inputRefs: any) {
  return (ref: any) => {
    inputRefs.forEach((inputRef: any) => {
      if (!inputRef) {
        return;
      }

      if (typeof inputRef === "function") {
        inputRef(ref);
      } else {
        inputRef.current = ref;
      }
    });
  };
}

export default function AgendaPointItem({
  index,
  form,
  provided,
  snapshot,
}: {
  index: number;
  form: UseFormReturnType<AgendaInterface>;
  snapshot: DraggableStateSnapshot;
  provided: DraggableProvided;
}) {
  const [usePortal, setUsePortal] = useState(false);
  const [opened, { toggle }] = useDisclosure(false);
  const { ref, width } = useElementSize();
  const theme = useMantineTheme();

  useEffect(() => {
    console.log("dragging:", snapshot.isDragging);
    setUsePortal(snapshot.isDragging);
  }, [snapshot]);

  const child: ReactElement = (
    <>
      <Flex
        ref={provided.innerRef}
        mt="xs"
        gap="md"
        justify="center"
        align="center"
        direction="row"
        {...provided.draggableProps}
      >
        <Center {...provided.dragHandleProps}>
          <IconGripVertical size="2rem" />
        </Center>
        <Stack gap="sm" style={{ flexGrow: "1" }}>
          <Flex
            justify="flex-end"
            align="flex-start"
            wrap="nowrap"
            gap="sm"
            ref={ref}
          >
            <TextInput
              placeholder="Title"
              withAsterisk
              size="md"
              {...form.getInputProps(`agenda.${index}.title`)}
              style={{ width: "90%" }}
            />
            <NumberInput
              withAsterisk
              placeholder="Duration"
              size="md"
              min={5}
              max={120}
              step={5}
              {...form.getInputProps(`agenda.${index}.duration`)}
              style={{ width: "10%", minWidth: "80px" }}
            />
          </Flex>
          {/* <FakeInputField
            placeholder="Description"
            value={form.values.agenda[index].description}
            width="100%"
            height="calc(2.625rem*var(--mantine-scale))"
            onClick={toggle}
          /> */}
          <Button
            variant="outline"
            justify="space-between"
            leftSection={opened? <IconArrowUp /> : <IconArrowDown />}
            rightSection={opened? <IconArrowUp /> : <IconArrowDown />}
            onClick={toggle}
          >
            {opened ? "Hide description" : "Show description"}
          </Button>
          <Collapse in={opened}>
            <Input.Wrapper
              {...form.getInputProps(`agenda.${index}.description`)}
            >
              <RichTextEditorComponent
                form={form}
                fieldToBeSet={`agenda.${index}.description`}
                width={width}
              />
            </Input.Wrapper>
          </Collapse>
        </Stack>
        <Center>
          <ActionIcon
            variant="subtle"
            color={theme.colors.red[8]}
            size="lg"
            onClick={() => form.removeListItem("agenda", index)}
          >
            <IconTrashOff
              size={28}
              style={{ color: theme.colors.red[8], stroke: "1.5" }}
            />
          </ActionIcon>
        </Center>
      </Flex>
    </>
  );

  if (!usePortal) {
    return child;
  } else {
    // if dragging - put the item in a portal
    console.log("Putting into portal");
    return createPortal(child, portal);
  }
}
