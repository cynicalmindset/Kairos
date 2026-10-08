import MessageList from "../src/components/Messagelist.tsx";
import { Box, Text, useInput, useAnimation } from "ink";
import Header from "./components/Header.tsx";
import RoomList from "./components/Roomlist.tsx";
import Members from "./components/Members.tsx";
import Help from "./components/Help.tsx";
import Input from "./components/Input.tsx";
import { clearScreen, showHelp, type UICommandContext } from "./commands/uiCommands.ts";
import { startLogin, startRegister, logout, type AuthCommandContext } from "./commands/authCommands.ts";
import { shareFile, acceptFile, rejectFile, type FileCommandContext } from "./commands/fileCommands.ts";
import {
  leaveRoom,
  getMembers,
  joinRoom,
  listRooms,
  createRoomAction,
  backFromRoom,
  type RoomCommandContext,
} from "./commands/roomCommands.ts";
import {
  joinroomies,
  sendSocketMessage,
  setMessageHandler,
  setconncetionhandler,
} from "../../src/socket.ts";
import {
  register,
  login,
  getroom,
  getmessage,
  sendmessage,
  createroom,
} from "./api.ts";
import TextInput from "ink-text-input";
import { useEffect, useState } from "react";
import { getSavedToken } from "./auth.ts";
import { settoken } from "./api.ts";

type Mode = "chat" | "register" | "login";
type ViewMode = "welcome" | "rooms" | "members" | "help" | "chat" | "create_room";

