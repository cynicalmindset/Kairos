import { auth } from "../auth";
import { prisma } from "./prisma";

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const sessionCache = new Map<string, CacheEntry<any>>();
const membershipCache = new Map<string, CacheEntry<boolean>>();

const SESSION_TTL_MS = 60 * 1000; // 1 minute
const MEMBERSHIP_TTL_MS = 60 * 1000; // 1 minute

function getAuthKey(headers: any): string | null {
  if (!headers) return null;
  const authHeader = headers["authorization"] || (headers.get && headers.get("authorization"));
  if (authHeader) return String(authHeader);

  const cookieHeader = headers["cookie"] || (headers.get && headers.get("cookie"));
  if (cookieHeader) return String(cookieHeader);

  return null;
}

/**
 * Get session with high-speed in-memory cache to avoid repeated MongoDB roundtrips.
 */
export async function getCachedSession(headers: any) {
  const key = getAuthKey(headers);
  const now = Date.now();

  if (key && sessionCache.has(key)) {
    const entry = sessionCache.get(key)!;
    if (entry.expiresAt > now) {
      return entry.data;
    }
    sessionCache.delete(key);
  }

  const session = await auth.api.getSession({
    headers,
  });

  if (key && session?.user) {
    sessionCache.set(key, {
      data: session,
      expiresAt: now + SESSION_TTL_MS,
    });
  }

  return session;
}

/**
 * Check room membership with in-memory caching.
 */
export async function isMemberCached(userId: string, roomId: string): Promise<boolean> {
  const key = `${userId}:${roomId}`;
  const now = Date.now();

  if (membershipCache.has(key)) {
    const entry = membershipCache.get(key)!;
    if (entry.expiresAt > now) {
      return entry.data;
    }
    membershipCache.delete(key);
  }

  const membership = await prisma.roomMember.findUnique({
    where: {
      userId_roomId: {
        userId,
        roomId,
      },
    },
    select: {
      id: true,
    },
  });

  const isMember = Boolean(membership);
  membershipCache.set(key, {
    data: isMember,
    expiresAt: now + MEMBERSHIP_TTL_MS,
  });

  return isMember;
}

/**
 * Invalidate membership cache when user joins, leaves, or gets kicked.
 */
export function invalidateMembership(userId?: string, roomId?: string) {
  if (userId && roomId) {
    membershipCache.delete(`${userId}:${roomId}`);
  } else if (roomId) {
    for (const key of membershipCache.keys()) {
      if (key.endsWith(`:${roomId}`)) {
        membershipCache.delete(key);
      }
    }
  } else {
    membershipCache.clear();
  }
}

/**
 * Invalidate session cache.
 */
export function invalidateSession(headers?: any) {
  if (headers) {
    const key = getAuthKey(headers);
    if (key) sessionCache.delete(key);
  } else {
    sessionCache.clear();
  }
}
