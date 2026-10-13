import { FiArrowRight, FiChevronRight, FiMessageSquare, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import shared from "../shared.module.css";
import styles from "./styles.module.css";

const Insights = ({ feedback, onSelectFeedback, onSelectTheme }) => {
  const navigate = useNavigate();
  const sentiments = ["Positive", "Neutral", "Negative"];
  const colors = { Positive: styles.positive, Neutral: styles.neutral, Negative: styles.negative };
  const total = feedback.length || 1;
  const themes = [...new Set(feedback.flatMap((item) => item.tags))].map((name) => {
    const notes = feedback.filter((item) => item.tags.includes(name));
    return { name, notes, total: notes.length, positive: notes.filter((item) => item.sentiment === "Positive").length, neutral: notes.filter((item) => item.sentiment === "Neutral").length, negative: notes.filter((item) => item.sentiment === "Negative").length };
  }).sort((a, b) => b.total - a.total || b.negative - a.negative);
  const counts = Object.fromEntries(sentiments.map((sentiment) => [sentiment, feedback.filter((item) => item.sentiment === sentiment).length]));
  const channels = [...new Set(feedback.map((item) => item.channel))].map((channel) => ({ channel, count: feedback.filter((item) => item.channel === channel).length })).sort((a, b) => b.count - a.count);
  const risks = feedback.filter((item) => item.sentiment === "Negative" && item.status !== "Resolved").sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt));
  const openTheme = (name) => onSelectTheme(name);
  const openFeedback = (item) => { onSelectFeedback(item.id); navigate("/inbox"); };

  return <div className={shared.page}>
    <div className={shared.pageHeading}><div><p className={shared.context}>Patterns in the conversation</p><h1>Themes & insights</h1><p className={shared.intro}>See what customers return to, and where a closer look may help.</p></div><button className={shared.secondaryButton} type="button" onClick={() => navigate("/inbox")}><FiMessageSquare aria-hidden="true" /> Browse all feedback</button></div>

    <section className={styles.summaryStrip} aria-label="Feedback insight summary">
      <div className={styles.summaryLead}><span><FiTrendingUp aria-hidden="true" /></span><div><strong>{themes.length} customer themes</strong><p>Across {feedback.length} feedback {feedback.length === 1 ? "note" : "notes"} in this demo workspace</p></div></div>
      <div className={styles.summaryStat}><span>Most discussed</span><strong>{themes[0]?.name || "No themes yet"}</strong></div>
      <div className={styles.summaryStat}><span>Needs attention</span><strong>{risks.length} {risks.length === 1 ? "note" : "notes"}</strong></div>
    </section>

    <div className={styles.analysisGrid}>
      <section className={styles.analysisCard}><div className={styles.cardHeading}><div><h2>Theme momentum</h2><p>Number of customer notes by theme</p></div><span className={styles.period}>All feedback</span></div>
        <div className={styles.momentumList}>{themes.map((item, index) => <button className={styles.momentumRow} type="button" key={item.name} onClick={() => openTheme(item.name)}>
          <span className={`${styles.rank} ${index < 3 ? styles[`rank${index + 1}`] : ""}`}>{String(index + 1).padStart(2, "0")}</span><span className={styles.themeLabel}><strong>{item.name}</strong><small>{item.positive} positive · {item.negative} negative</small></span><span className={styles.momentumTrack}><i style={{ width: `${Math.max(5, (item.total / (themes[0]?.total || 1)) * 100)}%` }} /></span><strong className={styles.themeTotal}>{item.total}</strong><FiChevronRight aria-hidden="true" />
        </button>)}</div>
        {!themes.length ? <div className={styles.noData}>Add customer feedback with themes to see patterns here.</div> : null}
      </section>

      <section className={`${styles.analysisCard} ${styles.sentimentCard}`}><div className={styles.cardHeading}><div><h2>Sentiment balance</h2><p>How feedback is landing today</p></div></div>
        <div className={styles.sentimentOverview}><div className={styles.donut} style={{ "--positive": `${(counts.Positive / total) * 100}%`, "--neutral": `${((counts.Positive + counts.Neutral) / total) * 100}%` }}><div><strong>{feedback.length}</strong><span>notes</span></div></div><div className={styles.sentimentLegend}>{sentiments.map((sentiment) => <div key={sentiment}><span className={`${styles.legendDot} ${colors[sentiment]}`} /><span>{sentiment}</span><strong>{counts[sentiment]}</strong><small>{Math.round((counts[sentiment] / total) * 100)}%</small></div>)}</div></div>
        <div className={styles.sentimentCallout}><strong>{counts.Negative ? "A few experiences need a human follow-up." : "No unresolved negative signals."}</strong><p>{counts.Negative} negative notes have been shared across the feedback inbox.</p></div>
      </section>

      <section className={`${styles.analysisCard} ${styles.channelCard}`}><div className={styles.cardHeading}><div><h2>Where feedback comes from</h2><p>Channels used in this workspace</p></div></div>
        <div className={styles.channelList}>{channels.map(({ channel, count }) => <div className={styles.channelRow} key={channel}><span>{channel}</span><div><i style={{ width: `${Math.max(5, (count / Math.max(1, channels[0]?.count)) * 100)}%` }} /></div><strong>{count}</strong></div>)}</div>
      </section>

      <section className={`${styles.analysisCard} ${styles.riskCard}`}><div className={styles.cardHeading}><div><h2>Follow up with care</h2><p>Unresolved negative feedback</p></div><span className={styles.riskCount}>{risks.length}</span></div>
        <div className={styles.riskList}>{risks.slice(0, 3).map((item) => <button type="button" className={styles.riskRow} key={item.id} onClick={() => openFeedback(item)}><span className={styles.riskSignal} /><span><strong>{item.title}</strong><small>{item.name} · {item.company}</small></span><FiArrowRight aria-hidden="true" /></button>)}</div>
        {risks.length === 0 ? <div className={styles.allClear}><span>✓</span><strong>Nothing waiting for a response</strong><p>New negative feedback will appear here.</p></div> : null}
        {risks.length > 3 ? <button className={styles.viewMore} type="button" onClick={() => { onSelectTheme(""); navigate("/inbox"); }}>See all {risks.length} notes <FiArrowRight aria-hidden="true" /></button> : null}
      </section>
    </div>
    <p className={styles.disclaimer}>Insights update from the feedback in this browser session. They are not shared across devices.</p>
  </div>;
};

export default Insights;
