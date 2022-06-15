import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styles from "../styles/PageNotFound.module.css";

const PageNotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("pageTitles.pageNotFound");
    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");
  });
  return (
    <div className={styles.page}>
      <p className={styles.text}>{t("404.title")}</p>
      <button className={styles.btn} onClick={() => navigate("/dashboard")}>
        {t("404.btnHome")}
      </button>
    </div>
  );
};

export default PageNotFound;
