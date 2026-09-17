import { Router } from "express";
import { auth } from "../auth";
import { prisma } from "../lib/prisma";
const router = Router({ mergeParams: true });

//message get
router.get("/", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  if (!session?.user) {
    return res.status(401).json({
      error: "not logged in",
    });
  }

  const { roomId } = req.params as { roomId: string };

  const memebership = await prisma.roomMember.findUnique({
    where: {
      userId_roomId: {
        userId: session.user.id,
        roomId,
      },
    },
  });

  if (!memebership) {
    return res.status(403).json({
      error: "You are not a member of this room",
    });
  }

  const messages = await prisma.message.findMany({
    where: { roomId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return res.json({
    messages,
  });
});

//messsage post
router.post("/", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
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

  const memebership = await prisma.roomMember.findUnique({
    where: {
      userId_roomId: {
        userId: session.user.id,
        roomId,
      },
    },
  });

  if (!memebership) {
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
