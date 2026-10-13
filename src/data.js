const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

export const feedbackStatuses = ["New", "In review", "Planned", "Resolved"];
export const sentimentOptions = ["Positive", "Neutral", "Negative"];
export const themeOptions = ["Reporting", "Onboarding", "Integrations", "Workflow", "Mobile", "Support", "Pricing"];

export const initialFeedback = [
  {
    id: "FB-1048", name: "Anita Bose", initials: "AB", color: "plum", role: "Operations lead", company: "Sisu Health", email: "anita@sisuhealth.example", channel: "In-product", receivedAt: hoursAgo(1), sentiment: "Positive", status: "New", title: "The weekly digest saved our Monday review", message: "The Monday digest is the first thing I open now. Our team used to spend half an hour pulling updates together, and it gives us a clean starting point. I would love a way to choose which sections each teammate sees.", tags: ["Reporting", "Workflow"], notes: [], responseDraft: ""
  },
  {
    id: "FB-1047", name: "Marcus Lee", initials: "ML", color: "blue", role: "Product manager", company: "Fieldnote", email: "marcus@fieldnote.example", channel: "Email", receivedAt: hoursAgo(3), sentiment: "Negative", status: "In review", title: "Invite links expire before my team can use them", message: "I invited five contractors for a short project. Two of them opened the invitation the next morning and it had already expired. Could the link stay active for at least a day, or let me resend it from the team page?", tags: ["Onboarding", "Workflow"], notes: [{ id: "N-1", text: "Support confirmed the current invite window is 12 hours. Product review scheduled for Thursday.", createdAt: hoursAgo(2) }], responseDraft: "Thanks for flagging the short invite window. We are reviewing a longer expiration period and an easier resend option."
  },
  {
    id: "FB-1046", name: "Mina Patel", initials: "MP", color: "coral", role: "Founder", company: "Orchard Finance", email: "mina@orchard.example", channel: "Customer call", receivedAt: hoursAgo(7), sentiment: "Neutral", status: "Planned", title: "A read-only export would help our finance team", message: "We can see all of our activity in the app, which is great. Finance needs a read-only CSV once a month for reconciliation. A scheduled export would be useful, but even a simple manual download would unblock us.", tags: ["Reporting", "Integrations"], notes: [], responseDraft: ""
  },
  {
    id: "FB-1045", name: "Evan Brooks", initials: "EB", color: "mint", role: "Design director", company: "Common Thread", email: "evan@commonthread.example", channel: "Review", receivedAt: hoursAgo(12), sentiment: "Positive", status: "Resolved", title: "Small details make this feel considered", message: "I appreciate the keyboard shortcuts and the way filters stay put when I return. It is a calm tool to work in. We switched our whole studio last month and the team picked it up without a training session.", tags: ["Onboarding", "Workflow"], notes: [], responseDraft: ""
  },
  {
    id: "FB-1044", name: "Priya Nair", initials: "PN", color: "gold", role: "Customer success", company: "Morrow Learning", email: "priya@morrow.example", channel: "In-product", receivedAt: hoursAgo(19), sentiment: "Negative", status: "In review", title: "I cannot connect our shared support inbox", message: "Our support team shares one mailbox, so the connection flow does not recognize an individual owner. We need to connect the shared address and make sure replies still show the right teammate.", tags: ["Integrations", "Support"], notes: [], responseDraft: ""
  },
  {
    id: "FB-1043", name: "Sofia Chen", initials: "SC", color: "rose", role: "Research lead", company: "Northstar Labs", email: "sofia@northstar.example", channel: "Email", receivedAt: hoursAgo(28), sentiment: "Neutral", status: "New", title: "Could we compare feedback across releases?", message: "We collect a lot of useful notes after each launch. I would like to compare the themes from one release to another and see whether a change actually reduced the reports we were getting.", tags: ["Reporting"], notes: [], responseDraft: ""
  },
  {
    id: "FB-1042", name: "Daniel Ortiz", initials: "DO", color: "blue", role: "Account manager", company: "Brightline Goods", email: "daniel@brightline.example", channel: "Customer call", receivedAt: hoursAgo(41), sentiment: "Positive", status: "Planned", title: "The mobile view finally fits my day", message: "I can review notes between visits now without pinching around a desktop layout. The quick status update is especially helpful. Please keep the key actions this easy to reach.", tags: ["Mobile", "Workflow"], notes: [], responseDraft: ""
  },
  {
    id: "FB-1041", name: "Jules Martin", initials: "JM", color: "plum", role: "Studio owner", company: "Sunday Studio", email: "jules@sunday.example", channel: "Review", receivedAt: hoursAgo(55), sentiment: "Negative", status: "Resolved", title: "I got stuck setting up my first workspace", message: "I was not sure what to do after creating the workspace. A short guided checklist with an example project would help new teams feel confident before they invite everyone.", tags: ["Onboarding", "Support"], notes: [{ id: "N-2", text: "Sent the getting-started guide and added the setup checklist request to the onboarding review.", createdAt: hoursAgo(47) }], responseDraft: ""
  }
];
