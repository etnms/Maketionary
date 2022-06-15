import { useTranslation } from "react-i18next";
import styles from "./LoaderPage.module.css";

const LoaderPage = () => {
  const {t} = useTranslation()
  return (
    <div className={styles.page}>
      <div className={`${styles["loader-basis"]} ${styles["loader"]}`}></div>
      <div className={`${styles["loader-basis"]} ${styles["second-loader"]}`}></div>
      <div className={`${styles["loader-basis"]} ${styles["third-loader"]}`}></div>
      <h1 className={styles.title}>{t("loading.title")}</h1>
    </div>
  );
};

export default LoaderPage;
