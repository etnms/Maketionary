import React from 'react';
import styles from "./ConfirmMessage.module.css";

interface IConfirm {
    message: string
}
const ConfirmMessage = ({message}: React.PropsWithChildren<IConfirm>) => {
    return <p className={styles.message}>{message}</p>;
};

export default ConfirmMessage;