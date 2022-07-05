import pageStyle from "../../styles/PageOverlay.module.css";
import buttons from "../../styles/Buttons.module.css";
import styles from "./ReceivedRequestMenu.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useState } from "react";
import adapter from "../../helpers/axiosAdapter";

interface IRequest {
  _id: string;
  project: { name: string; user: string };
}

const ReceivedRequestMenu = () => {
  const navigate = useNavigate();

  const listRequest = useAppSelector((state) => state.collabRequests.value);

  const [isAnyItemSelected, setIsAnyItemSelected] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<string>("");

  const selectRequest = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, _id: string) => {
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
    adapter
      .post(`/shared-projects/answer/${selectedRequest}`, { accepted: value })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const diplayListRequest = () => {
    return listRequest.map((req: IRequest) => (
      <li
        key={req._id}
        className={styles.notif}
        tabIndex={0}
        onDoubleClick={(e) => selectRequest(e, req._id)}>
        <span>
          You were invited on the project <em>{req.project.name}</em>
        </span>{" "}
        <span>by {req.project.user}</span>
      </li>
    ));
  };

  return (
    <div className={pageStyle.page}>
      <div className={pageStyle.box}>
        <button onClick={() => navigate("/dashboard")} className={pageStyle["btn-close"]}>
          <CloseIcon />
        </button>
        <h1 className={styles.title}>Shared projects notifications</h1>
        {listRequest.length !== 0 ? (
          <p className={styles.subtitle}>Double click to select a request</p>
        ) : null}
        {listRequest.length !== 0 ? (
          <ul className={styles["list-notif"]}>{diplayListRequest()}</ul>
        ) : (
          <p>You have no notification</p>
        )}
        {isAnyItemSelected ? (
          <span className={buttons["wrapper-btns"]}>
            <button className={buttons["btn-open"]} onClick={() => answerRequest(true)}>
              Accept
            </button>
            <button
              className={`${buttons["btn-cancel"]} ${styles["btn-refuse"]}`}
              onClick={() => answerRequest(false)}>
              Refuse
            </button>
          </span>
        ) : null}
        <button className={styles["btn-cancel"]} onClick={() => navigate("/dashboard")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReceivedRequestMenu;
