import React, { useCallback, useState } from "react";
import styles from "./ListWordsNavigation.module.css";
import stylesFilter from "./FilterLetter.module.css";
import { IWordDb } from "../../interfaces/interfaceWord";

interface IWordPerPages {
  lengthArrayFiltered: number;
  numberItemsPerPage: number;
  setNumberItemsPerPage: Function;
  setSelectionFirst: Function;
  setSelectionSecond: Function;
  filteredResults: IWordDb[];
}

const ListWordsNavigation = (props: React.PropsWithChildren<IWordPerPages>) => {
  const {
    lengthArrayFiltered,
    numberItemsPerPage,
    setNumberItemsPerPage,
    setSelectionFirst,
    setSelectionSecond,
    filteredResults,
  } = props;

  const [activePage, setActivePage] = useState<number>(0);

  const numberPages = useCallback(() => {
    if (filteredResults === undefined) return;

    // Get the length of the array to display number of pages
    const number: number = Math.ceil(lengthArrayFiltered/ numberItemsPerPage);
    if (number === 0) return 1;
    return number;
  }, [filteredResults, numberItemsPerPage, lengthArrayFiltered]);

  const updateSelection = (selectedPage: number) => {
    setActivePage(selectedPage);
    setSelectionFirst(selectedPage * numberItemsPerPage);
    setSelectionSecond(selectedPage * numberItemsPerPage + numberItemsPerPage);
  };

  const updateNumberItemsPage = (value: number) => {
    // If page open is further than the next page change then update the selection accordingly
    let currentActivePage = activePage;
    if (lengthArrayFiltered / value < activePage) currentActivePage = Math.ceil(lengthArrayFiltered / value) - 1;
    setNumberItemsPerPage(value);
    localStorage.setItem("nbItemPage", value.toString());
    setSelectionFirst(currentActivePage * value);
    setSelectionSecond(currentActivePage * value + value);
  };

  const renderSelectPages = () => {
    return Array(numberPages())
      .fill(0)
      .map((item: any, i: number) => (
        <option value={i} key={"select" + i}>
          {i + 1}
        </option>
      ));
  };

  const pagesLinks = () => {
    const nbPages = numberPages();
    return Array(numberPages())
      .fill(0)
      .map((item: any, i: number) => {
        if (
          i === activePage ||
          i === activePage - 1 ||
          i === activePage + 1 ||
          (i === activePage + 2 && activePage === 0)
        )
          return (
            <button
              key={"pages" + i}
              className={`${i === activePage ? styles.active : null} ${stylesFilter.letter}`}
              onClick={() => updateSelection(i)}>
              {i + 1}
            </button>
          );
        if (activePage > nbPages!) {
          setActivePage(nbPages! - 1);
          return (
            <button
              key={"pages" + i}
              className={`${styles.active} ${stylesFilter.letter}`}
              onClick={() => updateSelection(i)}>
              {i + 1}
            </button>
          );
        } else return null;
      });
  };
  return (
    <>
      <span>
        Pages: {pagesLinks()}{" "}
        <button className={styles["btn-disabled"]} disabled>
          {"..."}
        </button>{" "}
        <span>Go to </span>
        <select
          className={styles["select-number-words"]}
          value={activePage}
          onChange={(e) => updateSelection(parseInt(e.currentTarget.value))}>
          {renderSelectPages()}
        </select>
      </span>
      <div className={styles["bottom-options"]}>
        Maximum number of words per pages:{" "}
        <select
          onChange={(e) => updateNumberItemsPage(parseInt(e.currentTarget.value))}
          defaultValue={parseInt(localStorage.getItem("nbItemPage")!) || 100}
          className={styles["select-number-words"]}>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </>
  );
};

export default ListWordsNavigation;
