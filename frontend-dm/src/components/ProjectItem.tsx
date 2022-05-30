import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React, { useState } from "react";
import styles from "../styles/OpenProject.module.css";
import { IProjectItem } from "../interfaces/interfaceProjectItem";

const ProjectItem = (props: React.PropsWithChildren<IProjectItem>) => {
  const { _id, name, setSelectedProject, setSelectedProjectName } = props;
  const token = localStorage.getItem("token");

  const [projectValue, setProjectValue] = useState<string>(name);
  const [edit, setEdit] = useState<boolean>(false);

  const updateProjectName = () => {
    const newName = (document.querySelector("input[name='edit-project']") as HTMLInputElement).value;
    axios
      .put(
        `${process.env.REACT_APP_BACKEND}/api/language`,
        { newName, _id },
        { headers: { Authorization: token! } }
      )
      .then((res) => {
        setEdit(false);
        localStorage.setItem("projectName", newName);
      })
      .catch((err) => {
        setEdit(false);
        console.log(err);
      });
  };

  const deleteProject = (_id: string) => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND}/api/language`, {
        data: { _id },
        headers: { Authorization: token! },
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const selectProject = (e: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent<HTMLLIElement>, _id: string, name: string) => {
    const el = e.currentTarget;
    // Select previous selected element to remove style
    const previousEl = document.querySelector(`.${styles["selected-project"]}`);
    previousEl?.classList.remove(`${styles["selected-project"]}`);
    // Add selected style to item
    el.classList.add(`${styles["selected-project"]}`);

    setSelectedProject(_id);
    setSelectedProjectName(name);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLLIElement>, _id: string, name: string) => {
    if (e.key === "Enter")selectProject(e, _id,name); 
  }

  return (
    <li className={styles["language-li"]} onClick={(e) => selectProject(e, _id, name)} onKeyDown={(e) => handleKeyPress(e, _id, name)} tabIndex={0} >
      {edit ? (
        <input
          name="edit-project"
          value={projectValue}
          className={styles["input-project"]}
          onChange={(e) => setProjectValue((e.currentTarget as HTMLInputElement).value)}
        />
      ) : (
        `${projectValue}`
      )}
      <span className={styles["wrapper-edit-btns"]} >
        {edit ? (
          <button onClick={updateProjectName} className={styles["edit-btn"]} aria-label="edit confirm button">
            <CheckCircleIcon />
          </button>
        ) : (
          <button className={styles["edit-btn"]} onClick={() => setEdit(true)} aria-label="edit button">
            <EditIcon />
          </button>
        )}
        <button
          onClick={() => deleteProject(_id)}
          className={styles["delete-btn"]}
          aria-label="delete confirm button">
          <DeleteIcon />
        </button>
      </span>
    </li>
  );
};

export default ProjectItem;
