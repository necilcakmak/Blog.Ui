export type InputType = "text" | "email" | "password" | "number" | "date" | "file";

export interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: InputType;
  placeholder?: string;
  required?: boolean;
  pattern?: RegExp;
  errorMessage?: string;
  className?: string;
  disabled?: boolean;
}
