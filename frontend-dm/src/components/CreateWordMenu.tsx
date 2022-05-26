import axios from "axios";
import { useAppDispatch } from "../app/hooks";
import { addWord } from "../features/arrayWordsSlice";
import { renderGlossOptions, renderPOSOptions } from "../helpers/renderSelect";
import styles from "./CreateWordMenu.module.css";


const CreateWordMenu = () => {
  const token = localStorage.getItem("token");

  const dispatch = useAppDispatch();

  const createWord = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Get all parameters
    e.preventDefault();
    const word = (document.querySelector("input[name='word']") as HTMLInputElement).value;
    const translation = (document.querySelector("input[name='translation']") as HTMLInputElement).value;
    const definition = (document.querySelector("textarea[name='definition']") as HTMLTextAreaElement).value;
    const example = (document.querySelector("textarea[name='example']") as HTMLTextAreaElement).value;
    const pos = (document.querySelector("select[name='pos']") as HTMLSelectElement).value;
    const gloss = (document.querySelector("select[name='gloss']") as HTMLSelectElement).value;
    const languageID = localStorage.getItem("project");

    axios
      .post(
        `${process.env.REACT_APP_BACKEND}/api/word`,
        { word, translation, definition, example, pos, gloss, languageID },
        { headers: { Authorization: token! } }
      )
      .then((res) => dispatch(addWord(res.data.results)))
      .catch((err) => console.log(err.message));

    // Reset values to default
    (document.querySelector("input[name='word']") as HTMLInputElement).value = "";
    (document.querySelector("input[name='translation']") as HTMLInputElement).value = "";
    (document.querySelector("textarea[name='definition']") as HTMLTextAreaElement).value = "";
    (document.querySelector("textarea[name='example']") as HTMLTextAreaElement).value = "";
    (document.querySelector("select[name='pos']") as HTMLSelectElement).value = "Noun";
    (document.querySelector("select[name='gloss']") as HTMLSelectElement).value = "ABE";


  };

  return (
    <aside className={styles["create-word"]}>
      <form className={styles["form-word"]}>
        <h2 className={styles.title}>Add new word</h2>
        <label htmlFor="word">Word</label>
        <input name="word" />
        <label htmlFor="translation">Translation</label>
        <input name="translation" />
        <label htmlFor="definition">Definition</label>
        <textarea name="definition" className={styles.definition} />
        <label htmlFor="example">Example</label>
        <textarea name="example" className={styles.example} />
        <label htmlFor="pos">Part of Speech</label>
        <select name="pos">{renderPOSOptions("create")}</select>
        <label htmlFor="gloss">Gloss</label>
        <select name="gloss">{renderGlossOptions("create")}</select>
        <button type="submit" className={styles["btn-submit"]} onClick={(e) => createWord(e)}>
          Add word
        </button>
      </form>
    </aside>
  );
};

export default CreateWordMenu;
