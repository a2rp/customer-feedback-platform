import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

const Modal = ({ title, description, onClose, children, wide = false }) => {
  const panelRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const panel = panelRef.current;
    const getFocusable = () => [...(panel?.querySelectorAll(focusableSelector) ?? [])];
    const focusFirst = () => (getFocusable()[0] || panel)?.focus();
    focusFirst();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = getFocusable();
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first) {
        event.preventDefault();
        panel.focus();
      } else if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const keepFocusInside = (event) => {
      if (panel && !panel.contains(event.target)) focusFirst();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", keepFocusInside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", keepFocusInside);
      if (previous instanceof HTMLElement && previous.isConnected && previous.getClientRects().length) {
        previous.focus();
      } else {
        document.querySelector("#main-content")?.focus();
      }
    };
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
