type UICommandContext = {
  setmidtext: (value: string) => void;
  setlistroom: (value: boolean) => void;
  setempyt: (value: boolean) => void;
  setshowcommands: (value: boolean) => void;
  setmessages: (messages: any[]) => void;
  setmessage: (value: string) => void;
};

export function clearScreen(ctx: UICommandContext) {
  ctx.setmidtext("");
  ctx.setlistroom(false);
  ctx.setempyt(true);
  ctx.setshowcommands(false);
  ctx.setmessages([]);
  ctx.setmessage("");
}

export function showHelp(ctx: UICommandContext) {
  ctx.setempyt(false);
  ctx.setshowcommands(true);
  ctx.setmessage("");
}