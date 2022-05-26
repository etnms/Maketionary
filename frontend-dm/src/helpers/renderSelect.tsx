import dataPOS from "../data/POS.json";
import dataGloss from "../data/gloss.json";

export const renderPOSOptions = (type: string) => {
  return dataPOS.map((element) => <option key={`${element}-${type}`}>{element}</option>);
};

export const renderGlossOptions = (type: string) => {
  return dataGloss.map((element) => <option key={`${element}-${type}`}>{element}</option>);
};
