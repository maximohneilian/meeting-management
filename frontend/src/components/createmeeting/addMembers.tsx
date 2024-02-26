import { useEffect, useState } from "react";
import React from "react";
import {
  PillsInput,
  Pill,
  Combobox,
  CheckIcon,
  Group,
  useCombobox,
} from "@mantine/core";
import { UserInterface } from "../../interfaces";


interface AddMembersProps {
  onMembersChange: (ids: number[]) => void;
  title: string;
  users: Array<UserInterface>,
  initialValues: string[],
  selectedUsers: string[],
}

export default function AddMembers({
  onMembersChange,
  title,
  users,
  initialValues,
  selectedUsers,
}: AddMembersProps) {

  useEffect(() => {
    console.log(`Selected ${title}`, selectedUsers)
  }, [selectedUsers])

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [search, setSearch] = useState("");
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    setValue(initialValues)
    console.log("set values", initialValues)
  }, [initialValues])

  const handleValueSelect = (val: string) => {
    setValue((current) =>
      current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val]
    );
  }

  const handleValueRemove = (val: string) => {
    setValue((current) => current.filter((v) => v !== val));
  }

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const options = users
    .filter((user) => user.username.toLowerCase().includes(search.trim().toLowerCase()) && !selectedUsers.includes(user.username))
    .map((user) => (
      <Combobox.Option value={user.username} key={user.id} active={value.includes(user.username)}>
        <Group gap="sm">
          {value.includes(user.username) ? <CheckIcon size={12} /> : null}
          <span>{user.username}</span>
        </Group>
      </Combobox.Option>
    ));

  React.useEffect(() => {
    const ids : number[] = users.filter(user => value.includes(user.username)).map(user => user.id)
    console.log("Ids", ids)
    onMembersChange(ids);
  }, [value]);

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
      <Combobox.DropdownTarget>
        <PillsInput onClick={() => combobox.openDropdown()}>
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder={`Add ${title}`}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length > 0 ? (
            options
          ) : (
            <Combobox.Empty>Nothing found...</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
