import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import adapter from "../../helpers/axiosAdapter";
import styles from "./ShareProject.module.css";

const ShareProject = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const projectID: string = useAppSelector((state) => state.projectItem.projectID);
  const projectName: string = useAppSelector((state) => state.projectItem.projectName);

  const shareProject = () => {
    const user: string = (document.querySelector("input[name='input-share']") as HTMLInputElement).value;
    adapter
      .post(`/shared-projects/${projectID}`, { user })
      .then((res) => {console.log(res); navigate("/open-project")})
      .catch((err) => {console.log(err); navigate("/open-project")});
  };

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <p>
          Sharing project: <em>{projectName}</em>
        </p>
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
        <button className={`${styles.btn} ${styles["btn-close"]}`} onClick={() => navigate("/open-project")}>
          X
        </button>
      </div>
    </div>
  );
};

export default ShareProject;
