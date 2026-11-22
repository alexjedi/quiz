import film from "./film-music.json";
import general from "./general.json";
import geography from "./geography.json";
import science from "./science.json";

export interface Question {
  q: string;
  a: string[];
}

export interface Pack {
  id: string;
  title: string;
  questions: Question[];
}

export const packs = [general, science, geography, film] satisfies Pack[];
