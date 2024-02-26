import { ActionIcon, Paper, Text} from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { IconEdit } from "@tabler/icons-react";
import React, { ReactNode } from 'react';

interface CustomPaperProps {
  render: () => ReactNode; // Function that returns ReactNode
  title: string;
  onEditClick?: () => void; //click handler for the edit button as props
  allowEdit: boolean,
}

const CustomPaper: React.FC<CustomPaperProps> = ({ render, title, allowEdit, onEditClick}) => {
  const { ref, width} = useElementSize();

  return (
    <Paper style={{ position: "relative" }} p='xl'>
      <div
        style={{
          position: "absolute",
          top: "-1px",
          left: "20px",
          width: width + 10,
          height: "1px",
          backgroundColor: "var(--mantine-color-white)",
        }}
      />
      <Text
        ref={ref}
        size='xs'
        style={{
          position: "absolute",
          top: "-8px",
          left: "25px",
          fontWeight: "600",
        }}
      >
        {title}
      </Text>
      {/* <Text style={{position: "absolute", top:"-20px", left:"10px", fontWeight:"500"}}>{title}</Text> */}
      {allowEdit && 
        <ActionIcon
          style={{ position: "absolute", top: "-5px", right: "-5px" }}
          onClick={onEditClick}
        >
          <IconEdit style={{ width: "70%", height: "70%" }} stroke={2} />
        </ActionIcon>
      }
      {render()}
    </Paper>
  );
};

export default CustomPaper