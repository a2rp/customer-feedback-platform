import { FiCoffee, FiCode, FiFacebook, FiGithub, FiGift, FiGlobe, FiHeart, FiLinkedin, FiMail, FiYoutube } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import styles from "./styles.module.css";

const links = [
  { label: "Portfolio", href: "https://www.ashishranjan.net", Icon: FiGlobe },
  { label: "GitHub", href: "https://github.com/a2rp", Icon: FiGithub },
  { label: "CodePen", href: "https://codepen.io/ash1198", Icon: FiCode },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", Icon: FiLinkedin },
  { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", Icon: FiFacebook },
  { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", Icon: FiYoutube },
  { label: "Email", href: "mailto:ash.ranjan09@gmail.com", Icon: FiMail },
  { label: "Support", href: "https://a2rp-donation-page.netlify.app/", Icon: FiHeart },
  { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/ashishranjan", Icon: FiCoffee },
  { label: "Patreon", href: "https://www.patreon.com/ashishranjan", Icon: FiGift },
  { label: "Source code", href: "https://github.com/a2rp/customer-feedback-platform", Icon: FiGithub },
];

const tooltipDestination = (href) => href.startsWith("mailto:") ? href.slice(7) : `${new URL(href).host}${new URL(href).pathname}`.replace(/\/$/, "");

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.copyright}>
      <a className={styles.logoLink} href="https://www.ashishranjan.net" aria-label="Ashish Ranjan portfolio"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan logo" /></a>
      <p>© {new Date().getFullYear()} <a className={styles.name} href="https://www.ashishranjan.net">Ashish Ranjan</a>. All rights reserved.</p>
    </div>
    <nav className={styles.links} aria-label="Creator links">
      {links.map(({ label, href, Icon }) => (
        <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} aria-label={label} data-tooltip-id="creator-links-tooltip" data-tooltip-content={`${label}\n${tooltipDestination(href)}`}>
          <Icon aria-hidden="true" />
        </a>
      ))}
    </nav>
    <Tooltip id="creator-links-tooltip" place="top" delayShow={300} arrowColor="#282638" className={styles.tooltip} render={({ content }) => {
      if (!content) return null;
      const [label, destination] = String(content).split("\n");
      return <span className={styles.tooltipContent}><strong>{label}</strong><small>{destination}</small></span>;
    }} />
  </footer>
);

export default Footer;
