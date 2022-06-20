import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setSearchFilter, setSearchInput } from "../features/searchSlice";
import letters from "../data/letters.json";
import styles from "../components/FilterLetter.module.css";

const FilterLetter = () => {
  const dispatch = useAppDispatch();
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
      <span>Filter by letter:</span>
      <span>{letterLinks()}</span>
    </div>
  );
};

export default FilterLetter;
