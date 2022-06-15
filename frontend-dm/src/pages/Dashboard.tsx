import styles from "../styles/Dashboard.module.css";
import TopNav from "../components/TopNav";
import ListWords from "../components/ListWords";
import CreateWordMenu from "../components/CreateWordMenu";
import { useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { setFirstConnection, setUsername } from "../features/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import LoaderPage from "../components/LoaderPage";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const projectID = localStorage.getItem("project");

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const username = useAppSelector((state) => state.auth.username);
  const firstConnection = useAppSelector((state) => state.auth.firstConnection);

  useEffect(() => {
    document.title = "Maketionary";
    if (localStorage.getItem("darktheme") === "darktheme") {
      document.documentElement.setAttribute("data-color-scheme", "dark");
    } else {
      document.documentElement.setAttribute("data-color-scheme", "light");
    }
    // If user refreshed the page (the state), then API call for username
    if (firstConnection) {
      axios
        .get(`${process.env.REACT_APP_BACKEND}/api/dashboard`, { headers: { authorization: token! } })
        .then((res) => {
          // Request for username
          dispatch(setUsername(res.data));
          // If user has refreshed the page (the state) then set frstConnection back to false after response from server
          dispatch(setFirstConnection(false));
        })
        .catch((err) => navigate("/"));
    }
  });

  const renderDashboard = () => {
    if (username === "") return <LoaderPage />;
    else
      return (
        <div className={styles.app}>
          <TopNav />

          {projectID !== null ? (
            <main className={styles["wrapper-main"]}>
              <CreateWordMenu />
              <ListWords />
            </main>
          ) : (
            <main className={styles["wrapper-no-project"]}>
              <p className={styles.box}>{t("main.noProjectOpen")}</p>
            </main>
          )}
        </div>
      );
  };
  return renderDashboard();
};

export default Dashboard;
