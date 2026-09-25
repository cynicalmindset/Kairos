import TextInput from "ink-text-input";

type InputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function Input({
  value,
  onChange,
  onSubmit,
}: InputProps) {
  return (
    <TextInput
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      placeholder="/help for commands"
    />
  );
}