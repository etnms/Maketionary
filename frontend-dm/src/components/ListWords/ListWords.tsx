import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateWordList } from "../../features/arrayWordsSlice";
import { IWordDb } from "../../interfaces/interfaceWord";
import FilterLetter from "./FilterLetter";
import styles from "./ListWords.module.css";
import filterStyle from "./FilterLetter.module.css";
import Loader from "../Loaders/Loader";
import Word from "./Word";
import { Dispatch } from "redux";
import DisplayOptions from "./DisplayOptions";
import adapter from "../../helpers/axiosAdapter";
import ListWordsNavigation from "./ListWordsNavigation";
import { io } from "socket.io-client";

const ListWords = () => {
  const projectID: string | null = localStorage.getItem("project");

  const { t } = useTranslation();
  const dispatch: Dispatch<any> = useAppDispatch();
  const [pending, startTransition] = useTransition();

  const [filteredResults, setFilteredResults] = useState<IWordDb[]>();

  const listWords: IWordDb[] = useAppSelector(
    (state) => state.arrayWords.value,
  );
  const searchInput: string = useAppSelector(
    (state) => state.search.searchInput,
  );
  // Search bar input and filtering
  const searchFilter: string = useAppSelector(
    (state) => state.search.searchFilter,
  );
  const searchTypeFilter: string = useAppSelector(
    (state) => state.search.searchTypeFilter,
  );
  // View without search filtering
  const displayTypeFilter: string = useAppSelector(
    (state) => state.search.displayTypeFilter,
  );
  const isDescendingFilter: boolean = useAppSelector(
    (state) => state.search.isDescendingFilter,
  );

  // Display pages and number of items per pages
  const [numberItemsPerPage, setNumberItemsPerPage] = useState<number>(
    parseInt(localStorage.getItem("nbItemPage")!) || 100,
  );
  // Selection of items in array
  const [selectionFirst, setSelectionFirst] = useState<number>(0);
  const [selectionSecond, setSelectionSecond] =
    useState<number>(numberItemsPerPage);
  // Length of current array to display
  const [lengthArrayFiltered, setLengthArrayFiltered] = useState<number>();

  // sort array function to use in memo
  const createSortedArray = useCallback(
    (array: IWordDb[], typeFilter: string) => {
      if (isDescendingFilter)
        return array.sort((a: any, b: any) =>
          b[typeFilter] > a[typeFilter]
            ? 1
            : b[typeFilter] === a[typeFilter]
              ? 0
              : -1,
        );
      else
        return array.sort((a: any, b: any) =>
          a[typeFilter] > b[typeFilter]
            ? 1
            : a[typeFilter] === b[typeFilter]
              ? 0
              : -1,
        );
    },
    [isDescendingFilter],
  );

  // Get the actual sorted array
  const sortedArray: IWordDb[] = useMemo(
    () => createSortedArray([...listWords], displayTypeFilter),
    [listWords, displayTypeFilter, createSortedArray],
  );

  // Setting
  const columnDisplay: boolean = useAppSelector(
    (state) => state.settings.inLineDisplay,
  );
  // Rerender when change in the settings

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_APP_ENDPOINT}`);
    socket.emit("join", localStorage.getItem("project")!);

    socket.on("msg", (msg: any) => {
      console.log(msg);
      dispatch(updateWordList([...listWords].concat(msg.args)));
    });

    socket.on("delete", (word: any) => {
      console.log(word);
      dispatch(
        updateWordList([
          ...listWords.filter((item: any) => item._id !== word.word._id),
        ]),
      );
    });

    socket.on("update", (word: any) => {
      console.log("updated", word);
      dispatch(
        updateWordList([
          ...listWords.map((item: any) => {
            if (item._id === word.word._id) {
              return {
                ...item,
                word: word.word.word,
                translation: word.word.translation,
                definition: word.word.definition,
                example: word.word.example,
                pos: word.word.pos,
                gloss: word.word.gloss,
              };
            } else return item;
          }),
        ]),
      );
    });

    return () => {
      socket.off("msg");
      socket.off("delete");
      socket.off("update");
    };
  }, [dispatch, listWords]);

  useEffect(() => {}, [columnDisplay]);

  useEffect(() => {
    adapter
      .get(`/word/${projectID}`)
      .then((res) => {
        dispatch(updateWordList(res.data.words));
      })
      .catch();
  }, [projectID, dispatch]);

  useEffect(() => {
    if (searchFilter !== searchInput) {
      const prevActive: Element | null = document.querySelector(
        `.${filterStyle.active}`,
      );
      prevActive?.classList.remove(filterStyle.active);
    }
    // If else statement solely for UI purposes depending on its size
    if (sortedArray.length < 100) {
      // Copy the sorted array to avoid reference issues & filter
      const filtered: IWordDb[] = [
        ...sortedArray.filter((word: any) =>
          word[searchTypeFilter].toLowerCase().startsWith(searchInput),
        ),
      ];
      const slicedArray = filtered.slice(selectionFirst, selectionSecond);
      setLengthArrayFiltered(filtered.length);
      // Update filtered results to be displayed
      setFilteredResults(slicedArray);
    } else {
      startTransition(() => {
        const filtered: IWordDb[] = [
          ...sortedArray.filter((word: any) =>
            word[searchTypeFilter].toLowerCase().startsWith(searchInput),
          ),
        ];
        const slicedArray = filtered.slice(selectionFirst, selectionSecond);
        setLengthArrayFiltered(filtered.length);
        setFilteredResults(slicedArray);
      });
    }
  }, [
    sortedArray,
    searchInput,
    searchFilter,
    searchTypeFilter,
    selectionFirst,
    selectionSecond,
  ]);

  const filterResults = () => {
    if (filteredResults === undefined) return;
    if (filteredResults.length === 0)
      return <p className={styles["no-result"]}>{t("main.noResult")}</p>;

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
        user={word.user}
      />
    ));
  };

  return (
    <main className={styles.main}>
      <div className={styles["info-menu"]}>
        <span>
          {t("main.numberEntries")}
          {listWords.length}
        </span>
        <DisplayOptions />
      </div>
      <FilterLetter />
      <ul className={styles.list}>
        {!columnDisplay ? (
          <li className={`${styles.listitem} ${styles.titles}`} key={"titles"}>
            <span className={styles["wrapper-edit"]}></span>
            {/* Empty element to create space in the view but no need to edit titles*/}
            <div className={styles["wrapper-content"]}>
              <span className={styles.word}>{t("main.word")}</span>
              <span className={styles.translation}>
                {t("main.translation")}
              </span>
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
      <ListWordsNavigation
        lengthArrayFiltered={lengthArrayFiltered!}
        numberItemsPerPage={numberItemsPerPage}
        setNumberItemsPerPage={setNumberItemsPerPage}
        setSelectionFirst={setSelectionFirst}
        setSelectionSecond={setSelectionSecond}
        filteredResults={filteredResults!}
      />
    </main>
  );
};

export default ListWords;
