 const translatePos = (value, language) => {
  switch (value) {
    case "noun":
      if (language === "en") return "Noun";
      if (language === "fr") return "Nom";
      else return "Noun";
    case "verb":
      if (language === "en") return "Verb";
      if (language === "fr") return "Verbe";
      else return "Verb";
    case "pronoun":
      if (language === "en") return "Pronoun";
      if (language === "fr") return "Pronom";
      else return "Pronoun";
    case "adjective":
      if (language === "en") return "Adjective";
      if (language === "fr") return "Adjectif";
      else return "Adjective";
    case "adverb":
      if (language === "en") return "Adverb";
      if (language === "fr") return "Adverbe";
      else return "Adverb";
    case "interjection":
      if (language === "en") return "Interjection";
      if (language === "fr") return "Interjection";
      else return "Interjection";
    case "preposition":
      if (language === "en") return "Preposition";
      if (language === "fr") return "Préposition";
      else return "Preposition";
    case "conjunction":
      if (language === "en") return "Conjunction";
      if (language === "fr") return "Conjonction";
      else return "Conjunction";
    case "determiner":
      if (language === "en") return "Determiner";
      if (language === "fr") return "Déterminant";
      break;
    case "number":
      if (language === "en") return "Number";
      if (language === "fr") return "Nombre";
      else return "Number";
    default:
      return "";
  }
};

export default translatePos;