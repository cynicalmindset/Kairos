import { Box, Text } from "ink";

type messgelistprop = {
    messages: any[];
}

export default function Messagelist({messages}:messgelistprop){
    const visibleMessages = messages.slice(-25);

    return (
    <Box flexDirection="column">
      {visibleMessages.map((msg, index) => {
          if (msg.type === "file_share") {
            return (
              <Text key={msg.shareId ?? index}>
                <Text color="red">
                  {msg.user?.name ?? "Someone"} wants to share:
                </Text>
                {"  "}
                <Text>
                  {msg.fileName} ({msg.fileSize} bytes)
                </Text>
                {"\n"}
                <Text color="gray">/accept {msg.shareId}</Text>
                {"  "}
                <Text color="gray">/reject {msg.shareId}</Text>
              </Text>
            );
          }

          return (
            <Text key={msg.id ?? index}>
              <Text color="red">{msg.user?.name ?? "You"}: </Text>
              {msg.content}
            </Text>
          );
        })}
    </Box>
  );
}
