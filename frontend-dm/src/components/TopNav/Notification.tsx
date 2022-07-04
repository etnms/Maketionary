import { useEffect, useState } from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import styles from "./Notification.module.css";
import adapter from "../../helpers/axiosAdapter";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const [hasNotifications, setHasNotification] = useState<boolean>(false);
  const [numberNotifications, setNumberNotifications] = useState<number>(0);

  const navigate = useNavigate();
  
  useEffect(() => {
    setHasNotification(false);
    adapter
      .get("/shared-projects")
      .then((res) => {
        if (res.data.results.collabRequest.length !== 0) {
          setNumberNotifications(res.data.results.collabRequest.length);
          setHasNotification(true);
        };
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <button className={styles["notification-btn"]} onClick={() => navigate("notifications")}>
      <NotificationsNoneIcon className={styles.icon} />
      {hasNotifications? <span className={styles["notification-alert"]}>{numberNotifications}</span> : null}
      
    </button>
  );
};

export default Notification;
