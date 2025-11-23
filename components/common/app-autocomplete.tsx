"use client";

import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@heroui/react";

type AppAutocompleteProps<T extends Record<string, any>> = Omit<AutocompleteProps,"children"> & {
  items: T[];
  itemLabel?: keyof T;
  itemValue?: keyof T;
};

export default function AppAutocomplete<T extends Record<string, any>>({
  items,
  itemLabel = "label",
  itemValue = "value",
  labelPlacement = "outside-top",
  ...props
}: AppAutocompleteProps<T>) {
  return (
    <Autocomplete labelPlacement={labelPlacement} {...props}>
      {items.map((item) => (
        <AutocompleteItem
          key={String(item[itemValue] ?? "")}
        >
          {String(item[itemLabel] ?? "")}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
