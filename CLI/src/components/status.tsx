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
  frame = 0,
}: StatusProps) {
  const currentFrame = spinnerFrames[Math.abs(frame || 0) % spinnerFrames.length];

  return connected ? (
    <Text color="green">
      ✓ Server is live {logged ? "" : "(Not logged in)"}
    </Text>
  ) : (
    <Text color="yellow">
      {currentFrame} Connecting to server...
    </Text>
  );
}