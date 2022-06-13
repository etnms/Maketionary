import styles from "./TopNav.module.css";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "./SearchBar";
import { IWordDb } from "../interfaces/interfaceWord";
import { useTranslation } from "react-i18next";
import React from "react";

interface ITopNav {
  username: string;
}

const TopNav = (props: React.PropsWithChildren<ITopNav>) => {
  const { username  } = props;

  const navigate = useNavigate();
  const { t } = useTranslation();

  const token = localStorage.getItem("token");

  const projectID = localStorage.getItem("project");
  const projectName = localStorage.getItem("projectName");

  const displayDropdown = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent> | React.KeyboardEvent<HTMLSpanElement>
  ) => {
    // Get all elements that previously had the display dropdown class
    const displayDropdownEls = document.querySelector(`.${styles["display-dropdown"]}`);

    const children = e.currentTarget.children;
    children[1]!.classList.toggle(`${styles["display-dropdown"]}`);

    // Remove previous classes. Needs to be put after the toggle as the elements were previously selected
    // This allows for the click different menu/click same menu to close previous menus
    if (displayDropdownEls) {
      displayDropdownEls?.classList.remove(`${styles["display-dropdown"]}`);
    }
  };

  const downloadJSON = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND}/api/download/json`,
      headers: { Authorization: token! },
      params: { projectID },
    })
      .then((res) => {
        const fileName = projectName;
        // Sort data
        const sortedData = res.data.results.words.sort((a: IWordDb, b: IWordDb) =>
          a.word > b.word ? 1 : a.word === b.word ? 0 : -1
        );
        // Stringify
        const json = JSON.stringify(sortedData);
        const blob = new Blob([json], { type: "application/json" });
        // Create and click on anchor element to download the results
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = `${fileName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => console.log(err));
  };

  const downloadRTF = () => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND}/api/download/rtf`,
      headers: { Authorization: token! },
      params: { projectID },
    })
      .then((res) => {
        const fileName = projectName;
        const blob = new Blob([res.data], { type: "text/plain" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = `${fileName}.rtf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => console.log(err));
  };

  // For accessiblity, add press enter option on span element
  // The span element acts as a button since its children are already buttons
  const handleKeypress = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter") displayDropdown(e);
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
            <button className={styles["nav-btn"]} onClick={downloadJSON}>
              {t("nav.exportJson")}
            </button>
            <button className={styles["nav-btn"]} onClick={downloadRTF}>
              {t("nav.exportRtf")}
            </button>
          </div>
        </span>
        <button onClick={() => navigate("settings")} className={styles["btn-settings"]}>
          {t("nav.settings")}
        </button>
      </div>
      { // Display outlet for the settings after the button to follow a more natural order, especially accessibility and focus
      }
      <Outlet/>
      <SearchBar />

      <div className={styles["wrapper-user"]}>
        {projectID !== null ? ( // Display only is a project is open
          <span className={styles["current-project"]}>
            {t("nav.current")} <em>{projectName}</em>
          </span>
        ) : null}
        <span>
          {t("nav.welcome")}
          {username}
        </span>
        <button className={styles["btn-logout"]}>{t("nav.signout")}</button>
      </div>
    </nav>
  );
};

export default TopNav;
