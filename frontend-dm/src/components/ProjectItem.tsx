import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { Dispatch, useRef, useState } from "react";
import styles from "../styles/OpenProject.module.css";
import { IProjectItem } from "../interfaces/interfaceProjectItem";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import confirmDeleteStyle from "./ConfirmDelete.module.css";
import { setProjectGuests, setProjectID, setProjectName, setProjectOwner } from "../features/projectItemSlice";
import { useTranslation } from "react-i18next";
import { NavigateFunction, useNavigate } from "react-router-dom";
import adapter from "../helpers/axiosAdapter";
import ShareIcon from "@mui/icons-material/Share";
import InfoIcon from '@mui/icons-material/Info';

const ProjectItem = (props: React.PropsWithChildren<IProjectItem>) => {
  const { _id, user, guestUser, owner, name, setErrorMessage } = props;

  const [projectValue, setProjectValue] = useState<string>(name);

  const [edit, setEdit] = useState<boolean>(false);

  const stateID: string = useAppSelector((state) => state.projectItem.projectID);

  const dispatch: Dispatch<any> = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const resetValue = useRef(name);
  const { t } = useTranslation();

  const updateProjectName = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const newName: string = (document.querySelector("input[name='edit-project']") as HTMLInputElement).value;
    adapter
      .put(`/language/${_id}`, { newName })
      .then(() => {
        resetValue.current = newName;
        setEdit(false);
        localStorage.setItem("projectName", newName);
        setProjectValue(newName);
        setErrorMessage("");
      })
      .catch((err) => {
        if (err.response.data === "Name too long") setErrorMessage(t("errorMessages.errorNameTooLong"));
        if (err.response.status === 401) return navigate("/expired");
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
    setErrorMessage("");
    setProjectValue(resetValue.current);
    const el: EventTarget & HTMLLIElement = e.currentTarget;
    // Select previous selected element to remove style
    const previousEl: Element | null = document.querySelector(`.${styles["selected-project"]}`);
    previousEl?.classList.remove(`${styles["selected-project"]}`);
    // Add selected style to item
    el.classList.add(`${styles["selected-project"]}`);
    setEdit(false);
    dispatch(setProjectID(_id));
    dispatch(setProjectName(name));
    dispatch(setProjectOwner(user));
    dispatch(setProjectGuests(guestUser));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLLIElement>, _id: string, name: string) => {
    if (e.key === "Enter") selectProject(e, _id, name);
  };

  const allowEditMode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setEdit(true);
  };

  return (
    <li
      className={styles["language-li"]}
      onClick={(e) => selectProject(e, _id, projectValue)}
      onKeyDown={(e) => handleKeyPress(e, _id, projectValue)}
      tabIndex={0}>
      {edit && stateID === _id ? (
        <input
          name="edit-project"
          value={projectValue}
          className={styles["input-project"]}
          onChange={(e) => setProjectValue(e.currentTarget.value)}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        `${projectValue}`
      )}
      {stateID === _id? <button className={styles["info-btn"]} onClick={() => navigate("project-info")}><InfoIcon/></button> : null}
      {stateID === _id && owner ? (
        <span className={styles["wrapper-edit-btns"]}>
          {edit ? (
            <button
              onClick={updateProjectName}
              className={styles["edit-btn"]}
              aria-label={t("ariaLabels.editConfirm")}>
              <CheckCircleIcon />
            </button>
          ) : (
            <button
              className={styles["edit-btn"]}
              onClick={(e) => allowEditMode(e)}
              aria-label={t("ariaLabels.edit")}>
              <EditIcon />
            </button>
          )}
          <button
            onClick={openConfirmDelete}
            className={styles["delete-btn"]}
            aria-label={t("ariaLabels.delete")}>
            <DeleteIcon />
          </button>
          <button
            className={styles["edit-btn"]}
            onClick={() => navigate("share-project")}
            aria-label={t("ariaLabels.share")}>
            <ShareIcon />
          </button>
        </span>
      ) : null}
    </li>
  );
};

export default ProjectItem;
