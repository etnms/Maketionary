import { useEffect } from "react";
import styles from "./Toggle.module.css";

interface IToggle {
  children: JSX.Element,
  name: string;
  settings: string;
  value: string;
}

const Toggle = ({children, name, settings, value }: React.PropsWithChildren<IToggle>) => {

  useEffect(() => {
    const currentValue = JSON.parse(localStorage.getItem(settings)!);
    const toggle = (document.querySelector(`input[name=${name}]`) as HTMLInputElement);
    toggle.checked = currentValue;

  }, [name, settings])

  const toggleSetting = (settings: string, value: string) => {
    const currentValue = JSON.parse(localStorage.getItem(settings)!);
    if (currentValue) localStorage.setItem(settings, "false");
    else localStorage.setItem(settings, value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, name: string) => {
    if (e.key === "Enter") {
      const toggle = document.querySelector(`input[name=${name}]`) as HTMLInputElement;
      toggle.checked = !toggle.checked;
      toggleSetting(settings, value)
    }
  };

  return (
    <div className={styles["wrapper-toggle"]}>
      
      {children}
      <label className={styles.switch}>
        <input
          type="checkbox"
          name={name}
          onChange={() => toggleSetting(settings, value)}
          onKeyDown={(e) => handleKeyPress(e, name)}        
        />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
    </div>
  );
};

export default Toggle;
