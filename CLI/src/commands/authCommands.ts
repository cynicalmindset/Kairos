import { clearAuth } from "../auth.ts";

type AuthCommandContext = {
  setmode: (mode: "chat" | "register" | "login") => void;
  setlogged: (value: boolean) => void;
  setmessage: (value: string) => void;
  setmessages: (messages: any[]) => void;
};

export function startLogin(ctx: AuthCommandContext) {
  ctx.setmode("login");
  ctx.setmessage("");
}

export function startRegister(ctx: AuthCommandContext) {
  ctx.setmode("register");
  ctx.setmessage("");
}

export function logout(ctx: AuthCommandContext) {
  clearAuth();

  ctx.setlogged(false);
  ctx.setmode("chat");
  ctx.setmessage("");
  ctx.setmessages([]);
}