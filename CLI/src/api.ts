import { saveAuth } from "./auth.ts";
const API = "http://localhost:3000";
let authtoken: string | null = null;
export function settoken(token: string) {
  authtoken = token;
}

export function gettoken() {
  return authtoken;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (authtoken) {
    headers.set("Authorization", `Bearer ${authtoken}`);
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
