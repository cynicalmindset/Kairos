import { Box, Text } from "ink";
import figlet from "figlet";
import Status from "../components/status.tsx";

type HeaderProps = {
  logged: boolean;
  serverconnected: boolean;
  frame: number;
};

const logo = figlet.textSync("KAIROS", {
//   font: "ANSI Shadow",
font: "Small Keyboard",
});

export default function Header({
  logged,
  serverconnected,
  frame,
}: HeaderProps) {
  return (
    <Box flexDirection="column" alignItems="center" borderStyle="single">
      <Text color="red">{logo}</Text>
      <Box flexDirection="row" marginTop={1}>
        <Text color="gray">cynicalmidset || </Text>
        <Status
          logged={logged}
          connected={serverconnected}
          frame={frame}
        />
      </Box>
    </Box>
  );
}