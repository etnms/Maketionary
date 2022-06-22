import { useTranslation } from "react-i18next";
import { Dispatch } from "redux";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setDisplayTypeFilter, setIsDescendingFilter } from "../features/searchSlice";
import styles from "./DisplayOptions.module.css";
import Dropdown from "./Dropdown";

const DisplayOptions = () => {
  const dispatch: Dispatch<any> = useAppDispatch();
  const { t } = useTranslation();
  const isDescendingFilter: boolean = useAppSelector((state) => state.search.isDescendingFilter);
  const displayTypeFilter: string = useAppSelector((state) => state.search.displayTypeFilter);

  return (
    <span className={styles.filter}>
      <Dropdown
      buttonClass={`${styles["btn-filter"]}`}
        filteringFunction={setDisplayTypeFilter}
        searchFilter={"display-words"}
        dataDropdown={"dropdown-view"}
        buttonText={`${t("main.sortText")} ${t(`main.${displayTypeFilter}`)}`}
        titleFilter={null}
      />
      <button
        className={styles["btn-filter"]}
        onClick={() => dispatch(setIsDescendingFilter(!isDescendingFilter))}>
        Direction: {isDescendingFilter ? "Z \u279D A" : "A \u279D Z"}
      </button>
    </span>
  );
};

export default DisplayOptions;
