import React, { useState } from "react";
import IWord from "../interfaces/interfaceWord";
import styles from "./ListWords.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { renderGlossOptions, renderPOSOptions } from "../helpers/renderSelect";

const Word = (props: React.PropsWithChildren<IWord>) => {
  const { _id, word, translation, definition, example, pos, gloss } = props;

  const token = localStorage.getItem("token");
  const [editMode, setEditMode] = useState(false);

  // Define all the values in state for an entry to use them for edit and display
  const [wordValue, setWordValue] = useState(word);
  const [translationValue, setTranslationValue] = useState(translation);
  const [definitionValue, setDefinitionValue] = useState(definition);
  const [exampleValue, setExampleValue] = useState(example);
  const [posValue, setPosValue] = useState(pos);
  const [glossValue, setGlossValue] = useState(gloss);

  const selectLine = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setEditMode(false);
    const el = e.currentTarget;
    // Select previous selected element
    const previousEl = document.querySelector(`.${styles.selected}`);

    // Add selected style to item
    el.classList.add(`${styles.selected}`);
    el.children[0].children[0].classList.add(`${styles["wrapper-btns-reveal"]}`);

    // Remove from previous; order is important it allows to click on same item to deselect
    previousEl?.classList.remove(`${styles.selected}`);
    previousEl?.children[0].children[0].classList.remove(`${styles["wrapper-btns-reveal"]}`);
  };

  const deleteWord = () => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND}/api/word`, {
        data: { _id },
        headers: { Authorization: token! },
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const updateWord = () => {
    const word = (document.querySelector("input[name='edit-word']") as HTMLInputElement).value;
    const translation = (document.querySelector("input[name='edit-translation']") as HTMLInputElement).value;
    const definition = (document.querySelector("input[name='edit-definition']") as HTMLInputElement).value;
    const example = (document.querySelector("textarea[name='edit-example']") as HTMLTextAreaElement).value;
    const pos = (document.querySelector("select[name='edit-pos']") as HTMLSelectElement).value;
    const gloss = (document.querySelector("select[name='edit-gloss']") as HTMLSelectElement).value;

    axios
      .put(
        `${process.env.REACT_APP_BACKEND}/api/word`,
        { word, translation, definition, example, pos, gloss, _id },
        { headers: { Authorization: token! } }
      )
      .then((res) => {
        console.log(res);
        setEditMode(false);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e: React.ChangeEvent<HTMLElement>, elementName: string) => {
    switch (elementName) {
      case "word":
        setWordValue((e.target as HTMLInputElement).value);
        break;
      case "translation":
        setTranslationValue((e.target as HTMLInputElement).value);
        break;
      case "definition":
        setDefinitionValue((e.target as HTMLInputElement).value);
        break;
      case "example":
        setExampleValue((e.target as HTMLTextAreaElement).value);
        break;
      case "pos":
        setPosValue((e.target as HTMLSelectElement).value);
        break;
      case "gloss":
        setGlossValue((e.target as HTMLSelectElement).value);
        break;
      default:
        return;
    }
  };

  return (
    <li className={styles.listitem} onDoubleClick={(e) => selectLine(e)}>
      <div className={styles["wrapper-edit"]}>
        <div className={styles["wrapper-btns"]}>
          <DeleteIcon className={styles["btn"]} onClick={deleteWord} />
          {editMode ? (
            <CheckCircleIcon className={styles["btn"]} onClick={updateWord} />
          ) : (
            <EditIcon className={styles["btn"]} onClick={() => setEditMode(true)} />
          )}
        </div>
      </div>
      {editMode ? (
        <span className={`${styles.word}`}>
          <input
            name="edit-word"
            value={wordValue}
            className={`${styles.edit}`}
            onChange={(e) => handleChange(e, "word")}
          />
        </span>
      ) : (
        <span className={styles.word}>{wordValue}</span>
      )}
      {editMode ? (
        <span className={`${styles.translation}`}>
          <input
            name="edit-translation"
            value={translationValue}
            className={`${styles.edit}`}
            onChange={(e) => handleChange(e, "translation")}
          />
        </span>
      ) : (
        <span className={styles.translation}>{translationValue}</span>
      )}
      {editMode ? (
        <span className={`${styles.definition}`}>
          <input
            name="edit-definition"
            value={definitionValue}
            className={`${styles.edit}`}
            onChange={(e) => handleChange(e, "definition")}
          />
        </span>
      ) : (
        <span className={styles.definition}>{definitionValue}</span>
      )}
      {editMode ? (
        <span className={styles.example}>
          <textarea
            name="edit-example"
            value={exampleValue}
            className={`${styles.edit} ${styles["edit-example"]}`}
            onChange={(e) => handleChange(e, "example")}></textarea>
        </span>
      ) : (
        <span className={styles.example}>{exampleValue}</span>
      )}
      {editMode ? (
        <span className={styles.pos}>
          <select
            name="edit-pos"
            value={posValue}
            className={styles.pos}
            onChange={(e) => handleChange(e, "pos")}>
            {renderPOSOptions("edit")}
          </select>
        </span>
      ) : (
        <span className={styles.pos}>{posValue}</span>
      )}
      {editMode ? (
        <span className={styles.gloss}>
          <select
            name="edit-gloss"
            value={glossValue}
            className={styles.gloss}
            onChange={(e) => handleChange(e, "gloss")}>
            {renderGlossOptions("edit")}
          </select>
        </span>
      ) : (
        <span className={styles.gloss}>{glossValue}</span>
      )}
    </li>
  );
};

export default Word;
