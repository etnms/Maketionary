import styles from "../styles/Dashboard.module.css";
import TopNav from "../components/TopNav/TopNav";
import ListWords from "../components/ListWords";
import CreateWordMenu from "../components/CreateWordMenu";
import { useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { setFirstConnection, setUsername } from "../features/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import LoaderPage from "../components/LoaderPage";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Dispatch } from "redux";
import refreshAccessToken from "../helpers/refreshAccessToken";
import { adapter } from "../helpers/axiosAdapter";

const Dashboard = () => {

  const projectID: string | null = localStorage.getItem("project");

  const { t } = useTranslation();
  const dispatch: Dispatch<any> = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const username: string = useAppSelector((state) => state.auth.username);
  const firstConnection: boolean = useAppSelector((state) => state.auth.firstConnection);


  useEffect(() => {
    document.title = "Maketionary";
    if (localStorage.getItem("darktheme") === "darktheme") {
      document.documentElement.setAttribute("data-color-scheme", "dark");
    } else {
      document.documentElement.setAttribute("data-color-scheme", "light");
    }
    // If user refreshed the page (the state), then API call for username
    if (firstConnection) {
      adapter
        .get("/api/dashboard")
        .then((res) => {
          // Request for username
          dispatch(setUsername(res.data));
          console.log(res.data);
          // If user has refreshed the page (the state) then set frstConnection back to false after response from server
          dispatch(setFirstConnection(false));
        })
        .catch(() => {});
    }

    adapter.interceptors.response.use(
      function (response) {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response.status === 403 &&
          originalRequest.url === `${process.env.REACT_APP_BACKEND}/api/token`
        ) {
          return Promise.reject(error);
        }
        if (error.response.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;
          adapter.interceptors.response.eject(error);
          const access_token = await refreshAccessToken();
          originalRequest.headers["authorization"] = "Bearer " + access_token;
          return adapter(originalRequest);
        }
        //if no correct credential expire session and reject promise
        navigate("/expired");
        return Promise.reject(error);
      }
    );
  }, [dispatch, firstConnection, navigate]);

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
