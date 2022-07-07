import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Dispatch } from "redux";
import { useAppDispatch } from "../../app/hooks";
import { setErrorDownload, setIsFileDownloading } from "../../features/downloadFileSlice";
import adapter from "../../helpers/axiosAdapter";
import { IWordDb } from "../../interfaces/interfaceWord";
import styles from "./TopNavMenu.module.css";

const TopNavMenu = () => {
  const token: string | null = localStorage.getItem("token");
  const projectID: string | null = localStorage.getItem("project");
  const projectName: string | null = localStorage.getItem("projectName");

  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch<any> = useAppDispatch();
  const { t } = useTranslation();

  // Value to know if user clicked on element of the menu
  const [isMenuItemSelected, setIsMenuItemSelected] = useState<boolean>(false);

  const displayDropdown = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent> | React.KeyboardEvent<HTMLSpanElement>
  ) => {
    // Click decides if user clicked to have the menu elements or if the menu has to hide them
    setIsMenuItemSelected(prev => !prev);

    // Get all elements that previously had the display dropdown class
    const displayDropdownEls: Element | null = document.querySelector(`.${styles["display-dropdown"]}`);
    displayDropdownEls?.classList.remove(`${styles["display-dropdown"]}`);
    const children: HTMLCollection = e.currentTarget.children;
    children[1]!.classList.toggle(`${styles["display-dropdown"]}`);

    // Remove previous classes. Needs to be put after the toggle as the elements were previously selected
    // This allows for the click different menu/click same menu to close previous menus
    if (displayDropdownEls) {
      displayDropdownEls?.classList.remove(`${styles["display-dropdown"]}`);
    }
  };

  // useEffect for navigation UI
  useEffect(() => {
    const dropdowns= document.querySelectorAll(`.${styles.dropdown}`);

    const displayMenuHover = (node: Element) => {
      // Get all dropdown elements
      const displayDropdownEls: NodeListOf<Element> = document.querySelectorAll(`.${styles["display-dropdown"]}`);
      // If list is empty then return
      // This avoids hover effect to appear when menu is supposed to be closed
      if (displayDropdownEls.length === 0) return;
 
      // Remove all the dropdowns that are visible
      displayDropdownEls.forEach((el) => el?.classList.remove(`${styles["display-dropdown"]}`));
      // Get the elements (children) of the current dropdown
      const children: HTMLCollection = node.children;
      // Show the elements
      children[1]!.classList.add(`${styles["display-dropdown"]}`);
    };

    const hide = () => {
      // Get the elements and hide each one of them one by one
      // Getting the element is a duplicate but necessary to have individual hide/show of each dropdown
      const displayDropdownEls: NodeListOf<Element> = document.querySelectorAll(`.${styles["display-dropdown"]}`);
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

  const downloadFile = (
    token: string,
    projectID: string,
    projectName: string,
    format: string,
    responseType: any,
    type: string
  ) => {
    // Display window while file is being prepared
    dispatch(setIsFileDownloading(true));
    navigate("download");
    const lang: string = localStorage.getItem("i18nextLng") || "en"
    adapter({
      method: "get",
      url: `/download/${format}`,
      params: { projectID, lang },
      responseType, //blob or json
    })
      .then((res) => {
        const fileName: string = projectName;
        let blob;
        if (format === "json") {
          // Sort data
          const sortedData: any = res.data.results.words.sort((a: IWordDb, b: IWordDb) =>
            a.word > b.word ? 1 : a.word === b.word ? 0 : -1
          );
          // Stringify
          const json: string = JSON.stringify(sortedData);
          blob = new Blob([json], { type }); //text/plain
        } else blob = new Blob([res.data], { type }); //text/plain

        const href: string = URL.createObjectURL(blob);
        const link: HTMLAnchorElement = document.createElement("a");
        link.href = href;
        link.download = `${fileName}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        dispatch(setIsFileDownloading(false));
        // Close window after download
        navigate("/dashboard");
      })
      .catch((err) => {
        dispatch(setErrorDownload(true));
      });
  };

  return (
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
            onClick={() =>
              downloadFile(token!, projectID!, projectName!, "json", "json", "application/json")
            }>
            {t("nav.exportJson")}
          </button>
          <button
            className={styles["nav-btn"]}
            onClick={() => downloadFile(token!, projectID!, projectName!, "xml", "blob", "text/plain")}>
            {t("nav.exportXml")}
          </button>
          <button
            className={styles["nav-btn"]}
            onClick={() => downloadFile(token!, projectID!, projectName!, "docx", "blob", "text/plain")}>
            {t("nav.exportDocx")}
          </button>
          <button
            className={styles["nav-btn"]}
            onClick={() => downloadFile(token!, projectID!, projectName!, "rtf", "blob", "text/plain")}>
            {t("nav.exportRtf")}
          </button>
          <button
            className={styles["nav-btn"]}
            onClick={() => downloadFile(token!, projectID!, projectName!, "pdf", "blob", "text/plain")}>
            {t("nav.exportPdf")}
          </button>
        </div>
      </span>
      <button onClick={() => navigate("settings")} className={styles["btn-settings"]}>
        {t("nav.settings")}
      </button>
    </div>
  );
};

export default TopNavMenu;
