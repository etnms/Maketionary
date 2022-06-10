import styles from "./ErrorMessage.module.css";

interface IErrorMessage {
  message: string;
}
const ErrorMessage = (props: React.PropsWithChildren<IErrorMessage>) => {
  const { message } = props;
  return <p className={styles.message}>{message}</p>;
};

export default ErrorMessage;
