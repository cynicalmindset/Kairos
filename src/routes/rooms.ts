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

//create ROOM
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

      members: {
        create: {
          userId: session.user.id,
        },
      },
    },
  });

  return res.status(201).json({
    message: "Room created",
    room,
  });
});


//leave room

router.delete("/:roomId/leave", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return res.status(401).json({
      error: "Not logged in",
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
  });

  if (!membership) {
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

  return res.json({
    message: "Left room",
  });
});


//deleteroom

router.delete("/:roomId", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

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

  return res.json({
    message: "Room deleted",
  });
});

//room memebers list

router.get("/:roomId/members", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session?.user) {
    return res.status(401).json({
      error: "Not logged in",
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
  });

  if (!membership) {
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

//kick memeber

router.delete("/:roomId/members/:userId", async (req, res) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

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

  const membership = await prisma.roomMember.findUnique({
    where: {
      userId_roomId: {
        userId,
        roomId,
      },
    },
  });

  if (!membership) {
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

  return res.json({
    message: "Member removed",
  });
});


// file share


export default router;
