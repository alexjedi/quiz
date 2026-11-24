import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API = "https://opentdb.com";
const PAUSE_MS = 5500;
const BATCH = 50;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "questions");

const flag = (name) => process.argv.find((arg) => arg.startsWith(`--${name}=`))?.split("=")[1];
const wanted = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const limit = Number(flag("limit") ?? 100);
const difficulties = flag("difficulty")?.split(",") ?? [""];

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function get(path) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch(`${API}/${path}`).catch(() => null);
    if (response?.ok) {
      const data = await response.json();
      if (data.response_code !== 5) return data;
    }
    await pause(PAUSE_MS);
  }
  throw new Error(`Request failed: ${path}`);
}

function slug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function title(name) {
  return name.replace(/^(Entertainment|Science): /, "");
}

const { trivia_categories: categories } = await get("api_category.php");

if (wanted.length === 0) {
  for (const category of categories) console.log(String(category.id).padStart(3), category.name);
  console.log("\nUsage: pnpm import:otdb <category id> [<category id> ...] [--limit=100] [--difficulty=medium,hard]");
  console.log("Existing pack files are kept; up to --limit new questions are appended to each.");
  process.exit(0);
}

const { token } = await get("api_token.php?command=request");

async function fetchQuestions(id, difficulty, want, seen) {
  const found = [];
  const level = difficulty ? `&difficulty=${difficulty}` : "";
  let amount = BATCH;
  while (found.length < want) {
    await pause(PAUSE_MS);
    const data = await get(
      `api.php?amount=${amount}&category=${id}${level}&type=multiple&encode=url3986&token=${token}`,
    );
    if (data.response_code === 1 || data.response_code === 4) {
      if (amount === 1) break;
      amount = Math.ceil(amount / 2);
      continue;
    }
    if (data.response_code !== 0) throw new Error(`Open Trivia DB answered with code ${data.response_code}`);
    for (const item of data.results) {
      const q = decodeURIComponent(item.question).trim();
      const a = [item.correct_answer, ...item.incorrect_answers].map((answer) => decodeURIComponent(answer).trim());
      if (seen.has(q) || a.length !== 4 || new Set(a).size !== 4) continue;
      seen.add(q);
      found.push({ q, a });
    }
  }
  return found.slice(0, want);
}

for (const id of wanted.map(Number)) {
  const category = categories.find((entry) => entry.id === id);
  if (!category) {
    console.log(`Unknown category ${id}`);
    continue;
  }
  const name = title(category.name);
  const file = `otdb-${slug(name)}.json`;
  const path = join(OUT, file);
  const pack = existsSync(path)
    ? JSON.parse(readFileSync(path, "utf8"))
    : {
        id: `otdb-${slug(name)}`,
        title: name,
        source: "Open Trivia Database, CC BY-SA 4.0",
        questions: [],
      };
  const seen = new Set(pack.questions.map((question) => question.q));
  const added = [];
  for (const [index, difficulty] of difficulties.entries()) {
    const share = Math.ceil((limit - added.length) / (difficulties.length - index));
    added.push(...(await fetchQuestions(id, difficulty, share, seen)));
  }
  pack.questions.push(...added);
  writeFileSync(path, `${JSON.stringify(pack, null, 2)}\n`);
  console.log(`${file}: +${added.length}, ${pack.questions.length} total`);
}

console.log("\nRegister new packs in src/questions/index.ts.");
