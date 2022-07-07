import { useEffect, useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import styles from "./Notification.module.css";
import adapter from "../../helpers/axiosAdapter";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setNumberNotifications, setRequestList } from "../../features/shareRequestsSlice";

const Notification = () => {
  const [hasNotifications, setHasNotification] = useState<boolean>(false);
  const numberNotifications = useAppSelector(state => state.collabRequests.numberNotifications);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setHasNotification(false);
    adapter
      .get("/shared-projects")
      .then((res) => {
        if (res.data.results.collabRequest.length !== 0) {
          dispatch(setNumberNotifications(res.data.results.collabRequest.length))
          setHasNotification(true);
          dispatch(setRequestList(res.data.results.collabRequest));
        }
      })
      .catch((err) => console.log(err));
  }, [dispatch, numberNotifications]);

  return (
    <button className={styles["notification-btn"]} onClick={() => navigate("notifications")}>
      <NotificationsNoneIcon className={styles.icon} />
      {hasNotifications ? <span className={styles["notification-alert"]}>{numberNotifications}</span> : null}
    </button>
  );
};

export default Notification;
