import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/PageNotFound.module.css";

const PageNotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = " 404 - Page not found";
    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");
  });
  return (
    <div className={styles.page}>
      <p className={styles.text}>This page does not exist.</p>
      <button className={styles.btn} onClick={() => navigate("/")}>
        Home
      </button>
    </div>
  );
};

export default PageNotFound;
