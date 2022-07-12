import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setSearchFilter, setSearchInput } from "../../features/searchSlice";
import letters from "../../data/letters.json";
import styles from "./FilterLetter.module.css";
import { Dispatch } from "redux";
import { useTranslation } from "react-i18next";

const FilterLetter = () => {
  const dispatch: Dispatch<any> = useAppDispatch();
  const {t} = useTranslation();
  const searchInput: string = useAppSelector((state) => state.search.searchInput);

  const filterByLetter = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, searchValue: string) => {
    const prevActive: Element | null = document.querySelector(`.${styles.active}`);
    e.currentTarget.classList.add(styles.active);
    prevActive?.classList.remove(styles.active);
    // if same letter resets
    if (searchValue === searchInput) {
      dispatch(setSearchInput(""));
      dispatch(setSearchFilter(""));
    } else {
      dispatch(setSearchInput(searchValue));
      dispatch(setSearchFilter(searchValue));
    }
  };

  const letterLinks = () => {
    return letters.letters.map((letter) => (
      <button
        key={`filter-letter-${letter}`}
        onClick={(e) => filterByLetter(e, letter)}
        className={styles.letter}>
        {letter}
      </button>
    ));
  };

  return (
    <div className={styles.list}>
      <span>{t("main.filterByLetter")}</span>
      <span>{letterLinks()}</span>
    </div>
  );
};

export default FilterLetter;
