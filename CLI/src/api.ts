import { saveAuth } from "./auth.ts";
const API = process.env.API_URL;
// const API = "https://many-hedging-frustrate.ngrok-free.dev";
let authtoken: string | null = null;


export function settoken(token: string) {
  authtoken = token;
}

export function gettoken() {
  return authtoken;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
) {
  const headers = new Headers(options.headers);

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (authtoken) {
    headers.set(
      "Authorization",
      `Bearer ${authtoken}`,
    );
  }

  return fetch(`${API}${path}`, {
    ...options,
    headers,
  });
}

// Auth API

export async function register(name: String, email: String, password: String) {
  const response = await apiFetch("/api/auth/sign-up/email", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
  const data = (await response.json()) as any;
  if (!response.ok) {
    throw new Error(data.message ?? "Registration failed");
  }
  if (data.token) {
    settoken(data.token);
    saveAuth(data.token);
  }
  return data;
}

export async function login(email: string, password: string) {
  const response = await apiFetch("/api/auth/sign-in/email", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = (await response.json()) as any;

  if (!response.ok) {
    throw new Error(data.message ?? "Login failed");
  }

  if (data.token) {
    settoken(data.token);
    saveAuth(data.token);
  }

  return data;
}

//ROOMS API CAL

export async function createroom(name: string) {
  const response = await apiFetch("/api/rooms", {
    method: "POST",
    body: JSON.stringify({
      name,
    }),
  });
  const data = (await response.json()) as any;
  if (!response.ok) {
    throw new Error(data.message ?? "failed to create room");
  }
  return data.room;
}

export async function joinroom(roomId: string) {
  const response = await apiFetch(`/api/rooms/${roomId}/join`, {
    method: "POST",
  });
  const data = (await response.json()) as any;
  if (!response.ok) {
    throw new Error(data.error ?? "Failed to join room");
  }
  return data;
}

export async function getroom() {
  const response = await apiFetch("/api/rooms");
  const data = (await response.json()) as any;
  if (!response.ok) {
    throw new Error(data.error ?? "Failed to fetch rooms");
  }
  return data.room;
}

export async function getroombyid(roomId: string) {
  const response = await apiFetch(`/api/rooms/${roomId}`);

  const data = (await response.json()) as any;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to get room");
  }

  return data.room;
}

// message api
export async function getmessage(roomId: string) {
  const response = await apiFetch(`/api/rooms/${roomId}/messages`);

  const data = (await response.json()) as any;
  // console.log(data.messages);

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to get messages");
  }

  return data.messages;
}

export async function sendmessage(roomId: string, content: string) {
  const response = await apiFetch(`/api/rooms/${roomId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

  const data = (await response.json()) as any;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to send message");
  }

  return data.message;
}

// file sharing API

export async function createshare(
  roomId: string,
  fileName: string,
  filePath: string,
  fileSize: number,
) {
  const response = await apiFetch(`/api/rooms/${roomId}/share`, {
    method: "POST",
    body: JSON.stringify({
      fileName,
      filePath,
      fileSize,
    }),
  });

  const data = (await response.json()) as any;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to create file share");
  }

  return data.fileshare;
}

export async function acceptshare(
  roomId: string,
  shareId: string,
) {
  const response = await apiFetch(
    `/api/rooms/${roomId}/shares/${shareId}/accept`,
    {
      method: "POST",
    },
  );

  const data = (await response.json()) as any;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to accept file share");
  }

  return data.fileshare;
}

export async function rejecttshare(
  roomId: string,
  shareId: string,
) {
  const response = await apiFetch(
    `/api/rooms/${roomId}/shares/${shareId}/reject`,
    {
      method: "POST",
    },
  );

  const data = (await response.json()) as any;

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to reject file share");
  }

  return data.fileshare;
}


export async function uploadshare(
  roomId: string,
  shareId: string,
  filePath: string,
){
  const formdata = new FormData();
  const file = Bun.file(filePath);

  if (!(await file.exists())) {
    throw new Error("File does not exist");
  }

  formdata.append("file",file);

    const response = await apiFetch(
    `/api/rooms/${roomId}/shares/${shareId}/upload`,
    {
      method: "POST",
      body: formdata,
    },
  );

  const text = await response.text();

  console.log("UPLOAD STATUS:", response.status);
  console.log("UPLOAD RESPONSE:", text);

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Server returned: ${text}`);
  }

  if(!response.ok){
    throw new Error(data.error ?? "failed to upload data");
  }

  return data;
}

export async function downloadshare(
  roomId: string,
  shareId: string,
) {
  console.log("DOWNLOAD URL:", `/api/rooms/${roomId}/shares/${shareId}/download`);

  const response = await apiFetch(
    `/api/rooms/${roomId}/shares/${shareId}/download`,
  );

  console.log("DOWNLOAD FETCH FINISHED");
  console.log("DOWNLOAD STATUS:", response.status);

  return response;
}