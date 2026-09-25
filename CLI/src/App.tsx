import { existsSync, stat, statSync } from "fs";
import path from "path";
import MessageList from "../src/components/Messagelist.tsx";
import { Box, render, Text, useInput, useAnimation } from "ink";
import Header from "./components/Header.tsx";
import RoomList from "./components/Roomlist.tsx";
import Members from "./components/Members.tsx";
import Help from "./components/Help.tsx";
import Input from "./components/Input.tsx";
import { clearScreen, showHelp } from "./commands/uiCommands.ts";
import { startLogin, startRegister, logout } from "./commands/authCommands.ts";
import { shareFile, acceptFile, rejectFile } from "./commands/fileCommands.ts";
import {
  leaveRoom,
  getMembers,
  joinRoom,
  listRooms,
  createRoom,
  backFromRoom,
} from "./commands/roomCommands.ts";
import {
  joinroomies,
  sendSocketMessage,
  setMessageHandler,
  sendFileShare,
  setconncetionhandler,
} from "../../src/socket.ts";
// import "../../src/socket/index.ts"
import {
  register,
  login,
  getroom,
  createroom,
  getmessage,
  sendmessage,
} from "./api.ts";
import TextInput from "ink-text-input";
import { useEffect, useState } from "react";
import { clearAuth, getSavedToken } from "./auth.ts";
import { settoken } from "./api.ts";

type Mode = "chat" | "register" | "login";

