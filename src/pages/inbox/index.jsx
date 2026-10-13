import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiCheck, FiChevronDown, FiClock, FiCopy, FiEdit2, FiExternalLink, FiFilter, FiInbox, FiMessageCircle, FiMoreHorizontal, FiPlus, FiSearch, FiSend, FiTrash2 } from "react-icons/fi";
import { feedbackStatuses, sentimentOptions } from "../../data";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const timeAgo = (value) => {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours} hr ago` : `${Math.floor(hours / 24)} days ago`;
};
const avatarClass = (color) => `${styles.avatar} ${styles[color] || styles.plum}`;

const Inbox = ({ feedback, selectedId, onSelectFeedback, onUpdateFeedback, onOpenFeedback, onRequestDelete, onAddNote, onNotify, searchQuery, onSearchQueryChange, selectedTheme, onSelectTheme, onNewFeedback }) => {
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [sentimentFilter, setSentimentFilter] = useState("All sentiment");
  const [sort, setSort] = useState("Newest first");
  const [noteDrafts, setNoteDrafts] = useState({});
  const [replyDrafts, setReplyDrafts] = useState({});
  const [mobileDetail, setMobileDetail] = useState(false);
  const visible = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return [...feedback].filter((item) => {
      const matchesQuery = !query || [item.name, item.company, item.title, item.message, item.channel, ...item.tags].join(" ").toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All statuses" || item.status === statusFilter;
      const matchesSentiment = sentimentFilter === "All sentiment" || item.sentiment === sentimentFilter;
      const matchesTheme = !selectedTheme || item.tags.includes(selectedTheme);
      return matchesQuery && matchesStatus && matchesSentiment && matchesTheme;
    }).sort((a, b) => sort === "Oldest first" ? new Date(a.receivedAt) - new Date(b.receivedAt) : new Date(b.receivedAt) - new Date(a.receivedAt));
  }, [feedback, searchQuery, statusFilter, sentimentFilter, selectedTheme, sort]);
  const selected = visible.find((item) => item.id === selectedId) || visible[0] || null;
  const noteText = selected ? noteDrafts[selected.id] ?? "" : "";
  const replyDraft = selected ? replyDrafts[selected.id] ?? selected.responseDraft ?? "" : "";
  const setNoteText = (value) => { if (selected) setNoteDrafts((items) => ({ ...items, [selected.id]: value })); };
  const setReplyDraft = (value) => { if (selected) setReplyDrafts((items) => ({ ...items, [selected.id]: value })); };

  useEffect(() => {
    if (visible.length && !visible.some((item) => item.id === selectedId)) onSelectFeedback(visible[0].id);
    if (!visible.length && selectedId) onSelectFeedback(null);
  }, [visible, selectedId, onSelectFeedback]);

  const openRecord = (item) => { onSelectFeedback(item.id); setMobileDetail(true); };
  const saveNote = (event) => {
    event.preventDefault();
    if (selected && onAddNote(selected.id, noteText)) setNoteText("");
  };
  const saveReply = () => { if (selected) onUpdateFeedback(selected.id, { responseDraft: replyDraft }, "Reply draft saved."); };
  const copyReply = async () => {
    if (!replyDraft.trim()) { onNotify("Write a reply before copying it.", "error"); return; }
    try { await navigator.clipboard.writeText(replyDraft); onNotify("Reply copied to your clipboard."); }
    catch { onNotify("Clipboard access is unavailable in this browser.", "error"); }
  };

  return <div className={shared.page}>    <div className={styles.pageHeading}>
      <div><p className={shared.context}>Customer voice</p><h1>Feedback inbox</h1><p className={shared.intro}>Read the full note, add context, and move each conversation forward.</p></div>
      <button className={shared.primaryButton} type="button" onClick={onNewFeedback}><FiPlus aria-hidden="true" /> Add feedback</button>
    </div>

    <div className={styles.toolbar}>
      <label className={styles.search}><FiSearch aria-hidden="true" /><input aria-label="Find feedback" value={searchQuery} onChange={(event) => onSearchQueryChange(event.target.value)} placeholder="Find a customer or phrase" /></label>
      <label className={styles.filter}><FiFilter aria-hidden="true" /><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option>{feedbackStatuses.map((item) => <option key={item}>{item}</option>)}</select><FiChevronDown aria-hidden="true" /></label>
      <label className={styles.filter}><select aria-label="Filter by sentiment" value={sentimentFilter} onChange={(event) => setSentimentFilter(event.target.value)}><option>All sentiment</option>{sentimentOptions.map((item) => <option key={item}>{item}</option>)}</select><FiChevronDown aria-hidden="true" /></label>
      <label className={styles.filter}><FiClock aria-hidden="true" /><select aria-label="Sort feedback" value={sort} onChange={(event) => setSort(event.target.value)}><option>Newest first</option><option>Oldest first</option></select><FiChevronDown aria-hidden="true" /></label>
      {selectedTheme ? <button className={styles.themeFilter} type="button" onClick={() => { onSelectFeedback(visible[0]?.id ?? null); onSearchQueryChange(""); onSelectTheme(""); onSelectTheme(""); }} aria-label={`Clear ${selectedTheme} theme filter`}>Theme: {selectedTheme}<span>×</span></button> : null}
    </div>

    <div className={styles.splitPane}>
      <section className={`${styles.listPane} ${mobileDetail ? styles.mobileHidden : ""}`} aria-label="Feedback list">
        <div className={styles.listHeader}><div><strong>{visible.length} {visible.length === 1 ? "note" : "notes"}</strong><span>{selectedTheme ? `about ${selectedTheme}` : "in this inbox"}</span></div><button type="button" aria-label="Add feedback" onClick={onNewFeedback}><FiPlus aria-hidden="true" /></button></div>
        {visible.length ? <div className={styles.listScroll}>{visible.map((item) => <button type="button" key={item.id} className={`${styles.feedbackItem} ${selected?.id === item.id ? styles.selectedItem : ""}`} onClick={() => openRecord(item)} aria-pressed={selected?.id === item.id}>
          <span className={avatarClass(item.color)}>{item.initials}</span><span className={styles.itemContent}><span className={styles.itemTop}><strong>{item.name}</strong><time>{timeAgo(item.receivedAt)}</time></span><span className={styles.itemCompany}>{item.company}</span><span className={styles.itemTitle}>{item.title}</span><span className={styles.itemBottom}><span className={`${styles.sentiment} ${styles[item.sentiment.toLowerCase()]}`}>{item.sentiment}</span><span>{item.channel}</span><span className={`${styles.statusDot} ${styles[item.status.toLowerCase().replace(" ", "")]}`}>{item.status}</span></span></span>
        </button>)}</div> : <div className={styles.empty}><span><FiInbox aria-hidden="true" /></span><strong>No feedback matches</strong><p>Try another search or clear a filter.</p><button type="button" onClick={() => { onSearchQueryChange(""); setStatusFilter("All statuses"); setSentimentFilter("All sentiment"); }}>Clear filters</button></div>}
      </section>

      <section className={`${styles.detailPane} ${mobileDetail ? styles.mobileVisible : ""}`} aria-label="Selected feedback detail">
        {selected ? <>
          <div className={styles.detailHeader}><button className={styles.backButton} type="button" onClick={() => setMobileDetail(false)}><FiArrowLeft aria-hidden="true" /> Back to inbox</button><div className={styles.detailActions}><button type="button" onClick={() => onOpenFeedback(selected)} aria-label="Edit feedback"><FiEdit2 aria-hidden="true" /></button><button className={styles.deleteButton} type="button" onClick={() => onRequestDelete(selected)} aria-label="Delete feedback"><FiTrash2 aria-hidden="true" /></button><button type="button" aria-label="More feedback options" onClick={() => onNotify("This feedback is already available in your workspace.")}><FiMoreHorizontal aria-hidden="true" /></button></div></div>
          <div className={styles.detailBody}>
            <div className={styles.recordMeta}><span>{selected.id}</span><span className={styles.metaDot}>·</span><span>{selected.channel}</span><span className={styles.metaDot}>·</span><time>{timeAgo(selected.receivedAt)}</time></div>
            <h2>{selected.title}</h2>
            <div className={styles.customerLine}><span className={avatarClass(selected.color)}>{selected.initials}</span><span><strong>{selected.name}</strong><small>{selected.role || "Customer"} at {selected.company}</small></span><a href={`mailto:${selected.email}`} aria-label={`Email ${selected.name}`}><FiExternalLink aria-hidden="true" /> Contact</a></div>
            <blockquote className={styles.quote}><FiMessageCircle aria-hidden="true" /><p>{selected.message}</p></blockquote>
            <div className={styles.attributeRow}><label>Status<select aria-label="Update feedback status" value={selected.status} onChange={(event) => onUpdateFeedback(selected.id, { status: event.target.value }, `Status changed to ${event.target.value}.`)}>{feedbackStatuses.map((item) => <option key={item}>{item}</option>)}</select></label><label>Sentiment<select aria-label="Update sentiment" value={selected.sentiment} onChange={(event) => onUpdateFeedback(selected.id, { sentiment: event.target.value }, `Sentiment updated to ${event.target.value.toLowerCase()}.`)}>{sentimentOptions.map((item) => <option key={item}>{item}</option>)}</select></label></div>
            <div className={styles.tagSection}><strong>Product themes</strong><div>{selected.tags.length ? selected.tags.map((tag) => <button className={styles.tag} key={tag} type="button" onClick={() => onSelectTheme(tag)}>{tag}</button>) : <span className={styles.noTags}>No themes assigned yet</span>}</div></div>
            <section className={styles.notesSection}><div className={styles.sectionTitle}><h3>Team notes</h3><span>{selected.notes.length}</span></div>
              {selected.notes.length ? <div className={styles.notesList}>{selected.notes.map((note) => <article className={styles.note} key={note.id}><span className={styles.noteAvatar}>ST</span><div><strong>Studio team <time>{timeAgo(note.createdAt)}</time></strong><p>{note.text}</p></div></article>)}</div> : <p className={styles.noNotes}>Keep private context here so your team has the full picture.</p>}
              <form className={styles.noteForm} onSubmit={saveNote}><textarea aria-label="Add an internal note" value={noteText} onChange={(event) => setNoteText(event.target.value)} placeholder="Add an internal note..." rows="2" /><button type="submit" aria-label="Add team note"><FiSend aria-hidden="true" /></button></form>
            </section>
            <section className={styles.replySection}><div className={styles.sectionTitle}><div><h3>Reply draft</h3><p>This stays a draft in the frontend demo.</p></div><span><FiCheck aria-hidden="true" /> Private</span></div><textarea aria-label="Draft a customer reply" value={replyDraft} onChange={(event) => setReplyDraft(event.target.value)} placeholder="Write a thoughtful response..." rows="3" /><div className={styles.replyActions}><button type="button" className={styles.copyButton} onClick={copyReply}><FiCopy aria-hidden="true" /> Copy draft</button><button type="button" className={styles.saveButton} onClick={saveReply}>Save draft</button></div></section>
          </div>
        </> : <div className={styles.detailEmpty}><span><FiInbox aria-hidden="true" /></span><h2>Select a customer note</h2><p>Choose a conversation to see its full story and add team context.</p></div>}
      </section>
    </div>
  </div>;
};

export default Inbox;
