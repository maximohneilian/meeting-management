import { Group, Box } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { DragDropContext, Droppable, Draggable, DraggableProvided, DraggableStateSnapshot, DroppableProvided } from "@hello-pangea/dnd";
import AgendaPointItem from "./agendaPointItem";
import AddButton from "../buttons/addButton";
import { AgendaInterface } from "../../interfaces";


export default function AgendaPointWidget({form}: {form: UseFormReturnType<AgendaInterface>}) {

  const portal = document.createElement("div");
  document.body.appendChild(portal);



  return (
    <Box maw="100%" mx="auto">
      <DragDropContext
        onDragEnd={({ destination, source }) =>
          destination?.index !== undefined &&
          form.reorderListItem("agenda", {
            from: source.index,
            to: destination.index,
          })
        }
      >
        <Droppable
          droppableId="dnd-list"
          direction="vertical"
        >
          {(droppableProvided : DroppableProvided) => (
            <div {...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
              {form.values.agenda.map((_, index) => (
                <Draggable key={index} draggableId={index.toString()} index={index} >
                  {(
                    draggableProvided: DraggableProvided,
                    snapshot: DraggableStateSnapshot,
                  ) => (
                    <AgendaPointItem form={form} key={index} index={index} provided={draggableProvided} snapshot={snapshot}/>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Group justify="center" mt="md">
        <AddButton
          onClick={() =>
            form.insertListItem("agenda", {
              title: "",
              description: "",
              duration: 5,
            })
          }
        />
      </Group>
    </Box>
  );
}