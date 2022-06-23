import React, { useEffect, useState } from "react";
import IWord, { IWordDb } from "../interfaces/interfaceWord";
import styles from "./ListWords.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { renderGlossOptions } from "../helpers/renderSelect";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectWordEdit, setEditMode } from "../features/editModeSlice";
import { updateWordList } from "../features/arrayWordsSlice";
import { useTranslation } from "react-i18next";
import ErrorMessage from "./ErrorMessage";
import useTranslateSelect from "../helpers/useTranslateSelect";

const Word = (props: React.PropsWithChildren<IWord>) => {
  const { _id, word, translation, definition, example, pos, gloss } = props;

  const token: string | null = localStorage.getItem("token");

  const { t } = useTranslation();

  // Setting
  const columnDisplay: boolean = useAppSelector((state) => state.settings.inLineDisplay);
  // Rerender when change in the settings
  useEffect(() => {}, [columnDisplay]);

  const listWord: IWordDb[] = useAppSelector((state) => state.arrayWords.value);
  // Using global state to determine the status of the edit mode
  // But also checking which word is currently select to show only one edit at a time (for current word)
  const dispatch = useAppDispatch();
  const editMode: boolean = useAppSelector((state) => state.editMode.value);
  const wordToEdit: string = useAppSelector((state) => state.editMode.wordToEdit);

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

  const [errorMessage, setErrorMessage] = useState<string>("");

  const selectLine = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent<HTMLLIElement>
  ) => {
    dispatch(setEditMode(false));
    dispatch(selectWordEdit(_id));
    const el = e.currentTarget;

    // Select previous selected element
    const previousEl: Element | null = document.querySelector(`.${styles.selected}`);
    // If same element then reset the edit values
    if (el === previousEl) cancelChange();
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
      .then(() => {
        // Filter list to remove deleted item
        const updatedList: IWordDb[] = listWord.filter((word: IWord) => word._id !== _id);
        // Update the list for new render
        dispatch(updateWordList(updatedList));
      })
      .catch(() => {
        setErrorMessage(t("errorMessages.errorEditWord"));
      });
  };

  const activateEditMode = () => {
    setErrorMessage("");
    dispatch(setEditMode(true))
  } 

  const updateWord = () => {
    // Updating a word function
    // This function does not uppercase/lowercase entries as opposed to the create word one
    // This is for the simple purpose of letting users change entries as they wish for scenarios where casing can be an issue
    const word: string = (document.querySelector("input[name='edit-word']") as HTMLInputElement).value;
    const translation: string = (document.querySelector("input[name='edit-translation']") as HTMLInputElement).value;
    const definition: string = (document.querySelector("textarea[name='edit-definition']") as HTMLTextAreaElement)
      .value;
    const example: string = (document.querySelector("textarea[name='edit-example']") as HTMLTextAreaElement).value;
    const pos: string = (document.querySelector("select[name='edit-pos']") as HTMLSelectElement).value;
    const gloss: string = (document.querySelector("select[name='edit-gloss']") as HTMLSelectElement).value;

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
      .catch(() =>{
        setErrorMessage(t("errorMessages.errorEditWord"));
      } );
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

  const handleKeypress = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === "Enter") selectLine(e);
  };

  const translate = useTranslateSelect(posValue)
  // Render list element
  return (
    <li
      className={styles.listitem}
      onDoubleClick={(e) => selectLine(e)}
      tabIndex={0}
      onKeyDown={(e) => handleKeypress(e)}>
      <div className={styles["wrapper-edit"]}>
        <div className={styles["wrapper-btns"]}>
          <button
            className={styles["btn"]}
            onClick={deleteWord}
            aria-label={t("ariaLabels.delete")}>
            <DeleteIcon />
          </button>
          {editMode ? (
            <button className={styles["btn"]} onClick={updateWord} aria-label={t("ariaLabels.editConfirm")}>
              <CheckCircleIcon />
            </button>
          ) : (
            <button
              className={styles["btn"]}
              onClick={activateEditMode}
              aria-label={t("ariaLabels.edit")}>
              <EditIcon />
            </button>
          )}
        </div>
      </div>
      {/* Check to see if edit mode is on but also if the selected word is the correct one.
      This allows for one edit at a time and not showing multiple on accident. 
      Repeat for every field.*/}
      {editMode && wordToEdit === _id ? (
        <div>
          <div className={!columnDisplay ? styles["wrapper-content"] : styles["wrapper-content-block"]}>
            <span className={styles.word}>
              <input
                name="edit-word"
                value={wordTmp}
                className={!columnDisplay ? `${styles.edit}` : `${styles["edit-block"]}`}
                onChange={(e) => handleChange(e, "word")}
              />
            </span>
            <span className={styles.translation}>
              <input
                name="edit-translation"
                value={translationTmp}
                className={!columnDisplay ? `${styles.edit}` : `${styles["edit-block"]}`}
                onChange={(e) => handleChange(e, "translation")}
              />
            </span>
            <span className={styles.definition}>
              <textarea
                name="edit-definition"
                value={definitionTmp}
                className={
                  !columnDisplay
                    ? `${styles.edit} ${styles["edit-example"]}`
                    : `${styles["edit-block"]} ${styles["edit-block-example"]}`
                }
                onChange={(e) => handleChange(e, "definition")}></textarea>
            </span>
            <span className={styles.example}>
              <textarea
                name="edit-example"
                value={exampleTmp}
                className={
                  !columnDisplay
                    ? `${styles.edit} ${styles["edit-example"]}`
                    : `${styles["edit-block"]} ${styles["edit-block-example"]}`
                }
                onChange={(e) => handleChange(e, "example")}></textarea>
            </span>
            <span className={styles.pos}>
              <select
                name="edit-pos"
                value={posTmp}
                className={!columnDisplay ? `${styles.edit}` : `${styles["edit-block"]}`}
                onChange={(e) => handleChange(e, "pos")}>
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
            </span>
            <span className={styles.gloss}>
              <select
                name="edit-gloss"
                value={glossTmp}
                className={!columnDisplay ? `${styles.edit}` : `${styles["edit-block"]}`}
                onChange={(e) => handleChange(e, "gloss")}>
                {renderGlossOptions("edit")}
              </select>
            </span>
          </div>
          {errorMessage === "" ? null : <ErrorMessage message={errorMessage} />}
        </div>
      ) : columnDisplay ? (
        <span className={styles["wrapper-content-block"]}>
          {
            <span>
              <b>{t("main.word")}</b>: {wordValue}
            </span>
          }

          {translationValue !== "" ? (
            <span>
              <br /> <b>{t("main.translation")}</b>: {translationValue}
            </span>
          ) : null}

          {definitionValue !== "" ? (
            <span>
              <br />
              <b>{t("main.definition")}</b>: {definitionValue}
            </span>
          ) : null}

          {exampleValue !== "" ? (
            <span>
              <br />
              <b>{t("main.example")}</b>: {exampleValue}
            </span>
          ) : null}

          {translate !== "" ? (
            <span>
              <br /> <b>{t("main.pos")}</b>: {translate}
            </span>
          ) : null}

          {glossValue !== "" ? (
            <span>
              <br />
              <b>{t("main.gloss")}</b>: {glossValue}
            </span>
          ) : null}
        </span>
      ) : (
        <div className={styles["wrapper-content"]}>
          <span className={styles.word}>{wordValue}</span>
          <span className={styles.translation}>{translationValue}</span>
          <span className={styles.definition}>{definitionValue}</span>
          <span className={styles.example}>{exampleValue}</span>
          <span className={styles.pos}>{translate}</span>
          <span className={styles.gloss}>{glossValue}</span>
        </div>
      )}
    </li>
  );
};

export default Word;