function App() {
  const [mode, setmode] = useState<Mode>("chat");
  const [view, setView] = useState<ViewMode>("welcome");

  const [serverconnected, setserverconnected] = useState(false);
  const [logged, setlogged] = useState(false);

  const [activeroom, setactiveroom] = useState<any | null>(null);
  const [rooms, setrooms] = useState<any[]>([]);
  const [selectedroom, setselectedroom] = useState(0);
  const [member, setmember] = useState<any[]>([]);

  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState<any[]>([]);
  const [roomname, setroomname] = useState("");
  const [midtext, setmidtext] = useState("");

  const [error, seterror] = useState("");
  const [info, setinfo] = useState("");

  // Auth inputs
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [registerstep, setregisterstep] = useState<"name" | "email" | "password">("name");
  const [loginstep, setloginstep] = useState<"email" | "password">("email");

  // Keyboard navigation for room selector and overlay escape
  useInput(async (_input, key) => {
    if (key.escape) {
      if (view === "rooms" || view === "members" || view === "help" || view === "create_room") {
        if (activeroom) {
          setView("chat");
          setmidtext(`# ${activeroom.name}`);
        } else {
          setView("welcome");
          setmidtext("");
        }
        seterror("");
        setinfo("");
        return;
      }
    }

    if (view === "rooms" && rooms.length > 0) {
      if (key.upArrow) {
        setselectedroom((prev) => (prev > 0 ? prev - 1 : rooms.length - 1));
      }

      if (key.downArrow) {
        setselectedroom((prev) => (prev < rooms.length - 1 ? prev + 1 : 0));
      }

      if (key.return) {
        const room = rooms[selectedroom];
        if (!room) return;

        try {
          joinroomies(room.id);
          const data = await getmessage(room.id);

          setactiveroom(room);
          setmessages(data || []);
          setView("chat");
          setmidtext(`# ${room.name}`);
          seterror("");
          setinfo(`Entered #${room.name}`);
        } catch (err) {
          seterror(
            err instanceof Error ? err.message : "Failed to open room",
          );
        }
      }
    }
  });

  const { frame } = useAnimation({
    interval: 80,
    isActive: !serverconnected,
  });

  useEffect(() => {
    setconncetionhandler((connected) => {
      setserverconnected(connected);
    });
  }, []);

  useEffect(() => {
    setMessageHandler((newMessage) => {
      setmessages((prev) => {
        const optimisticIndex = prev.findIndex(
          (msg) => msg.optimistic && msg.content === newMessage.content,
        );

        if (optimisticIndex !== -1) {
          const updated = [...prev];
          updated[optimisticIndex] = {
            ...newMessage,
            optimistic: false,
          };
          return updated;
        }

        return [...prev, newMessage];
      });
    });
  }, []);

  useEffect(() => {
    const token = getSavedToken();
    if (token) {
      settoken(token);
      setlogged(true);
    }
  }, []);

  useEffect(() => {
    if (!logged || mode !== "chat") return;
    getroom()
      .then((data) => {
        setrooms(data || []);
      })
      .catch((err) => {
        seterror(
          err instanceof Error ? err.message : "Failed to load rooms",
        );
      });
  }, [logged, mode]);

  const handlesubmit = async () => {
    const raw = message.trim();
    if (!raw) return;

    // Clear transient errors on new command attempt
    seterror("");
    setinfo("");

    const uiContext: UICommandContext = {
      setView,
      setmidtext,
      setmessages,
      setmessage,
      seterror,
      setinfo,
      activeroom,
    };

    const authContext: AuthCommandContext = {
      setmode,
      setlogged,
      setactiveroom,
      setView,
      setmessages,
      setmessage,
      seterror,
      setinfo,
    };

    const fileContext: FileCommandContext = {
      activeroom,
      setmessage,
      seterror,
      setinfo,
    };

    const roomContext: RoomCommandContext = {
      activeroom,
      setactiveroom,
      setmessages,
      setmember,
      setrooms,
      setView,
      setselectedroom,
      setmidtext,
      setmessage,
      seterror,
      setinfo,
    };

    // 1. UI Commands
    if (raw === "/clear") {
      clearScreen(uiContext);
      return;
    }

    if (raw === "/help") {
      showHelp(uiContext);
      return;
    }

    // 2. Auth Commands
    if (raw === "/login") {
      startLogin(authContext);
      return;
    }

    if (raw === "/register") {
      startRegister(authContext);
      return;
    }

    if (raw === "/logout") {
      logout(authContext);
      return;
    }

    // 3. Room Commands
    if (raw === "/rooms") {
      await listRooms(roomContext);
      return;
    }

    if (raw.startsWith("/create")) {
      const roomArg = raw.slice(7).trim();
      await createRoomAction(roomArg || undefined, roomContext);
      return;
    }

    if (raw.startsWith("/join ")) {
      const roomId = raw.slice(6).trim();
      await joinRoom(roomId, roomContext);
      return;
    }

    if (raw === "/members") {
      await getMembers(roomContext);
      return;
    }

    if (raw === "/leave") {
      await leaveRoom(roomContext);
      return;
    }

    if (raw === "/back") {
      backFromRoom(roomContext);
      return;
    }

    // 4. File Commands
    if (raw.startsWith("/share ")) {
      const filepath = raw.slice(7).trim();
      await shareFile(filepath, fileContext);
      return;
    }

    if (raw.startsWith("/accept ")) {
      const shareId = raw.slice(8).trim();
      await acceptFile(shareId, fileContext);
      return;
    }

    if (raw.startsWith("/reject ")) {
      const shareId = raw.slice(8).trim();
      await rejectFile(shareId, fileContext);
      return;
    }

    // 5. Normal Chat Message
    if (activeroom) {
      const content = raw;

      // Optimistic preview
      setmessages((prev) => [
        ...prev,
        {
          content,
          user: { name: "You" },
          optimistic: true,
        },
      ]);
      setmessage("");

      try {
        const sent = await sendmessage(activeroom.id, content);
        sendSocketMessage(activeroom.id, content, sent.user);
      } catch (err) {
        seterror(
          err instanceof Error ? err.message : "Failed to send message",
        );
      }
      return;
    }

    // If not in room and typed non-command text
    seterror("You are not inside a room. Type /rooms to view rooms or /create to make one.");
    setmessage("");
  };

  if (mode === "login") {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="red">Kairos - Login</Text>
        {error ? <Text color="red">⚠️ {error}</Text> : null}

        {loginstep === "email" && (
          <Box marginTop={1}>
            <Text>Email: </Text>
            <TextInput
              value={email}
              onChange={setemail}
              onSubmit={() => {
                if (!email.trim()) return;
                setloginstep("password");
              }}
            />
          </Box>
        )}

        {loginstep === "password" && (
          <Box marginTop={1}>
            <Text>Password: </Text>
            <TextInput
              mask="*"
              value={password}
              onChange={setpassword}
              onSubmit={async () => {
                if (!password.trim()) return;
                try {
                  await login(email, password);
                  seterror("");
                  setinfo("Logged in successfully");
                  setlogged(true);
                  setmode("chat");
                  setView("welcome");
                } catch (e) {
                  seterror(e instanceof Error ? e.message : "Login failed");
                }
              }}
            />
          </Box>
        )}
      </Box>
    );
  }

  if (mode === "register") {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="red">Kairos - Register</Text>
        {error ? <Text color="red">⚠️ {error}</Text> : null}

        {registerstep === "name" && (
          <Box marginTop={1}>
            <Text>Name: </Text>
            <TextInput
              value={name}
              onChange={setname}
              onSubmit={() => {
                if (!name.trim()) return;
                setregisterstep("email");
              }}
            />
          </Box>
        )}

        {registerstep === "email" && (
          <Box marginTop={1}>
            <Text>Email: </Text>
            <TextInput
              value={email}
              onChange={setemail}
              onSubmit={() => {
                if (!email.trim()) return;
                setregisterstep("password");
              }}
            />
          </Box>
        )}

        {registerstep === "password" && (
          <Box marginTop={1}>
            <Text>Password: </Text>
            <TextInput
              mask="*"
              value={password}
              onChange={setpassword}
              onSubmit={async () => {
                if (!password.trim()) return;
                try {
                  await register(name, email, password);
                  seterror("");
                  setinfo("Registered and logged in successfully");
                  setlogged(true);
                  setmode("chat");
                  setView("welcome");
                } catch (e) {
                  seterror(e instanceof Error ? e.message : "Registration failed");
                }
              }}
            />
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Header logged={logged} serverconnected={serverconnected} frame={frame} />

      <Box borderStyle="single" height={22} flexDirection="column" paddingX={1}>
        {view === "welcome" && (
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            marginY={2}
          >
            <Text color="cyan" bold>Welcome to Kairos Terminal Chat 🚀</Text>
            <Text color="gray">{"\nCode together without ever leaving your IDE"}</Text>
            <Text color="gray">{"\nType /help for available commands or /rooms to join a room"}</Text>
          </Box>
        )}

        {view === "help" && (
          <Box flexDirection="column" marginY={1}>
            <Help />
          </Box>
        )}

        {view === "rooms" && (
          <Box flexDirection="column" marginY={1}>
            <Text bold color="yellow">Available Rooms (↑/↓ to select, Enter to join):</Text>
            <Box marginTop={1}>
              <RoomList rooms={rooms} selectedroom={selectedroom} />
            </Box>
          </Box>
        )}

        {view === "members" && (
          <Box flexDirection="column" marginY={1}>
            <Members members={member} />
          </Box>
        )}

        {view === "create_room" && (
          <Box flexDirection="column" marginY={1}>
            <Text bold color="green">Create a New Room</Text>
            <Text color="gray">Type the room name below and press Enter (or Esc to cancel)</Text>
          </Box>
        )}

        {view === "chat" && (
          <Box flexDirection="column">
            {midtext ? (
              <Box marginY={1}>
                <Text bold color="magenta">{midtext}</Text>
              </Box>
            ) : null}
            <MessageList messages={messages} />
          </Box>
        )}
      </Box>

      {/* Feedback Banner */}
      {error ? (
        <Box paddingX={1}>
          <Text color="red">⚠️ {error}</Text>
        </Box>
      ) : info ? (
        <Box paddingX={1}>
          <Text color="cyan">ℹ️ {info}</Text>
        </Box>
      ) : null}

      {/* Input Prompt */}
      <Box borderStyle="single">
        <Text color="red">{" > "}</Text>
        {view === "create_room" ? (
          <TextInput
            placeholder="Enter room name..."
            value={roomname}
            onChange={setroomname}
            onSubmit={async () => {
              const trimmed = roomname.trim();
              if (!trimmed) {
                seterror("Room name cannot be empty");
                return;
              }

              try {
                const room = await createroom(trimmed);
                setrooms((prev) => [...prev, room]);
                setroomname("");

                // Auto join new room
                joinroomies(room.id);
                setactiveroom(room);
                setmessages([]);
                setView("chat");
                setmidtext(`# ${room.name}`);
                seterror("");
                setinfo(`Created and joined room #${room.name}`);
              } catch (err) {
                seterror(
                  err instanceof Error ? err.message : "Failed to create room",
                );
              }
            }}
          />
        ) : (
          <Input
            value={message}
            onChange={setmessage}
            onSubmit={handlesubmit}
          />
        )}
      </Box>
    </Box>
  );
}

export default App;
