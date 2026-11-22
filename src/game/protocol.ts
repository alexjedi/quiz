export type AbilityId = "hide" | "fifty" | "time";
export type AbilityState = "locked" | "ready" | "used";
export type Phase = "lobby" | "question" | "reveal" | "results";

export interface Settings {
  roundSeconds: number;
  questionCount: number;
  packIds: string[];
}

export interface PlayerView {
  id: string;
  name: string;
  avatar: number;
  score: number;
  streak: number;
  connected: boolean;
  answered: boolean;
  host: boolean;
}

export interface QuestionView {
  index: number;
  total: number;
  pack: string;
  text: string;
  answers: string[];
  startedAt: number;
  durationMs: number;
}

export interface RevealView {
  correct: number;
  fastestId: string | null;
  picks: Record<string, number | null>;
  gains: Record<string, number>;
}

export interface SelfView {
  id: string;
  abilities: Record<AbilityId, AbilityState>;
  hidden: number[];
  pick: number | null;
  deadline: number;
  earned: AbilityId[];
}

export interface RoomState {
  code: string;
  phase: Phase;
  now: number;
  phaseEndsAt: number;
  settings: Settings;
  players: PlayerView[];
  question: QuestionView | null;
  reveal: RevealView | null;
  self: SelfView;
}

export type ClientMessage =
  | { type: "join"; id: string; name: string; avatar: number }
  | { type: "settings"; settings: Settings }
  | { type: "start" }
  | { type: "answer"; index: number }
  | { type: "ability"; ability: AbilityId }
  | { type: "lobby" };

export type ServerMessage =
  | { type: "state"; state: RoomState }
  | { type: "error"; message: string };
