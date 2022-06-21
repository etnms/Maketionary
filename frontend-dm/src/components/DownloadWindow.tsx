import React from "react";
import settingsStyle from "./Settings.module.css";
import styles from "./DownloadWindow.module.css";
import Loader from "./Loader";
import CloseIcon from "@mui/icons-material/Close";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import ErrorMessage from "./ErrorMessage";
import { setErrorDownload } from "../features/downloadFileSlice";
import { Dispatch } from "redux";

const DownloadWindow = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch: Dispatch<any> = useAppDispatch();
  const { t } = useTranslation();

  const isFileDownloading: boolean = useAppSelector((state) => state.download.isFileDownloading);
  const errorDownload: boolean = useAppSelector((state) => state.download.errorDownload);

  const closeWindow = () => {
    navigate("/dashboard");
    dispatch(setErrorDownload(false));
  };
  return (
    <div className={styles.download}>
      <div className={styles["download-box"]}>
        <button onClick={closeWindow} className={settingsStyle["btn-close"]}>
          <CloseIcon />
        </button>
        {errorDownload ? ( // Check for error
          <ErrorMessage message={t("download.errorDownload")} />
        ) : isFileDownloading ? ( // If no error check for status
          <>
            <p className={styles.text}>{t("download.text")}</p>
            <Loader width={24} height={24} />
          </>
        ) : (
          <p className={styles.text}>{t("download.noDownload")}</p>
        )}
      </div>
    </div>
  );
};

export default DownloadWindow;
