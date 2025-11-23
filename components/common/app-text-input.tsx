import { Input, InputProps } from "@heroui/react";

export default function AppTextInput(props: InputProps) {
  return <Input {...props} labelPlacement="outside-top" />;
}