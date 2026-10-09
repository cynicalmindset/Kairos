import { Box, Text } from "ink";
import figlet from "figlet";
import Status from "../components/status.tsx";

type HeaderProps = {
  logged: boolean;
  serverconnected: boolean;
  frame: number;
  error?: string;
  info?: string;
};

const logo = ` ____ ____ ____ ____ ____ ____ 
||K |||A |||I |||R |||O |||S ||
||__|||__|||__|||__|||__|||__||
|/__\\|/__\\|/__\\|/__\\|/__\\|/__\\|`;

export default function Header({
  logged,
  serverconnected,
  frame,
  error,
  info,
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
      {error ? (
        <Box marginTop={1}>
          <Text color="red">{error}</Text>
        </Box>
      ) : info ? (
        <Box marginTop={1}>
          <Text>{info}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
