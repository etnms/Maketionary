import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import adapter from "../../helpers/axiosAdapter";
import pageStyles from "../../styles/PageOverlay.module.css";
import styles from "./ShareProject.module.css";
import CloseIcon from "@mui/icons-material/Close";
import ErrorMessage from "../ErrorMessage";
import { useState } from "react";
import ConfirmMessage from "../ConfirmMessage";
import Loader from "../Loaders/Loader";
const ShareProject = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const projectID: string = useAppSelector((state) => state.projectItem.projectID);
  const projectName: string = useAppSelector((state) => state.projectItem.projectName);

  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const shareProject = () => {
    const user: string = (document.querySelector("input[name='input-share']") as HTMLInputElement).value;
    setIsLoading(true);
    adapter
      .post(`/shared-projects/${projectID}`, { user })
      .then(() => {
        setIsLoading(false);
        setMessage(t("shareProject.requestSent"));
        (document.querySelector("input[name='input-share']") as HTMLInputElement).value = "";
       
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.data === "Error: user not found") setMessage(t("shareProject.requestErrorUser"));
        if (err.response.data === "Error: request already sent")
          setMessage(t("shareProject.requestErrorAlreadySent"));
        if (err.response.status === 401) return navigate("/expired");
      });
  };

  const renderMessage = () => {
    switch (message) {
      case "":
        return null;
      case t("shareProject.requestErrorUser"):
        return <ErrorMessage message={message} />;
      case t("shareProject.requestErrorAlreadySent"):
        return <ErrorMessage message={message} />;
      case t("shareProject.requestSent"):
        return <ConfirmMessage message={message} />;
      default:
        return null;
    }
  };

  const handleChange = () => {
    if (message !== "") setMessage("");
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.box}>
        <button className={pageStyles["btn-close"]} onClick={() => navigate("/open-project")}>
          <CloseIcon />
        </button>
        <h1 className={styles.title}>
          {t("shareProject.shareTitle")} <em>{projectName}</em>
        </h1>
        <label htmlFor="input-share" className={styles.label}>
          {t("shareProject.shareInfoText")}
        </label>
        <input name="input-share" className={styles["input-share"]} onChange={handleChange} />
        <span className={styles["wrapper-btns"]}>
          <button className={`${styles.btn} ${styles["btn-confirm"]}`} onClick={shareProject}>
            {t("shareProject.shareBtnShare")}
          </button>
          <button className={styles.btn} onClick={() => navigate("/open-project")}>
            {t("shareProject.shareBtnCancel")}
          </button>
        </span>
        {isLoading? <Loader width={24} height={24}/> : renderMessage()}
      </div>
    </div>
  );
};

export default ShareProject;
