import { Box, Text } from "ink";

export default function Help() {
  return (
    <Box flexDirection="column">
      <Text bold>Commands</Text>

      <Text>/rooms       List rooms</Text>
      <Text>/create      Create a room</Text>
      <Text>/join        Join a room</Text>
      <Text>/members     Show room members</Text>
      <Text>/leave       Leave current room</Text>
      <Text>/share       Share a file</Text>
      <Text>/clear       Clear screen</Text>
      <Text>/help        Show this help</Text>
      <Text>/logout      Logout</Text>
      <Text>/home        Return to home screen</Text>
      <Text>/profile     View user profile & stats</Text>
    </Box>
  );
}