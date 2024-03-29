import styles from "./DarkThemeToggle.module.css";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect } from "react";

const DarkThemeToggle = () => {
  /// Although this toggle component work pretty much the same way as the toggle one they are slight differences like
  // setAttribute; this probably could be used as one common toggle component later on.

  const currentValue = localStorage.getItem("darktheme");

  useEffect(() => {
    // Get toggle value
    const toggle = document.querySelector("input[name='toggle-darktheme") as HTMLInputElement;
    if (currentValue === "lighttheme") toggle.checked = false;
    else toggle.checked = true;
  }, [currentValue]);

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
          aria-label="switch"
        />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <DarkModeIcon />
    </div>
  );
};

export default DarkThemeToggle;
