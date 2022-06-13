import styles from "./LoaderPage.module.css";

const LoaderPage = () => {
  return (
    <div className={styles.page}>
      <div className={`${styles["loader-basis"]} ${styles["loader"]}`}></div>
      <div className={`${styles["loader-basis"]} ${styles["second-loader"]}`}></div>
      <div className={`${styles["loader-basis"]} ${styles["third-loader"]}`}></div>
      <h1 className={styles.title}>Loading maketionary</h1>
    </div>
  );
};

export default LoaderPage;
