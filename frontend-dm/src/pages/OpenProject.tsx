import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styles from "../styles/OpenProject.module.css";
import buttons from "../styles/Buttons.module.css";
import ProjectItem from "../components/ProjectItem";
import { IProjectItem } from "../interfaces/interfaceProjectItem";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ConfirmDelete from "../components/ConfirmDelete";
import { setProjectID, setProjectName } from "../features/projectItemSlice";
import { useTranslation } from "react-i18next";
import { setSearchInput } from "../features/searchSlice";
import Loader from "../components/Loaders/Loader";
import adapter from "../helpers/axiosAdapter";
import ErrorMessage from "../components/ErrorMessage";

const OpenProject = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [languageList, setLanguageList] = useState<IProjectItem[]>([]);

  const projectID = useAppSelector((state) => state.projectItem.projectID);
  const projectName = useAppSelector((state) => state.projectItem.projectName);

  const [listSelected, setListSelected] = useState<string>("all");

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setLoading(true);
    document.title = t("pageTitles.openProject");

    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");

    adapter
      .get(`/language/${listSelected}`)
      .then((res) => {
        setLanguageList(res.data.languages);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/expired");
      });
  }, [t, navigate, listSelected]);

  const displayListProject = () => {
    if (languageList.length === 0) return <span>{t("projects.noProjects")}</span>;
    return languageList.map((language) => (
      <ProjectItem
        key={language._id}
        user={language.user}
        guestUser={language.guestUser}
        _id={language._id}
        name={language.name}
        setErrorMessage={setErrorMessage}
        owner={language.owner}
      />
    ));
  };

  const selectTab = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, value: string) => {
    dispatch(setProjectID(""));
    const prevSelected = document.querySelector(`.${styles["tab-selected"]}`);
    prevSelected?.classList.remove(styles["tab-selected"]);
    e.currentTarget.classList.add(styles["tab-selected"]);
    setListSelected(value);
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
      <span className={styles.tab}>
        <button
          className={`${styles["tab-nav"]} ${styles["tab-selected"]}`}
          onClick={(e) => selectTab(e, "all")}>
          {t("projects.allProjects")}
        </button>
        <button className={styles["tab-nav"]} onClick={(e) => selectTab(e, "collab")}>
          {t("projects.sharedProjects")}
        </button>
      </span>
      <div className={styles.menu}>
        <h1 className={styles.title}>{t("projects.openProjectTitle")}</h1>
        {loading ? (
          <div className={styles["wrapper-loader"]}>
            <Loader width={24} height={24} />
            <p>{t("projects.loading")}</p>
          </div>
        ) : (
          <ul className={styles["list-link"]}>{displayListProject()}</ul>
        )}
        {errorMessage === "" ? null : <ErrorMessage message={errorMessage} />}
        <span className={buttons["wrapper-btns"]}>
          {languageList.length === 0 ? null : (
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
      <Outlet />
    </main>
  );
};

export default OpenProject;
