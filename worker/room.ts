import { DurableObject } from "cloudflare:workers";
import type {
  AbilityId,
  AbilityState,
  ClientMessage,
  Phase,
  PlayerView,
  RoomState,
  ServerMessage,
  Settings,
} from "../src/game/protocol";
import {
  ANSWER_GRACE_MS,
  AVATAR_COUNT,
  COUNT_OPTIONS,
  MAX_PLAYERS,
  NAME_LIMIT,
  REVEAL_MS,
  ROUND_OPTIONS,
  defaultSettings,
  earnedAt,
  hideTargets,
  lockedAbilities,
  scoreAnswer,
  shuffled,
} from "../src/game/scoring";
import { packs } from "../src/questions";

interface Seat {
  id: string;
  name: string;
  avatar: number;
  score: number;
  streak: number;
  abilities: Record<AbilityId, AbilityState>;
  socket: WebSocket | null;
  pick: number | null;
  pickedAfter: number;
  hidden: number[];
  deadline: number;
  earned: AbilityId[];
  gain: number;
}

interface Prepared {
  pack: string;
  text: string;
  answers: string[];
  correct: number;
}

const ANSWER_COUNT = 4;

export class Room extends DurableObject {
  private seats = new Map<string, Seat>();
  private sockets = new Map<WebSocket, string>();
  private hostId: string | null = null;
  private code = "";
  private phase: Phase = "lobby";
  private settings: Settings = defaultSettings(packs.map((p) => p.id));
  private questions: Prepared[] = [];
  private index = 0;
  private startedAt = 0;
  private phaseEndsAt = 0;
  private fastestId: string | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;

  async fetch(request: Request): Promise<Response> {
    this.code = new URL(request.url).pathname.split("/")[3] ?? "";
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    server.accept();
    server.addEventListener("message", (event) => this.onMessage(server, event.data));
    server.addEventListener("close", () => this.onClose(server));
    server.addEventListener("error", () => this.onClose(server));
    return new Response(null, { status: 101, webSocket: client });
  }

  private onMessage(socket: WebSocket, data: string | ArrayBuffer): void {
    if (typeof data !== "string" || data.length > 2000) return;
    let message: ClientMessage;
    try {
      message = JSON.parse(data) as ClientMessage;
    } catch {
      return;
    }
    if (typeof message !== "object" || message === null) return;
    if (message.type === "join") {
      this.join(socket, message);
      return;
    }
    const seat = this.seats.get(this.sockets.get(socket) ?? "");
    if (!seat) return;
    const host = seat.id === this.hostId;
    switch (message.type) {
      case "settings":
        if (host && this.phase === "lobby") this.applySettings(message.settings);
        break;
      case "start":
        if (host && (this.phase === "lobby" || this.phase === "results")) this.start();
        break;
      case "answer":
        this.answer(seat, message.index);
        break;
      case "ability":
        this.useAbility(seat, message.ability);
        break;
      case "lobby":
        if (host && this.phase === "results") this.toLobby();
        break;
    }
  }

  private join(socket: WebSocket, message: { id: unknown; name: unknown; avatar: unknown }): void {
    const id = typeof message.id === "string" ? message.id.slice(0, 40) : "";
    if (!id) return;
    const name = (typeof message.name === "string" ? message.name.trim().slice(0, NAME_LIMIT) : "") || "Player";
    const avatar = typeof message.avatar === "number" ? Math.abs(Math.floor(message.avatar)) % AVATAR_COUNT : 0;
    let seat = this.seats.get(id);
    if (!seat) {
      if (this.seats.size >= MAX_PLAYERS) {
        this.send(socket, { type: "error", message: "This room is full." });
        socket.close(1000, "full");
        return;
      }
      seat = {
        id,
        name,
        avatar,
        score: 0,
        streak: 0,
        abilities: lockedAbilities(),
        socket: null,
        pick: null,
        pickedAfter: 0,
        hidden: [],
        deadline: this.phase === "question" ? this.startedAt + this.settings.roundSeconds * 1000 : 0,
        earned: [],
        gain: 0,
      };
      this.seats.set(id, seat);
    } else {
      seat.name = name;
      seat.avatar = avatar;
      if (seat.socket && seat.socket !== socket) {
        this.sockets.delete(seat.socket);
        seat.socket.close(1000, "replaced");
      }
    }
    seat.socket = socket;
    this.sockets.set(socket, id);
    this.ensureHost();
    if (this.phase === "question") this.scheduleEnd();
    this.broadcast();
  }

