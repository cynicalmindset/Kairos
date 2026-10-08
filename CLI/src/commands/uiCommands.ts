export type UICommandContext = {
  setView: (view: "welcome" | "rooms" | "members" | "help" | "chat" | "create_room") => void;
  setmidtext: (value: string) => void;
  setmessages: React.Dispatch<React.SetStateAction<any[]>>;
  setmessage: (value: string) => void;
  seterror: (value: string) => void;
  setinfo: (value: string) => void;
  activeroom: any;
};

export function clearScreen(ctx: UICommandContext) {
  ctx.seterror("");
  ctx.setinfo("");
  ctx.setmessage("");

  if (ctx.activeroom) {
    ctx.setmessages([]);
    ctx.setView("chat");
    ctx.setmidtext(`# ${ctx.activeroom.name}`);
  } else {
    ctx.setmidtext("");
    ctx.setView("welcome");
  }
}

export function showHelp(ctx: UICommandContext) {
  ctx.seterror("");
  ctx.setinfo("Type /back to exit help menu");
  ctx.setView("help");
  ctx.setmessage("");
}