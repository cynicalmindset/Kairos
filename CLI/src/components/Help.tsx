import { Box, Text } from "ink";

export default function Help() {
  return (
    <Box flexDirection="column">
      <Text bold color="yellow">Available Commands</Text>

      <Text>/rooms              List your rooms & codes</Text>
      <Text>/create             Create a new room</Text>
      <Text>/join &lt;roomCode&gt;   Join a room with code or name</Text>
      <Text>/code               Show current room code</Text>
      <Text>/members            Show room members</Text>
      <Text>/leave              Leave current room</Text>
      <Text>/share &lt;file&gt;     Share a file in room</Text>
      <Text>/clear              Clear screen</Text>
      <Text>/profile            View profile & stats</Text>
      <Text>/home               Return to home screen</Text>
      <Text>/help               Show this help</Text>
      <Text>/logout             Logout</Text>
    </Box>
  );
}