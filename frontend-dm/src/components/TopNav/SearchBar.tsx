import { useAppDispatch } from "../../app/hooks";
import { setSearchInput, setSearchTypeFilter } from "../../features/searchSlice";
import styles from "./SearchBar.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { RefObject, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dispatch } from "redux";

const SearchBar = () => {
  const dispatch: Dispatch<any> = useAppDispatch();
  const { t } = useTranslation();

  const searchItems = (searchValue: string) => {
    dispatch(setSearchInput(searchValue));
  };

  // Get ref of the input element
  const ref: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  // useEffect to add focus styles on select
  useEffect(() => {
    // Get the searchbar
    const searchBar: Element | null = document.querySelector(`.${styles["wrapper-search"]}`);
    // If user click on the search bar display the focus style, otherwise remove it
    const checkIfClickedOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) searchBar?.classList.remove(`${styles.focus}`);
      else searchBar?.classList.add(`${styles.focus}`);
    };
    // Add listener
    document.addEventListener("mousedown", checkIfClickedOutside);
    // Cleanup the event listener
    return () => document.removeEventListener("mousedown", checkIfClickedOutside);
  });

  const displayDropdown = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent> | React.KeyboardEvent<HTMLSpanElement>
  ) => {

    // Get all elements that previously had the display dropdown class
    const displayDropdownEls: Element | null = document.querySelector(`.${styles["display-dropdown"]}`);
    displayDropdownEls?.classList.remove(`${styles["display-dropdown"]}`);
    const children: HTMLCollection = e.currentTarget.children;
    children[1]!.classList.toggle(`${styles["display-dropdown"]}`);

    // Remove previous classes. Needs to be put after the toggle as the elements were previously selected
    // This allows for the click different menu/click same menu to close previous menus
    if (displayDropdownEls) {
      displayDropdownEls?.classList.remove(`${styles["display-dropdown"]}`);
    }
  };

  const chooseFilterOption = (value: string) => {
    dispatch(setSearchTypeFilter(value))
  }

  return (
    <div className={styles["wrapper-search"]}>
      <input
        name="search-bar"
        className={styles["search-bar"]}
        onChange={(e) => searchItems(e.target.value)}
        placeholder={`${t("nav.search")}`}
        aria-label={t("ariaLabels.searchBar")}
        ref={ref}
      />
      {/*<SearchIcon className={styles["search-icon"]} />*/}
      <span tabIndex={0} className={styles.dropdown} onClick={(e) => displayDropdown(e)}>
        <SearchIcon className={styles["search-icon"]} />
        <div className={styles["dropdown-content"]}>
          <span className={styles["title-filter"]}>{t("nav.filterBy")}</span>
          <button className={styles["nav-btn"]} onClick={() => chooseFilterOption("word")}>{t("main.word")}</button>
          <button className={styles["nav-btn"]} onClick={() => chooseFilterOption("translation")}>{t("main.translation")}</button>
          <button className={styles["nav-btn"]} onClick={() => chooseFilterOption("definition")}>{t("main.definition")}</button>
          <button className={styles["nav-btn"]} onClick={() => chooseFilterOption("example")}>{t("main.example")}</button>
          <button className={styles["nav-btn"]} onClick={() => chooseFilterOption("pos")}>{t("main.pos")}</button>
          <button className={styles["nav-btn"]} onClick={() => chooseFilterOption("gloss")}>{t("main.gloss")}</button>
        </div>
      </span>
    </div>
  );
};

export default SearchBar;
