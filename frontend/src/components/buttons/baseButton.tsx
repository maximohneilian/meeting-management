import { Button } from '@mantine/core';

type Props = {
  color: string,
  text: string,
}

export default function BaseButton({color = "green.2", text="Button"} : Props) {
  return <Button variant="filled" color={color} radius="xl">{text}</Button>
}