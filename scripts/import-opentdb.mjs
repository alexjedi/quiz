import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API = "https://opentdb.com";
const PAUSE_MS = 5500;
const BATCH = 50;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "questions");

const wanted = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : 100;

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function get(path) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch(`${API}/${path}`);
    if (response.ok) return response.json();
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
  console.log("\nUsage: pnpm import:otdb <category id> [<category id> ...] [--limit=100]");
  process.exit(0);
}

const { token } = await get("api_token.php?command=request");

for (const id of wanted.map(Number)) {
  const category = categories.find((entry) => entry.id === id);
  if (!category) {
    console.log(`Unknown category ${id}`);
    continue;
  }
  const { category_question_count: counts } = await get(`api_count.php?category=${id}`);
  const seen = new Set();
  const questions = [];
  let remaining = Math.min(limit, counts.total_question_count);
  while (remaining > 0 && questions.length < limit) {
    await pause(PAUSE_MS);
    const amount = Math.min(BATCH, remaining);
    const data = await get(`api.php?amount=${amount}&category=${id}&type=multiple&encode=url3986&token=${token}`);
    if (data.response_code === 1 || data.response_code === 4) {
      if (amount === 1) break;
      remaining = Math.floor(amount / 2);
      continue;
    }
    if (data.response_code !== 0) throw new Error(`Open Trivia DB answered with code ${data.response_code}`);
    for (const item of data.results) {
      const q = decodeURIComponent(item.question).trim();
      const a = [item.correct_answer, ...item.incorrect_answers].map((answer) => decodeURIComponent(answer).trim());
      if (seen.has(q) || a.length !== 4 || new Set(a).size !== 4) continue;
      seen.add(q);
      questions.push({ q, a });
    }
    remaining = Math.min(remaining, limit - questions.length);
  }
  const name = title(category.name);
  const file = `otdb-${slug(name)}.json`;
  const pack = { id: `otdb-${slug(name)}`, title: name, source: "Open Trivia Database, CC BY-SA 4.0", questions };
  writeFileSync(join(OUT, file), `${JSON.stringify(pack, null, 2)}\n`);
  console.log(`${file}: ${questions.length} questions`);
}

console.log("\nRegister new packs in src/questions/index.ts.");