  private onClose(socket: WebSocket): void {
    const id = this.sockets.get(socket);
    if (!id) return;
    this.sockets.delete(socket);
    const seat = this.seats.get(id);
    if (!seat || seat.socket !== socket) return;
    seat.socket = null;
    if (this.phase === "lobby") this.seats.delete(id);
    if (this.sockets.size === 0) {
      this.reset();
      return;
    }
    this.ensureHost();
    if (this.phase === "question") this.scheduleEnd();
    this.broadcast();
  }

  private reset(): void {
    this.clearTimer();
    this.seats.clear();
    this.hostId = null;
    this.phase = "lobby";
    this.settings = defaultSettings(packs.map((p) => p.id));
    this.questions = [];
    this.index = 0;
  }

  private ensureHost(): void {
    const current = this.hostId ? this.seats.get(this.hostId) : undefined;
    if (current?.socket) return;
    this.hostId = null;
    for (const seat of this.seats.values()) {
      if (seat.socket) {
        this.hostId = seat.id;
        return;
      }
    }
  }

  private applySettings(next: Settings): void {
    if (typeof next !== "object" || next === null) return;
    const packIds = Array.isArray(next.packIds) ? packs.map((p) => p.id).filter((id) => next.packIds.includes(id)) : [];
    this.settings = {
      roundSeconds: ROUND_OPTIONS.includes(next.roundSeconds) ? next.roundSeconds : this.settings.roundSeconds,
      questionCount: COUNT_OPTIONS.includes(next.questionCount) ? next.questionCount : this.settings.questionCount,
      packIds: packIds.length > 0 ? packIds : this.settings.packIds,
    };
    this.broadcast();
  }

  private start(): void {
    const pool: Prepared[] = [];
    for (const pack of packs) {
      if (!this.settings.packIds.includes(pack.id)) continue;
      for (const question of pack.questions) {
        if (question.a.length !== ANSWER_COUNT) continue;
        const answers = shuffled(question.a, Math.random);
        pool.push({ pack: pack.title, text: question.q, answers, correct: answers.indexOf(question.a[0]) });
      }
    }
    if (pool.length === 0) return;
    this.questions = shuffled(pool, Math.random).slice(0, this.settings.questionCount);
    for (const seat of [...this.seats.values()]) {
      if (!seat.socket) {
        this.seats.delete(seat.id);
        continue;
      }
      seat.score = 0;
      seat.streak = 0;
      seat.abilities = lockedAbilities();
      seat.earned = [];
      seat.gain = 0;
    }
    this.startQuestion(0);
  }

  private startQuestion(index: number): void {
    this.index = index;
    this.phase = "question";
    this.startedAt = Date.now();
    this.fastestId = null;
    const deadline = this.startedAt + this.settings.roundSeconds * 1000;
    this.phaseEndsAt = deadline;
    for (const seat of this.seats.values()) {
      seat.pick = null;
      seat.pickedAfter = 0;
      seat.hidden = [];
      seat.deadline = deadline;
      seat.earned = [];
      seat.gain = 0;
    }
    this.scheduleEnd();
    this.broadcast();
  }

  private scheduleEnd(): void {
    this.clearTimer();
    const now = Date.now();
    let latest = 0;
    for (const seat of this.seats.values()) {
      if (seat.socket && seat.pick === null && seat.deadline > now) latest = Math.max(latest, seat.deadline);
    }
    if (latest === 0) {
      this.reveal();
      return;
    }
    this.phaseEndsAt = latest;
    this.timer = setTimeout(() => this.scheduleEnd(), latest - now + ANSWER_GRACE_MS);
  }

  private answer(seat: Seat, index: number): void {
    if (this.phase !== "question" || seat.pick !== null) return;
    if (!Number.isInteger(index) || index < 0 || index >= ANSWER_COUNT || seat.hidden.includes(index)) return;
    const now = Date.now();
    if (now > seat.deadline + ANSWER_GRACE_MS) return;
    seat.pick = index;
    seat.pickedAfter = now - this.startedAt;
    this.scheduleEnd();
    if (this.phase === "question") this.broadcast();
  }

