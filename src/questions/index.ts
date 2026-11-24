import film from "./film-music.json";
import general from "./general.json";
import geography from "./geography.json";
import otdbAnimals from "./otdb-animals.json";
import otdbAnime from "./otdb-japanese-anime-and-manga.json";
import otdbArt from "./otdb-art.json";
import otdbBoardGames from "./otdb-board-games.json";
import otdbBooks from "./otdb-books.json";
import otdbCartoons from "./otdb-cartoon-and-animations.json";
import otdbCelebrities from "./otdb-celebrities.json";
import otdbComics from "./otdb-comics.json";
import otdbComputers from "./otdb-computers.json";
import otdbFilm from "./otdb-film.json";
import otdbGadgets from "./otdb-gadgets.json";
import otdbGeneral from "./otdb-general-knowledge.json";
import otdbGeography from "./otdb-geography.json";
import otdbHistory from "./otdb-history.json";
import otdbMathematics from "./otdb-mathematics.json";
import otdbMusic from "./otdb-music.json";
import otdbMusicals from "./otdb-musicals-and-theatres.json";
import otdbMythology from "./otdb-mythology.json";
import otdbPolitics from "./otdb-politics.json";
import otdbScience from "./otdb-science-and-nature.json";
import otdbSports from "./otdb-sports.json";
import otdbTelevision from "./otdb-television.json";
import otdbVehicles from "./otdb-vehicles.json";
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

const withQuestionsFrom = (pack: Pack, extra: Pack): Pack => ({
  ...pack,
  questions: [...pack.questions, ...extra.questions],
});

export const packs = [
  withQuestionsFrom(general, otdbGeneral),
  science,
  withQuestionsFrom(geography, otdbGeography),
  film,
  otdbHistory,
  otdbScience,
  otdbFilm,
  otdbMusic,
  otdbTelevision,
  otdbVideoGames,
  otdbAnime,
  otdbBooks,
  otdbSports,
  otdbAnimals,
  otdbMythology,
  otdbComputers,
  otdbArt,
  otdbPolitics,
  otdbComics,
  otdbCartoons,
  otdbBoardGames,
  otdbVehicles,
  otdbMathematics,
  otdbCelebrities,
  otdbMusicals,
  otdbGadgets,
] satisfies Pack[];
