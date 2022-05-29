import { useAppDispatch } from "../app/hooks";
import { setSearchInput } from "../features/searchSlice";
import styles from "./SearchBar.module.css";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef } from "react";

const SearchBar = () => {
  const dispatch = useAppDispatch();

  const searchItems = (searchValue: string) => {
    dispatch(setSearchInput(searchValue));
  };

  // Get ref of the input element
  const ref = useRef<HTMLInputElement>(null);
  // useEffect to add focus styles on select
  useEffect(() => {
    // Get the searchbar 
    const searchBar = document.querySelector(`.${styles["wrapper-search"]}`);
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
        placeholder="Search"
        aria-label="search-bar"
        ref={ref}
      />
      <SearchIcon className={styles["search-icon"]} />
    </div>
  );
};

export default SearchBar;
