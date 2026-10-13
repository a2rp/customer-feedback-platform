import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import { sentimentOptions, themeOptions } from "../../data";
import Modal from "../modal";
import styles from "./styles.module.css";

const blank = { name: "", company: "", email: "", role: "", channel: "In-product", sentiment: "Neutral", title: "", message: "", tags: [] };

const FeedbackForm = ({ initialValues, onClose, onSave }) => {
  const [values, setValues] = useState(() => ({ ...blank, ...initialValues, tags: initialValues?.tags ? [...initialValues.tags] : [] }));
  const [attempted, setAttempted] = useState(false);
  const editing = Boolean(initialValues?.id);
  const errors = {
    name: !values.name.trim() ? "Add a customer name." : "",
    company: !values.company.trim() ? "Add the customer organization." : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) ? "Enter a valid email address." : "",
    title: !values.title.trim() ? "Add a short feedback title." : "",
    message: values.message.trim().length < 12 ? "Add a little more detail (at least 12 characters)." : "",
  };
  const update = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const toggleTag = (tag) => setValues((current) => ({ ...current, tags: current.tags.includes(tag) ? current.tags.filter((item) => item !== tag) : [...current.tags, tag] }));
  const submit = (event) => {
    event.preventDefault();
    setAttempted(true);
    if (Object.values(errors).some(Boolean)) return;
    onSave({ ...values, name: values.name.trim(), company: values.company.trim(), email: values.email.trim(), title: values.title.trim(), message: values.message.trim() });
  };

  return <Modal title={editing ? "Edit feedback" : "Add feedback"} description={editing ? "Update the customer note and its context." : "Capture a customer voice note for this workspace."} onClose={onClose} wide>
    <form className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.grid}>
        <label className={styles.field}>Customer name<input name="name" value={values.name} onChange={update} placeholder="e.g. Maya Chen" aria-invalid={Boolean(attempted && errors.name)} />{attempted && errors.name ? <small>{errors.name}</small> : null}</label>
        <label className={styles.field}>Organization<input name="company" value={values.company} onChange={update} placeholder="e.g. Northstar Labs" aria-invalid={Boolean(attempted && errors.company)} />{attempted && errors.company ? <small>{errors.company}</small> : null}</label>
        <label className={styles.field}>Email<input type="email" name="email" value={values.email} onChange={update} placeholder="name@company.com" aria-invalid={Boolean(attempted && errors.email)} />{attempted && errors.email ? <small>{errors.email}</small> : null}</label>
        <label className={styles.field}>Role<input name="role" value={values.role} onChange={update} placeholder="e.g. Product manager" /></label>
        <label className={styles.field}>Source<select name="channel" value={values.channel} onChange={update}><option>In-product</option><option>Email</option><option>Customer call</option><option>Review</option></select></label>
        <label className={styles.field}>Sentiment<select name="sentiment" value={values.sentiment} onChange={update}>{sentimentOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <label className={styles.field}>Feedback title<input name="title" value={values.title} onChange={update} placeholder="Summarize the feedback" aria-invalid={Boolean(attempted && errors.title)} />{attempted && errors.title ? <small>{errors.title}</small> : null}</label>
      <label className={styles.field}>Customer message<textarea name="message" value={values.message} onChange={update} rows="4" placeholder="What did the customer say?" aria-invalid={Boolean(attempted && errors.message)} />{attempted && errors.message ? <small>{errors.message}</small> : <span className={styles.hint}>Keep the customer's words intact where possible.</span>}</label>
      <fieldset className={styles.tags}><legend>Product themes</legend><div>{themeOptions.map((tag) => <button key={tag} className={values.tags.includes(tag) ? styles.selectedTag : styles.tag} type="button" onClick={() => toggleTag(tag)} aria-pressed={values.tags.includes(tag)}>{values.tags.includes(tag) ? <FiCheck aria-hidden="true" /> : null}{tag}</button>)}</div></fieldset>
      <div className={styles.actions}><button className={styles.cancel} type="button" onClick={onClose}>Cancel</button><button className={styles.save} type="submit">{editing ? "Save changes" : "Add to feedback"}</button></div>
    </form>
  </Modal>;
};

export default FeedbackForm;
