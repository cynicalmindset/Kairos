const API = "http://localhost:3000";
let authtoken : string | null = null;
export function settoken(token:string){
    authtoken = token;
}

export function gettoken(){
    return authtoken;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
) {
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


export async function register(name:String,email:String,password:String){
  const response = await apiFetch("/api/auth/sign-up/email",{
    method:"POST",
    body:JSON.stringify({
      name,
      email,
      password
    })
  });
  const data = await response.json() as any;
  if(!response.ok){
     throw new Error(data.message ?? "Registration failed");
  }
  if(data.token){
    settoken(data.token);
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

  const data = await response.json() as any;

  if (!response.ok) {
    throw new Error(data.message ?? "Login failed");
  }

  if (data.token) {
    settoken(data.token);
  }

  return data;
}