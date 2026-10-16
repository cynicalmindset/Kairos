import MessageList from "../src/components/Messagelist.tsx";
import { Box, Text, useInput, useAnimation ,useStdout} from "ink";
import Header from "./components/Header.tsx";
import RoomList from "./components/Roomlist.tsx";
// import Sidebar from "./components/ascii.tsx";
import {Load} from "./monitor/load.tsx"
import Members from "./components/Members.tsx";
import Help from "./components/Help.tsx";
import Profile from "./components/Profile.tsx";
import Input from "./components/Input.tsx";
import { clearScreen, openBrowser, showHelp, type UICommandContext } from "./commands/uiCommands.ts";
import { startLogin, startRegister, logout, type AuthCommandContext } from "./commands/authCommands.ts";
import { shareFile, acceptFile, rejectFile, type FileCommandContext } from "./commands/fileCommands.ts";
import {
  leaveRoom,
  getMembers,
  joinRoom,
  listRooms,
  createRoomAction,
  backFromRoom,
  goHome,
  type RoomCommandContext,
} from "./commands/roomCommands.ts";
import {
  joinroomies,
  sendSocketMessage,
  setMessageHandler,
  setconncetionhandler,
  setpresence
} from "../../src/socket.ts";
import {
  register,
  login,
  getroom,
  getmessage,
  sendmessage,
  createroom,
  getprofile,
} from "./api.ts";
import TextInput from "ink-text-input";
import { useEffect, useState } from "react";
import { getSavedToken } from "./auth.ts";
import { settoken } from "./api.ts";
import { input } from "better-auth";
import HomeAscii from "./components/HomeAscii.tsx";

type Mode = "chat" | "register" | "login";
type ViewMode = "welcome" | "rooms" | "members" | "help" | "chat" | "create_room" | "profile" | "cpu";

