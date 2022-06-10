import styles from "../styles/Home.module.css";
import TopNav from "../components/TopNav";
import ListWords from "../components/ListWords";
import CreateWordMenu from "../components/CreateWordMenu";
import { useEffect, useState } from "react";
import axios from "axios";
import Settings from "../components/Settings";
import { useAppDispatch } from "../app/hooks";
import { setIsDarkModeToggled } from "../features/settingsSlice";
import { useTranslation } from "react-i18next";

const Dashboard = () => {

  const dispatch = useAppDispatch();

  const token = localStorage.getItem("token");
  const projectID = localStorage.getItem("project");

  const { t } = useTranslation();

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    document.title = "Maketionary";
    // Toggle darktheme
    if (localStorage.getItem("darktheme") === "darktheme") {
      document.documentElement.setAttribute("data-color-scheme", "dark");
      dispatch(setIsDarkModeToggled(true));
    } else {
      document.documentElement.setAttribute("data-color-scheme", "light");
      dispatch(setIsDarkModeToggled(false));
    }

    // Request for username
    axios
      .get(`${process.env.REACT_APP_BACKEND}/api/dashboard`, { headers: { authorization: token! } })
      .then((res) => setUsername(res.data))
      .catch((err) => console.log(err));
  });

  return (
    <div className={styles.app}>
      <TopNav username={username} />

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
      <Settings />
    </div>
  );
};

export default Dashboard;