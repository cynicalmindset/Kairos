import { Router } from "express";
import { prisma } from "../lib/prisma";
import { getCachedSession } from "../lib/auth-cache";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const session = await getCachedSession(req.headers);
    if (!session?.user) {
      return res.status(401).json({
        error: "not logged in",
      });
    }

    const userId = session.user.id;

    const [roomsjoined, roomsOwned, totalmessages, fileshared] = await Promise.all([
      prisma.roomMember.count({ where: { userId } }).catch(() => 0),
      prisma.room.count({ where: { ownerId: userId } }).catch(() => 0),
      prisma.message.count({ where: { userId } }).catch(() => 0),
      prisma.fileShare.count({ where: { senderId: userId } }).catch(() => 0),
    ]);

    return res.json({
      user: session.user,
      stats: {
        roomsjoined,
        roomsOwned,
        totalmessages,
        fileshared,
      },
    });
  } catch (err) {
    console.error("Profile endpoint error:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to load profile",
    });
  }
});

export default router;