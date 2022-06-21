import axios from "axios";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updateWordList } from "../features/arrayWordsSlice";
import { IWordDb } from "../interfaces/interfaceWord";
import FilterLetter from "./FilterLetter";
import styles from "./ListWords.module.css";
import filterStyle from "./FilterLetter.module.css";
import Loader from "./Loader";
import Word from "./Word";
import { Dispatch } from "redux";
import DisplayOptions from "./DisplayOptions";

const ListWords = () => {
  const token: string | null = localStorage.getItem("token");
  const projectID: string | null = localStorage.getItem("project");

  const { t } = useTranslation();
  const dispatch: Dispatch<any> = useAppDispatch();
  const [pending, startTransition] = useTransition();

  const [filteredResults, setFilteredResults] = useState<IWordDb[]>();

  const listWord: IWordDb[] = useAppSelector((state) => state.arrayWords.value);
  const searchInput: string = useAppSelector((state) => state.search.searchInput);
  // Search bar input and filtering
  const searchFilter: string = useAppSelector((state) => state.search.searchFilter);
  const searchTypeFilter: string = useAppSelector((state) => state.search.searchTypeFilter);
  // View without search filtering
  const displayTypeFilter: string = useAppSelector((state) => state.search.displayTypeFilter);
  const isDescendingFilter: boolean = useAppSelector((state) => state.search.isDescendingFilter);

  // sort array function to use in memo
  const createSortedArray = useCallback(
    (array: IWordDb[], typeFilter: string) => {
      if (isDescendingFilter)
        return array.sort((a: any, b: any) =>
          b[typeFilter] > a[typeFilter] ? 1 : b[typeFilter] === a[typeFilter] ? 0 : -1
        );
      else
        return array.sort((a: any, b: any) =>
          a[typeFilter] > b[typeFilter] ? 1 : a[typeFilter] === b[typeFilter] ? 0 : -1
        );
    },
    [isDescendingFilter]
  );

  // Get the actual sorted array
  const sortedArray: IWordDb[] = useMemo(
    () => createSortedArray([...listWord], displayTypeFilter),
    [listWord, displayTypeFilter, createSortedArray]
  );

  // Setting
  const columnDisplay: boolean = useAppSelector((state) => state.settings.inLineDisplay);
  // Rerender when change in the settings
  useEffect(() => {}, [columnDisplay]);

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
    if (searchFilter !== searchInput) {
      const prevActive: Element | null = document.querySelector(`.${filterStyle.active}`);
      prevActive?.classList.remove(filterStyle.active);
    }
    // If else statement solely for UI purposes depending on its size
    if (sortedArray.length < 100) {
      console.log(sortedArray)
      // Copy the sorted array to avoid reference issues & filter
      const filtered: IWordDb[] = [
        ...sortedArray.filter((word: any) => word[searchTypeFilter].startsWith(searchInput)),
      ];
      // Update filtered results to be displayed
      setFilteredResults(filtered);
    } else {
      startTransition(() => {
        const filtered: IWordDb[] = [
          ...sortedArray.filter((word: any) => word[searchTypeFilter].startsWith(searchInput)),
        ];
        setFilteredResults(filtered);
      });
    }
  }, [sortedArray, searchInput, searchFilter, searchTypeFilter]);

  const filterResults = () => {
    if (filteredResults === undefined) return;
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
      <div className={styles["info-menu"]}>
        <span>
          {t("main.numberEntries")}
          {listWord.length}
        </span>
        <DisplayOptions/>
      </div>
      <FilterLetter />
      <ul className={styles.list}>
        {!columnDisplay ? (
          <li className={`${styles.listitem} ${styles.titles}`} key={"titles"}>
            <span className={styles["wrapper-edit"]}></span>
            {/* Empty element to create space in the view but no need to edit titles*/}
            <div className={styles["wrapper-content"]}>
              <span className={styles.word}>{t("main.word")}</span>
              <span className={styles.translation}>{t("main.translation")}</span>
              <span className={styles.definition}>{t("main.definition")}</span>
              <span className={styles.example}>{t("main.example")}</span>
              <span className={styles.pos}>{t("main.pos")}</span>
              <span className={styles.gloss}>{t("main.gloss")}</span>
            </div>
          </li>
        ) : null}
        {pending ? (
          <div className={styles["wrapper-loader-main"]}>
            <Loader width={50} height={50} />
          </div>
        ) : (
          filterResults()
        )}
      </ul>
    </main>
  );
};

export default ListWords;
