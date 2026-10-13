import { NavLink } from "react-router-dom";
import { FiBarChart2, FiGrid, FiInbox, FiMessageCircle, FiTag } from "react-icons/fi";
import styles from "./styles.module.css";

const Sidebar = ({ newCount, feedbackCount }) => {
  const links = [
    { to: "/overview", label: "Overview", Icon: FiGrid },
    { to: "/inbox", label: "Feedback inbox", Icon: FiInbox, badge: newCount },
    { to: "/insights", label: "Themes & insights", Icon: FiBarChart2 },
  ];

  return <aside className={styles.sidebar} aria-label="Workspace navigation">
    <a className={styles.brand} href="#/overview" aria-label="Sonder overview"><span className={styles.mark}><FiMessageCircle aria-hidden="true" /></span><span><strong>sonder</strong><small>customer voice</small></span></a>
    <div className={styles.sectionLabel}>WORKSPACE</div>
    <nav className={styles.nav}>
      {links.map(({ to, label, Icon, badge }) => <NavLink key={to} to={to} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}>
        <Icon aria-hidden="true" /><span>{label}</span>{badge > 0 ? <small>{badge}</small> : null}
      </NavLink>)}
    </nav>
    <div className={styles.sidebarBottom}>
      <div className={styles.voiceCard}><span><FiTag aria-hidden="true" /></span><div><strong>{feedbackCount} voices collected</strong><p>Every note helps shape what comes next.</p></div></div>
      <div className={styles.workspaceUser}><span>ST</span><div><strong>Studio team</strong><small>Feedback workspace</small></div></div>
    </div>
  </aside>;
};

export default Sidebar;
