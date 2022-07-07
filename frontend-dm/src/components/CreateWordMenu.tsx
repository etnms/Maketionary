import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dispatch } from "redux";
import { useAppDispatch } from "../app/hooks";
import { addWord } from "../features/arrayWordsSlice";
import { renderGlossOptions } from "../helpers/renderSelect";
import styles from "./CreateWordMenu.module.css";
import ErrorMessage from "./ErrorMessage";
import Loader from "./Loaders/Loader";
import useWindowResize from "../helpers/useWindowResize";
import { NavigateFunction, useNavigate } from "react-router-dom";
import adapter from "../helpers/axiosAdapter";

const CreateWordMenu = () => {
  const dispatch: Dispatch<any> = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>("");
  // Boolean for the loader component
  const [loading, setLoading] = useState<boolean>(false);

  const createWord = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // Get all parameters
    // Remove any upper case letters for word/translation
    const word: string = (
      document.querySelector("input[name='word']") as HTMLInputElement
    ).value.toLowerCase();
    const translation: string = (
      document.querySelector("input[name='translation']") as HTMLInputElement
    ).value.toLowerCase();
    // Uppercase the first letter for definition and examples
    let definition: string = (document.querySelector("textarea[name='definition']") as HTMLTextAreaElement)
      .value;
    // Making sure the field is not empty, if not uppercase it
    if (definition !== "") definition = definition[0].toUpperCase() + definition.slice(1);
    let example: string = (document.querySelector("textarea[name='example']") as HTMLTextAreaElement).value;
    // Making sure the field is not empty, if not uppercase it
    if (example !== "") example = example[0].toUpperCase() + example.slice(1);
    //pos and gloss don't require changes since they are select values
    const pos: string = (document.querySelector("select[name='pos']") as HTMLSelectElement).value;
    const gloss: string = (document.querySelector("select[name='gloss']") as HTMLSelectElement).value;
    //Get the ID
    const languageID: string | null = localStorage.getItem("project");
    // Create loader to wait for answer from the server
    setLoading(true);
    adapter
      .post("/word", { word, translation, definition, example, pos, gloss, languageID })
      .then((res) => {
        dispatch(addWord(res.data));
        setLoading(false);
        // Reset values to default
        (document.querySelector("input[name='word']") as HTMLInputElement).value = "";
        (document.querySelector("input[name='translation']") as HTMLInputElement).value = "";
        (document.querySelector("textarea[name='definition']") as HTMLTextAreaElement).value = "";
        (document.querySelector("textarea[name='example']") as HTMLTextAreaElement).value = "";
        (document.querySelector("select[name='pos']") as HTMLSelectElement).value = "";
        (document.querySelector("select[name='gloss']") as HTMLSelectElement).value = "";
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.response.status === 401) return navigate("/expired");
        if (err.response.data === "Error empty field") return setErrorMessage(t("errorMessages.errorWord"));
        if (err.response.data === "Error create word") return setErrorMessage(t("errorMessages.errorWordDb"));
        else setErrorMessage(t("errorMessages.errorProblem"));
      });
  };

  // Handle the change to the word value to remove error message
  const handleWordChange = () => {
    const word: string = (document.querySelector("input[name='word']") as HTMLInputElement).value;
    if (errorMessage === t("errorMessages.errorWord")) {
      if (word !== "") setErrorMessage("");
    }
  };

  //Get current size of window with hook and state of the menu for phone view

  const widthWindow = useWindowResize();
  const [isMenuPhoneOpen, setIsMenuOpen] = useState<boolean>(false);
  // Display the menu fully or close it
  const displayMobileView = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const width = window.innerWidth;
    if (width <= 950) {
      const el = document.querySelector(`.${styles["create-word"]}`);
      el?.classList.toggle(`${styles["phone-view"]}`);
      setIsMenuOpen((prev: boolean) => !prev);
    }
  };

  return (
    <aside className={styles["create-word"]}>
      <form className={styles["form-word"]}>
        {widthWindow <= 950 ? (
          <button className={styles["button-show"]} onClick={(e) => displayMobileView(e)}>
            {isMenuPhoneOpen ? "-" : "+"}
          </button>
        ) : null}
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
        <select name="pos" defaultValue={""}>
          <option disabled hidden></option>
          <option value="noun">{t("selectPOS.noun")}</option>
          <option value="verb">{t("selectPOS.verb")}</option>
          <option value="pronoun">{t("selectPOS.pronoun")}</option>
          <option value="adjective">{t("selectPOS.adjective")}</option>
          <option value="adverb">{t("selectPOS.adverb")}</option>
          <option value="interjection">{t("selectPOS.interjection")}</option>
          <option value="preposition">{t("selectPOS.preposition")}</option>
          <option value="conjunction">{t("selectPOS.conjunction")}</option>
          <option value="determiner">{t("selectPOS.determiner")}</option>
          <option value="number">{t("selectPOS.number")}</option>
        </select>
        <label htmlFor="gloss">{t("newWord.gloss")}</label>
        <select name="gloss" defaultValue={""}>
          {renderGlossOptions("create")}
        </select>
        {errorMessage === "" ? null : <ErrorMessage message={errorMessage} />}
        {!loading ? ( // Loader after word submission
          <button type="submit" className={styles["btn-submit"]} onClick={(e) => createWord(e)}>
            {t("newWord.addWordBtn")}
          </button>
        ) : (
          <div className={styles["wrapper-loader"]}>
            <Loader width={24} height={24} />
          </div>
        )}
      </form>
    </aside>
  );
};

export default CreateWordMenu;
