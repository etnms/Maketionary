import pageStyle from "../../styles/PageOverlay.module.css";
import buttons from "../../styles/Buttons.module.css";
import styles from "./ReceivedRequestMenu.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useState } from "react";
import adapter from "../../helpers/axiosAdapter";
import { useTranslation } from "react-i18next";
import ConfirmMessage from "../ConfirmMessage";
import { useDispatch } from "react-redux";
import { removeNotification, setRequestList } from "../../features/shareRequestsSlice";
import Loader from "../Loaders/Loader";

interface IRequest {
  _id: string;
  project: { name: string };
  sender: string;
}

const ReceivedRequestMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const listRequest = useAppSelector((state) => state.collabRequests.value);

  const [isAnyItemSelected, setIsAnyItemSelected] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<string>("");

  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleKeyPress = (e: React.KeyboardEvent, _id: string) => {
    if (e.key === "Enter") selectRequest(e, _id);
  };

  const selectRequest = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent,
    _id: string
  ) => {
    deselect();
    setIsAnyItemSelected(true);
    setSelectedRequest(_id);
    e.currentTarget.classList.add(styles["selected-notif"]);
    if (selectedRequest === _id) {
      deselect();
      setIsAnyItemSelected(false);
    }
  };

  const deselect = () => {
    const prevNotif = document.querySelector(`.${styles["selected-notif"]}`);
    prevNotif?.classList.remove(styles["selected-notif"]);
    setSelectedRequest("");
  };

  const answerRequest = (value: boolean) => {
    setIsLoading(true);
    adapter
      .post(`/shared-projects/answer/${selectedRequest}`, { accepted: value })
      .then((res) => {
        setIsLoading(false);
        if (res.data === "Request accepted") setMessage(t("shareProject.requestAccepted"));
        if (res.data === "Request refused") setMessage(t("shareProject.requestRefused"));
        dispatch(setRequestList([...listRequest.filter((item: any) => item._id !== selectedRequest)]));
        setIsAnyItemSelected(false);
        dispatch(removeNotification());
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 401) return navigate("/expired");
      });
  };

  const diplayListRequest = () => {
    return listRequest.map((req: IRequest) => (
      <li
        key={req._id}
        className={styles.notif}
        tabIndex={0}
        onDoubleClick={(e) => selectRequest(e, req._id)}
        onKeyDown={(e) => handleKeyPress(e, req._id)}>
        <span className={styles["req-text"]}>
          {req.sender}
          {t("shareProject.notifInvite")}
          <em>{req.project.name}</em>
        </span>
      </li>
    ));
  };

  const renderMessage = () => {
    switch (message) {
      case "":
        return null;
      case "Request succesfully accepted":
        return <ConfirmMessage message={message} />;
      case "Request succesfully refused.":
        return <ConfirmMessage message={message} />;
      default:
        return null;
    }
  };

  return (
    <div className={pageStyle.page} data-notif-window="window">
      <div className={pageStyle.box}>
        <button onClick={() => navigate("/dashboard")} className={pageStyle["btn-close"]} autoFocus>
          <CloseIcon />
        </button>
        <h1 className={styles.title}>{t("shareProject.notifTitle")}</h1>
        {listRequest.length !== 0 ? (
          <p className={styles.subtitle}>{t("shareProject.notifSubtitle")}</p>
        ) : null}
        {listRequest.length !== 0 ? (
          <ul className={styles["list-notif"]}>{diplayListRequest()}</ul>
        ) : (
          <p>{t("shareProject.notifNoNotif")}</p>
        )}
        {isAnyItemSelected ? (
          <span className={buttons["wrapper-btns"]}>
            <button className={buttons["btn-open"]} onClick={() => answerRequest(true)}>
              {t("shareProject.notifBtnAccept")}
            </button>
            <button
              className={`${buttons["btn-cancel"]} ${styles["btn-refuse"]}`}
              onClick={() => answerRequest(false)}>
              {t("shareProject.notifBtnRefuse")}
            </button>
          </span>
        ) : null}
        <button className={styles["btn-cancel"]} onClick={() => navigate("/dashboard")}>
          {t("shareProject.notifBtnCancel")}
        </button>
        {isLoading ? <Loader width={24} height={24} /> : renderMessage()}
      </div>
    </div>
  );
};

export default ReceivedRequestMenu;
