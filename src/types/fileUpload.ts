interface FileUploadProps {
  label?: string;
  value?: string | null;
  onChange: (value: string | null) => void;
  errorMessage?: string;
  className?: string;
}