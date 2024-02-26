import { Group, useMantineTheme, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import logo from "../../../assets/svgs/logos/Logo_Green.svg";
import AvatarButton from "../../buttons/avatarButton";
import { useAppSelector } from "../../../store/hooks";
import { useEffect, useState } from "react";
import { UserInterface } from "../../../interfaces";

type Props = {
  Burger: React.ReactElement;
};

export default function Header({ Burger }: Props) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery("(max-width: 70em)");
const [avatarType, setAvatarType] = useState<
  "default" | "image" | "withLetters"
>("default");
const [image, setImage] = useState<string | undefined>(undefined);
const [letters, setLetters] = useState<string | undefined>(undefined);

  // const dispatch = useDispatch();
  const userData = useAppSelector(
    (state): UserInterface | null => state.user.userData
  );




  useEffect(() => {
    if (userData) {
      console.log("SHOW ME THE AVATAR", userData);
        if (userData.profile_picture) {
          setAvatarType ("image");
          setImage(userData.profile_picture)
        } else if (userData?.first_name && userData?.last_name) {
          setAvatarType ("withLetters");
         setLetters(
           `${userData.first_name[0].toUpperCase()}${userData.last_name[0].toUpperCase()}`
         );
        }else {
          setAvatarType('default')
        }
    }
  }, [ userData]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 var(--mantine-spacing-md)",
        justifyContent: "space-between",
      }}
    >
      <Group gap='md'>
        {Burger}
        <img src={logo} style={{ height: "35px" }}></img>
        {!isMobile && (
          <Text
            style={{
              color: theme.colors.brand2[7],
              fontSize: "var(--mantine-font-size-md)",
            }}
          >
            Meetings@Cannabees
          </Text>
        )}
      </Group>

      <Group>
        <AvatarButton avatarType={avatarType} image={image} letters={letters} />
      </Group>
    </div>
  );
}
