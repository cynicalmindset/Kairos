import { Text } from "ink";

type StatusProps = {
  logged: boolean;
  connected: boolean;
  frame: number;
};

const spinnerFrames = [
  "⠋",
  "⠙",
  "⠹",
  "⠸",
  "⠼",
  "⠴",
  "⠦",
  "⠧",
  "⠇",
  "⠏",
];

export default function Status({
  logged,
  connected,
  frame,
}: StatusProps) {
  if (!logged) return null;

  return connected ? (
    <Text color="green">
      ✓ Server is live
    </Text>
  ) : (
    <Text color="yellow">
      {spinnerFrames[frame % spinnerFrames.length]}
      {" "}Connecting to server...
    </Text>
  );
}