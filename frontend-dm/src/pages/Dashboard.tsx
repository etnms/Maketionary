import styles from "../styles/Dashboard.module.css";
import TopNav from "../components/TopNav";
import ListWords from "../components/ListWords";
import CreateWordMenu from "../components/CreateWordMenu";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";


const Dashboard = () => {

  const token = localStorage.getItem("token");
  const projectID = localStorage.getItem("project");

  const { t } = useTranslation();

  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    document.title = "Maketionary";
    if (localStorage.getItem("darktheme") === "darktheme") {
      document.documentElement.setAttribute("data-color-scheme", "dark");
    } else {
      document.documentElement.setAttribute("data-color-scheme", "light");
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

    </div>
  );
};

export default Dashboard;
