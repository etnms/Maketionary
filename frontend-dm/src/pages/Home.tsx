import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";
import buttons from "../styles/Buttons.module.css";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../app/hooks";
import { setFirstConnection, setUsername } from "../features/authSlice";
import adapter from "../helpers/axiosAdapter";

const Home = () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const navigate = useNavigate();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  useEffect(() => {
    document.title = "Maketionary";
    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");

    // if there is no token then return, no need for API call as users need to connect
    if (refreshToken === null) return;
    // If token is valid leads straight to the dashboard
    adapter
    .get("/dashboard")
    .then((res) => {
      // If token is valid then set username and firstConnection to false
      // firstConnection makes sure that the api is not called twice (in dashboard)
      dispatch(setUsername(res.data.username));
      sessionStorage.setItem("username", res.data.username)
      sessionStorage.setItem("userid", res.data.userid);
      dispatch(setFirstConnection(false));
      navigate("/dashboard");
    })
    .catch(() => {
      return;
    });
  }, [refreshToken, navigate, dispatch]);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <button className={buttons["btn-open"]} onClick={() => navigate("/login")}>
          {t("login.title")}
        </button>
        <button className={buttons["btn-cancel"]} onClick={() => navigate("/signup")}>
          {t("signup.title")}
        </button>
      </nav>
      <section className={styles.section}>
        <h1 className={styles.title}>{t("home.title")}</h1>
        <h2 className={styles.subtitle}>{t("home.subtitle")}</h2>
        <button className={styles["btn-get-started"]} onClick={() => navigate("/signup")}>
          {t("home.getStarted")}
        </button>
      </section>
    </div>
  );
};

export default Home;
