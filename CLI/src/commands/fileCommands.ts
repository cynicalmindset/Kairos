
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

type FileCommandContext = {
  activeroom: any;

  setmessage: (value: string) => void;
  seterror: (value: string) => void;
};

export async function shareFile(
  filepath: string,
  ctx: FileCommandContext,
) {
  if (!ctx.activeroom) {
    ctx.seterror("join a room first");
    return;
  }

  if (!filepath) {
    ctx.seterror("file path is required");
    return;
  }

  if (!existsSync(filepath)) {
    ctx.seterror("file does not exist");
    return;
  }

  try {
    const stats = statSync(filepath);

    if (!stats.isFile()) {
      ctx.seterror("path is not a file");
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

    ctx.setmessage("");
    ctx.seterror("");
  } catch (error) {
    ctx.seterror(
      error instanceof Error
        ? error.message
        : "Failed to share file",
    );
  }
}


export async function acceptFile(
  shareId: string,
  ctx: FileCommandContext,
) {
  if (!ctx.activeroom) {
    ctx.seterror("Join a room first");
    return;
  }

  if (!shareId) {
    ctx.seterror("Share ID is required");
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
        ?.match(/filename="(.+)"/)?.[1] ??
      "shared-file";

    await Bun.write(filename, buffer);

    console.log(`File downloaded: ${filename}`);

    ctx.setmessage("");
    ctx.seterror("");
  } catch (error) {
    ctx.seterror(
      error instanceof Error
        ? error.message
        : "Failed to accept file",
    );
  }
}

export async function rejectFile(
  shareId: string,
  ctx: FileCommandContext,
) {
  if (!ctx.activeroom) {
    ctx.seterror("Join a room first");
    return;
  }

  if (!shareId) {
    ctx.seterror("Share ID is required");
    return;
  }

  try {
    await rejecttshare(
      ctx.activeroom.id,
      shareId,
    );

    ctx.setmessage("");
    ctx.seterror("");
  } catch (error) {
    ctx.seterror(
      error instanceof Error
        ? error.message
        : "Failed to reject file share",
    );
  }
}