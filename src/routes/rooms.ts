import { Router } from "express";
const router = Router();
import { prisma } from "../lib/prisma.ts";
import { getCachedSession, isMemberCached, invalidateMembership } from "../lib/auth-cache";
import multer from "multer";
import { mkdir } from "fs/promises";

const upload = multer({
  storage: multer.memoryStorage(),
});

// Join room
router.post("/:roomId/join", async (req, res) => {
  const session = await getCachedSession(req.headers);
  if (!session?.user) {
    return res.status(401).json({
      error: "not logged in",
    });
  }

  const { roomId } = req.params;

  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    select: { id: true },
  });

  if (!room) {
    return res.status(404).json({
      error: "Room not found",
    });
  }

  const isMember = await isMemberCached(session.user.id, roomId);
  if (isMember) {
    return res.status(409).json({
      error: "Already a part of this room",
    });
  }

  const membership = await prisma.roomMember.create({
    data: {
      userId: session.user.id,
      roomId,
    },
  });

  invalidateMembership(session.user.id, roomId);

  return res.status(201).json({
    message: "joined room",
    membership,
  });
});

// Get room
router.get("/:roomId", async (req, res) => {
  const session = await getCachedSession(req.headers);
  if (!session?.user) {
    return res.status(401).json({
      error: "not logged in",
    });
  }

  const { roomId } = req.params;

  const membership = await prisma.roomMember.findUnique({
    where: {
      userId_roomId: {
        userId: session.user.id,
        roomId,
      },
    },
    include: {
      room: true,
    },
  });

  if (!membership) {
    return res.status(403).json({
      error: "You are not a member of this room",
    });
  }

  return res.json({
    room: membership.room,
  });
});

// List rooms
router.get("/", async (req, res) => {
  const session = await getCachedSession(req.headers);
  if (!session?.user) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  const memberships = await prisma.roomMember.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      room: true,
    },
  });
  const room = memberships.map((membership) => membership.room);
  return res.json({
    room,
  });
});

// Create Room
router.post("/", async (req, res) => {
  const session = await getCachedSession(req.headers);

  if (!session?.user) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({
      error: "Room name is required",
    });
  }

  const room = await prisma.room.create({
    data: {
      name: name.trim(),
      ownerId: session.user.id,
      members: {
        create: {
          userId: session.user.id,
        },
      },
    },
  });

  invalidateMembership(session.user.id, room.id);

  return res.status(201).json({
    message: "Room created",
    room,
  });
});

// Leave room
router.delete("/:roomId/leave", async (req, res) => {
  const session = await getCachedSession(req.headers);

  if (!session?.user) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  const { roomId } = req.params;

  const isMember = await isMemberCached(session.user.id, roomId);
  if (!isMember) {
    return res.status(404).json({
      error: "You are not a member of this room",
    });
  }

  await prisma.roomMember.delete({
    where: {
      userId_roomId: {
        userId: session.user.id,
        roomId,
      },
    },
  });

  invalidateMembership(session.user.id, roomId);

  return res.json({
    message: "Left room",
  });
});

// Delete room
router.delete("/:roomId", async (req, res) => {
  const session = await getCachedSession(req.headers);

  if (!session?.user) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  const { roomId } = req.params;

  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });

  if (!room) {
    return res.status(404).json({
      error: "Room not found",
    });
  }

  if (room.ownerId !== session.user.id) {
    return res.status(403).json({
      error: "Only the room owner can delete this room",
    });
  }

  await prisma.room.delete({
    where: {
      id: roomId,
    },
  });

  invalidateMembership(undefined, roomId);

  return res.json({
    message: "Room deleted",
  });
});

