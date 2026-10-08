import { clearAuth } from "../auth.ts";

export type AuthCommandContext = {
  setmode: (mode: "chat" | "register" | "login") => void;
  setlogged: (value: boolean) => void;
  setactiveroom: (room: any) => void;
  setView: (view: "welcome" | "rooms" | "members" | "help" | "chat" | "create_room") => void;
  setmessages: React.Dispatch<React.SetStateAction<any[]>>;
  setmessage: (value: string) => void;
  seterror: (value: string) => void;
  setinfo: (value: string) => void;
};

export function startLogin(ctx: AuthCommandContext) {
  ctx.setmode("login");
  ctx.seterror("");
  ctx.setinfo("");
  ctx.setmessage("");
}

export function startRegister(ctx: AuthCommandContext) {
  ctx.setmode("register");
  ctx.seterror("");
  ctx.setinfo("");
  ctx.setmessage("");
}

export function logout(ctx: AuthCommandContext) {
  clearAuth();

  ctx.setlogged(false);
  ctx.setactiveroom(null);
  ctx.setmessages([]);
  ctx.setView("welcome");
  ctx.setmode("chat");
  ctx.seterror("");
  ctx.setinfo("Logged out successfully");
  ctx.setmessage("");
}