import { existsSync, statSync } from "fs";
import path from "path";

import {
  createshare,
  uploadshare,
  acceptshare,
  rejecttshare,
  downloadshare,
} from "../api.ts";

import { sendFileShare } from "../../../src/socket.ts";

export type FileCommandContext = {
  activeroom: any;
  setmessage: (value: string) => void;
  seterror: (value: string) => void;
  setinfo: (value: string) => void;
};

export async function shareFile(
  filepath: string,
  ctx: FileCommandContext,
) {
  if (!ctx.activeroom) {
    ctx.seterror("Join a room first before sharing a file");
    ctx.setmessage("");
    return;
  }

  if (!filepath) {
    ctx.seterror("File path is required. Usage: /share <path/to/file>");
    ctx.setmessage("");
    return;
  }

  if (!existsSync(filepath)) {
    ctx.seterror(`File does not exist: ${filepath}`);
    ctx.setmessage("");
    return;
  }

  try {
    const stats = statSync(filepath);

    if (!stats.isFile()) {
      ctx.seterror("Path is a directory, not a file");
      ctx.setmessage("");
      return;
    }

    const filename = path.basename(filepath);

    const fileshare = await createshare(
      ctx.activeroom.id,
      filename,
      filepath,
      stats.size,
    );

    await uploadshare(
      ctx.activeroom.id,
      fileshare.id,
      filepath,
    );

    sendFileShare(
      ctx.activeroom.id,
      fileshare.id,
      fileshare.fileName,
      fileshare.fileSize,
      fileshare.sender,
    );

    ctx.seterror("");
    ctx.setinfo(`Shared file "${filename}" with room #${ctx.activeroom.name}`);
    ctx.setmessage("");
  } catch (error) {
    ctx.seterror(
      error instanceof Error ? error.message : "Failed to share file",
    );
    ctx.setmessage("");
  }
}

export async function acceptFile(
  shareId: string,
  ctx: FileCommandContext,
) {
  if (!ctx.activeroom) {
    ctx.seterror("Join a room first before accepting a file");
    ctx.setmessage("");
    return;
  }

  if (!shareId) {
    ctx.seterror("Share ID is required. Usage: /accept <shareId>");
    ctx.setmessage("");
    return;
  }

  try {
    await acceptshare(ctx.activeroom.id, shareId);

    const response = await downloadshare(
      ctx.activeroom.id,
      shareId,
    );

    const buffer = await response.arrayBuffer();

    const filename =
      response.headers
        .get("content-disposition")
        ?.match(/filename="(.+)"/)?.[1] ?? `download-${shareId}`;

    await Bun.write(filename, buffer);

    ctx.seterror("");
    ctx.setinfo(`Downloaded file "${filename}" to current directory`);
    ctx.setmessage("");
  } catch (error) {
    ctx.seterror(
      error instanceof Error ? error.message : "Failed to accept file",
    );
    ctx.setmessage("");
  }
}

export async function rejectFile(
  shareId: string,
  ctx: FileCommandContext,
) {
  if (!ctx.activeroom) {
    ctx.seterror("Join a room first");
    ctx.setmessage("");
    return;
  }

  if (!shareId) {
    ctx.seterror("Share ID is required. Usage: /reject <shareId>");
    ctx.setmessage("");
    return;
  }

  try {
    await rejecttshare(
      ctx.activeroom.id,
      shareId,
    );

    ctx.seterror("");
    ctx.setinfo(`Rejected file share ${shareId}`);
    ctx.setmessage("");
  } catch (error) {
    ctx.seterror(
      error instanceof Error ? error.message : "Failed to reject file share",
    );
    ctx.setmessage("");
  }
}