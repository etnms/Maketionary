import React from "react";
import styles from "./TopNav.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TopNav = () => {
  const token = localStorage.getItem("token");
  const projectID = localStorage.getItem("project");
  const navigate = useNavigate();
  const displayDropdown = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
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
        const fileName = "file";
        const json = JSON.stringify(res.data);
        const blob = new Blob([json], { type: "application/json" });
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

  return (
    <nav className={styles.nav}>
      <div className={styles["wrapper-nav"]}>
        <span className={styles.dropdown} onClick={(e) => displayDropdown(e)}>
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
        <span className={styles.dropdown} onClick={(e) => displayDropdown(e)}>
          <span>Export</span>
          <div className={styles["dropdown-content"]}>
            <button className={styles["nav-btn"]} onClick={() => downloadJSON()}>
              Export as JSON
            </button>
            <button className={styles["nav-btn"]}>Export as RTF</button>
          </div>
        </span>
        <span className={styles.dropdown} onClick={(e) => displayDropdown(e)}>
          <span>Settings</span>
          <div className={styles["dropdown-content"]}>
            <button className={styles["nav-btn"]}>xx</button>
            <button className={styles["nav-btn"]}>yy</button>
          </div>
        </span>
      </div>
      <div className={styles["wrapper-user"]}>
        <span>Current project: xxxx</span>
        <span>Welcome, user</span>
        <button className={styles["btn-logout"]}>Sign out</button>
      </div>
    </nav>
  );
};

export default TopNav;
