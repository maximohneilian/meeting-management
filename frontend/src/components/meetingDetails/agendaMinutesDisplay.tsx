import {
  Text,
  Title,
  Flex,
  useMantineTheme,
  Stack,
  Divider,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import CustomPaper from "../themeComponents/customPaper";
import { AgendaPointInterface } from "../../interfaces";

import { useEffect, useState } from "react";

type Props = {
  agendaItems: AgendaPointInterface[];
  allowEdit: boolean;
  infoType: string;
};

export default function AgendaMinutesDisplay({
  agendaItems,
  allowEdit,
  infoType,
}: Props) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 70em)");
  const [agendaItemsSorted, setAgendaItemsSorted] = useState(agendaItems)

  useEffect(() => {
    setAgendaItemsSorted([...agendaItems].sort((a, b) => a.order - b.order))
    console.log("Agenda Items:", agendaItems);

  }, [agendaItems]);

  return (
    <>
      {agendaItems && (
        <CustomPaper
          title={infoType}
          allowEdit={allowEdit}
          render={() => (
            <Flex direction='column' gap='sm'>
              {agendaItemsSorted.map(({ id, title, description, notes }, index) => (
                <Flex
                  key={id}
                  direction='column'
                  gap='md'
                  style={{ marginTop: index > 0 ? "2rem" : "0" }}
                >
                  <Flex
                    direction={isMobile ? "column" : "row"}
                    align='flex-start'
                    gap='xl'
                    style={{ width: "100%" }}
                  >
                    <Stack
                      gap={isMobile ? "xs" : "sm"}
                      w={isMobile ? "100%" : "30%"}
                    >
                      <Text size="sm" style={{ color: theme.colors.green[6] }}>
                        Topic:
                      </Text>
                      <Title order={2}>{title}</Title>
                    </Stack>
                    {infoType === "Agenda" ? (
                      <Stack
                        gap={isMobile ? "xs" : "sm"}
                        w={isMobile ? "100%" : "70%"}
                      >
                        <Text size="sm"
                          style={{ color: theme.colors.green[6] }}
                        >
                          Description:
                        </Text>
                        {description && (
                          <div
                            dangerouslySetInnerHTML={{ __html: description }}
                          ></div>
                        )}
                      </Stack>
                    ) : (
                      <Stack
                        justify='flex-start'
                        gap={isMobile ? "xs" : "sm"}
                        w={isMobile ? "100%" : "70%"}
                      >
                        <Text size="sm" style={{ color: theme.colors.green[6] }}
                        >
                          Notes:
                        </Text>
                        <Text size="md">
                          {notes && (
                            <div
                              dangerouslySetInnerHTML={{ __html: notes }}
                            ></div>
                          )}
                        </Text>
                      </Stack>
                    )}
                  </Flex>
                  {index < agendaItems.length - 1 && <Divider my='sm' />}
                </Flex>
              ))}
            </Flex>
          )}
        />
      )}
    </>
  );
}
