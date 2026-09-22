import { existsSync, stat, statSync } from "fs";
import path from "path";
import { Box, render, Text, useInput } from "ink";
import {
  joinroomies,
  sendSocketMessage,
  setMessageHandler,
  sendFileShare,
  
} from "../../src/socket.ts";
// import "../../src/socket/index.ts"
import {
  register,
  login,
  getroom,
  createroom,
  getmessage,
  sendmessage,
  joinroom,
  getroombyid,
  createshare,
  acceptshare,
  rejecttshare,
  uploadshare,
  downloadshare
} from "./api.ts";
import TextInput from "ink-text-input";
import { useEffect, useState } from "react";
import { clearAuth, getSavedToken } from "./auth.ts";
import { settoken } from "./api.ts";

type Mode = "chat" | "register" | "login";

function App() {
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
  const visibleMessages = messages.slice(-25);
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

  useEffect(() => {
    setMessageHandler((newMessage) => {
      setmessages((prev) => [...prev, newMessage]);
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
        seterror(error);
      });
  }, [logged, mode]);

  const handlesubmit = async () => {
    if (!message.trim()) return;

    if (message.trim().startsWith("/share")) {
      if (!activeroom) {
        seterror("join a room first");
        console.log("join a room first");
        return;
      }

      const filepath = message.trim().slice(7).trim();

      if (!filepath) {
        seterror("file path is required");
        console.log("file path is required");
        return;
      }

      if (!existsSync(filepath)) {
        seterror("file does not exist");
        console.log("file does not exist");
        return;
      }

      try {
        const stats = statSync(filepath);
        if (!stats.isFile()) {
          seterror("path is not a file");
          console.log("path is not a file");
          return;
        }

        const filename = path.basename(filepath);
        const fileshare = await createshare(
          activeroom.id,
          filename,
          filepath,
          stats.size,
        );


        await uploadshare(
          activeroom.id,
          fileshare.id,
          filepath,
        );


        sendFileShare(
          activeroom.id,
          fileshare.id,
          fileshare.fileName,
          fileshare.fileSize,
          fileshare.sender
        );

        if(fileshare){
          console.log("file shared")
        }

        setmessage("");
        seterror("");
      } catch (error) {
        seterror(
          error instanceof Error ? error.message : "Failed to share file",
        );
        console.log(error)
      }
      return;
    }

if (message.trim().startsWith("/accept ")) {
  console.log("ACCEPT COMMAND STARTED");

  if (!activeroom) {
    seterror("Join a room first");
    return;
  }

  const shareId = message.trim().slice(8).trim();

  console.log("SHARE ID:", shareId);

  if (!shareId) {
    seterror("Share ID is required");
    return;
  }

  try {
    console.log("ACCEPTING...");

    await acceptshare(activeroom.id, shareId);

    console.log("ACCEPTED. DOWNLOADING...");

    const response = await downloadshare(
      activeroom.id,
      shareId,
    );

    console.log("DOWNLOAD RESPONSE:", response.status);

    const buffer = await response.arrayBuffer();

    const filename =
      response.headers
        .get("content-disposition")
        ?.match(/filename="(.+)"/)?.[1] ?? "shared-file";

    console.log("WRITING FILE:", filename);

    await Bun.write(filename, buffer);

    console.log(`File downloaded: ${filename}`);

    setmessage("");
    seterror("");
  } catch (error) {
    console.log("ACCEPT ERROR:", error);

    seterror(
      error instanceof Error
        ? error.message
        : "Failed to accept file",
    );
  }

  return;
}

    if (message.trim().startsWith("/reject ")) {
      if (!activeroom) {
        seterror("Join a room first");
        return;
      }

      const shareId = message.trim().slice(8).trim();

      if (!shareId) {
        seterror("Share ID is required");
        return;
      }

      try {
        await rejecttshare(activeroom.id, shareId);

        setmessage("");
        seterror("");
      } catch (error) {
        seterror(
          error instanceof Error
            ? error.message
            : "Failed to reject file share",
        );
      }

      return;
    }

    if (message.trim().startsWith("/join ")) {
      const roomId = message.trim().slice(6).trim();

      if (!roomId) {
        seterror("Room ID is required");
        return;
      }

      try {
        await joinroom(roomId);

        const room = await getroombyid(roomId);

        joinroomies(roomId);

        const data = await getmessage(roomId);

        setactiveroom(room);
        setmessages(data);
        setlistroom(false);
        setempyt(false);
        setmidtext(`# ${room.name}`);
        setmessage("");
        seterror("");
      } catch (error) {
        seterror(
          error instanceof Error ? error.message : "Failed to join room",
        );
      }

      return;
    }

    if (message.trim() === "/create") {
      setIsCreatingRoom(true);
      setmessage("");
      setmessages([]);
      return;
    }

    if (message.trim() === "/back") {
      setactiveroom(null);
      setmessages([]);
      setmidtext("");
      setmessage("");
      return;
    }
    if (message.trim() === "/rooms") {
      try {
        const data = await getroom();

        setrooms(data);
        setselectedroom(0);
        setlistroom(true);
        setempyt(false);
        setshowcommands(false);
        setmessage("");
      } catch (error) {
        seterror(
          error instanceof Error ? error.message : "Failed to fetch rooms",
        );
      }

      return;
    }
    if (message.trim() === "/logout") {
      clearAuth();
      setlogged(false);
      setmode("chat");
      setmessage("");
      setmessages([]);
      return;
    }
    if (message.trim() === "/register") {
      setmode("register");
      setmessage("");
      return;
    }
    if (message.trim() === "/login") {
      setmode("login");
      setmessage("");
      return;
    }
    if (message.trim() === "/clear") {
      setmidtext("");
      setlistroom(false);
      setempyt(true);
      setshowcommands(false);
      setmessages([]);
      setmessage("");
      return;
    }
    if (message.trim() === "/help") {
      setempyt(false);
      setshowcommands(true);
      setmessage("");
      return;
    }
    // setmessages((prev) => [...prev, message]);

    if (activeroom) {
      try {
        const sentmessage = await sendmessage(activeroom.id, message.trim());

        sendSocketMessage(activeroom.id, message.trim(), sentmessage.user);

        setmessage("");
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

        {error && <Text color="red">{error}</Text>}

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
      <Box
        borderStyle="single"
        paddingX={1}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Text bold color="red">
          Kairos - v1
        </Text>
        {logged && <Text color="gray">account connected</Text>}
      </Box>

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

        {listroom && (
          <Box
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box marginY={1}>
              <Text bold>Rooms</Text>
            </Box>

            {rooms.map((room, index) => (
              <Text
                key={room.id}
                color={index === selectedroom ? "red" : "gray"}
              >
                {index === selectedroom ? "> " : "  "}
                {room.name} <Text color="gray">({room.id})</Text>
              </Text>
            ))}
          </Box>
        )}

        {showcommads && (
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            marginTop={1}
          >
            <Text color="gray">
              {"/help      - Show commands\n"}
              {"/login     - Login\n"}
              {"/register  - Create account\n"}
              {"/join      - Join a room\n"}
              {"/create    - Create a room\n"}
              {"/rooms     - List rooms\n"}
              {"/back      - get back to home\n"}
              {"/logout    - Logout\n"}
              {"/clear     - clear text box\n"}
              {"/visit     - open our website\n"}
            </Text>
          </Box>
        )}
       {visibleMessages.map((msg, index) => {
          if (msg.type === "file_share") {
            return (
              <Text key={msg.shareId ?? index}>
                <Text color="red">
                  {msg.user?.name ?? "Someone"} wants to share:
                </Text>
                {"  "}
                <Text>
                  {msg.fileName} ({msg.fileSize} bytes)
                </Text>
                {"\n"}
                <Text color="gray">
                  /accept {msg.shareId}
                </Text>
                {"  "}
                <Text color="gray">
                  /reject {msg.shareId}
                </Text>
              </Text>
            );
          }

          return (
            <Text key={msg.id ?? index}>
              <Text color="red">{msg.user?.name ?? "You"}: </Text>
              {msg.content}
            </Text>
          );
        })}
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
          <TextInput
            value={message}
            onChange={setmessage}
            onSubmit={handlesubmit}
            placeholder="/help for commands"
          />
        )}
      </Box>
    </Box>
  );
}

render(<App />);
