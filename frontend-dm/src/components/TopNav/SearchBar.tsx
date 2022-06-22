import { useAppDispatch } from "../../app/hooks";
import { setSearchInput, setSearchTypeFilter } from "../../features/searchSlice";
import styles from "./SearchBar.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { RefObject, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Dispatch } from "redux";
import Dropdown from "../Dropdown";

const SearchBar = () => {
  const dispatch: Dispatch<any> = useAppDispatch();
  const { t } = useTranslation();

  const searchItems = (searchValue: string) => {
    // update search value to lower case for easier filtering in ListWords.tsx
    dispatch(setSearchInput(searchValue.toLowerCase()));
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
      <Dropdown
      buttonClass={null}
        searchFilter="search"
        dataDropdown="dropdown-search"
        filteringFunction={setSearchTypeFilter}
        buttonText={<SearchIcon className={styles["search-icon"]} aria-label={t("ariaLabels.searchIcon")}/>} // string or svg
        titleFilter={<span className={styles["title-filter"]}>{t("nav.filterBy")}</span>}
      />
    </div>
  );
};

export default SearchBar;
