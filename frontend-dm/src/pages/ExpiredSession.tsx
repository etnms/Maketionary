import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ExpiredSession.module.css";

const ExpiredSession = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState<number>(5);
  useEffect(() => {
    document.title = "Session expired";
    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");

    if (count > 0) setTimeout(() => setCount(count - 1), 1000);
    if (count === 0) navigate("/");
  }, [count, navigate]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <p>Your session has expired.</p>
        <p>You will be redirected in {count} seconds.</p>
      </div>
    </div>
  );
};

export default ExpiredSession;
