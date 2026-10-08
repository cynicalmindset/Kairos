import { Router } from "express";
import { prisma } from "../lib/prisma";
import { getCachedSession, isMemberCached } from "../lib/auth-cache";

const router = Router({ mergeParams: true });

// Message GET - retrieve recent messages for room
router.get("/", async (req, res) => {
  const session = await getCachedSession(req.headers);
  if (!session?.user) {
    return res.status(401).json({
      error: "not logged in",
    });
  }

  const { roomId } = req.params as { roomId: string };

  const isMember = await isMemberCached(session.user.id, roomId);
  if (!isMember) {
    return res.status(403).json({
      error: "You are not a member of this room",
    });
  }

  const limit = Math.min(Number(req.query.limit) || 100, 200);

  const messages = await prisma.message.findMany({
    where: { roomId },
    take: limit,
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return res.json({
    messages,
  });
});

// Message POST - create new message
router.post("/", async (req, res) => {
  const session = await getCachedSession(req.headers);
  if (!session?.user) {
    return res.status(401).json({
      error: "Not logged in",
    });
  }

  const { roomId } = req.params as { roomId: string };
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({
      error: "message content is required",
    });
  }

  const isMember = await isMemberCached(session.user.id, roomId);
  if (!isMember) {
    return res.status(403).json({
      error: "not memeber of this room",
    });
  }

  const message = await prisma.message.create({
    data: {
      content,
      userId: session.user.id,
      roomId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return res.json({
    message,
  });
});

export default router;

