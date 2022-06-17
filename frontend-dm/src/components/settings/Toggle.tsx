import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import styles from "./Toggle.module.css";

interface IToggle {
  title: string;
  beforeText: string;
  afterText: string;
  name: string;
  setting: string;
  defaultValue: boolean;
  stateFunction: Function;
}

const Toggle = (props: React.PropsWithChildren<IToggle>) => {
  const { title, beforeText, afterText, defaultValue, name, setting, stateFunction } = props;

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Get toggle value
    const currentValue = JSON.parse(localStorage.getItem(setting)!);

    // if item not in localstorage give it default value
    if (currentValue === null) localStorage.setItem(setting, defaultValue.toString());
    // Display the value as checkbox
    const toggle = document.querySelector(`input[name=${name}]`) as HTMLInputElement;
    toggle.checked = currentValue;
  }, [name, setting, defaultValue]);

  //Toggle funtion for setting value
  const toggleSetting = (
    e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
    setting: string
  ) => {
    const storageValue = e.currentTarget.checked.toString();
    localStorage.setItem(setting, storageValue);
    dispatch(stateFunction(e.currentTarget.checked));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, name: string, setting: string) => {
    if (e.key === "Enter") {
      const toggle = document.querySelector(`input[name=${name}]`) as HTMLInputElement;
      toggle.checked = !toggle.checked;
      toggleSetting(e, setting);
    }
  };

  return (
    <div className={styles["wrapper-toggle"]}>
      <span>{title}</span>
      <span>{beforeText}</span>
      <label className={styles.switch}>
        <input
          type="checkbox"
          name={name}
          onChange={(e) => toggleSetting(e, setting)}
          onKeyDown={(e) => handleKeyPress(e, name, setting)}
          className={styles.toggle}
          aria-label="switch"
        />
        <span className={`${styles.slider} ${styles.round}`}></span>
      </label>
      <span>{afterText}</span>
    </div>
  );
};

export default Toggle;
