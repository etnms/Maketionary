import styles from "./TopNav.module.css";
import { NavigateFunction, Outlet, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../app/hooks";
import TopNavMenu from "./TopNavMenu";
import { Dispatch } from "redux";
import { useDispatch } from "react-redux";
import { setFirstConnection } from "../../features/authSlice";
import axios from "axios";

const TopNav = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch<any> = useDispatch();
  const { t } = useTranslation();

  const projectID: string | null = localStorage.getItem("project");
  const projectName: string | null = localStorage.getItem("projectName");

  const logout = () => {
    const refreshToken: string | null = localStorage.getItem("refreshToken");
    axios
      .delete(`${process.env.REACT_APP_BACKEND}/api/token`, { data: { refreshToken } })
      .then()
      .catch();
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("accessToken");
    dispatch(setFirstConnection(true));
    navigate("/");
  };

  return (
    <nav className={styles.nav}>
      <TopNavMenu />
      {/* Display outlet for the settings after the button to follow a more natural order, especially accessibility and focus */}
      <Outlet />
      <SearchBar />

      <div className={styles["wrapper-user"]}>
        {projectID !== null ? ( // Display only is a project is open
          <span className={styles["current-project"]}>
            {t("nav.current")} <em>{projectName}</em>
          </span>
        ) : null}
        <span>
          {t("nav.welcome")}
          {useAppSelector((state) => state.auth.username)}
        </span>
        <button className={styles["btn-logout"]} onClick={logout}>
          {t("nav.signout")}
        </button>
      </div>
    </nav>
  );
};

export default TopNav;
