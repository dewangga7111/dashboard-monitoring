import { Combo } from "./combo";
type FieldType = "input" | "autocomplete" | "datepicker" | "daterange";

export interface FilterField {
  type: FieldType;
  key: string;
  label: string;
  placeholder?: string;
  options?: Combo[];
}