import { useSyncExternalStore } from "react";
import { AVATAR_COUNT } from "../game/scoring";
import { type ThemeId, themes } from "./themes";

export interface Prefs {
  name: string;
  avatar: number;
  music: number;
  sfx: boolean;
  theme: ThemeId;
}

const KEY = "quiz:prefs";
const ID_KEY = "quiz:id";
const ROOM_KEY = "quiz:room";

const fallback: Prefs = {
  name: "",
  avatar: Math.floor(Math.random() * AVATAR_COUNT),
  music: 5,
  sfx: true,
  theme: "grape",
};

function load(): Prefs {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<Prefs>;
    return {
      name: typeof raw.name === "string" ? raw.name : fallback.name,
      avatar: typeof raw.avatar === "number" ? raw.avatar : fallback.avatar,
      music: typeof raw.music === "number" ? Math.min(10, Math.max(0, raw.music)) : fallback.music,
      sfx: typeof raw.sfx === "boolean" ? raw.sfx : fallback.sfx,
      theme: themes.some((t) => t.id === raw.theme) ? (raw.theme as ThemeId) : fallback.theme,
    };
  } catch {
    return fallback;
  }
}

let prefs = load();
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPrefs(): Prefs {
  return prefs;
}

export function setPrefs(patch: Partial<Prefs>): void {
  prefs = { ...prefs, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {}
  for (const listener of listeners) listener();
}

export function usePrefs(): Prefs {
  return useSyncExternalStore(subscribe, getPrefs);
}

export function playerId(): string {
  try {
    const existing = sessionStorage.getItem(ID_KEY);
    if (existing) return existing;
    const created = crypto.randomUUID();
    sessionStorage.setItem(ID_KEY, created);
    return created;
  } catch {
    return crypto.randomUUID();
  }
}

export function rememberedRoom(): string | null {
  try {
    return sessionStorage.getItem(ROOM_KEY);
  } catch {
    return null;
  }
}

export function rememberRoom(code: string | null): void {
  try {
    if (code) sessionStorage.setItem(ROOM_KEY, code);
    else sessionStorage.removeItem(ROOM_KEY);
  } catch {}
}
