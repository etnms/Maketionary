import React, { useState } from "react";
import IWord from "../interfaces/interfaceWord";
import styles from "./ListWords.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { renderGlossOptions, renderPOSOptions } from "../helpers/renderSelect";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectWordEdit, setEditMode } from "../features/editModeSlice";

// need function that cancel edit / restores tmp value to current value

const Word = (props: React.PropsWithChildren<IWord>) => {
  const { _id, word, translation, definition, example, pos, gloss } = props;

  const token = localStorage.getItem("token");

  // Using redux to determine the status of the edit mode
  // But also checking which word is currently select to show only one edit at a time (for current word)
  const dispatch = useAppDispatch();
  const editMode = useAppSelector(state => state.editMode.value);
  const wordToEdit = useAppSelector(state => state.editMode.wordToEdit);

  // Define all the values in state for an entry to use them for edit and display
  const [wordValue, setWordValue] = useState<string>(word);
  const [translationValue, setTranslationValue] = useState<string>(translation);
  const [definitionValue, setDefinitionValue] = useState<string>(definition);
  const [exampleValue, setExampleValue] = useState<string>(example);
  const [posValue, setPosValue] = useState<string>(pos);
  const [glossValue, setGlossValue] = useState<string>(gloss);

  // Temp values for editing purposes
  const [wordTmp, setWordTmp] = useState<string>(word);
  const [translationTmp, setTranslationTmp] = useState<string>(translation);
  const [definitionTmp, setDefinitionTmp] = useState<string>(definition);
  const [exampleTmp, setExampleTmp] = useState<string>(example);
  const [posTmp, setPosTmp] = useState<string>(pos);
  const [glossTmp, setGlossTmp] = useState<string>(gloss);

  const selectLine = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    dispatch(setEditMode(false));
    dispatch(selectWordEdit(_id));
    //setCurrentElement(true)
    const el = e.currentTarget;

    // Select previous selected element
    const previousEl = document.querySelector(`.${styles.selected}`);
    // If same element then reset the edit values 
    if (el === previousEl) cancelChange();
   // if (el !== previousEl) setCurrentElement(true);
    // Add selected style to item
    el.classList.add(`${styles.selected}`);
    el.children[0].children[0].classList.add(`${styles["wrapper-btns-reveal"]}`);

    // Remove from previous; order is important it allows to click on same item to deselect
    previousEl?.classList.remove(`${styles.selected}`);
    previousEl?.children[0].children[0].classList.remove(`${styles["wrapper-btns-reveal"]}`);
  };

  const deleteWord = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    const el = e.currentTarget;
    const liToDelete = el.parentElement?.parentElement?.parentElement; // get the li element
    const ul = liToDelete?.parentElement; // Get the parent (ul element)

    axios
      .delete(`${process.env.REACT_APP_BACKEND}/api/word`, {
        data: { _id },
        headers: { Authorization: token! },
      })
      .then(() => {
        ul?.removeChild(liToDelete!);
      })
      .catch((err) => console.log(err));
  };

  const updateWord = () => {
    const word = (document.querySelector("input[name='edit-word']") as HTMLInputElement).value;
    const translation = (document.querySelector("input[name='edit-translation']") as HTMLInputElement).value;
    const definition = (document.querySelector("textarea[name='edit-definition']") as HTMLTextAreaElement).value;
    const example = (document.querySelector("textarea[name='edit-example']") as HTMLTextAreaElement).value;
    const pos = (document.querySelector("select[name='edit-pos']") as HTMLSelectElement).value;
    const gloss = (document.querySelector("select[name='edit-gloss']") as HTMLSelectElement).value;

    axios
      .put(
        `${process.env.REACT_APP_BACKEND}/api/word`,
        { word, translation, definition, example, pos, gloss, _id },
        { headers: { Authorization: token! } }
      )
      .then(() => {
        // Tmp values are applied to the actual value once validated
        setWordValue(wordTmp);
        setDefinitionValue(definitionTmp);
        setTranslationValue(translationTmp);
        setExampleValue(exampleTmp);
        setGlossValue(glossTmp);
        setPosValue(posTmp);
        dispatch(setEditMode(false));
      })
      .catch((err) => console.log(err));
  };

  // Hangle the change of each tmp value: allows to see changes directly
  const handleChange = (e: React.ChangeEvent<HTMLElement>, elementName: string) => {
    switch (elementName) {
      case "word":
        setWordTmp((e.target as HTMLInputElement).value);
        break;
      case "translation":
        setTranslationTmp((e.target as HTMLInputElement).value);
        break;
      case "definition":
        setDefinitionTmp((e.target as HTMLTextAreaElement).value);
        break;
      case "example":
        setExampleTmp((e.target as HTMLTextAreaElement).value);
        break;
      case "pos":
        setPosTmp((e.target as HTMLSelectElement).value);
        break;
      case "gloss":
        setGlossTmp((e.target as HTMLSelectElement).value);
        break;
      default:
        return;
    }
  };

  const cancelChange = () => {
    setWordTmp(wordValue);
    setDefinitionTmp(definitionValue);
    setTranslationTmp(translationValue);
    setExampleTmp(exampleValue);
    setGlossTmp(glossValue);
    setPosTmp(posValue);
  };

  return (
    <li className={styles.listitem} onDoubleClick={(e) => selectLine(e)}>
      <div className={styles["wrapper-edit"]}>
        <div className={styles["wrapper-btns"]}>
          <DeleteIcon className={styles["btn"]} onClick={(e) => deleteWord(e)} />
          {editMode ? (
            <CheckCircleIcon className={styles["btn"]} onClick={updateWord} />
          ) : (
            <EditIcon className={styles["btn"]} onClick={() => dispatch(setEditMode(true))} />
          )}
        </div>
      </div>
      {/* Check to see if edit mode is on but also if the selected word is the correct one.
      This allows for one edit at a time and not showing multiple on accident. 
      Repeat for every field.*/}
      {editMode && (wordToEdit === _id) ? (
        <span className={`${styles.word}`}>
          <input
            name="edit-word"
            value={wordTmp}
            className={`${styles.edit}`}
            onChange={(e) => handleChange(e, "word")}
          />
        </span>
      ) : (
        <span className={styles.word}>{wordValue}</span>
      )}
      {editMode && (wordToEdit === _id) ? (
        <span className={`${styles.translation}`}>
          <input
            name="edit-translation"
            value={translationTmp}
            className={`${styles.edit}`}
            onChange={(e) => handleChange(e, "translation")}
          />
        </span>
      ) : (
        <span className={styles.translation}>{translationValue}</span>
      )}
      {editMode && (wordToEdit === _id) ? (
        <span className={`${styles.definition}`}>
          <textarea
            name="edit-definition"
            value={definitionTmp}
            className={`${styles.edit} ${styles["edit-example"]}`}
            onChange={(e) => handleChange(e, "definition")}>
          </textarea>
        </span>
      ) : (
        <span className={styles.definition}>{definitionValue}</span>
      )}
      {editMode && (wordToEdit === _id) ? (
        <span className={styles.example}>
          <textarea
            name="edit-example"
            value={exampleTmp}
            className={`${styles.edit} ${styles["edit-example"]}`}
            onChange={(e) => handleChange(e, "example")}></textarea>
        </span>
      ) : (
        <span className={styles.example}>{exampleValue}</span>
      )}
      {editMode && (wordToEdit === _id) ? (
        <span className={styles.pos}>
          <select
            name="edit-pos"
            value={posTmp}
            className={styles.pos}
            onChange={(e) => handleChange(e, "pos")}>
            {renderPOSOptions("edit")}
          </select>
        </span>
      ) : (
        <span className={styles.pos}>{posValue}</span>
      )}
      {editMode && (wordToEdit === _id) ? (
        <span className={styles.gloss}>
          <select
            name="edit-gloss"
            value={glossTmp}
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