// Room members list
router.get("/:roomId/members", async (req, res) => {
  const session = await getCachedSession(req.headers);

  if (!session?.user) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  const { roomId } = req.params;

  const isMember = await isMemberCached(session.user.id, roomId);
  if (!isMember) {
    return res.status(403).json({
      error: "You are not a member of this room",
    });
  }

  const members = await prisma.roomMember.findMany({
    where: {
      roomId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  return res.json({
    members: members.map((member) => member.user),
  });
});

// Kick member
router.delete("/:roomId/members/:userId", async (req, res) => {
  const session = await getCachedSession(req.headers);

  if (!session?.user) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  const { roomId, userId } = req.params;

  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });

  if (!room) {
    return res.status(404).json({
      error: "Room not found",
    });
  }

  if (room.ownerId !== session.user.id) {
    return res.status(403).json({
      error: "Only the room owner can remove members",
    });
  }

  const isMember = await isMemberCached(userId, roomId);
  if (!isMember) {
    return res.status(404).json({
      error: "User is not a member of this room",
    });
  }

  await prisma.roomMember.delete({
    where: {
      userId_roomId: {
        userId,
        roomId,
      },
    },
  });

  invalidateMembership(userId, roomId);

  return res.json({
    message: "Member removed",
  });
});

// File share
router.post("/:roomId/share", async (req, res) => {
  try {
    const session = await getCachedSession(req.headers);

    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { roomId } = req.params;
    const { fileName, filePath, fileSize } = req.body;

    if (!fileName || !filePath || !fileSize) {
      return res.status(400).json({
        error: "File information is required",
      });
    }

    const isMember = await isMemberCached(session.user.id, roomId);
    if (!isMember) {
      return res.status(404).json({
        error: "User is not a member of this room",
      });
    }

    const fileshare = await prisma.fileShare.create({
      data: {
        fileName,
        filePath,
        fileSize,
        senderId: session.user.id,
        roomId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.json({
      fileshare,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Failed to create file share",
    });
  }
});

router.get("/:roomId/shares", async (req, res) => {
  try {
    const session = await getCachedSession(req.headers);

    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { roomId } = req.params;

    const isMember = await isMemberCached(session.user.id, roomId);
    if (!isMember) {
      return res.status(403).json({
        error: "You are not a member of this room",
      });
    }

    const fileShares = await (prisma as any).fileShare.findMany({
      where: {
        roomId,
        status: "pending",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.json({
      fileShares,
    });
  } catch (error) {
    console.error("FILE SHARES ERROR:", error);
    return res.status(500).json({
      error: "Failed to fetch file shares",
    });
  }
});

router.post("/:roomId/shares/:shareId/accept", async (req, res) => {
  try {
    const session = await getCachedSession(req.headers);

    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { roomId, shareId } = req.params;

    const isMember = await isMemberCached(session.user.id, roomId);
    if (!isMember) {
      return res.status(403).json({
        error: "You are not a member of this room",
      });
    }

    const fileShare = await (prisma as any).fileShare.findFirst({
      where: {
        id: shareId,
        roomId,
        status: "pending",
      },
    });

    if (!fileShare) {
      return res.status(404).json({
        error: "File share not found",
      });
    }

    const updatedShare = await prisma.fileShare.update({
      where: {
        id: shareId,
      },
      data: {
        status: "accepted",
      },
    });

    return res.json({
      fileShare: updatedShare,
    });
  } catch (error) {
    console.error("ACCEPT SHARE ERROR:", error);
    return res.status(500).json({
      error: "Failed to accept file share",
    });
  }
});

router.post("/:roomId/shares/:shareId/reject", async (req, res) => {
  try {
    const session = await getCachedSession(req.headers);

    if (!session) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { roomId, shareId } = req.params;

    const isMember = await isMemberCached(session.user.id, roomId);
    if (!isMember) {
      return res.status(403).json({
        error: "You are not a member of this room",
      });
    }

    const fileShare = await (prisma as any).fileShare.findFirst({
      where: {
        id: shareId,
        roomId,
        status: "pending",
      },
    });

    if (!fileShare) {
      return res.status(404).json({
        error: "File share not found",
      });
    }

    const updatedShare = await (prisma as any).fileShare.update({
      where: {
        id: shareId,
      },
      data: {
        status: "rejected",
      },
    });

    return res.json({
      fileShare: updatedShare,
    });
  } catch (error) {
    console.error("REJECT SHARE ERROR:", error);
    return res.status(500).json({
      error: "Failed to accept file share",
    });
  }
});

// File server upload
router.post("/:roomId/shares/:shareId/upload", upload.single("file"), async (req, res) => {
  try {
    const session = await getCachedSession(req.headers);
    if (!session) {
      return res.status(403).json({
        error: "unauthorized",
      });
    }

    const { roomId, shareId } = req.params;
    const normalizedRoomId = Array.isArray(roomId) ? roomId[0] : roomId;
    const normalizedShareId = Array.isArray(shareId) ? shareId[0] : shareId;

    if (!normalizedRoomId || !normalizedShareId) {
      return res.status(400).json({
        error: "Missing room or share id",
      });
    }

    const isMember = await isMemberCached(session.user.id, normalizedRoomId);
    if (!isMember) {
      return res.status(403).json({
        error: "you are not a part of this room",
      });
    }

    const fileshare = await prisma.fileShare.findFirst({
      where: {
        id: normalizedShareId,
        roomId: normalizedRoomId,
        senderId: session.user.id,
        status: "pending",
      },
    });

    if (!fileshare) {
      return res.status(404).json({
        error: "file not found",
      });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "File is required",
      });
    }

    const shareDir = `./uploads/${normalizedShareId}`;

    await mkdir(shareDir, { recursive: true });

    await Bun.write(
      `${shareDir}/${fileshare.fileName}`,
      file.buffer,
    );

    return res.json({
      message: "File uploaded successfully",
      path: `${shareDir}/${fileshare.fileName}`,
    });
  } catch (error) {
    console.error("UPLOAD FILE ERROR:", error);
    return res.status(500).json({
      error: "Failed to upload file",
    });
  }
});

// Download from server
router.get("/:roomId/shares/:shareId/download", async (req, res) => {
  try {
    const session = await getCachedSession(req.headers);

    if (!session) {
      return res.status(403).json({
        error: "unauthorized",
      });
    }

    const { roomId, shareId } = req.params;

    const normalizedRoomId = Array.isArray(roomId) ? roomId[0] : roomId;
    const normalizedShareId = Array.isArray(shareId) ? shareId[0] : shareId;

    const isMember = await isMemberCached(session.user.id, normalizedRoomId);
    if (!isMember) {
      return res.status(403).json({
        error: "You are not a member of this room",
      });
    }

    const fileshare = await prisma.fileShare.findFirst({
      where: {
        id: normalizedShareId,
        roomId: normalizedRoomId,
        status: "accepted",
      },
    });

    if (!fileshare) {
      return res.status(404).json({
        error: "File share not found or not accepted",
      });
    }

    const filePath = `./uploads/${normalizedShareId}/${fileshare.fileName}`;
    const file = Bun.file(filePath);

    if (!(await file.exists())) {
      return res.status(404).json({
        error: "File does not exist on server",
      });
    }

    const buffer = await file.arrayBuffer();

    res.setHeader(
      "Content-Type",
      file.type || "application/octet-stream",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileshare.fileName}"`,
    );

    return res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("DOWNLOAD FILE ERROR:", error);
    return res.status(500).json({
      error: "Failed to download file",
    });
  }
});

export default router;
