import { useEffect } from "react";
import styles from "./Toggle.module.css";

interface IToggle {
  children: JSX.Element;
  name: string;
  settings: string;
  value: string;
}

const Toggle = (props: React.PropsWithChildren<IToggle>) => {
  const { children, name, settings, value } = props;

  useEffect(() => {
    // Get toggle value
    const currentValue = JSON.parse(localStorage.getItem(settings)!);
    // if item not in localstorage give it default value
    if (currentValue === null) localStorage.setItem(settings, value);
    // Display the value as checkbox
    const toggle = document.querySelector(`input[name=${name}]`) as HTMLInputElement;
    toggle.checked = currentValue;
  }, [name, settings, value]);

  //Toggle funtion for setting value
  const toggleSetting = () => {};

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, name: string) => {
    if (e.key === "Enter") {
      const toggle = document.querySelector(`input[name=${name}]`) as HTMLInputElement;
      toggle.checked = !toggle.checked;
      toggleSetting();
    }
  };

  return (
    <div className={styles["wrapper-toggle"]}>
      {children}
      <label className={styles.switch}>
        <input
          type="checkbox"
          name={name}
          onChange={() => toggleSetting()}
          onKeyDown={(e) => handleKeyPress(e, name)}
          className={styles.toggle}
          aria-label="switch"
        />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
    </div>
  );
};

export default Toggle;
