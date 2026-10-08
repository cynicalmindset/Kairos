import { Box, Text } from "ink";

type ProfileProps = {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt?: string;
  };
  stats?: {
    roomsjoined: number;
    roomsOwned: number;
    totalmessages: number;
    fileshared: number;
  };
};

export default function Profile({ user, stats }: ProfileProps) {
  if (!user) {
    return (
      <Box paddingX={1} marginY={1}>
        <Text color="yellow">Loading profile...</Text>
      </Box>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recently";

  return (
    <Box flexDirection="column" paddingX={1} marginY={1}>
      <Text bold color="green">
        👤 User Profile
      </Text>

      <Box flexDirection="column" marginTop={1} paddingLeft={1}>
        <Text>
          <Text bold color="gray">Name:           </Text>
          <Text color="white" bold>{user.name}</Text>
        </Text>
        <Text>
          <Text bold color="gray">Email:          </Text>
          <Text color="cyan">{user.email}</Text>
        </Text>
        <Text>
          <Text bold color="gray">User ID:        </Text>
          <Text color="gray">{user.id}</Text>
        </Text>
        <Text>
          <Text bold color="gray">Member Since:   </Text>
          <Text color="white">{joinDate}</Text>
        </Text>
      </Box>

      <Box marginTop={1}>
        <Text color="gray">──────────────── Activity Stats ────────────────</Text>
      </Box>

      <Box flexDirection="column" marginTop={1} paddingLeft={1}>
        <Text>
          <Text bold color="gray">Rooms Joined:    </Text>
          <Text color="yellow" bold>{stats?.roomsjoined ?? 0}</Text>
          <Text color="gray"> (Owner of {stats?.roomsOwned ?? 0})</Text>
        </Text>
        <Text>
          <Text bold color="gray">Messages Sent:   </Text>
          <Text color="green" bold>{stats?.totalmessages ?? 0}</Text>
        </Text>
        <Text>
          <Text bold color="gray">Files Shared:    </Text>
          <Text color="magenta" bold>{stats?.fileshared ?? 0}</Text>
        </Text>
      </Box>

      <Box marginTop={1}>
        <Text color="gray">(Press Esc or type /back to return to chat)</Text>
      </Box>
    </Box>
  );
}