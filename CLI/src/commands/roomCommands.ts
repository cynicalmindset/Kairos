import {
  getroom,
  getroombyid,
  getmessage,
  joinroom,
  leaveroom,
  roommembers,
  createroom,
} from "../api.ts";
import { joinroomies } from "../../../src/socket.ts";

export type RoomCommandContext = {
  activeroom: any;
  setactiveroom: (room: any) => void;
  setmessages: React.Dispatch<React.SetStateAction<any[]>>;
  setmember: (members: any[]) => void;
  setrooms: React.Dispatch<React.SetStateAction<any[]>>;
  setView: (view: "welcome" | "rooms" | "members" | "help" | "chat" | "create_room") => void;
  setselectedroom: (value: number) => void;
  setmidtext: (value: string) => void;
  setmessage: (value: string) => void;
  seterror: (value: string) => void;
  setinfo: (value: string) => void;
};

//go back 
export function goHome(ctx: RoomCommandContext) {
  ctx.setactiveroom(null);
  ctx.setmessages([]);
  ctx.setmidtext("");
  ctx.setView("welcome");
  ctx.seterror("");
  ctx.setinfo("Returned to Home screen");
  ctx.setmessage("");
}

// Leave room
export async function leaveRoom(ctx: RoomCommandContext) {
  if (!ctx.activeroom) {
    ctx.seterror("You are not inside any room");
    ctx.setmessage("");
    return;
  }

  try {
    await leaveroom(ctx.activeroom.id);
    const roomName = ctx.activeroom.name;

    ctx.setactiveroom(null);
    ctx.setmessages([]);
    ctx.setmember([]);
    ctx.setmidtext("");
    ctx.setView("welcome");
    ctx.seterror("");
    ctx.setinfo(`Left room #${roomName}`);

    const updatedRooms = await getroom();
    ctx.setrooms(updatedRooms);
  } catch (error) {
    ctx.seterror(
      error instanceof Error ? error.message : "Failed to leave room",
    );
  }

  ctx.setmessage("");
}

// Get members
export async function getMembers(ctx: RoomCommandContext) {
  if (!ctx.activeroom) {
    ctx.seterror("Join a room first to see its members");
    ctx.setmessage("");
    return;
  }

  try {
    const mem = await roommembers(ctx.activeroom.id);
    ctx.setmember(mem);
    ctx.setView("members");
    ctx.seterror("");
    ctx.setinfo(`Members of #${ctx.activeroom.name} (Type /back to return to chat)`);
  } catch (error) {
    ctx.seterror(
      error instanceof Error ? error.message : "Failed to get room members",
    );
  }
  ctx.setmessage("");
}

// Join room by ID
export async function joinRoom(
  roomId: string,
  ctx: RoomCommandContext,
) {
  if (!roomId) {
    ctx.seterror("Room ID is required. Usage: /join <roomId>");
    return;
  }

  try {
    await joinroom(roomId);
    const room = await getroombyid(roomId);

    joinroomies(roomId);
    const data = await getmessage(roomId);

    ctx.setactiveroom(room);
    ctx.setmessages(data);
    ctx.setView("chat");
    ctx.setmidtext(`# ${room.name}`);
    ctx.setmessage("");
    ctx.seterror("");
    ctx.setinfo(`Joined room #${room.name}`);
  } catch (error) {
    ctx.seterror(
      error instanceof Error ? error.message : "Failed to join room",
    );
  }
}

// List rooms
export async function listRooms(ctx: RoomCommandContext) {
  try {
    const data = await getroom();

    ctx.setrooms(data || []);
    ctx.setselectedroom(0);
    ctx.setView("rooms");
    ctx.seterror("");
    ctx.setinfo("Use ↑ / ↓ and Enter to select a room, or /back to exit");
    ctx.setmessage("");
  } catch (error) {
    ctx.seterror(
      error instanceof Error ? error.message : "Failed to fetch rooms",
    );
  }
}

// Start room creation
export async function createRoomAction(
  name: string | undefined,
  ctx: RoomCommandContext,
) {
  if (name && name.trim()) {
    try {
      const room = await createroom(name.trim());
      ctx.setrooms((prev) => [...prev, room]);
      
      // Auto join created room
      joinroomies(room.id);
      ctx.setactiveroom(room);
      ctx.setmessages([]);
      ctx.setView("chat");
      ctx.setmidtext(`# ${room.name}`);
      ctx.seterror("");
      ctx.setinfo(`Created and joined room #${room.name}`);
    } catch (error) {
      ctx.seterror(
        error instanceof Error ? error.message : "Failed to create room",
      );
    }
  } else {
    ctx.setView("create_room");
    ctx.seterror("");
    ctx.setinfo("Enter a name for the new room");
  }
  ctx.setmessage("");
}

// Back from overlay or room
export function backFromRoom(ctx: RoomCommandContext) {
  ctx.seterror("");
  ctx.setinfo("");
  ctx.setmessage("");

  if (ctx.activeroom) {
    ctx.setView("chat");
    ctx.setmidtext(`# ${ctx.activeroom.name}`);
  } else {
    ctx.setView("welcome");
    ctx.setmidtext("");
  }
}