export default interface IWord {
  _id: string;
  word: string;
  translation: string;
  definition: string;
  example: string;
  pos: string;
  gloss: string;
}

export interface IWordDb {
  definition: string,
  example: string,
  gloss: string,
  language: string,
  pos: string,
  translation: string,
  word: string,
  __v: string,
  _id: string
}
