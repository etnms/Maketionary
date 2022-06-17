import styles from "./TopNav.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { downloadDocx, downloadJSON, downloadRTF } from "../helpers/downloadFiles";
import { useAppSelector } from "../app/hooks";



const TopNav = () => {

  const navigate = useNavigate();
  
  const { t } = useTranslation();

  const token = localStorage.getItem("token");

  const projectID = localStorage.getItem("project");
  const projectName = localStorage.getItem("projectName");

  // Value to know if user clicked on element of the menu
  const [isMenuItemSelected, setIsMenuItemSelected] = useState<boolean>(false);

  const displayDropdown = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent> | React.KeyboardEvent<HTMLSpanElement>
  ) => {
    // Click decides if user clicked to have the menu elements or if the menu has to hide them
    setIsMenuItemSelected(!isMenuItemSelected);

    // Get all elements that previously had the display dropdown class
    const displayDropdownEls = document.querySelector(`.${styles["display-dropdown"]}`);
    displayDropdownEls?.classList.remove(`${styles["display-dropdown"]}`);
    const children = e.currentTarget.children;
    children[1]!.classList.toggle(`${styles["display-dropdown"]}`);

    // Remove previous classes. Needs to be put after the toggle as the elements were previously selected
    // This allows for the click different menu/click same menu to close previous menus
    if (displayDropdownEls) {
      displayDropdownEls?.classList.remove(`${styles["display-dropdown"]}`);
    }
  };

  useEffect(() => {

    const dropdowns = document.querySelectorAll(`.${styles.dropdown}`);

    const displayMenuHover = (node: Element) => {
      // Get all dropdown elements
      const displayDropdownEls = document.querySelectorAll(`.${styles["display-dropdown"]}`);
      // If list is empty then return
      // This avoids hover effect to appear when menu is supposed to be closed
      if (displayDropdownEls.length === 0) return
      // Remove all the dropdowns that are visible
      displayDropdownEls.forEach((el) => el?.classList.remove(`${styles["display-dropdown"]}`));
      // Get the elements (children) of the current dropdown 
      const children = node.children;
      // Show the elements
      children[1]!.classList.add(`${styles["display-dropdown"]}`);
    };

    const hide = () => {
      // Get the elements and hide each one of them one by one
      // Getting the element is a duplicate but necessary to have individual hide/show of each dropdown
      const displayDropdownEls = document.querySelectorAll(`.${styles["display-dropdown"]}`);
      displayDropdownEls.forEach((el) => el?.classList.remove(`${styles["display-dropdown"]}`));
    };

    // If menu selected then each element can display menu on hover
    if (isMenuItemSelected) {
      dropdowns.forEach((node) => {
        node.addEventListener("mouseover", () => displayMenuHover(node));
      });
    }
    // If no item of the menu is selected then hide the dropdown elements
    if (!isMenuItemSelected) {
      dropdowns.forEach((node) => {
        node.addEventListener("mouseout", hide);
      });
    }
    // Cleanup
    return () => {
      dropdowns.forEach((node) => {
        node.removeEventListener("mouseover", () => displayMenuHover(node));
        node.removeEventListener("mouseout", hide);
      });
    };
  }, [isMenuItemSelected]);

  // For accessiblity, add press enter option on span element
  // The span element acts as a button since its children are already buttons
  const handleKeypress = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") displayDropdown(e);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className={styles.nav}>
      <div className={styles["wrapper-nav"]}>
        <span
          tabIndex={0}
          className={styles.dropdown}
          onClick={(e) => displayDropdown(e)}
          onKeyDown={(e) => handleKeypress(e)}>
          <span>{t("nav.file")}</span>
          <div className={styles["dropdown-content"]}>
            <button className={styles["nav-btn"]} onClick={() => navigate("/new-project")}>
              {t("nav.newProject")}
            </button>
            <button className={styles["nav-btn"]} onClick={() => navigate("/open-project")}>
              {t("nav.openProject")}
            </button>
          </div>
        </span>
        <span
          tabIndex={0}
          className={styles.dropdown}
          onClick={(e) => displayDropdown(e)}
          onKeyDown={(e) => handleKeypress(e)}>
          <span>{t("nav.export")}</span>
          <div className={styles["dropdown-content"]}>
            <button
              className={styles["nav-btn"]}
              onClick={() => downloadJSON(token!, projectID!, projectName!)}>
              {t("nav.exportJson")}
            </button>
            <button
              className={styles["nav-btn"]}
              onClick={() => downloadDocx(token!, projectID!, projectName!)}>
              download docx
            </button>
            <button
              className={styles["nav-btn"]}
              onClick={() => downloadRTF(token!, projectID!, projectName!)}>
              {t("nav.exportRtf")}
            </button>
          </div>
        </span>
        <button onClick={() => navigate("settings")} className={styles["btn-settings"]}>
          {t("nav.settings")}
        </button>
      </div>
      {
        // Display outlet for the settings after the button to follow a more natural order, especially accessibility and focus
      }
      <Outlet />
      <SearchBar />

      <div className={styles["wrapper-user"]}>
        {projectID !== null ? ( // Display only is a project is open
          <span className={styles["current-project"]}>
            {t("nav.current")} <em>{projectName}</em>
          </span>
        ) : null}
        <span>
          {t("nav.welcome")}
          {useAppSelector(state => state.auth.username)}
        </span>
        <button className={styles["btn-logout"]} onClick={logout}>
          {t("nav.signout")}
        </button>
      </div>
    </nav>
  );
};

export default TopNav;
