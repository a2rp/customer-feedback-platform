import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { initialFeedback } from "./data";
import ConfirmationDialog from "./components/confirmationdialog";
import FeedbackForm from "./components/feedbackform";
import Footer from "./components/footer";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Toast from "./components/toast";
import styles from "./App.module.css";

const pageTitles = { "/overview": "Overview", "/inbox": "Feedback inbox", "/insights": "Themes & insights" };

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [feedback, setFeedback] = useState(initialFeedback);
  const [selectedId, setSelectedId] = useState(initialFeedback[0]?.id ?? null);
  const [dialog, setDialog] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notices, setNotices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [inboxQuery, setInboxQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  const notify = useCallback((message, type = "success") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setNotices((items) => [...items.slice(-3), { id, message, type }]);
    window.setTimeout(() => setNotices((items) => items.filter((item) => item.id !== id)), 4200);
  }, []);
  const dismissToast = (id) => setNotices((items) => items.filter((item) => item.id !== id));
  const openNew = () => setDialog({ type: "new" });
  const openEdit = (record) => setDialog({ type: "edit", record });
  const saveFeedback = (values) => {
    if (dialog?.type === "edit") {
      setFeedback((items) => items.map((item) => item.id === dialog.record.id ? { ...item, ...values } : item));
      notify("Feedback details updated.");
    } else {
      const nextNumber = feedback.reduce((max, item) => Math.max(max, Number(item.id.split("-")[1]) || 0), 1000) + 1;
      const record = { ...values, id: `FB-${nextNumber}`, initials: values.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(), color: "plum", receivedAt: new Date().toISOString(), status: "New", notes: [], responseDraft: "" };
      setFeedback((items) => [record, ...items]);
      setSelectedId(record.id);
      setInboxQuery("");
      setSelectedTheme("");
      notify("Feedback added to the inbox.");
      navigate("/inbox");
    }
    setDialog(null);
  };
  const updateFeedback = (id, changes, message) => {
    setFeedback((items) => items.map((item) => item.id === id ? { ...item, ...changes } : item));
    if (message) notify(message);
  };
  const addNote = (id, text) => {
    if (!text.trim()) { notify("Write a note before adding it.", "error"); return false; }
    const note = { id: `N-${Date.now()}`, text: text.trim(), createdAt: new Date().toISOString() };
    setFeedback((items) => items.map((item) => item.id === id ? { ...item, notes: [...item.notes, note] } : item));
    notify("Internal note added.");
    return true;
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    const removedId = deleteTarget.id;
    const next = feedback.filter((item) => item.id !== removedId);
    setFeedback(next);
    if (selectedId === removedId) setSelectedId(next[0]?.id ?? null);
    setDeleteTarget(null);
    notify("Feedback removed from this demo session.");
  };
  const submitSearch = (query) => {
    setInboxQuery(query);
    setSelectedTheme("");
    navigate("/inbox");
  };
  const selectTheme = (theme) => {
    setSelectedTheme(theme);
    setInboxQuery("");
    navigate("/inbox");
  };

  const pageProps = {
    feedback,
    selectedId,
    onNewFeedback: openNew,
    onSelectFeedback: setSelectedId,
    onUpdateFeedback: updateFeedback,
    onOpenFeedback: openEdit,
    onRequestDelete: setDeleteTarget,
    onAddNote: addNote,
    onNotify: notify,
    searchQuery: inboxQuery,
    onSearchQueryChange: setInboxQuery,
    selectedTheme,
    onSelectTheme: selectTheme,
  };
  const title = pageTitles[location.pathname] || "Workspace";

  return <div className={styles.app}>
    <Sidebar newCount={feedback.filter((item) => item.status === "New").length} feedbackCount={feedback.length} />
    <Header pageTitle={title} searchValue={searchValue} onSearchChange={setSearchValue} onSearch={submitSearch} onAdd={openNew} />
    <main className={styles.main} id="main-content"><AppRoutes pageProps={pageProps} /><Footer /></main>
    {dialog ? <FeedbackForm initialValues={dialog.type === "edit" ? dialog.record : null} onClose={() => setDialog(null)} onSave={saveFeedback} /> : null}
    {deleteTarget ? <ConfirmationDialog itemName={deleteTarget.title} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} /> : null}
    <Toast items={notices} onDismiss={dismissToast} />
  </div>;
};

export default App;