function App() {

  //dimensions
  const {stdout} = useStdout();
  const [dimensions,setdimensions] = useState({
    Columns: stdout?.columns || 80,
    Rows: stdout?.rows||24,
  })

  //dimensions const
  const iscompact = dimensions.Rows<26;
  const headerHeight = iscompact?3:5;

  const inputHeight = 3;
  const contentBoarders = 2;

  // const alertHeight = 1;

  const [scrolloffset, setscrolloffset] = useState(0);[]

  const [mode, setmode] = useState<Mode>("chat");
  const [view, setView] = useState<ViewMode>("welcome");

  const [serverconnected, setserverconnected] = useState(false);
  const [logged, setlogged] = useState(false);

  const [activeroom, setactiveroom] = useState<any | null>(null);
  const [rooms, setrooms] = useState<any[]>([]);
  const [selectedroom, setselectedroom] = useState(0);
  const [member, setmember] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any | null>(null);

  const [message, setmessage] = useState("");
  const [messages, setmessages] = useState<any[]>([]);
  const [roomname, setroomname] = useState("");
  const [midtext, setmidtext] = useState("");

  const [error, seterror] = useState("");
  const [info, setinfo] = useState("");

  const alertHeight = (error || info) ? 1 : 0;
  const overhead =  headerHeight + inputHeight +contentBoarders + alertHeight
  const contentHeight = Math.max(5, dimensions.Rows - overhead);

  // const isWide = dimensions.Columns >= 105;

  // Auth inputs
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [registerstep, setregisterstep] = useState<"name" | "email" | "password">("name");
  const [loginstep, setloginstep] = useState<"email" | "password">("email");

  // Keyboard navigation for room selector and overlay escape
  useInput(async (input, key) => {
    if (key.escape) {
      if (view === "chat" && scrolloffset > 0) {
        setscrolloffset(0);
        return;
      }

      if (view === "rooms" || view === "members" || view === "help" || view === "create_room" || view === "profile" || view === "cpu") {
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

      if (view === "chat" || activeroom) {
        setactiveroom(null);
        setmessages([]);
        setmidtext("");
        setView("welcome");
        setscrolloffset(0);
        seterror("");
        setinfo("Returned to Home screen");
        return;
      }
    }

    // 2. CHAT SCROLLING
    if (view === "chat") {
      // Scroll UP: PageUp OR Ctrl+U
      if (key.upArrow|| (key.ctrl && input === "u")) {
        setscrolloffset((prev) => Math.min(prev + 5, Math.max(0, messages.length - 1)));
        return;
      }

      // Scroll DOWN: PageDown OR Ctrl+D
      if (key.downArrow || (key.ctrl && input === "d")) {
        setscrolloffset((prev) => Math.max(0, prev - 5));
        return;
      }
    }

    // 3. ROOM SELECTOR NAVIGATION (Arrow Keys)
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
          setscrolloffset(0);
          setView("chat");
          setmidtext(`# ${room.name}`);
          seterror("");
          setinfo(`Entered #${room.name} | Room Code: ${room.id}`);
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

  useEffect(()=>{
    let timer:any;
    function handleresize(){
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.clear();
        setdimensions({
        Columns: stdout?.columns || 80,
        Rows: stdout?.rows || 24,
      })
      }, 100);
    }
    // stdout?.on("resize", handleresize);
    process.stdout?.on("resize", handleresize);

    return ()=>{
      clearTimeout(timer);
      process.stdout?.off("resize", handleresize);
    }

  },[])

  useEffect(() => {
    setconncetionhandler((connected) => {
      setserverconnected(connected);
    });
  }, []);

  useEffect(() => {
    setMessageHandler((data) => {
      setscrolloffset((prev) => (prev > 0 ? prev + 1 : 0));
      if(data.type === "presence:update"){
        setmember(data.users);
        return;
      }

      setmessages((prev) => {
        const optimisticIndex = prev.findIndex(
          (msg) => msg.optimistic && msg.content === data.content,
        );

        if (optimisticIndex !== -1) {
          const updated = [...prev];
          updated[optimisticIndex] = {
            ...data,
            optimistic: false,
          };
          return updated;
        }

        return [...prev, data];
      });
    });
  }, []);

  useEffect(() => {
    const token = getSavedToken();
    if (token) {
      settoken(token);
      setlogged(true);
    }
    getprofile()
      .then((data)=>{
        setProfileData(data);
      })
      .catch(()=>{})
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

    if (raw === "/website" || raw === "/web") {
      const url = "https://kairoscmd.vercel.app/"; // Change to your custom domain or landing page URL
      openBrowser(url);
      setinfo(`Opening ${url} in your browser...`);
      setmessage("");
      return;
    }

    if (raw === "/help") {
      showHelp(uiContext);
      return;
    }

    if (raw === "/cpu" || raw === "/sys" || raw === "/top") {
      setView("cpu");
      setmidtext("System Monitor");
      setmessage("");
      return;
    }

    if (raw === "/home") {
      goHome(roomContext);
      return;
    }

    if (raw === "/profile") {
      if (!logged) {
        seterror("Please /login first to view your profile");
        setmessage("");
        return;
      }
      try {
        const data = await getprofile();
        setProfileData(data);
        setView("profile");
        seterror("");
        setinfo("Viewing profile");
      } catch (err) {
        seterror(err instanceof Error ? err.message : "Failed to load profile");
      }
      setmessage("");
      setscrolloffset(0);
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
      setscrolloffset(0);
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

    if (raw === "/code") {
      if (!activeroom) {
        seterror("You are not inside any room. Type /rooms or /create to start.");
      } else {
        setinfo(`Room: #${activeroom.name} | Room Code: ${activeroom.id} (Share: /join ${activeroom.id})`);
      }
      setmessage("");
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

                  const data = await getprofile();
                  setpresence(data.id,data.name)

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

                  const data = await getprofile();
                  setpresence(data.id,data.name)
                  setname(data.name)

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
      <Header
        logged={logged}
        serverconnected={serverconnected}
        frame={frame}
        error={error}
        info={info}
        user={profileData?.user}
        activeRoom={activeroom}
        terminalrows={dimensions.Rows}
      />

      <Box borderStyle="single" height={contentHeight} flexDirection="column" paddingX={1}>
        {view === "welcome" && (
            <Box
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height={contentHeight - 2}
            >
            <HomeAscii isActive={view === "welcome"} terminalWidth={dimensions.Columns} />
          </Box>
        )}

        {view === "help" && (
          <Box flexDirection="column" marginY={1}>
            <Help />
          </Box>
        )}

        {view === "rooms" && (
          <Box flexDirection="column" marginY={1}>
            <Text bold color="yellow">  Available Rooms (↑/↓ then Enter to join):</Text>
            <Box marginTop={1}>
              <RoomList rooms={rooms} selectedroom={selectedroom} />
            </Box>
          </Box>
        )}

        {view === "members" && (
          <Box flexDirection="column" marginY={1}>
            <Members members={member} roomName={activeroom?.name} roomCode={activeroom?.id} />
          </Box>
        )}

        {view === "profile" && (
          <Profile user={profileData?.user} stats={profileData?.stats} />
        )}

        {view === "create_room" && (
          <Box flexDirection="column" marginY={1}>
            <Text bold color="green">Create a New Room</Text>
            <Text color="gray">Type the room name below and press Enter (or Esc to cancel)</Text>
          </Box>
        )}

        {view === "cpu" && (
          <Load terminalWidth={dimensions.Columns} />
        )}

        {view === "chat" && (
          <Box flexDirection="column">
            {activeroom ? (
              <Box marginY={1} flexDirection="row" justifyContent="space-between">
                {/* <Box flexDirection="row" gap={1}>
                  <Text bold color="magenta">#{activeroom.name}</Text>
                  <Text color="gray">|</Text>
                  <Text color="gray">Room Code: </Text>
                  <Text bold color="yellow">{activeroom.id}</Text>
                </Box> */}
                {/* <Text color="gray">(Use /code or share with friends to /join)</Text> */}
              </Box>
            ) : midtext ? (
              <Box>
                <Text bold color="magenta">{midtext}</Text>
              </Box>
            ) : null}
            <MessageList messages={messages} viewportHeight={contentHeight-2} scrollOffset={scrolloffset} roomName={activeroom?.name} roomCode={activeroom?.id}/>
          </Box>
        )}
      </Box>

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
                setinfo(`Created #${room.name}! Room Code: ${room.id} (Share: /join ${room.id})`);
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
