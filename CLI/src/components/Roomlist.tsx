import { Box, Text } from "ink";

type roomlistprops = {
    rooms:any[];
    selectedroom:number;
}

export default function RoomList({ rooms, selectedroom }: roomlistprops) {
  if (!rooms || rooms.length === 0) {
    return (
      <Box flexDirection="column">
        <Text color="gray">No rooms found. Type /create to create a new room!</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {rooms.map((room, index) => {
        const isSelected = index === selectedroom;
        return (
          <Box key={room.id} flexDirection="row" gap={1}>
            <Text color={isSelected ? "cyan" : "white"} bold={isSelected}>
              {isSelected ? "> " : "  "}
              #{room.name}
            </Text>
            <Text color="gray">
              (Code: <Text color="yellow" bold>{room.id}</Text>)
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}