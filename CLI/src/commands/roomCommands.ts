import {
  getroom,
  getroombyid,
  getmessage,
  joinroom,
  leaveroom,
  roommembers,
} from "../api.ts";


import { joinroomies } from "../../../src/socket.ts";

type RoomCommandContext = {
  activeroom: any;
  setactiveroom: (room: any) => void;

  setmessages: React.Dispatch<React.SetStateAction<any[]>>;
  setmember: (members: any[]) => void;
  setrooms: (rooms: any[]) => void;

  setlistroom: (value: boolean) => void;
  setshowmember: (value: boolean) => void;
  setempyt: (value: boolean) => void;

  setselectedroom: (value: number) => void;
  setmidtext: (value: string) => void;
  setmessage: (value: string) => void;
  seterror: (value: string) => void;
  setIsCreatingRoom: (value: boolean) => void;
  setshowcommands: (value: boolean) => void;
};

// leave room
export async function leaveRoom(ctx:RoomCommandContext){
    if(!ctx.activeroom){
        ctx.seterror("you are not inside room");
        ctx.setmessage("");
        return;
    }

    try {
        await leaveroom(ctx.activeroom.id);

        ctx.setactiveroom(null);
        ctx.setmessages([]);
        ctx.setmember([]);
        ctx.setmidtext("");
        ctx.setempyt(true);

        const updatedRooms = await getroom();
        ctx.setrooms(updatedRooms);

    } catch (error) {
        ctx.seterror(
      error instanceof Error
        ? error.message
        : "Failed to leave room",
    );
    }

    ctx.setmessage("");
}

// get members
export async function getMembers(ctx:RoomCommandContext){
    if(!ctx.activeroom){
        ctx.seterror("you are not inside room");
        ctx.setmessage("");
        return;
    }

    try {
        const mem = await roommembers(ctx.activeroom.id);
        ctx.setmember(mem);
    } catch (error) {
        ctx.seterror(
      error instanceof Error
        ? error.message
        : "Failed to get room members",
    );
    }
    ctx.setshowmember(true);
    ctx.setmessage("");
}

//join
export async function joinRoom(
  roomId: string,
  ctx: RoomCommandContext,
) {
  if (!roomId) {
    ctx.seterror("Room ID is required");
    return;
  }

  try {
    await joinroom(roomId);

    const room = await getroombyid(roomId);

    joinroomies(roomId);

    const data = await getmessage(roomId);

    ctx.setactiveroom(room);
    ctx.setmessages(data);
    ctx.setlistroom(false);
    ctx.setempyt(false);
    ctx.setmidtext(`# ${room.name}`);
    ctx.setmessage("");
    ctx.seterror("");
  } catch (error) {
    ctx.seterror(
      error instanceof Error
        ? error.message
        : "Failed to join room",
    );
  }
}

//list rooms
export async function listRooms(ctx: RoomCommandContext) {
  try {
    const data = await getroom();

    ctx.setrooms(data);
    ctx.setselectedroom(0);
    ctx.setlistroom(true);
    ctx.setempyt(false);
    ctx.setshowcommands(false);
    ctx.setmessage("");
  } catch (error) {
    ctx.seterror(
      error instanceof Error
        ? error.message
        : "Failed to fetch rooms",
    );
  }
}

//create room 
export function createRoom(ctx: RoomCommandContext) {
  ctx.setIsCreatingRoom(true);
  ctx.setmessage("");
  ctx.setmessages([]);
}

//back from room 
export function backFromRoom(ctx: RoomCommandContext) {
  ctx.setactiveroom(null);
  ctx.setmessages([]);
  ctx.setmidtext("");
  ctx.setmessage("");
}