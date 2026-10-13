import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Modal = ({ title, description, onClose, children, wide = false }) => {
  const panelRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    panelRef.current?.focus();
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("keydown", onKeyDown); previous?.focus?.(); };
  }, [onClose]);

  return <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className={`${styles.panel} ${wide ? styles.wide : ""}`} role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby={description ? "dialog-description" : undefined} tabIndex={-1} ref={panelRef}>
      <header className={styles.header}>
        <div><h2 id="dialog-title">{title}</h2>{description ? <p id="dialog-description">{description}</p> : null}</div>
        <button className={styles.close} type="button" aria-label="Close dialog" onClick={onClose}><FiX aria-hidden="true" /></button>
      </header>
      {children}
    </section>
  </div>;
};

export default Modal;
