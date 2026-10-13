import { FiGithub, FiPlus, FiSearch } from "react-icons/fi";
import styles from "./styles.module.css";

const Header = ({ pageTitle, searchValue, onSearchChange, onSearch, onAdd }) => (
  <header className={styles.header}>
    <div className={styles.location}>
      <span>Customer voice</span>
      <span className={styles.slash}>/</span>
      <strong>{pageTitle}</strong>
    </div>
    <form className={styles.search} onSubmit={(event) => { event.preventDefault(); onSearch(searchValue.trim()); }}>
      <FiSearch aria-hidden="true" />
      <input aria-label="Search feedback" placeholder="Search feedback" value={searchValue} onChange={(event) => onSearchChange(event.target.value)} />
      <kbd>Enter</kbd>
    </form>
    <button className={styles.addButton} type="button" onClick={onAdd}><FiPlus aria-hidden="true" /><span>Add feedback</span></button>
    <a className={styles.repoLink} href="https://github.com/a2rp/customer-feedback-platform" target="_blank" rel="noreferrer" aria-label="Open GitHub repository in a new tab"><FiGithub aria-hidden="true" /><span>Repository</span></a>
  </header>
);

export default Header;
