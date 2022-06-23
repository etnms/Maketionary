import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const useTranslateSelect = (value: string) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");

  // Custom hook to translate select POS
  // Allows for neutral data in db and multilingual display/UI
  useEffect(() => {
    switch (value) {
      case "noun":
        setText(t("selectPOS.noun"));
        break;
      case "verb":
        setText(t("selectPOS.verb"));
        break;
      case "pronoun":
        setText(t("selectPOS.pronoun"));
        break;
      case "adjective":
        setText(t("selectPOS.adjective"));
        break;
      case "adverb":
        setText(t("selectPOS.adverb"));
        break;
      case "interjection":
        setText(t("selectPOS.interjection"));
        break;
      case "preposition":
        setText(t("selectPOS.preposition"));
        break;
      case "conjunction":
        setText(t("selectPOS.conjunction"));
        break;
      case "determiner":
        setText(t("selectPOS.determiner"));
        break;
      case "number":
        setText(t("selectPOS.number"));
        break;
      default:
        setText("");
        break;
    }
  }, [t, text, value]);

  return text;
};

export default useTranslateSelect;
