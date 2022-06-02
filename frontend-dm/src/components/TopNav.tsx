import React from "react";
import styles from "./TopNav.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "./SearchBar";
import { IWordDb } from "../interfaces/interfaceWord";
import settingsStyles from "./Settings.module.css";
import { useAppSelector } from "../app/hooks";

interface ITopNav {
  username: string;
}

const TopNav = (props: React.PropsWithChildren<ITopNav>) => {
  const { username } = props;

  const token = useAppSelector(state => state.auth.token);
  const projectID = localStorage.getItem("project");
  const projectName = localStorage.getItem("projectName");

  const navigate = useNavigate();

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

  const openSettings = () => {
    // Get settings element and add css to display it
    const settings = document.querySelector("[data-settings='settings-menu']");
    settings?.classList.add(`${settingsStyles["show-settings"]}`);

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
          <span>File</span>
          <div className={styles["dropdown-content"]}>
            <button className={styles["nav-btn"]} onClick={() => navigate("/new-project")}>
              New project
            </button>
            <button className={styles["nav-btn"]} onClick={() => navigate("/open-project")}>
              Open project
            </button>
          </div>
        </span>
        <span
          tabIndex={0}
          className={styles.dropdown}
          onClick={(e) => displayDropdown(e)}
          onKeyDown={(e) => handleKeypress(e)}>
          <span>Export</span>
          <div className={styles["dropdown-content"]}>
            <button className={styles["nav-btn"]} onClick={downloadJSON}>
              Export as JSON
            </button>
            <button className={styles["nav-btn"]} onClick={downloadRTF}>
              Export as RTF
            </button>
          </div>
        </span>
        <button onClick={() => openSettings()} className={styles["btn-settings"]}>Settings</button>
      </div>
      <SearchBar />
     
      <div className={styles["wrapper-user"]}>
        <span>
          Current project: <span className={styles["current-project"]}>{projectName}</span>
        </span>
        <span>Welcome, {username}</span>
        <button className={styles["btn-logout"]}>Sign out</button>
      </div>
    </nav>
  );
};

export default TopNav;
