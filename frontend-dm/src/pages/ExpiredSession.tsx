import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ExpiredSession.module.css";

const ExpiredSession = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [count, setCount] = useState<number>(5);

  useEffect(() => {
    console.log("hey")
    document.title = t("pageTitles.expiredSession");
    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");

    if (count > 0) setTimeout(() => setCount(count - 1), 1000);
    if (count === 0) navigate("/");
  }, [count, navigate, t]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <p>{t("expired.title")}</p>
        <p>{t("expired.redirectP1")}{count}{t("expired.redirectP2")}</p>
      </div>
    </div>
  );
};

export default ExpiredSession;