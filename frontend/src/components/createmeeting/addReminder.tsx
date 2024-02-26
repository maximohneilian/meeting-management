import { Switch, useMantineTheme, rem } from '@mantine/core';
import { IconAlarm, IconAlarmOff } from '@tabler/icons-react';
import { useState } from 'react';
import { NumberInput } from '@mantine/core';

interface AddReminderProps {
  onReminderChange: (value: string | number) => void;
}

export default function AddReminder({ onReminderChange }: AddReminderProps) {
  const theme = useMantineTheme();
  const [toggleState, setToggleState] = useState(false); 

  const sunIcon = (
    <IconAlarm
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.yellow[4]}
    />
  );

  const moonIcon = (
    <IconAlarmOff
      style={{ width: rem(16), height: rem(16) }}
      stroke={2.5}
      color={theme.colors.blue[6]}
    />
  );

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    setToggleState(value);
  };


  return (
      <div style={{display:'flex', justifyContent: 'space-between'}}>
        <div style={{maxWidth:'130px'}}>
          {toggleState && 
            <NumberInput
                label="Set Notification (min)"
                step={5}
                min={5}
                max={60}
                defaultValue={15}
                onChange={onReminderChange}
              />            
            }
        </div>
        <div>
          <Switch 
            size="md" 
            color="dark.4" 
            onLabel={sunIcon} 
            offLabel={moonIcon} 
            onChange={handleToggleChange}
          />
        </div>
        
      </div>
  )
}