function App() {
  const [showmember, setshowmember] = useState(false);
  const [serverconnected, setserverconnected] = useState(false);
  const [member, setmember] = useState<any[]>([]);
  const [activeroom, setactiveroom] = useState<any | null>(null);
  const [selectedroom, setselectedroom] = useState(0);
  const [midtext, setmidtext] = useState("");
  const [roomname, setroomname] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [rooms, setrooms] = useState<any[]>([]);
  const [listroom, setlistroom] = useState(false);
  const [mode, setmode] = useState<Mode>("chat");
  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState<any[]>([]);
  const [showcommads, setshowcommands] = useState(false);
  const [empty, setempyt] = useState(true);
  const [logged, setlogged] = useState(false);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [registerstep, setregisterstep] = useState<
    "name" | "email" | "password"
  >("name");
  const [loginstep, setloginstep] = useState<"email" | "password">("email");

  useInput(async (_input, key) => {
    if (!listroom || rooms.length === 0) return;

    if (key.upArrow) {
      setselectedroom((prev) => (prev > 0 ? prev - 1 : rooms.length - 1));
    }

    if (key.downArrow) {
      setselectedroom((prev) => (prev < rooms.length - 1 ? prev + 1 : 0));
    }

    if (key.return) {
      const room = rooms[selectedroom];

      //   setlistroom(false);
      //   setmidtext(`Joined ${room.name}`);
      try {
        joinroomies(room.id);
        const data = await getmessage(room.id);
        setactiveroom(room);
        setmessages(data);

        // const roomMem = await roommembers(room.id);
        // setmember(roomMem);

        setlistroom(false);
        setempyt(false);
        setmidtext(`# ${room.name}\n`);
      } catch (error) {
        seterror(
          error instanceof Error ? error.message : "failed to open room",
        );
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
        setrooms(data);
      })
      .catch((error) => {
        seterror(
          error instanceof Error ? error.message : "something went wrong",
        );
      });
  }, [logged, mode]);

  const handlesubmit = async () => {
    if (!message.trim()) return;

    const uiContext = {
      setmidtext,
      setlistroom,
      setempyt,
      setshowcommands,
      setmessages,
      setmessage,
    };
    const authContext = {
      setmode,
      setlogged,
      setmessage,
      setmessages,
    };
    const fileContext = {
      activeroom,
      setmessage,
      seterror,
    };
    const roomContext = {
      activeroom,
      setactiveroom,
      setmessages,
      setmember,
      setrooms,
      setlistroom,
      setshowmember,
      setempyt,
      setselectedroom,
      setmidtext,
      setmessage,
      seterror,
      setIsCreatingRoom,
      setshowcommands,
    };

    //FILE HANDELING

    if (message.trim().startsWith("/share")) {
      const filepath = message.trim().slice(7).trim();
      await shareFile(filepath, fileContext);
      return;
    }

    if (message.trim().startsWith("/accept ")) {
      const shareId = message.trim().slice(8).trim();
      await acceptFile(shareId, fileContext);
      return;
    }

    if (message.trim().startsWith("/reject ")) {
      const shareId = message.trim().slice(8).trim();
      await rejectFile(shareId, fileContext);
      return;
    }

    // ROOMS

    if (message.trim().startsWith("/join ")) {
      const roomId = message.trim().slice(6).trim();
      await joinRoom(roomId, roomContext);
      return;
    }

    if (message.trim() === "/leave") {
      await leaveRoom(roomContext);
      return;
    }

    if (message.trim() === "/members") {
      await getMembers(roomContext);
      return;
    }

    if (message.trim() === "/create") {
      createRoom(roomContext);
      return;
    }

    if (message.trim() === "/back") {
      backFromRoom(roomContext);
      return;
    }

    if (message.trim() === "/rooms") {
      await listRooms(roomContext);
      return;
    }

    // AUTH

    if (message.trim() === "/logout") {
      logout(authContext);
      return;
    }
    if (message.trim() === "/register") {
      startRegister(authContext);
      return;
    }
    if (message.trim() === "/login") {
      startLogin(authContext);
      return;
    }

    //MISSLENIOUS

    if (message.trim() === "/clear") {
      clearScreen(uiContext);
      return;
    }

    if (message.trim() === "/help") {
      showHelp(uiContext);
      return;
    }

    if (activeroom) {
      const content = message.trim();

      // Show immediately
      setmessages((prev) => [
        ...prev,
        {
          content,
          user: {
            name: "You",
          },
          optimistic: true,
        },
      ]);

      setmessage("");

      try {
        const sentmessage = await sendmessage(activeroom.id, content);

        sendSocketMessage(activeroom.id, content, sentmessage.user);
      } catch (error) {
        seterror(
          error instanceof Error ? error.message : "Failed to send message",
        );
      }
    }
    setmessage("");
  };

  if (mode === "login") {
    return (
      <Box flexDirection="column">
        <Text bold color="red">
          Kairos - Login
        </Text>

        {error && <Text color="red">{error}</Text>}

        {loginstep === "email" && (
          <>
            <Text>Email:</Text>

            <TextInput
              value={email}
              onChange={setemail}
              onSubmit={() => {
                if (!email.trim()) return;
                setloginstep("password");
              }}
            />
          </>
        )}

        {loginstep === "password" && (
          <>
            <Text>Password:</Text>

            <TextInput
              mask="#"
              value={password}
              onChange={setpassword}
              onSubmit={async () => {
                if (!password.trim()) return;

                try {
                  await login(email, password);
                  seterror("");
                  setlogged(true);
                  setmode("chat");
                } catch (e) {
                  if (e instanceof Error) {
                    seterror(e.message);
                  } else {
                    seterror("Registration failed");
                  }
                }
              }}
            />
          </>
        )}
      </Box>
    );
  }

  if (mode === "register") {
    return (
      <Box flexDirection="column">
        <Text bold color="red">
          Kairos - Register
        </Text>

        {/* {error && <Text color="red">{error}</Text>} */}

        {registerstep === "name" && (
          <>
            <Text>Name:</Text>

            <TextInput
              value={name}
              onChange={setname}
              onSubmit={() => {
                if (!name.trim()) return;
                setregisterstep("email");
              }}
            />
          </>
        )}

        {registerstep === "email" && (
          <>
            <Text>Email:</Text>

            <TextInput
              value={email}
              onChange={setemail}
              onSubmit={() => {
                if (!email.trim()) return;
                setregisterstep("password");
              }}
            />
          </>
        )}

        {registerstep === "password" && (
          <>
            <Text>Password:</Text>

            <TextInput
              mask="#"
              value={password}
              onChange={setpassword}
              onSubmit={async () => {
                if (!password.trim()) return;

                try {
                  await register(name, email, password);
                  seterror("");
                  setlogged(true);
                  setmode("chat");
                } catch (e) {
                  if (e instanceof Error) {
                    seterror(e.message);
                  } else {
                    seterror("Registration failed");
                  }
                }
              }}
            />
          </>
        )}
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Header logged={logged} serverconnected={serverconnected} frame={frame} />

      <Box borderStyle="single" height={30} flexDirection="column" paddingX={1}>
        {empty && (
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            marginY={1}
          >
            <Text color="gray">
              {"code together without ever leaving your IDE\n"}
              {"version 1.0.0 | 16 sept 2026 | cynicalmindset"}
            </Text>
          </Box>
        )}

        {midtext && (
          <Box justifyContent="center" alignItems="center">
            <Text color="gray">{midtext}</Text>
          </Box>
        )}
        {showmember && <Members members={member} />}
        {listroom && (
          <Box
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box marginY={1}>
              <Text bold>Rooms</Text>
            </Box>

            <RoomList rooms={rooms} selectedroom={selectedroom} />
          </Box>
        )}

        {showcommads && <Help />}
        <MessageList messages={messages} />
      </Box>

      <Box borderStyle="single">
        <Text color={"red"}>{" > "}</Text>
        {isCreatingRoom ? (
          <TextInput
            placeholder="enter room name..."
            value={roomname}
            onChange={setroomname}
            onSubmit={async (name) => {
              if (!name.trim()) {
                // get it to message box not input filed
                seterror("Room name cannot be empty");
                return;
              }

              try {
                const room = await createroom(name.trim());
                setrooms((prev) => [...prev, room]);
                setIsCreatingRoom(false);
                setmidtext(`Created room: ${room.name}`);
              } catch (error) {
                seterror(
                  error instanceof Error
                    ? error.message
                    : "Failed to create room",
                );
              }
            }}
          ></TextInput>
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
