import pageStyles from "../../styles/PageOverlay.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./ProjectInformation.module.css";
import buttons from "../../styles/Buttons.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IUserProject } from "../../interfaces/interfaceProjectItem";
import { setProjectGuests, setProjectID } from "../../features/projectItemSlice";
import { useState } from "react";
import adapter from "../../helpers/axiosAdapter";
import ConfirmMessage from "../ConfirmMessage";
import ErrorMessage from "../ErrorMessage";
import Loader from "../Loaders/Loader";

const ProjectInformation = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const projectName: string = useAppSelector((state) => state.projectItem.projectName);
  const projectOwner: IUserProject = useAppSelector((state) => state.projectItem.projectCreator);
  const projectGuests: IUserProject[] = useAppSelector((state) => state.projectItem.projectGuests);
  const stateID: string = useAppSelector((state) => state.projectItem.projectID);

  const username: string | null = sessionStorage.getItem("username");

  const [isUserSelected, setIsUserSelected] = useState<boolean>(false);
  const [userToRemove, setUserToRemove] = useState<string>("");
  const [idUserToRemove, setIdUserToRemove] = useState<string>("");

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const displayUserToRemove = (value: string, _id: string) => {
    setIsUserSelected(true);
    setUserToRemove(value);
    setIdUserToRemove(_id);
  };

  const listProjectGuest = () => {
    if (projectGuests === undefined) return;
    return projectGuests.map((guest: IUserProject) => (
      <li key={"guest-" + guest._id} className={styles.guest}>
        <p className={styles["guest-text"]}>{guest.username}</p>
        {username === projectOwner.username ? (
          <button
            onClick={() => displayUserToRemove(guest.username, guest._id)}
            className={styles["remove-btn"]}>
            {t("shareProject.removeUserText")}
          </button>
        ) : null}
      </li>
    ));
  };

  const removeUserFromProject = () => {
    setLoading(true);
    adapter
      .put(`/shared-projects/${stateID}`, { idUserToRemove })
      .then(() => {
        setIsUserSelected(false);
        setMessage(t("shareProject.successRemove"));
        dispatch(
          setProjectGuests([...projectGuests.filter((item: IUserProject) => item._id !== idUserToRemove)])
        );
        setLoading(false);
      })
      .catch(() => {
        setMessage(t("shareProject.failureRemove"));
        setLoading(false);
      });
  };

  const renderMessage = () => {
    if (message === "") return null;
    if (message === t("shareProject.successRemove")) return <ConfirmMessage message={message} />;
    else return <ErrorMessage message={message} />;
  };

  const cancelRemoveUser = () => {
    setIsUserSelected(false);
  };

  const closeWindow = () => {
    dispatch(setProjectID(""));
    navigate("/open-project");
  };

  return (
    <div className={pageStyles.page}>
      <div className={pageStyles.box}>
        <button className={pageStyles["btn-close"]} onClick={closeWindow}>
          <CloseIcon />
        </button>
        <h1 className={styles.title}>
          {t("projects.projectText")} <em>{projectName}</em>
        </h1>
        <h2 className={styles.subtitle}>
          {t("projects.ownerText")}
          {projectOwner.username}
        </h2>
        <p>{t("projects.contributorsText")}</p>
        <ul className={styles["list-guests"]}>{listProjectGuest()}</ul>
        {isUserSelected ? (
          <>
            <p className={styles["remove-text"]}>{t("shareProject.confirmRemoveText")}</p>
            <p className={styles["remove-text"]}>{userToRemove}</p>

            <span className={buttons["wrapper-btns"]}>
              <button className={styles["btn-confirm"]} onClick={() => removeUserFromProject()}>
                {t("projects.yesBtn")}
              </button>
              <button className={styles["btn-refuse"]} onClick={() => cancelRemoveUser()}>
                {t("projects.noBtn")}
              </button>
            </span>
          </>
        ) : null}
        {loading? <Loader width={24} height={24}/> : renderMessage()}
        <button className={styles.btn} onClick={closeWindow}>
          {t("shareProject.shareBtnCancel")}
        </button>
      </div>
    </div>
  );
};

export default ProjectInformation;
