import { Avatar } from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type AvatarProps = {
    avatarType: 'default' | 'image' | 'withLetters' ;
    image? : string;
    letters?:string;
}

const AvatarButton: React.FC<AvatarProps> = ({ avatarType, image, letters }) => {
  const navigate = useNavigate()
  let avatarElement;

useEffect(() => {
  console.log("type", avatarType)
}, [avatarType]);

  switch (avatarType) {
    case 'default':
      avatarElement = (
        <Avatar
          src={null}
          alt='no image here'
          radius='xl'
          onClick={() => navigate("/users/me")}
        />
      );
      break;
    case 'image':
      avatarElement = (
        <Avatar
          src={image}
          alt="it's me"
          onClick={() => navigate("/users/me")}
          onError={(e) => {
            console.error("Failed to load image:", image);
            e.currentTarget.style.display = "none";
          }}
        />
      );
      break;
    case 'withLetters':
      avatarElement = (
        <Avatar
          variant='filled'
          color='#A1C8AD'
          radius='xl'
          onClick={() => navigate("/users/me")}
        >
          {letters || "XX"}
        </Avatar>
      );
      break;
    default:
      avatarElement = <Avatar radius="xl" />;
  }

  return (
    <>
      {avatarElement}
    </>
  );
}

export default AvatarButton