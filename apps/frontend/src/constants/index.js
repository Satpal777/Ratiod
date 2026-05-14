export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
export const AUTH_BASE_URL = `${API_BASE_URL}/api/auth`;

export const navLinks = ["Product", "How it works", "Live demo", "Community"];

export const stats = [
  { value: "12K+", label: "polls launched every week" },
  { value: "2.4M", label: "votes counted in real time" },
  { value: "180+", label: "communities using Ratio'd daily" },
];

export const showcasePolls = [
  {
    category: "Tech launch",
    title: "Which feature should go live first?",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    votes: "18.2K votes",
  },
  {
    category: "Food debate",
    title: "What wins the community vote tonight?",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    votes: "9.4K votes",
  },
  {
    category: "Creator poll",
    title: "Pick the next livestream challenge.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    votes: "24.6K votes",
  },
];

export const featureCards = [
  {
    eyebrow: "Instant setup",
    title: "Create polls instantly.",
    text: "Write a question, add options, and share before the moment passes.",
    icon: "bolt",
  },
  {
    eyebrow: "Flexible identity",
    title: "Anonymous or authenticated.",
    text: "Run casual public takes or trusted rooms with signed-in voting.",
    icon: "mask",
  },
  {
    eyebrow: "Smart sharing",
    title: "Links that expire cleanly.",
    text: "Time-box a decision and close voting automatically when the link ends.",
    icon: "clock",
  },
  {
    eyebrow: "Live signal",
    title: "Analytics without the clutter.",
    text: "Track vote share, participation, and public result engagement.",
    icon: "chart",
  },
];

export const steps = [
  {
    number: "01",
    title: "Write the question",
    text: "Start with a clear prompt and answer options people can scan fast.",
  },
  {
    number: "02",
    title: "Share the link",
    text: "Drop it in chat, social, email, or anywhere your audience already is.",
  },
  {
    number: "03",
    title: "Read the room",
    text: "Watch the vote move live and publish a clean result page.",
  },
];

export const resultBars = [
  { label: "Live reaction voting", value: 64 },
  { label: "Anonymous voting", value: 23 },
  { label: "Invite-only polls", value: 13 },
];
