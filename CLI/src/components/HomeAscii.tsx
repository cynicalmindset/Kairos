import { Box, Text } from "ink";

type HomeAsciiProps = {
  isActive?: boolean;
  terminalWidth?: number;
};

// Razor-sharp modern block typography with vibrant ruby-to-crimson gradient
const LOGO_LINES = [
  { text: "██╗  ██╗ █████╗ ██╗██████╗  ██████╗ ███████╗", color: "#ff3b5c" },
  { text: "██║ ██╔╝██╔══██╗██║██╔══██╗██╔═══██╗██╔════╝", color: "#f42b4d" },
  { text: "█████╔╝ ███████║██║██████╔╝██║   ██║███████╗", color: "#e11d40" },
  { text: "██╔═██╗ ██╔══██║██║██╔══██╗██║   ██║╚════██║", color: "#c81034" },
  { text: "██║  ██╗██║  ██║██║██║  ██║╚██████╔╝███████║", color: "#ad0829" },
  { text: "╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝", color: "#8a001e" },
];

export default function HomeAscii({ terminalWidth = 80 }: HomeAsciiProps) {
  const isCompact = terminalWidth < 50;

  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center">
      {/* 1. Gold Sparkle Header Accent */}
      <Box marginBottom={1} flexDirection="row" alignItems="center" gap={1}>
        <Text color="#e5a93b">✦</Text>
        <Text color="#444444">──</Text>
        <Text color="#e5a93b" bold>
          12 oct 2026
        </Text>
        <Text color="#444444">──</Text>
        <Text color="#e5a93b">✦</Text>
      </Box>

      {/* 2. Razor-sharp Modern Block Typography */}
      {isCompact ? (
        <Box flexDirection="column" alignItems="center">
          <Text bold color="#ff3b5c">
            ◆ K A I R O S ◆
          </Text>
        </Box>
      ) : (
        <Box flexDirection="column" alignItems="center">
          {LOGO_LINES.map((line, idx) => (
            <Text key={idx} color={line.color} bold>
              {line.text}
            </Text>
          ))}
        </Box>
      )}

      {/* 3. Subtitle / Version */}
      <Box marginTop={1}>
        <Text color="gray">
          Realtime Terminal Collab <Text color="#444444">•</Text>{" "}
          <Text color="#e5a93b">v1.0.4</Text>
        </Text>
      </Box>

      {/* 4. Minimalist Claude Code-style Command Prompt Row */}
      <Box marginTop={2} flexDirection="row" gap={2}>
        <Text color="gray">
          <Text color="white" bold>
            /rooms
          </Text>{" "}
          Browse
        </Text>
        <Text color="gray">│</Text>
        <Text color="gray">
          <Text color="white" bold>
            /create
          </Text>{" "}
          New Room
        </Text>
        <Text color="gray">│</Text>
        <Text color="gray">
          <Text color="white" bold>
            /website
          </Text>{" "}
          Open Web
        </Text>
        <Text color="gray">│</Text>
        <Text color="gray">
          <Text color="white" bold>
            /help
          </Text>{" "}
          Help
        </Text>
      </Box>
    </Box>
  );
}
