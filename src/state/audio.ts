const MUSIC_URL = "/audio/music.m4a";
const PROMPT_URL = "/audio/prompt.wav";
const MUSIC_PEAK = 0.5;
const PROMPT_GAIN = 0.7;

let context: AudioContext | null = null;
let musicGain: GainNode | null = null;
let promptBuffer: AudioBuffer | null = null;
let musicLevel = 5;
let sfxOn = true;

async function decode(ctx: AudioContext, url: string): Promise<AudioBuffer> {
  const response = await fetch(url);
  return ctx.decodeAudioData(await response.arrayBuffer());
}

function gainFor(level: number): number {
  return (level / 10) * MUSIC_PEAK;
}

export function unlockAudio(): void {
  if (context) {
    if (context.state === "suspended") void context.resume();
    return;
  }
  const ctx = new AudioContext();
  context = ctx;
  musicGain = ctx.createGain();
  musicGain.gain.value = gainFor(musicLevel);
  musicGain.connect(ctx.destination);
  decode(ctx, PROMPT_URL)
    .then((buffer) => {
      promptBuffer = buffer;
    })
    .catch(() => {});
  decode(ctx, MUSIC_URL)
    .then((buffer) => {
      if (!musicGain) return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(musicGain);
      source.start();
    })
    .catch(() => {});
}

export function setMusicLevel(level: number): void {
  musicLevel = level;
  if (context && musicGain) musicGain.gain.setTargetAtTime(gainFor(level), context.currentTime, 0.05);
}

export function setSfx(on: boolean): void {
  sfxOn = on;
}

export function playPrompt(): void {
  if (!sfxOn || !context || !promptBuffer) return;
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = PROMPT_GAIN;
  source.buffer = promptBuffer;
  source.connect(gain).connect(context.destination);
  source.start();
}
