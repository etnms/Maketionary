import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../app/hooks";
import { addWord } from "../features/arrayWordsSlice";
import { renderGlossOptions } from "../helpers/renderSelect";
import styles from "./CreateWordMenu.module.css";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loader";

const CreateWordMenu = () => {
  const token = localStorage.getItem("token");

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>("");
  // Boolean for the loader component
  const [loading, setLoading] = useState<boolean>(false);

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
    // Create loader to wait for answer from the server
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND}/api/word`,
        { word, translation, definition, example, pos, gloss, languageID },
        { headers: { Authorization: token! } }
      )
      .then((res) => {
        dispatch(addWord(res.data.results));
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data === "Error empty field") setErrorMessage(t("errorMessages.errorWord"));
        else setErrorMessage(t("errorMessages.errorProblem"));
      });

    // Reset values to default
    (document.querySelector("input[name='word']") as HTMLInputElement).value = "";
    (document.querySelector("input[name='translation']") as HTMLInputElement).value = "";
    (document.querySelector("textarea[name='definition']") as HTMLTextAreaElement).value = "";
    (document.querySelector("textarea[name='example']") as HTMLTextAreaElement).value = "";
    (document.querySelector("select[name='pos']") as HTMLSelectElement).value = "";
    (document.querySelector("select[name='gloss']") as HTMLSelectElement).value = "";
  };

  // Handle the change to the word value to remove error message
  const handleWordChange = () => {
    const word = (document.querySelector("input[name='word']") as HTMLInputElement).value;
    if (errorMessage === t("errorMessages.errorWord")) {
      if (word !== "") setErrorMessage("");
    }
  };

  return (
    <aside className={styles["create-word"]}>
      <form className={styles["form-word"]}>
        <h2 className={styles.title}>{t("newWord.title")}</h2>
        <label htmlFor="word">{t("newWord.word")}</label>
        <input name="word" onChange={handleWordChange} />
        <label htmlFor="translation">{t("newWord.translation")}</label>
        <input name="translation" />
        <label htmlFor="definition">{t("newWord.definition")}</label>
        <textarea name="definition" className={styles.definition} />
        <label htmlFor="example">{t("newWord.example")}</label>
        <textarea name="example" className={styles.example} />
        <label htmlFor="pos">{t("newWord.pos")}</label>
        <select name="pos" defaultValue={""} >
          <option disabled hidden></option>
          <option>{t("selectPOS.noun")}</option>
          <option>{t("selectPOS.verb")}</option>
          <option>{t("selectPOS.pronoun")}</option>
          <option>{t("selectPOS.adjective")}</option>
          <option>{t("selectPOS.adverb")}</option>
          <option>{t("selectPOS.interjection")}</option>
          <option>{t("selectPOS.preposition")}</option>
          <option>{t("selectPOS.conjunction")}</option>
          <option>{t("selectPOS.determiner")}</option>
          <option>{t("selectPOS.number")}</option>
        </select>
        <label htmlFor="gloss">{t("newWord.gloss")}</label>
        <select name="gloss" defaultValue={""} >{renderGlossOptions("create")}</select>
        {errorMessage === "" ? null : <ErrorMessage message={errorMessage} />}
        {!loading? // Loader after word submission
        <button type="submit" className={styles["btn-submit"]} onClick={(e) => createWord(e)}>
          {t("newWord.addWordBtn")}
        </button> : <div className={styles["wrapper-loader"]}><Loader width={24} height={24}/></div>}
      </form>
    </aside>
  );
};

export default CreateWordMenu;
