import React, { useEffect, useRef, useState } from "react";
import IWord, { IWordDb } from "../../interfaces/interfaceWord";
import styles from "./ListWords.module.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { renderGlossOptions } from "../../helpers/renderSelect";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectWordEdit, setEditMode } from "../../features/editModeSlice";
import { updateWordList } from "../../features/arrayWordsSlice";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../ErrorMessage";
import useTranslateSelect from "../../helpers/useTranslateSelect";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Loader from "../Loaders/Loader";
import adapter from "../../helpers/axiosAdapter";
import CancelIcon from "@mui/icons-material/Cancel";

const Word = (props: React.PropsWithChildren<IWord>) => {
  const { _id, word, translation, definition, example, pos, gloss } = props;

  const navigate: NavigateFunction = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  // Setting
  const columnDisplay: boolean = useAppSelector((state) => state.settings.inLineDisplay);
  // Rerender when change in the settings
  useEffect(() => {
  }, [columnDisplay]);

  const listWord: IWordDb[] = useAppSelector((state) => state.arrayWords.value);
  // Using global state to determine the status of the edit mode
  // But also checking which word is currently select to show only one edit at a time (for current word)
  const editMode: boolean = useAppSelector((state) => state.editMode.value);
  const wordToEdit: string = useAppSelector((state) => state.editMode.wordToEdit);

  const [wordObject, setWordObject] = useState<IWord>({
    word,
    translation,
    definition,
    example,
    pos,
    gloss,
    _id,
  });

  const resetValue = useRef(wordObject);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectLine = (
    e:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.KeyboardEvent<HTMLLIElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
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
    setIsLoading(true);
    adapter
      .delete(`/word/${_id}`)
      .then(() => {
        // Filter list to remove deleted item
        const updatedList: IWordDb[] = listWord.filter((word: IWord) => word._id !== _id);
        // Update the list for new render
        dispatch(updateWordList(updatedList));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) return navigate("/expired");
        setErrorMessage(t("errorMessages.errorEditWord"));
      });
  };

  const activateEditMode = () => {
    setErrorMessage("");
    dispatch(setEditMode(true));
  };

  const updateWord = () => {
    setIsLoading(true);
    // Updating a word function
    // This function does not uppercase/lowercase entries as opposed to the create word one
    // This is for the simple purpose of letting users change entries as they wish for scenarios where casing can be an issue
    const word: string = (document.querySelector("input[name='edit-word']") as HTMLInputElement).value;
    const translation: string = (document.querySelector("input[name='edit-translation']") as HTMLInputElement)
      .value;
    const definition: string = (
      document.querySelector("textarea[name='edit-definition']") as HTMLTextAreaElement
    ).value;
    const example: string = (document.querySelector("textarea[name='edit-example']") as HTMLTextAreaElement)
      .value;
    const pos: string = (document.querySelector("select[name='edit-pos']") as HTMLSelectElement).value;
    const gloss: string = (document.querySelector("select[name='edit-gloss']") as HTMLSelectElement).value;

    adapter
      .put(`/word/${_id}`, { word, translation, definition, example, pos, gloss })
      .then(() => {
        resetValue.current.word = word;
        resetValue.current.definition = translation;
        resetValue.current.translation = definition;
        resetValue.current.example = example;
        resetValue.current.gloss = gloss;
        resetValue.current.pos = pos;
        dispatch(setEditMode(false));
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 403) return navigate("/expired");
        setErrorMessage(t("errorMessages.errorEditWord"));
      });
  };

  // Hangle the change of each tmp value: allows to see changes directly
  const handleChange = (e: React.ChangeEvent<HTMLElement>, elementName: string) => {
    switch (elementName) {
      case "word":
        setWordObject((prev: IWord) => ({ ...prev, word: (e.target as HTMLInputElement).value }));
        break;
      case "translation":
        setWordObject((prev: IWord) => ({ ...prev, translation: (e.target as HTMLInputElement).value }));
        break;
      case "definition":
        setWordObject((prev: IWord) => ({ ...prev, definition: (e.target as HTMLTextAreaElement).value }));
        break;
      case "example":
        setWordObject((prev: IWord) => ({ ...prev, example: (e.target as HTMLTextAreaElement).value }));
        break;
      case "pos":
        setWordObject((prev: IWord) => ({ ...prev, pos: (e.target as HTMLSelectElement).value }));
        break;
      case "gloss":
        setWordObject((prev: IWord) => ({ ...prev, gloss: (e.target as HTMLSelectElement).value }));
        break;
      default:
        return;
    }
  };

  const cancelChange = () => {
    setWordObject(resetValue.current);
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === "Enter") selectLine(e);
  };

  const renderBlockDisplay = (value: string, text: string) => {
    if (value !== "")
      return (
        <span>
          <br /> <b>{t(`main.${text}`)}</b>: {value}
        </span>
      );
    else return null;
  };

  const translate = useTranslateSelect(wordObject.pos);
  // Render list element
  return (
    <li
      className={styles.listitem}
      onDoubleClick={(e) => selectLine(e)}
      tabIndex={0}
      onKeyDown={(e) => handleKeypress(e)}>
      <div className={styles["wrapper-edit"]}>
        <div className={styles["wrapper-btns"]}>
          {isLoading ? (
            <Loader width={24} height={24} />
          ) : (
            <>
              <button
                className={`${styles["btn"]} ${styles["btn-delete"]}`}
                onClick={deleteWord}
                aria-label={t("ariaLabels.delete")}>
                <DeleteIcon />
              </button>
              {editMode ? (
                <button
                  className={styles["btn"]}
                  onClick={updateWord}
                  aria-label={t("ariaLabels.editConfirm")}>
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
              <button
                className={styles["btn"]}
                onClick={(e) => selectLine(e)}
                aria-label={t("ariaLabels.edit")}>
                <CancelIcon />
              </button>
            </>
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
                value={wordObject.word}
                className={!columnDisplay ? `${styles.edit}` : `${styles["edit-block"]}`}
                onChange={(e) => handleChange(e, "word")}
              />
            </span>
            <span className={styles.translation}>
              <input
                name="edit-translation"
                value={wordObject.translation}
                className={!columnDisplay ? `${styles.edit}` : `${styles["edit-block"]}`}
                onChange={(e) => handleChange(e, "translation")}
              />
            </span>
            <span className={styles.definition}>
              <textarea
                name="edit-definition"
                value={wordObject.definition}
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
                value={wordObject.example}
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
                value={wordObject.pos}
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
                value={wordObject.gloss}
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
              <b>{t("main.word")}</b>: {wordObject.word}
            </span>
          }
          {renderBlockDisplay(wordObject.translation, "translation")}
          {renderBlockDisplay(wordObject.definition, "definition")}
          {renderBlockDisplay(wordObject.example, "example")}
          {renderBlockDisplay(wordObject.pos, "pos")}
          {renderBlockDisplay(wordObject.gloss, "gloss")}
        </span>
      ) : (
        <div className={styles["wrapper-content"]}>
          <span className={styles.word}>{wordObject.word}</span>
          <span className={styles.translation}>{wordObject.translation}</span>
          <span className={styles.definition}>{wordObject.definition}</span>
          <span className={styles.example}>{wordObject.example}</span>
          <span className={styles.pos}>{translate}</span>
          <span className={styles.gloss}>{wordObject.gloss}</span>
        </div>
      )}
    </li>
  );
};

export default Word;
