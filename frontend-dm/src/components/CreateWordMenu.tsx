import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../app/hooks";
import { addWord } from "../features/arrayWordsSlice";
import { renderGlossOptions, renderPOSOptions } from "../helpers/renderSelect";
import styles from "./CreateWordMenu.module.css";
import ErrorMessage from "./ErrorMessage";

const CreateWordMenu = () => {
  const token = localStorage.getItem("token");

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>("");

  const createWord = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // Get all parameters
    // Remove any upper case letters for word/translation
    const word = (document.querySelector("input[name='word']") as HTMLInputElement).value.toLowerCase();
    const translation = (
      document.querySelector("input[name='translation']") as HTMLInputElement
    ).value.toLowerCase();
    // Uppercase the first letter for definition and examples
    let definition = (document.querySelector("textarea[name='definition']") as HTMLTextAreaElement).value;
    // Making sure the field is not empty, if not uppercase it
    if (definition !== "") definition = definition[0].toUpperCase() + definition.slice(1);
    let example = (document.querySelector("textarea[name='example']") as HTMLTextAreaElement).value;
    // Making sure the field is not empty, if not uppercase it
    if (example !== "") example = example[0].toUpperCase() + example.slice(1);
    //pos and gloss don't require changes since they are select values
    const pos = (document.querySelector("select[name='pos']") as HTMLSelectElement).value;
    const gloss = (document.querySelector("select[name='gloss']") as HTMLSelectElement).value;
    //Get the ID
    const languageID = localStorage.getItem("project");

    axios
      .post(
        `${process.env.REACT_APP_BACKEND}/api/word`,
        { word, translation, definition, example, pos, gloss, languageID },
        { headers: { Authorization: token! } }
      )
      .then((res) => dispatch(addWord(res.data.results)))
      .catch((err) => {
        if (err.response.data === "Error empty field") setErrorMessage(t("errorMessages.errorWord"));
        else setErrorMessage(t("errorMessages.errorProblem"));
      });

    // Reset values to default
    (document.querySelector("input[name='word']") as HTMLInputElement).value = "";
    (document.querySelector("input[name='translation']") as HTMLInputElement).value = "";
    (document.querySelector("textarea[name='definition']") as HTMLTextAreaElement).value = "";
    (document.querySelector("textarea[name='example']") as HTMLTextAreaElement).value = "";
    (document.querySelector("select[name='pos']") as HTMLSelectElement).value = "Noun";
    (document.querySelector("select[name='gloss']") as HTMLSelectElement).value = "ABE";
  };

  // Handle the change to the word value to remove error message
  const handleWordChange = () => {
    const word = (document.querySelector("input[name='word']") as HTMLInputElement).value;
    if (errorMessage === t("errorMessages.errorWord")){
      if (word !== "") setErrorMessage("")
    }
  }

  return (
    <aside className={styles["create-word"]}>
      <form className={styles["form-word"]}>
        <h2 className={styles.title}>{t("newWord.title")}</h2>
        <label htmlFor="word">{t("newWord.word")}</label>
        <input name="word" onChange={handleWordChange}/>
        <label htmlFor="translation">{t("newWord.translation")}</label>
        <input name="translation" />
        <label htmlFor="definition">{t("newWord.definition")}</label>
        <textarea name="definition" className={styles.definition} />
        <label htmlFor="example">{t("newWord.example")}</label>
        <textarea name="example" className={styles.example} />
        <label htmlFor="pos">{t("newWord.pos")}</label>
        <select name="pos">{renderPOSOptions("create")}</select>
        <label htmlFor="gloss">{t("newWord.gloss")}</label>
        <select name="gloss">{renderGlossOptions("create")}</select>
        {errorMessage === "" ? null : <ErrorMessage message={errorMessage} />}
        <button type="submit" className={styles["btn-submit"]} onClick={(e) => createWord(e)}>
          {t("newWord.addWordBtn")}
        </button>
      </form>
    </aside>
  );
};

export default CreateWordMenu;
