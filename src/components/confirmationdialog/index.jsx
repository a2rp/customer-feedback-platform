import { FiTrash2 } from "react-icons/fi";
import Modal from "../modal";
import styles from "./styles.module.css";

const ConfirmationDialog = ({ itemName, onCancel, onConfirm }) => (
  <Modal title="Remove this feedback?" description="This change applies to the current demo session." onClose={onCancel}>
    <div className={styles.body}>
      <span className={styles.icon}><FiTrash2 aria-hidden="true" /></span>
      <p><strong>{itemName}</strong> will be removed from this workspace. This action cannot be undone.</p>
      <div className={styles.actions}>
        <button className={styles.cancel} type="button" onClick={onCancel}>Keep feedback</button>
        <button className={styles.remove} type="button" onClick={onConfirm}><FiTrash2 aria-hidden="true" /> Remove feedback</button>
      </div>
    </div>
  </Modal>
);

export default ConfirmationDialog;
