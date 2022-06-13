import styles from "../styles/Home.module.css";

// Component that only serves for loading a temporary page before
// the translations backend gives results
const HomeLoader = () => {
  return <div className={styles.page}></div>;
};

export default HomeLoader;
