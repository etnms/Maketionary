import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/OpenProject.module.css";
import buttons from "../styles/Buttons.module.css";
import ProjectItem from "../components/ProjectItem";
import { IProjectItem } from "../interfaces/interfaceProjectItem";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ConfirmDelete from "../components/ConfirmDelete";
import { setProjectID, setProjectName } from "../features/projectItemSlice";

const OpenProject = () => {
  const navigate = useNavigate();

  const token = useAppSelector((state) => state.auth.token);
  const [languageList, setLanguageList] = useState<IProjectItem[]>([]);

  const projectID = useAppSelector(state => state.projectItem.projectID);
  const projectName = useAppSelector(state => state.projectItem.projectName);

  const dispatch = useAppDispatch();
  useEffect(() => {
    document.title = "Maketionary - Open project";

    axios
      .get(`${process.env.REACT_APP_BACKEND}/api/language`, { headers: { Authorization: token! } })
      .then((res) => setLanguageList(res.data.results.languages))
      .catch((err) => console.log(err));
  }, [token]);

  const displayListProject = () => {
    return languageList.map((language) => (
      <ProjectItem
        key={language._id}
        _id={language._id}
        name={language.name}
      />
    ));
  };

  const openProject = (projectID: string, projectName: string) => {
    if (projectID === "") return; //error
    localStorage.setItem("project", projectID);
    localStorage.setItem("projectName", projectName);
    dispatch(setProjectName(""));
    dispatch(setProjectID(""));
    navigate("/");
  };

  return (
    <main className={styles.main}>
      <div className={styles.menu}>
        <h1>Open project</h1>
        {languageList.length === 0 ? (
          <p>Loading your projects...</p>
        ) : (
          <ul className={styles["list-link"]}>{displayListProject()}</ul>
        )}
        <span className={buttons["wrapper-btns"]}>
          {languageList === [] ? null : (
            <button
              onClick={() => openProject(projectID, projectName)}
              className={buttons["btn-open"]}>
              Open
            </button>
          )}
          <button onClick={() => navigate("/")} className={buttons["btn-cancel"]}>
            Cancel
          </button>
        </span>
      </div>
      {projectID ===""? null : <ConfirmDelete languageList={languageList} setLanguageList={setLanguageList}/>}
    </main>
  );
};

export default OpenProject;
