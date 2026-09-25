import { Box, Text } from "ink";

type MembersProps = {
  members: any[];
};

export default function Members({ members }: MembersProps) {
  return (
    <Box flexDirection="column">
      <Text bold>Members</Text>

      {members.map((member) => (
        <Text key={member.id}>
          • {member.name}
        </Text>
      ))}
    </Box>
  );
}