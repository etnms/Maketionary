import React from "react";
import { useTranslation } from "react-i18next";
import { Dispatch } from "redux";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setDisplayTypeFilter, setIsDescendingFilter } from "../features/searchSlice";
import styles from "./DisplayOptions.module.css";

const DisplayOptions = () => {
  const dispatch: Dispatch<any> = useAppDispatch();
  const { t } = useTranslation();
  const isDescendingFilter: boolean = useAppSelector((state) => state.search.isDescendingFilter);
  const displayDropdown = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent> | React.KeyboardEvent<HTMLSpanElement>
  ) => {
    // Get all elements that previously had the display dropdown class
    const displayDropdownEls: Element | null = document.querySelector(`.${styles["display-dropdown"]}`);
    displayDropdownEls?.classList.remove(`${styles["display-dropdown"]}`);
    const children: HTMLCollection = e.currentTarget.children;
    children[0]!.classList.toggle(`${styles["display-dropdown"]}`);

    // Remove previous classes. Needs to be put after the toggle as the elements were previously selected
    // This allows for the click different menu/click same menu to close previous menus
    if (displayDropdownEls) {
      displayDropdownEls?.classList.remove(`${styles["display-dropdown"]}`);
    }
  };

  const chooseDisplayOrder = (value: string) => {
    dispatch(setDisplayTypeFilter(value));
  };

  return (
    <span className={styles.filter}>
      <span className={`${styles["btn-filter"]} ${styles.dropdown}`}  onClick={(e) => displayDropdown(e)}>
        Sort by: word
        <div className={styles["dropdown-content"]}>
          <button className={styles["nav-btn"]} onClick={() => chooseDisplayOrder("word")}>
            {t("main.word")}
          </button>
          <button className={styles["nav-btn"]} onClick={() => chooseDisplayOrder("translation")}>
            {t("main.translation")}
          </button>
          <button className={styles["nav-btn"]} onClick={() => chooseDisplayOrder("definition")}>
            {t("main.definition")}
          </button>
          <button className={styles["nav-btn"]} onClick={() => chooseDisplayOrder("example")}>
            {t("main.example")}
          </button>
          <button className={styles["nav-btn"]} onClick={() => chooseDisplayOrder("pos")}>
            {t("main.pos")}
          </button>
          <button className={styles["nav-btn"]} onClick={() => chooseDisplayOrder("gloss")}>
            {t("main.gloss")}
          </button>
        </div>
      </span>
      <button
        className={styles["btn-filter"]}
        onClick={() => dispatch(setIsDescendingFilter(!isDescendingFilter))}>
        Direction: {isDescendingFilter ? "Z \u279D A" : "A \u279D Z"  }
      </button>
    </span>
  );
};

export default DisplayOptions;
