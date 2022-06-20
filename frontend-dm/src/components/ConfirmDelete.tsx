import axios from "axios";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../app/hooks";
import { IProjectItem } from "../interfaces/interfaceProjectItem";
import styles from "./ConfirmDelete.module.css";

interface IConfirmDelete {
  languageList: Array<IProjectItem>;
  setLanguageList: Function;
}

const ConfirmDelete = (props: React.PropsWithChildren<IConfirmDelete>) => {
  const { languageList, setLanguageList } = props;

  const {t} = useTranslation();
  const token: string | null = localStorage.getItem("token");

  const projectID: string = useAppSelector((state) => state.projectItem.projectID);
  const projectName: string = useAppSelector((state) => state.projectItem.projectName);

  const deleteProject = () => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND}/api/language`, {
        data: { _id: projectID },
        headers: { Authorization: token! },
      })
      .then(() => {
        closeWindow();
        //Update the list
        setLanguageList([...languageList.filter((item) => item._id !== projectID)]);
        if (projectID === localStorage.getItem("project")) {
          localStorage.removeItem("project");
          localStorage.removeItem("projectName");
        }
      })
      .catch((err) => console.log(err));
  };

  const closeWindow = () => {
    const confirmWindow: Element | null = document.querySelector("[data-confirm-delete='window']");
    confirmWindow?.classList.remove(`${styles.show}`);
  };

  return (
    <div className={styles.page} data-confirm-delete="window">
      <div className={styles.box}>
        <p>{t('projects.deleteConfirmText')}</p>
        <p className={styles["project-name"]}>{projectName}</p>
        <p>?</p>
        <span className={styles["wrapper-btns"]}>
          <button className={`${styles.btn} ${styles["btn-confirm"]}`} onClick={deleteProject}>
          {t('projects.yesBtn')}
          </button>
          <button className={styles.btn} onClick={closeWindow}>
          {t('projects.noBtn')}
          </button>
        </span>
        <button className={`${styles.btn} ${styles["btn-close"]}`} onClick={closeWindow}>
          X
        </button>
      </div>
    </div>
  );
};

export default ConfirmDelete;
