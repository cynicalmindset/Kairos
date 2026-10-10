import { Box, Text } from "ink";

type MembersProps = {
  members: any[];
  roomName?: string;
  roomCode?: string;
};

export default function Members({ members, roomName, roomCode }: MembersProps) {
  return (
    <Box flexDirection="column">
      <Box flexDirection="row" gap={1}>
        <Text bold color="yellow">Members</Text>
        {roomName ? <Text color="magenta">#{roomName}</Text> : null}
        {roomCode ? (
          <Text color="gray">
            (Code: <Text color="yellow" bold>{roomCode}</Text>)
          </Text>
        ) : null}
      </Box>

      {members.map((member) => (
        <Text key={member.userId || member.id}>
          • {member.username || member.name}
        </Text>
      ))}
    </Box>
  );
}