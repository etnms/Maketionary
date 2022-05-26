import axios from "axios";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addWord, updateWord } from "../features/arrayWordsSlice";
import IWord from "../interfaces/interfaceWord";
import styles from "./ListWords.module.css";
import Word from "./Word";

const ListWords = () => {
  const token = localStorage.getItem("token");
  const projectID = localStorage.getItem("project");

  const listWord = useAppSelector(state => state.arrayWords.value)
  const dispatch = useAppDispatch()
  const [listWords, setListWords] = useState<Array<IWord>>([]);

  useEffect(() => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND}/api/word`,
      headers: { Authorization: token! },
      params: { projectID },
    })
      .then((res) => {
        dispatch(updateWord(res.data.results.words));
        //setListWords(res.data.results.words);
      })
      .catch((err) => console.log(err));
  }, [projectID, token, dispatch]);

  useEffect(() => {
    console.log("hey");
  }, [listWord])

  const displayWords = () => {
    return listWord.map((word: any) => (
      <Word key={word._id}
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
          <span className={styles["wrapper-edit"]}></span> {/* Empty element to create space in the view but no need to edit titles*/}
          <span className={styles.word}>Word</span>
          <span className={styles.translation}>Translation</span>
          <span className={styles.definition}>Definition</span>
          <span className={styles.example}>Example</span>
          <span className={styles.pos}>POS</span>
          <span className={styles.gloss}>Gloss</span>
        </li>
        {displayWords()}
      </ul>
    </main>
  );
};

export default ListWords;
