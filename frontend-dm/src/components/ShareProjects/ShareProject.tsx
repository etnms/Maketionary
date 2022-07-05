import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import adapter from "../../helpers/axiosAdapter";
import pageStyles from "../../styles/PageOverlay.module.css";
import styles from "./ShareProject.module.css";
import CloseIcon from "@mui/icons-material/Close";
const ShareProject = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const projectID: string = useAppSelector((state) => state.projectItem.projectID);
  const projectName: string = useAppSelector((state) => state.projectItem.projectName);

  const shareProject = () => {
    const user: string = (document.querySelector("input[name='input-share']") as HTMLInputElement).value;
    adapter
      .post(`/shared-projects/${projectID}`, { user })
      .then((res) => {
        navigate("/open-project");
      })
      .catch((err) => {
        navigate("/open-project");
      });
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.box}>
        <button className={pageStyles["btn-close"]} onClick={() => navigate("/open-project")}>
          <CloseIcon />
        </button> 
        <h1 className={styles.title}>
          Sharing project: <em>{projectName}</em>
        </h1>
        <label htmlFor="input-share" className={styles.label}>
          Username or email of the user you want to share your project with:
        </label>
        <input name="input-share" className={styles["input-share"]} />
        <span className={styles["wrapper-btns"]}>
          <button className={`${styles.btn} ${styles["btn-confirm"]}`} onClick={shareProject}>
            Share
          </button>
          <button className={styles.btn} onClick={() => navigate("/open-project")}>
            Cancel
          </button>
        </span>
      </div>
    </div>
  );
};

export default ShareProject;
