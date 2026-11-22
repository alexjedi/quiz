import { useSyncExternalStore } from "react";
import type { ClientMessage, RoomState, ServerMessage } from "../game/protocol";
import { CODE_ALPHABET, CODE_LENGTH } from "../game/scoring";
import { getPrefs, playerId } from "./prefs";

export interface RoomSnapshot {
  code: string | null;
  connected: boolean;
  state: RoomState | null;
  error: string | null;
}

const RETRY_MS = 1200;

let snapshot: RoomSnapshot = { code: null, connected: false, state: null, error: null };
let socket: WebSocket | null = null;
let retry: ReturnType<typeof setTimeout> | null = null;
let clockOffset = 0;
const listeners = new Set<() => void>();

function update(patch: Partial<RoomSnapshot>): void {
  snapshot = { ...snapshot, ...patch };
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function open(code: string): void {
  const scheme = location.protocol === "https:" ? "wss:" : "ws:";
  const ws = new WebSocket(`${scheme}//${location.host}/api/room/${code}/ws`);
  socket = ws;
  ws.addEventListener("open", () => {
    if (socket !== ws) return;
    const prefs = getPrefs();
    ws.send(JSON.stringify({ type: "join", id: playerId(), name: prefs.name, avatar: prefs.avatar } satisfies ClientMessage));
    update({ connected: true });
  });
  ws.addEventListener("message", (event) => {
    if (socket !== ws || typeof event.data !== "string") return;
    const message = JSON.parse(event.data) as ServerMessage;
    if (message.type === "state") {
      clockOffset = message.state.now - Date.now();
      update({ state: message.state, error: null });
    } else {
      update({ error: message.message });
    }
  });
  ws.addEventListener("close", () => {
    if (socket !== ws) return;
    socket = null;
    if (snapshot.error) {
      update({ code: null, connected: false, state: null });
      return;
    }
    update({ connected: false });
    retry = setTimeout(() => {
      if (snapshot.code === code) open(code);
    }, RETRY_MS);
  });
}

export function joinRoom(code: string): void {
  leaveRoom();
  update({ code, error: null });
  open(code);
}

export function leaveRoom(): void {
  if (retry !== null) clearTimeout(retry);
  retry = null;
  const ws = socket;
  socket = null;
  ws?.close();
  update({ code: null, connected: false, state: null, error: null });
}

export function send(message: ClientMessage): void {
  if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
}

export function serverNow(): number {
  return Date.now() + clockOffset;
}

export function useRoom(): RoomSnapshot {
  return useSyncExternalStore(subscribe, () => snapshot);
}

export function newRoomCode(): string {
  const values = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  let code = "";
  for (const value of values) code += CODE_ALPHABET[value % CODE_ALPHABET.length];
  return code;
}
