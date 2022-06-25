import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { Dispatch, useState } from "react";
import styles from "../styles/OpenProject.module.css";
import { IProjectItem } from "../interfaces/interfaceProjectItem";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import confirmDeleteStyle from "./ConfirmDelete.module.css";
import { setProjectID, setProjectName } from "../features/projectItemSlice";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router-dom";

const ProjectItem = (props: React.PropsWithChildren<IProjectItem>) => {
  const { _id, name } = props;

  const token: string | null = localStorage.getItem("token");

  const [projectValue, setProjectValue] = useState<string>(name);
  const [edit, setEdit] = useState<boolean>(false);

  const stateID: string = useAppSelector((state) => state.projectItem.projectID);

  const dispatch: Dispatch<any> = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const {t} = useTranslation();

  const updateProjectName = () => {
    const newName: string = (document.querySelector("input[name='edit-project']") as HTMLInputElement).value;
    axios
      .put(
        `${process.env.REACT_APP_BACKEND}/api/language`,
        { newName, _id },
        { headers: { Authorization: token! } }
      )
      .then(() => {
        setEdit(false);
        localStorage.setItem("projectName", newName);
      })
      .catch((err) => {
        setEdit(false);
        if (err.response.status === 403) return navigate("/expired")
      });
  };

  const openConfirmDelete = () => {
    // Display the confirmation menu to delete a project
    const confirmWindow: Element | null = document.querySelector("[data-confirm-delete='window']");
    confirmWindow?.classList.add(`${confirmDeleteStyle.show}`);
  };

  const selectProject = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent<HTMLLIElement>,
    _id: string,
    name: string
  ) => {
    const el: EventTarget & HTMLLIElement = e.currentTarget;
    // Select previous selected element to remove style
    const previousEl: Element | null = document.querySelector(`.${styles["selected-project"]}`);
    previousEl?.classList.remove(`${styles["selected-project"]}`);
    // Add selected style to item
    el.classList.add(`${styles["selected-project"]}`);
    setEdit(false);
    dispatch(setProjectID(_id));
    dispatch(setProjectName(name));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLLIElement>, _id: string, name: string) => {
    if (e.key === "Enter") selectProject(e, _id, name);
  };

  const allowEditMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    setEdit(true)
  }

  return (
    <li
      className={styles["language-li"]}
      onClick={(e) => selectProject(e, _id, name)}
      onKeyDown={(e) => handleKeyPress(e, _id, name)}
      tabIndex={0}>
      {edit && stateID === _id? (
        <input
          name="edit-project"
          value={projectValue}
          className={styles["input-project"]}
          onChange={(e) => setProjectValue((e.currentTarget as HTMLInputElement).value)}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        `${projectValue}`
      )}
      {stateID === _id ? (
        <span className={styles["wrapper-edit-btns"]}>
          {edit ? (
            <button onClick={updateProjectName} className={styles["edit-btn"]} aria-label={t("ariaLabels.editConfirm")}>
              <CheckCircleIcon />
            </button>
          ) : (
            <button className={styles["edit-btn"]} onClick={(e) => allowEditMode(e)} aria-label={t("ariaLabels.edit")}>
              <EditIcon />
            </button>
          )}
          <button onClick={openConfirmDelete} className={styles["delete-btn"]} aria-label={t("ariaLabels.delete")}>
            <DeleteIcon />
          </button>
        </span>
      ) : null}
    </li>
  );
};

export default ProjectItem;
