import type { AbilityId, AbilityState, Settings } from "./protocol";

export const POINTS_CORRECT = 100;
export const POINTS_FASTEST = 50;
export const REVEAL_MS = 3000;
export const ANSWER_GRACE_MS = 300;
export const MAX_PLAYERS = 12;
export const NAME_LIMIT = 14;
export const AVATAR_COUNT = 12;
export const ROUND_OPTIONS = [10, 15, 20, 30];
export const COUNT_OPTIONS = [5, 10, 15, 20];
export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export const CODE_LENGTH = 5;

export const MILESTONES: { streak: number; ability: AbilityId }[] = [
  { streak: 3, ability: "hide" },
  { streak: 5, ability: "fifty" },
  { streak: 7, ability: "time" },
];

export const ABILITY_LABELS: Record<AbilityId, string> = {
  hide: "Hide one",
  fifty: "50-50",
  time: "Double time",
};

export function lockedAbilities(): Record<AbilityId, AbilityState> {
  return { hide: "locked", fifty: "locked", time: "locked" };
}

export function defaultSettings(packIds: string[]): Settings {
  return { roundSeconds: 15, questionCount: 10, packIds };
}

export function scoreAnswer(correct: boolean, fastest: boolean): number {
  if (!correct) return 0;
  return POINTS_CORRECT + (fastest ? POINTS_FASTEST : 0);
}

export function earnedAt(streak: number, abilities: Record<AbilityId, AbilityState>): AbilityId[] {
  return MILESTONES.filter((m) => m.streak === streak && abilities[m.ability] === "locked").map((m) => m.ability);
}

export function milestoneFor(ability: AbilityId): number {
  return MILESTONES.find((m) => m.ability === ability)?.streak ?? 0;
}

export function hideTargets(
  ability: "hide" | "fifty",
  correct: number,
  hidden: number[],
  answerCount: number,
  random: () => number,
): number[] {
  const wrong: number[] = [];
  for (let i = 0; i < answerCount; i++) {
    if (i !== correct && !hidden.includes(i)) wrong.push(i);
  }
  const wanted = Math.min(ability === "hide" ? 1 : 2, wrong.length - 1);
  const targets: number[] = [];
  for (let n = 0; n < wanted; n++) {
    targets.push(wrong.splice(Math.floor(random() * wrong.length), 1)[0]);
  }
  return targets;
}

export function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function isRoomCode(value: string): boolean {
  return value.length === CODE_LENGTH && [...value].every((c) => CODE_ALPHABET.includes(c));
}
