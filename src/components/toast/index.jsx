import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Toast = ({ items, onDismiss }) => (
  <div className={styles.stack} aria-live="polite" aria-relevant="additions">
    {items.map((item) => {
      const Icon = item.type === "error" ? FiAlertCircle : FiCheckCircle;
      return <div className={`${styles.toast} ${item.type === "error" ? styles.error : ""}`} key={item.id} role={item.type === "error" ? "alert" : "status"}>
        <Icon aria-hidden="true" />
        <span>{item.message}</span>
        <button type="button" aria-label="Dismiss notification" onClick={() => onDismiss(item.id)}><FiX aria-hidden="true" /></button>
      </div>;
    })}
  </div>
);

export default Toast;
