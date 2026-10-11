import { Box, Text } from "ink";

type MessageListProps = {
  messages: any[];
  viewportHeight?: number;
  scrollOffset?: number;
  roomName?: string;
  roomCode?: string;
};

function formatTime(timestamp?: string | number): string {
  const date = timestamp ? new Date(timestamp) : new Date();
  const valid = !isNaN(date.getTime()) ? date : new Date();
  return `${String(valid.getHours()).padStart(2, "0")}:${String(valid.getMinutes()).padStart(2, "0")}`;
}

export default function Messagelist({
  messages,
  viewportHeight = 15,
  scrollOffset = 0,
  roomName,
  roomCode,
}: MessageListProps) {
  // Empty room welcome card
  if (!messages || messages.length === 0) {
    return (
      <Box
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height={viewportHeight}
      >
        <Box
          borderStyle="round"
          borderColor="gray"
          paddingX={2}
          paddingY={1}
          flexDirection="column"
          alignItems="center"
        >
          <Text bold color="cyan"> Welcome to #{roomName || "room"}</Text>
          <Box marginTop={1} flexDirection="column" alignItems="center">
            <Text color="gray">No messages yet in this room.</Text>
            <Text color="gray">
              Type a message below or share code <Text color="yellow" bold>{roomCode || "..."}</Text> with teammates.
            </Text>
          </Box>
        </Box>
      </Box>
    );
  }

  // Reserve 1 line for top/bottom indicators if needed
  const reserveLines = (scrollOffset > 0 ? 1 : 0) + (messages.length > viewportHeight ? 1 : 0);
  const maxVisibleCount = Math.max(3, viewportHeight - reserveLines);

  // Calculate slice indices
  const endIndex = Math.max(1, messages.length - scrollOffset);
  const startIndex = Math.max(0, endIndex - maxVisibleCount);

  const visibleMessages = messages.slice(startIndex, endIndex);
  const hiddenOlderCount = startIndex;
  const hiddenNewerCount = scrollOffset;

  return (
    <Box flexDirection="column" height={viewportHeight} justifyContent="flex-end">
      {/* 1. Older messages indicator */}
      {hiddenOlderCount > 0 ? (
        <Box paddingX={1} justifyContent="center">
          <Text color="gray">
            <Text color="gray">{hiddenOlderCount}</Text> older message{hiddenOlderCount > 1 ? "s" : ""} above (play with arrow keys)
          </Text>
        </Box>
      ) : null}

      {/* 2. Visible messages list */}
      <Box flexDirection="column" justifyContent="flex-end">
        {visibleMessages.map((msg, index) => {
          const isMe = msg.user?.name === "You" || msg.optimistic;
          const time = formatTime(msg.createdAt);

          // File share card
          if (msg.type === "file_share") {
            return (
              <Box
                key={msg.shareId ?? index}
                borderStyle="round"
                borderColor="magenta"
                paddingX={1}
                flexDirection="column"
              >
                <Box flexDirection="row" gap={1}>
                  <Text color="gray">{time}</Text>
                  <Text color="magenta" bold>File Share:</Text>
                  <Text bold color="white">{msg.fileName}</Text>
                  <Text color="yellow">({msg.fileSize} B)</Text>
                  <Text color="gray">from {msg.user?.name ?? "Someone"}</Text>
                </Box>
                <Box flexDirection="row" gap={2}>
                  <Text color="green">/accept {msg.shareId}</Text>
                  <Text color="gray">│</Text>
                  <Text color="red">✕ /reject {msg.shareId}</Text>
                </Box>
              </Box>
            );
          }

          // Standard chat message
          return (
            <Box key={msg.id ?? index} flexDirection="row" gap={1}>
              <Text color="gray">{time}</Text>
              <Text color="gray">│</Text>
              <Box flexDirection="row" flexShrink={0}>
                {isMe ? (
                  <Text color="cyan" bold>You: </Text>
                ) : (
                  <Text color="red" bold>{msg.user?.name ?? "Anonymous"}: </Text>
                )}
              </Box>
              <Box flexGrow={1}>
                <Text color="white">{msg.content}</Text>
                {msg.optimistic ? <Text color="gray"> (sending...)</Text> : null}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* 3. Newer messages indicator when scrolled up */}
      {hiddenNewerCount > 0 ? (
        <Box paddingX={1} justifyContent="center">
          <Text color="gray" bold>
            {hiddenNewerCount} newer message{hiddenNewerCount > 1 ? "s" : ""} below (play with arrows keys or esc)
          </Text>
        </Box>
      ) : null}
    </Box>
  );
}