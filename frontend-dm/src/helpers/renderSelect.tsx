import dataGloss from "../data/gloss.json";

// Render select gloss, gloss always stay the same with every language
export const renderGlossOptions = (type: string) => {
  return dataGloss.map((element) => {
    if (element === "") return <option key={`${element}-${type}`} disabled hidden>{element}</option>;
    else return <option key={`${element}-${type}`}>{element}</option>;
  });
};
