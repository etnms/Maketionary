import styles from "./DarkThemeToggle.module.css";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setIsDarkModeToggled } from "../features/settingsSlice";

const DarkThemeToggle = () => {
  const isDarkThemeToggled = useAppSelector((state) => state.settings.isDarkModeToggled);
  const dispatch = useAppDispatch();

  const toggleDarkTheme = (
    e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if ((e.target as HTMLInputElement).checked) {
      document.documentElement.setAttribute("data-color-scheme", "dark");
      localStorage.setItem("darktheme", "darktheme");
    } else {
      localStorage.setItem("darktheme", "lighttheme");
      document.documentElement.setAttribute("data-color-scheme", "light");
    }
    dispatch(setIsDarkModeToggled(!isDarkThemeToggled));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const toggle = document.querySelector("input[name='toggle-darktheme") as HTMLInputElement;
      toggle.checked = !toggle.checked;
      toggleDarkTheme(e);
    }
  };

  return (
    <div className={styles["dark-theme-toggle"]}>
      <LightModeIcon />
      <label className={styles.switch}>
        <input
          type="checkbox"
          name="toggle-darktheme"
          onChange={(e) => toggleDarkTheme(e)}
          onKeyDown={(e) => handleKeyPress(e)}
          checked={isDarkThemeToggled}
        />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <DarkModeIcon />
    </div>
  );
};

export default DarkThemeToggle;
