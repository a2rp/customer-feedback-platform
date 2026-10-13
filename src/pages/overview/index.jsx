import { FiArrowRight, FiBarChart2, FiChevronRight, FiMessageSquare, FiPlus, FiThumbsDown, FiThumbsUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import shared from "../shared.module.css";

const relativeDate = (value) => {
  const hours = Math.max(1, Math.floor((Date.now() - new Date(value).getTime()) / 3600000));
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
};
const initialsClass = (color) => `${styles.avatar} ${styles[color] || styles.plum}`;
const dayName = (date) => new Intl.DateTimeFormat("en", { weekday: "short" }).format(date);

const Overview = ({ feedback, onSelectFeedback, onSelectTheme, onNewFeedback }) => {
  const navigate = useNavigate();
  const dateLabel = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  const positive = feedback.filter((item) => item.sentiment === "Positive").length;
  const negative = feedback.filter((item) => item.sentiment === "Negative").length;
  const waiting = feedback.filter((item) => item.status === "New" || item.status === "In review").length;
  const themes = [...new Set(feedback.flatMap((item) => item.tags))].map((theme) => ({ theme, count: feedback.filter((item) => item.tags.includes(theme)).length })).sort((a, b) => b.count - a.count).slice(0, 4);
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setDate(date.getDate() - (6 - index)); date.setHours(0, 0, 0, 0);
    const count = feedback.filter((item) => { const received = new Date(item.receivedAt); return received.toDateString() === date.toDateString(); }).length;
    return { label: dayName(date), count };
  });
  const maxWeek = Math.max(1, ...week.map((item) => item.count));
  const latest = [...feedback].sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)).slice(0, 4);
  const openCount = Math.max(waiting, 0);
  const goToFeedback = (item) => { onSelectFeedback(item.id); navigate("/inbox"); };

  return <div className={shared.page}>
    <div className={shared.pageHeading}>
      <div><p className={shared.context}>{dateLabel}</p><h1>Listen closely.</h1><p className={shared.intro}>A thoughtful view of what your customers need next.</p></div>
      <div className={shared.headingActions}><button className={shared.secondaryButton} type="button" onClick={() => navigate("/inbox")}><FiMessageSquare aria-hidden="true" /> Open inbox</button><button className={shared.primaryButton} type="button" onClick={onNewFeedback}><FiPlus aria-hidden="true" /> Capture feedback</button></div>
    </div>

    <section className={styles.metricGrid} aria-label="Feedback summary">
      <article className={`${styles.metricCard} ${styles.metricPrimary}`}><span className={styles.metricIcon}><FiMessageSquare aria-hidden="true" /></span><div><span>Customer voices</span><strong>{feedback.length}</strong><small>Across every channel</small></div><span className={styles.metricArrow}><FiArrowRight aria-hidden="true" /></span></article>
      <article className={styles.metricCard}><span className={`${styles.metricIcon} ${styles.positiveIcon}`}><FiThumbsUp aria-hidden="true" /></span><div><span>Positive signals</span><strong>{positive}</strong><small>{feedback.length ? Math.round((positive / feedback.length) * 100) : 0}% of captured feedback</small></div></article>
      <article className={styles.metricCard}><span className={`${styles.metricIcon} ${styles.attentionIcon}`}><FiThumbsDown aria-hidden="true" /></span><div><span>Needs a response</span><strong>{openCount}</strong><small>New or being reviewed</small></div></article>
    </section>

    <div className={styles.dashboardGrid}>
      <section className={styles.panel}>
        <div className={styles.panelHeading}><div><h2>Voice over the week</h2><p>Feedback received in the last seven days</p></div><span className={styles.panelIcon}><FiBarChart2 aria-hidden="true" /></span></div>
        <div className={styles.chartSummary}><strong>{feedback.length}</strong><span>total notes in this workspace</span></div>
        <div className={styles.chart} role="img" aria-label={`Daily feedback totals: ${week.map((item) => `${item.label} ${item.count}`).join(", ")}`}>
          {week.map((item, index) => <div className={styles.chartColumn} key={`${item.label}-${index}`}><span className={styles.barValue}>{item.count || ""}</span><div className={styles.barTrack}><span className={styles.bar} style={{ height: `${Math.max(item.count ? 20 : 4, (item.count / maxWeek) * 100)}%` }} /></div><span className={styles.day}>{item.label}</span></div>)}
        </div>
        <div className={styles.chartFoot}><span><i /> Feedback notes</span><button type="button" onClick={() => navigate("/inbox")}>See all feedback <FiArrowRight aria-hidden="true" /></button></div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeading}><div><h2>What people are saying</h2><p>Sentiment across every note</p></div><span className={styles.panelIcon}><FiThumbsUp aria-hidden="true" /></span></div>
        <div className={styles.sentimentNumbers}><span><i className={styles.greenDot} />Positive <strong>{positive}</strong></span><span><i className={styles.grayDot} />Neutral <strong>{feedback.filter((item) => item.sentiment === "Neutral").length}</strong></span><span><i className={styles.redDot} />Negative <strong>{negative}</strong></span></div>
        <div className={styles.sentimentTrack} aria-label="Sentiment distribution">
          {feedback.length ? <><span className={styles.greenTrack} style={{ width: `${(positive / feedback.length) * 100}%` }} /><span className={styles.neutralTrack} style={{ width: `${(feedback.filter((item) => item.sentiment === "Neutral").length / feedback.length) * 100}%` }} /><span className={styles.redTrack} style={{ width: `${(negative / feedback.length) * 100}%` }} /></> : null}
        </div>
        <div className={styles.insightNote}><span className={styles.noteMark}>↗</span><p><strong>{positive > negative ? "More customers are sharing positive signals." : "There are themes worth a closer look."}</strong><br />Open the inbox to read the notes behind the numbers.</p></div>
      </section>

      <section className={`${styles.panel} ${styles.latestPanel}`}>
        <div className={styles.panelHeading}><div><h2>Recently heard</h2><p>The latest notes from your customers</p></div><button className={styles.textAction} type="button" onClick={() => navigate("/inbox")}>View inbox <FiArrowRight aria-hidden="true" /></button></div>
        <div className={styles.feedbackList}>
          {latest.map((item) => <button className={styles.feedbackRow} type="button" key={item.id} onClick={() => goToFeedback(item)}>
            <span className={initialsClass(item.color)}>{item.initials}</span><span className={styles.feedbackCopy}><strong>{item.title}</strong><small>{item.name} · {item.company}</small></span><span className={`${styles.sentiment} ${styles[item.sentiment.toLowerCase()]}`}>{item.sentiment}</span><span className={styles.rowDate}>{relativeDate(item.receivedAt)}</span><FiChevronRight className={styles.chevron} aria-hidden="true" />
          </button>)}
        </div>
      </section>

      <section className={`${styles.panel} ${styles.themesPanel}`}>
        <div className={styles.panelHeading}><div><h2>Themes to explore</h2><p>Topics customers mention most</p></div><button className={styles.textAction} type="button" onClick={() => navigate("/insights")}>All insights <FiArrowRight aria-hidden="true" /></button></div>
        <div className={styles.themeList}>{themes.map(({ theme, count }, index) => <button type="button" className={styles.themeRow} key={theme} onClick={() => onSelectTheme(theme)}><span className={`${styles.themeNumber} ${styles[`themeTone${index + 1}`]}`}>{String(index + 1).padStart(2, "0")}</span><span><strong>{theme}</strong><small>{count} customer {count === 1 ? "note" : "notes"}</small></span><span className={styles.themeBar}><i style={{ width: `${Math.max(18, (count / Math.max(1, themes[0]?.count)) * 100)}%` }} /></span><FiChevronRight aria-hidden="true" /></button>)}</div>
      </section>
    </div>
  </div>;
};

export default Overview;
