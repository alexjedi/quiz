import film from "./film-music.json";
import general from "./general.json";
import geography from "./geography.json";
import otdbAnimals from "./otdb-animals.json";
import otdbBooks from "./otdb-books.json";
import otdbComputers from "./otdb-computers.json";
import otdbFilm from "./otdb-film.json";
import otdbHistory from "./otdb-history.json";
import otdbMusic from "./otdb-music.json";
import otdbMythology from "./otdb-mythology.json";
import otdbSports from "./otdb-sports.json";
import otdbTelevision from "./otdb-television.json";
import otdbVideoGames from "./otdb-video-games.json";
import science from "./science.json";

export interface Question {
  q: string;
  a: string[];
}

export interface Pack {
  id: string;
  title: string;
  source?: string;
  questions: Question[];
}

export const packs = [
  general,
  science,
  geography,
  film,
  otdbHistory,
  otdbFilm,
  otdbMusic,
  otdbTelevision,
  otdbVideoGames,
  otdbBooks,
  otdbSports,
  otdbAnimals,
  otdbMythology,
  otdbComputers,
] satisfies Pack[];
