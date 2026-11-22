import { isRoomCode } from "../src/game/scoring";
import { Room } from "./room";

export { Room };

interface Env {
  ROOM: DurableObjectNamespace;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const parts = new URL(request.url).pathname.split("/");
    if (parts[1] !== "api") return env.ASSETS.fetch(request);
    const code = parts[3] ?? "";
    const wantsSocket = request.headers.get("Upgrade") === "websocket";
    if (parts[2] !== "room" || parts[4] !== "ws" || !isRoomCode(code) || !wantsSocket) {
      return new Response("Not found", { status: 404 });
    }
    return env.ROOM.get(env.ROOM.idFromName(code)).fetch(request);
  },
} satisfies ExportedHandler<Env>;