  private useAbility(seat: Seat, ability: AbilityId): void {
    if (this.phase !== "question" || seat.pick !== null) return;
    if (seat.abilities[ability] !== "ready" || Date.now() >= seat.deadline) return;
    if (ability === "time") {
      seat.deadline = this.startedAt + this.settings.roundSeconds * 2000;
    } else if (ability === "hide" || ability === "fifty") {
      const targets = hideTargets(ability, this.questions[this.index].correct, seat.hidden, ANSWER_COUNT, Math.random);
      if (targets.length === 0) return;
      seat.hidden.push(...targets);
    } else {
      return;
    }
    seat.abilities[ability] = "used";
    this.scheduleEnd();
    if (this.phase === "question") this.broadcast();
  }

  private reveal(): void {
    this.clearTimer();
    const correct = this.questions[this.index].correct;
    let fastest: Seat | null = null;
    for (const seat of this.seats.values()) {
      if (seat.pick === correct && (!fastest || seat.pickedAfter < fastest.pickedAfter)) fastest = seat;
    }
    this.fastestId = fastest?.id ?? null;
    for (const seat of this.seats.values()) {
      const right = seat.pick === correct;
      seat.gain = scoreAnswer(right, seat === fastest);
      seat.score += seat.gain;
      seat.streak = right ? seat.streak + 1 : 0;
      seat.earned = earnedAt(seat.streak, seat.abilities);
      for (const ability of seat.earned) seat.abilities[ability] = "ready";
    }
    this.phase = "reveal";
    this.phaseEndsAt = Date.now() + REVEAL_MS;
    this.timer = setTimeout(() => this.advance(), REVEAL_MS);
    this.broadcast();
  }

  private advance(): void {
    this.clearTimer();
    if (this.index + 1 < this.questions.length) {
      this.startQuestion(this.index + 1);
      return;
    }
    this.phase = "results";
    this.phaseEndsAt = 0;
    this.broadcast();
  }

  private toLobby(): void {
    this.phase = "lobby";
    for (const seat of [...this.seats.values()]) {
      if (!seat.socket) this.seats.delete(seat.id);
    }
    this.broadcast();
  }

  private clearTimer(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
  }

  private send(socket: WebSocket, message: ServerMessage): void {
    try {
      socket.send(JSON.stringify(message));
    } catch {
      this.onClose(socket);
    }
  }

  private broadcast(): void {
    const now = Date.now();
    const inRound = this.phase === "question" || this.phase === "reveal";
    const current = inRound ? this.questions[this.index] : null;
    const players: PlayerView[] = [];
    for (const seat of this.seats.values()) {
      players.push({
        id: seat.id,
        name: seat.name,
        avatar: seat.avatar,
        score: seat.score,
        streak: seat.streak,
        connected: seat.socket !== null,
        answered: inRound && seat.pick !== null,
        host: seat.id === this.hostId,
      });
    }
    const question = current && {
      index: this.index,
      total: this.questions.length,
      pack: current.pack,
      text: current.text,
      answers: current.answers,
      startedAt: this.startedAt,
      durationMs: this.settings.roundSeconds * 1000,
    };
    let reveal: RoomState["reveal"] = null;
    if (current && this.phase === "reveal") {
      reveal = { correct: current.correct, fastestId: this.fastestId, picks: {}, gains: {} };
      for (const seat of this.seats.values()) {
        reveal.picks[seat.id] = seat.pick;
        reveal.gains[seat.id] = seat.gain;
      }
    }
    for (const seat of this.seats.values()) {
      if (!seat.socket) continue;
      this.send(seat.socket, {
        type: "state",
        state: {
          code: this.code,
          phase: this.phase,
          now,
          phaseEndsAt: this.phaseEndsAt,
          settings: this.settings,
          players,
          question,
          reveal,
          self: {
            id: seat.id,
            abilities: seat.abilities,
            hidden: seat.hidden,
            pick: seat.pick,
            deadline: seat.deadline,
            earned: seat.earned,
          },
        },
      });
    }
  }
}
