import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/OpenProject.module.css";
import buttons from "../styles/Buttons.module.css";
import ProjectItem from "../components/ProjectItem";
import { IProjectItem } from "../interfaces/interfaceProjectItem";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ConfirmDelete from "../components/ConfirmDelete";
import { setProjectID, setProjectName } from "../features/projectItemSlice";
import { useTranslation } from "react-i18next";
import { setSearchInput } from "../features/searchSlice";
import Loader from "../components/Loader";
import adapter from "../helpers/axiosAdapter";

const OpenProject = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  //const access = localStorage.getItem("token");
  const [languageList, setLanguageList] = useState<IProjectItem[]>([]);

  const projectID = useAppSelector((state) => state.projectItem.projectID);
  const projectName = useAppSelector((state) => state.projectItem.projectName);

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = t("pageTitles.openProject");

    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");

    adapter
    .get("/language")
    .then((res) => {setLanguageList(res.data.results.languages)})
    .catch(() =>  navigate("/expired"));
   
  }, [t, navigate]);

  const displayListProject = () => {
    return languageList.map((language) => (
      <ProjectItem key={language._id} _id={language._id} name={language.name} />
    ));
  };

  const openProject = (projectID: string, projectName: string) => {
    if (projectID === "") return; //error
    localStorage.setItem("project", projectID);
    localStorage.setItem("projectName", projectName);
    goHomePage();
    dispatch(setSearchInput(""));
  };

  const goHomePage = () => {
    // First reset the values
    dispatch(setProjectName(""));
    dispatch(setProjectID(""));
    // Then navigate back to home page
    // Using timeout to put navigate in the stack
    // This avoid render problems with the change of state induced by redux
    setTimeout(() => navigate("/dashboard"), 0);
  };

  return (
    <main className={styles.main}>
      <div className={styles.menu}>
        <h1 className={styles.title}>{t("projects.openProjectTitle")}</h1>
        {languageList.length === 0 ? (
          <div className={styles["wrapper-loader"]}>
            <Loader width={24} height={24} />
            <p>{t("projects.loading")}</p>
          </div>
        ) : (
          <ul className={styles["list-link"]}>{displayListProject()}</ul>
        )}
        <span className={buttons["wrapper-btns"]}>
          {languageList === [] ? null : (
            <button onClick={() => openProject(projectID, projectName)} className={buttons["btn-open"]}>
              {t("projects.openBtn")}
            </button>
          )}
          <button onClick={goHomePage} className={buttons["btn-cancel"]}>
            {t("projects.cancelBtn")}
          </button>
        </span>
      </div>
      {projectID === "" ? null : (
        <ConfirmDelete languageList={languageList} setLanguageList={setLanguageList} />
      )}
    </main>
  );
};

export default OpenProject;
