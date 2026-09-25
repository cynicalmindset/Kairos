import { Box, Text } from "ink";

type roomlistprops = {
    rooms:any[];
    selectedroom:number;
}

export default function RoomList({rooms,selectedroom}:roomlistprops){
 return (
    <Box flexDirection="column">
      {rooms.map((room, index) => (
        <Text key={room.id}>
          {index === selectedroom ? "> " : "  "}
          {room.name}
        </Text>
      ))}
    </Box>
  );
}