export const translateTextDocument = (value, language) => {
  switch (value) {
    case "definition":
      if (language === "en") return "Definition";
      if (language === "fr") return "Définition";
    case "example":
      if (language === "en") return "Example";
      if (language === "fr") return "Exemple";
    default:
        return "";
  }
};
