import React from "react";
import { useTranslation } from "react-i18next";
import { Dispatch } from "redux";
import { useAppDispatch } from "../app/hooks";
import styles from "./Dropdown.module.css";

interface IDropdown {
  filteringFunction: Function;
  searchFilter: string;
  dataDropdown: string;
  buttonText: any; // string or svg
  titleFilter: any;
  buttonClass: any;
}
const Dropdown = (props: React.PropsWithChildren<IDropdown>) => {
  const { t } = useTranslation();
  const dispatch: Dispatch<any> = useAppDispatch();
  const {  buttonClass, buttonText, dataDropdown, filteringFunction, searchFilter, titleFilter } = props;

  const displayDropdown = (e: React.MouseEvent<HTMLSpanElement, MouseEvent> | React.KeyboardEvent<HTMLSpanElement>) => {
    // preventDefault to avoid double firing with enter key
    e.preventDefault()
    // Get all elements that previously had the display dropdown class
    const displayDropdownEls: Element | null = document.querySelector(`[data-dropdown="${dataDropdown}"]`);
    displayDropdownEls?.classList.toggle(`${styles["display-dropdown"]}`);
  };

  const chooseFilterOption = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string) => {
    const prevEls: NodeListOf<Element> = document.querySelectorAll(`[data-filter="${searchFilter}"]`);
    prevEls.forEach((el) => el.classList.remove(`${styles.active}`));
    e.currentTarget.classList.add(`${styles.active}`);
    dispatch(filteringFunction(value));
  };

  const handleKeypress = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") displayDropdown(e); 
  };

  return (
    <span
      className={`${styles.dropdown} ${buttonClass === null? null : buttonClass}`}
      onClick={(e) => displayDropdown(e)}
      onKeyDown={(e) => handleKeypress(e)}
      tabIndex={0}>
      {buttonText}
      <div className={styles["dropdown-content"]} data-dropdown={dataDropdown}>
        {titleFilter}
        <button
          className={`${styles["nav-btn"]} ${styles.active}`}
          data-filter={searchFilter}
          onClick={(e) => chooseFilterOption(e, "word")}>
          {t("main.word")}
        </button>
        <button
          className={styles["nav-btn"]}
          data-filter={searchFilter}
          onClick={(e) => chooseFilterOption(e, "translation")}>
          {t("main.translation")}
        </button>
        <button
          className={styles["nav-btn"]}
          data-filter={searchFilter}
          onClick={(e) => chooseFilterOption(e, "definition")}>
          {t("main.definition")}
        </button>
        <button
          className={styles["nav-btn"]}
          data-filter={searchFilter}
          onClick={(e) => chooseFilterOption(e, "example")}>
          {t("main.example")}
        </button>
        <button
          className={styles["nav-btn"]}
          data-filter={searchFilter}
          onClick={(e) => chooseFilterOption(e, "pos")}>
          {t("main.pos")}
        </button>
        <button
          className={styles["nav-btn"]}
          data-filter={searchFilter}
          onClick={(e) => chooseFilterOption(e, "gloss")}>
          {t("main.gloss")}
        </button>
      </div>
    </span>
  );
};

export default Dropdown;
