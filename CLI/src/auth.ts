import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { homedir } from "os";
import path from "path";

const KAIROS_DIR = path.join(homedir(), ".kairos");
const AUTH_FILE = path.join(KAIROS_DIR, "auth.json");

export function saveAuth(token: string) {
    if (!existsSync(KAIROS_DIR)) {
        mkdirSync(KAIROS_DIR, { recursive: true });
    }

    writeFileSync(
        AUTH_FILE,
        JSON.stringify({ token }, null, 2)
    );
}

export function getSavedToken(): string | null {
    if (!existsSync(AUTH_FILE)) {
        return null;
    }

    const data = JSON.parse(
        readFileSync(AUTH_FILE, "utf-8")
    );

    return data.token ?? null;
}

export function clearAuth() {
    if (existsSync(AUTH_FILE)) {
        writeFileSync(AUTH_FILE, "");
    }
}   