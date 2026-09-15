import { Router } from "express";
const router = Router();
import { prisma } from "../lib/prisma.ts";
import { auth } from "../auth";

//join room
router.post("/:roomId/join", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
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
  });

  if (!room) {
    return res.status(404).json({
      error: "Room not found",
    });
  }

  const existingmember = await prisma.roomMember.findUnique({
    where: {
      userId_roomId: {
        userId: session.user.id,
        roomId,
      },
    },
  });

  if (existingmember) {
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

  return res.status(201).json({
    message: "joined room",
    membership,
  });
});

//get room
router.get("/:roomId", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
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

//list room
router.get("/", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
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
  const room = memberships.map((membership) => {
    return membership.room;
  });
  return res.json({
    room,
  });
});

// router.post("/",async (req,res)=>{
//     const {name} = req.body;
//     const room = await prisma.room.create({
//         data:{
//             name,
//             ownerId:"TEMP"
//         }
//     })
//     res.json({
//         message: "Room created successfully",
//         room,
//     })
// })

//create room
router.post("/", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

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
    },
  });

  return res.status(201).json({
    message: "Room created",
    room,
  });
});

export default router;
