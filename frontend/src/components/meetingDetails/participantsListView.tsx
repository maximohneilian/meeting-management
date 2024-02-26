import { Divider, Group, Pill, Stack, Text } from "@mantine/core";
import CustomPaper from "../themeComponents/customPaper";
import { useMantineTheme } from "@mantine/core";
import { GuestContributorInterface, UserInterface } from "../../interfaces";
import { useMediaQuery } from "@mantine/hooks";

interface ParticipantComponentProps extends UserInterface {
  isContributor?: boolean;
}

interface ParticipantsListProps {
  guests: GuestContributorInterface[];
  contributors: GuestContributorInterface[];
  allowEdit: boolean;
}

const ParticipantComponent: React.FC<ParticipantComponentProps> = ({
  first_name,
  last_name,
  username,
  isContributor,
}) => {
  const theme = useMantineTheme();
  const backgroundColor = isContributor
    ? theme.colors.brand[3]
    : theme.colors.brand2[0];
  const displayName =
    first_name && last_name ? `${first_name} ${last_name}` : username;

  const pillStyle = {
    root: {
      backgroundColor,
    },
  };

  return (
    <div>
      <Pill styles={pillStyle}>{displayName}</Pill>
    </div>
  );
};

const ParticipantsList: React.FC<ParticipantsListProps> = ({
  guests,
  contributors,
  allowEdit,
}) => {
  const isMobile = useMediaQuery("(max-width: 70em)");
  const theme = useMantineTheme()

  return (
    <CustomPaper
      allowEdit={allowEdit}
      title="Participants"
      render={() => (
        <Group justify="center" align="flex-start">
          <Stack style={{ width: "48%"}}>
            <Text ta="right" fw={600} c={theme.colors.green[6]} size="sm">Joining</Text>
            <Pill.Group id="participant-list" style={{justifyContent: "flex-end"}}>
              {guests
                .filter((guest) => guest.invite_status === "A")
                .map((guest) => (
                  <ParticipantComponent key={guest.id} {...guest} />
                ))}
              {contributors
                .filter((contributor) => contributor.invite_status === "A")
                .map((contributor) => (
                  <ParticipantComponent
                    key={contributor.id}
                    {...contributor}
                    isContributor
                  />
                ))}
            </Pill.Group>
          </Stack>
          <Divider
            size="sm"
            orientation={isMobile ? "horizontal" : "vertical"}
          />
          <Stack style={{ width: "48%"}}>
            <Text ta="left" fw={600} c={theme.colors.black[1]} size="sm">Pending</Text>
            <Pill.Group id="participant-list">
              {guests
                .filter((guest) => guest.invite_status !== "A")
                .map((guest) => (
                  <ParticipantComponent key={guest.id} {...guest} />
                ))}
              {contributors
                .filter((contributor) => contributor.invite_status !== "A")
                .map((contributor) => (
                  <ParticipantComponent
                    key={contributor.id}
                    {...contributor}
                    isContributor
                  />
                ))}
            </Pill.Group>
          </Stack>
        </Group>
      )}
    />
  );
};

export default ParticipantsList;
