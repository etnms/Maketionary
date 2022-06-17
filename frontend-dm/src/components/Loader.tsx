import React from "react";
import styles from "./Loader.module.css";

interface ILoaderStyle {
  width: number;
  height:  number;
}
const Loader = ({width, height}: React.PropsWithChildren<ILoaderStyle>) => {
  return <div className={styles.loader} style={{width: width, height: height}}></div>;
};

export default Loader;
