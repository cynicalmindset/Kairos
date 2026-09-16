import { Box, render, Text } from "ink";
import { register, login, getroom, createroom } from "./api.ts";
import TextInput from "ink-text-input";
import { useEffect, useState } from "react";
import { clearAuth, getSavedToken } from "./auth.ts";
import { settoken } from "./api.ts";

type Mode = "chat" | "register" | "login";

function App() {
  const [midtext, setmidtext] = useState("");
  const [roomname, setroomname] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [rooms, setrooms] = useState<any[]>([]);
  const [listroom, setlistroom] = useState(false);
  const [mode, setmode] = useState<Mode>("chat");
  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState<String[]>([]);
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
  }, [logged,mode]);

  const handlesubmit = async () => {
    if (!message.trim()) return;

    if (message.trim() === "/create") {
      setIsCreatingRoom(true);
      setmessage("");
      setmessages([]);
      return;
    }
    if (message.trim() === "/rooms") {
  try {
    const data = await getroom();
    // console.log(data)
    setrooms(data);
    setlistroom(true);
    setempyt(false);
    setshowcommands(false);
    setmessage("");
  } catch (error) {
    seterror(
      error instanceof Error
        ? error.message
        : "Failed to fetch rooms"
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
    setmessages((prev) => [...prev, message]);
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

            {rooms.map((room) => (
              <Text key={room.id} color="gray">
                {room.name}
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
              {"/logout    - Logout\n"}
              {"/clear     - clear text box\n"}
              {"/visit     - open our website\n"}
            </Text>
          </Box>
        )}
        {visibleMessages.map((msg, index) => (
          <Text key={index}>
            <Text color={"red"}>You: </Text>
            {msg}
          </Text>
        ))}
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
