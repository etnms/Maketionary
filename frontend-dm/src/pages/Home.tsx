import styles from "../styles/Home.module.css";
import TopNav from "../components/TopNav";
import ListWords from "../components/ListWords";
import CreateWordMenu from "../components/CreateWordMenu";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const token = localStorage.getItem("token");

  const [username, setUsername] = useState("");

  useEffect(() => {
    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");

    axios
      .get(`${process.env.REACT_APP_BACKEND}/api/dashboard`, { headers: { authorization: token! } })
      .then((res) => setUsername(res.data))
      .catch((err) => console.log(err));
  });

  return (
    <div className={styles.app}>
      <TopNav username={username} />
      <div className={styles["wrapper-main"]}>
        <CreateWordMenu />
        <ListWords />
      </div>
    </div>
  );
};

export default Home;
