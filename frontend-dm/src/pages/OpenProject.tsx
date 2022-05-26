import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/OpenProject.module.css";
import buttons from "../styles/Buttons.module.css";
import ProjectItem from "../components/ProjectItem";


const OpenProject = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const [languageList, setLanguageList] = useState<any[]>([]);

  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}/api/language`, { headers: { Authorization: token! } })
      .then((res) => setLanguageList(res.data.results.languages))
      .catch((err) => console.log(err));
  }, [token]);

  const displayListProject = () => {
    return languageList.map((language) => (
      <ProjectItem key={language._id} _id={language._id} language={language.name} setSelectedProject={setSelectedProject}/>
    ));
  };

  const openProject = (projectID: string) => {
    if (projectID === "") return; //error
    localStorage.setItem("project", projectID);
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
            <button onClick={() => openProject(selectedProject)} className={buttons["btn-open"]}>
              Open
            </button>
          )}
          <button onClick={() => navigate("/")} className={buttons["btn-cancel"]}>
            Cancel
          </button>
        </span>
      </div>
    </main>
  );
};

export default OpenProject;
