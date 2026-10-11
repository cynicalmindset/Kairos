import { Box, Text } from "ink";
// import figlet from "figlet";
import Status from "../components/status.tsx";

type HeaderProps = {
  logged: boolean;
  serverconnected: boolean;
  frame: number;
  error?: string;
  info?: string;
  user?:any;
  terminalrows?:any;
  activeRoom?:any;
};

// const logo = ` ____ ____ ____ ____ ____ ____ 
// ||K |||A |||I |||R |||O |||S ||
// ||__|||__|||__|||__|||__|||__||
// |/__\\|/__\\|/__\\|/__\\|/__\\|/__\\|`;

export default function Header({
  logged,
  serverconnected,
  frame,
  error,
  info,
  user,
  terminalrows = 24,
  activeRoom
}: HeaderProps) {

  const compact = terminalrows < 26;

  if(compact){
    // console.log(user);
    return(
      
      <Box flexDirection="column" marginBottom={0}>
        <Box
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
        justifyContent="space-between"
        flexDirection="row"
        >
          <Box flexDirection="row" gap={1}>
            <Text bold color="red">✦ KAIROS</Text>
            <Text color="gray">v1.0.4</Text>
            {activeRoom?(
               <Box flexDirection="row">
                <Text color="magenta" bold>#{activeRoom.name}</Text>
                <Text color="gray"> ({activeRoom.id?.slice(0, 6)}...)</Text>
              </Box>
            ):(
              <Text color="gray">[Lobby]</Text>
            )}
          </Box>

          <Box flexDirection="row" gap={1}>
            {user?.name?(
              <Text color="white">hi {user.name}!</Text>
            ):logged?(
              <Text color="gray">Logged In</Text>
            ):(
              <Text color="yellow">○ Guest (/login)</Text>
            )}

            <Text color="gray">|</Text>
            <Status logged={logged} connected={serverconnected} frame={frame} />
          </Box>
        </Box>

        {error?(
          <Box paddingX={1}>
            <Text color="red" bold>✖ {error}</Text>
          </Box>
        ):null}
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginBottom={0}>
      <Box
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
        flexDirection="column"
      >
        <Box justifyContent="space-between" flexDirection="row">
          <Box flexDirection="row" gap={1}>
            <Text bold color="red">✦ KAIROS</Text>
            <Text color="gray">v1.0.4</Text>
            {/* <Text color="gray">―</Text>
            <Text color="gray">Terminal Chat & Sharing</Text> */}
          </Box>
          <Status logged={logged} connected={serverconnected} frame={frame} />
        </Box>
        <Box justifyContent="space-between" flexDirection="row" marginTop={0}>
          <Box flexDirection="row" gap={1}>
            {activeRoom ? (
              <Box flexDirection="row" gap={1}>
                <Text color="gray">Room:</Text>
                <Text color="white" bold>#{activeRoom.name}</Text>
                <Text color="gray">({activeRoom.id})</Text>
              </Box>
            ) : (
              <Text color="gray">No room active • Type <Text color="white" bold>/rooms</Text> or <Text color="white" bold>/create</Text></Text>
            )}
          </Box>
          <Box flexDirection="row" gap={1}>
            {user?.name ? (
              <Text color="white">{user.name} ({user.email})</Text>
            ) : logged ? (
              <Text color="gray">Logged In</Text>
            ) : (
              <Text color="yellow">○ Guest mode • Type <Text color="white" bold>/login</Text></Text>
            )}
          </Box>
        </Box>
      </Box>
    
      {error ? (
        <Box paddingX={1}>
          <Text color="red" bold>✖ {error}</Text>
        </Box>
      ): null}
    </Box>
  );
}
