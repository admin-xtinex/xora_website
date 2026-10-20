// All page copy lives here so wording can change without touching layout.

// With the interactive course built in (VITE_FUTURES_EDGE_ENABLED), it is the course: every course link goes there
// and its lessons carry the videos. Without it, /course is the video catalogue.
const COURSE = import.meta.env.VITE_FUTURES_EDGE_ENABLED === "true" ? "/learn/futures-edge" : "/course";

export const LINKS = {
  xtinex: "https://www.xtinex.com",
  contact: "mailto:info@xtinex.com",
  // Every call to action lands on the course page; section links go to the home page.
  getStarted: COURSE,
  course: COURSE,
  futuresEdge: "/#futures-edge",
} as const;

// `id` is the home-page section (for the scroll highlight); `href` is where the link goes.
export const NAV = [
  { id: "home", href: "/", label: "Home" },
  { id: "futures-edge", href: "/#futures-edge", label: "Futures Edge" },
  { id: "course", href: COURSE, label: "Course" },
  { id: "journey", href: "/#journey", label: "Learn" },
  { id: "intelligence", href: "/#intelligence", label: "Practice" },
  { id: "about", href: "/#about", label: "About" },
] as const;

export const HERO = {
  kicker: "AI-Powered Trading Intelligence",
  title: "XORA",
  headline: ["Read the Market.", "See the Opportunity."],
  support:
    "XORA analyses crypto futures markets, surfaces trend, key levels and scenarios, and pairs them with guided learning — so you spend less effort reading charts and more time understanding the decision.",
  chips: [
    { icon: "learn", label: "Structured Learning" },
    { icon: "analysis", label: "AI Market Analysis" },
    { icon: "risk", label: "Risk-Focused Education" },
    { icon: "practice", label: "Demo Practice" },
  ],
} as const;

export const VALUE = {
  kicker: "What XORA does",
  title: "Intelligence that turns market noise into clarity.",
  intro:
    "Futures markets move fast and say a lot at once. XORA reads the movement, organises what matters, and explains it — so the next step is clearer.",
  cards: [
    {
      icon: "analysis",
      title: "Market Analysis",
      line: "AI-powered insight into movement, trend, price behaviour and where opportunity may be forming.",
    },
    {
      icon: "complexity",
      title: "Reduce Complexity",
      line: "Crypto futures broken into structured, understandable steps — from contracts to leverage to risk.",
    },
    {
      icon: "effort",
      title: "Reduce Analysis Effort",
      line: "Less time scanning raw charts. More time understanding why a level, a trend or a scenario matters.",
    },
    {
      icon: "practice",
      title: "Guided Practice",
      line: "Learn, observe and practise in a demo environment before stepping into deeper trading workflows.",
    },
  ],
} as const;

export const EDGE = {
  kicker: "Introducing",
  title: "XORA Futures Edge",
  sub: "Learn the strategy. Understand the risk.",
  body:
    "Futures Edge is the structured entry point into XORA. Short, focused lessons take you from “what is a cryptocurrency?” to a complete demo trading decision — each with a narrated video, hands-on practice and a quiz, and no real funds required.",
  topics: [
    "Crypto futures basics",
    "Scalping concepts",
    "Leverage & margin awareness",
    "Risk management",
    "Binance basics",
    "Charts & market structure",
    "Guided modules",
    "Demo preparation",
  ],
  flow: ["Learn", "Understand", "Practice", "Qualify"],
} as const;

export const JOURNEY = {
  kicker: "Your path into XORA",
  title: "A clear journey, one step at a time.",
  intro: "No guesswork about where to start. Each stage prepares you for the next.",
  steps: [
    { icon: "discover", title: "Discover", line: "Understand what XORA is and how it reads the market." },
    { icon: "learn", title: "Learn", line: "Work through Futures Edge — structured, short, practical." },
    { icon: "analysis", title: "Analyze", line: "Use XORA’s intelligence: trend, levels and scenarios." },
    { icon: "practice", title: "Practice", line: "Build confidence with guided demo experiences." },
    { icon: "grow", title: "Grow", line: "Keep improving decision quality and discipline." },
  ],
} as const;

export const SHOWCASE = {
  kicker: "Market intelligence",
  title: "See what XORA sees.",
  intro:
    "A preview of the insight layer: trend context, key levels, scenarios and plain-language notes — presented for understanding, not noise.",
  annotation:
    "Second test of resistance on lighter volume than the first. Watch for rejection — a clean break with volume would shift the scenario.",
  scenarios: [
    { tone: "up", label: "Break & hold", line: "Close above resistance with volume → trend continuation scenario." },
    { tone: "down", label: "Rejection", line: "Wick and close back inside range → return toward support." },
  ],
  trend: [
    { tf: "1h", bias: "Bullish", strength: 72 },
    { tf: "15m", bias: "Bullish", strength: 58 },
    { tf: "5m", bias: "Neutral", strength: 41 },
  ],
  notes: [
    "Higher lows since the last support visit",
    "Volume fading into resistance",
    "Wait for the candle close, not the wick",
  ],
} as const;

export const DIFFERENT = {
  kicker: "Why XORA is different",
  title: "Not another trading tool. A smarter way to approach the market.",
  rows: [
    { without: "Hours scanning raw charts and indicators", with: "Trend, key levels and scenarios surfaced for you" },
    { without: "Scattered videos and conflicting advice", with: "One structured path from basics to analysis" },
    { without: "Learning by risking real money first", with: "Demo practice before any live decision" },
    { without: "Hype, signals and noise", with: "Clarity, context and risk awareness" },
  ],
  pillars: [
    "Practical futures intelligence",
    "AI-driven insight layer",
    "Structured guided onboarding",
    "Designed for preparation, not noise",
  ],
} as const;

export const TRUST = {
  title: "Education first. Risk always in view.",
  body:
    "XORA Futures Edge is focused on education, market analysis and guided demo practice. It is not a live trading service and no real funds are required. Trading crypto futures involves significant risk, including the loss of your capital — understand leverage and risk before you trade. XORA does not promise or guarantee profits.",
} as const;

export const FINAL = {
  kicker: "Start your XORA journey",
  title: ["See the market", "smarter."],
  body: "Build skills. Understand risk. Explore market intelligence with structure and clarity.",
  points: ["Learn at your pace", "No real funds required", "Build real skills"],
} as const;

export const FOOTER = {
  line: "XORA is XTINEX’s AI-powered trading intelligence platform — market analysis, structured futures learning and guided demo practice.",
  groups: [
    {
      title: "XORA",
      links: [
        { label: "Overview", href: "/" },
        { label: "What XORA Does", href: "/#what" },
        { label: "Market Intelligence", href: "/#intelligence" },
        { label: "Get Started", href: COURSE },
      ],
    },
    {
      title: "Futures Edge",
      links: [
        { label: "Introduction", href: "/#futures-edge" },
        { label: "Course", href: COURSE },
        { label: "Learning Path", href: "/#journey" },
        { label: "Demo Practice", href: "/#intelligence" },
        { label: "Risk Notice", href: "/#trust" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About XTINEX", href: "https://www.xtinex.com" },
        { label: "Contact", href: "mailto:info@xtinex.com" },
        { label: "Privacy Policy", href: "https://www.xtinex.com/#contact" },
        { label: "Terms of Service", href: "https://www.xtinex.com/#contact" },
      ],
    },
  ],
} as const;
