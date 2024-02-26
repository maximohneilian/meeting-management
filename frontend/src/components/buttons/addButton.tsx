import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

type Props = {
  color?: string,
  onClick?: () => void;
}


/**
* Renders an Add button with a plus icon. The button's color can be customized.
* 
* @component
* @param {Object} props The props for the AddButton component.
* @param {string} [props.color="green.2"] The color of the button. Defaults to "green.2".
* @param {Function} props.onClick The callback function to be called when the button is clicked.
* @returns {React.ReactElement} A React Element representing the Add button.
* 
* @example
* <AddButton color="blue.3" onClick={handleClick} />
*/
export default function AddButton({color = "green.2", onClick }: Props) {
  const icon = <IconPlus size={14} />;


  return (
          <Button 
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              justify="center" 
              variant="default"
              color={color}
              size="xs"
              onClick={onClick}
          >
          {icon}
          </Button>
  )

}
