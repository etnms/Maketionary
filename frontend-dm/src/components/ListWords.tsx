import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateWordList } from "../features/arrayWordsSlice";
import { IWordDb } from "../interfaces/interfaceWord";
import styles from "./ListWords.module.css";
import Word from "./Word";

const ListWords = () => {
  
  const token = localStorage.getItem("token");
  const projectID = localStorage.getItem("project");

  const {t} = useTranslation();

  const [filteredResults, setFilteredResults] = useState<IWordDb[]>();

  const listWord = useAppSelector((state) => state.arrayWords.value);
  const searchInput = useAppSelector((state) => state.search.searchInput);

  // Sort array; first make copy to avoid reference issues
  // Memoize values
  const sortedArray = useMemo(() => [...listWord], [listWord]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND}/api/word`,
      headers: { Authorization: token! },
      params: { projectID },
    })
      .then((res) => {
        dispatch(updateWordList(res.data.results.words));
      })
      .catch((err) => console.log(err));
  }, [projectID, token, dispatch]);

  useEffect(() => {
    // Copy the sorted array to avoid reference issues & filter
    const filtered = [...sortedArray.filter((word: any) => word.word.startsWith(searchInput))];

    // Update filtered results to be displayed
    setFilteredResults(filtered);
  }, [sortedArray, searchInput]);

  const displayWords = () => {
    // Sort the array
    sortedArray.sort((a: IWordDb, b: IWordDb) => (a.word > b.word ? 1 : a.word === b.word ? 0 : -1));
    return sortedArray.map((word: IWordDb) => (
      <Word
        key={word._id}
        _id={word._id}
        word={word.word}
        translation={word.translation}
        definition={word.definition}
        example={word.example}
        pos={word.pos}
        gloss={word.gloss}
      />
    ));
  };

  const filterResults = () => {
    return filteredResults!.map((word: IWordDb) => (
      <Word
        key={word._id}
        _id={word._id}
        word={word.word}
        translation={word.translation}
        definition={word.definition}
        example={word.example}
        pos={word.pos}
        gloss={word.gloss}
      />
    ));
  };

  return (
    <main className={styles.main}>
      <ul className={styles.list}>
        <li className={`${styles.listitem} ${styles.titles}`} key={"titles"}>
          <span className={styles["wrapper-edit"]}></span>{" "}
          {/* Empty element to create space in the view but no need to edit titles*/}
          <div className={styles["wrapper-content"]}>
          <span className={styles.word}>{t('main.word')}</span>
          <span className={styles.translation}>{t('main.translation')}</span>
          <span className={styles.definition}>{t('main.definition')}</span>
          <span className={styles.example}>{t('main.example')}</span>
          <span className={styles.pos}>{t('main.pos')}</span>
          <span className={styles.gloss}>{t('main.gloss')}</span>
          </div>
        </li>
        {searchInput === "" ? displayWords() : filterResults()}
      </ul>
    </main>
  );
};

export default ListWords;
