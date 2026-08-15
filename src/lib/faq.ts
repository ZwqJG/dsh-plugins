export type FaqItem = {
  question: string;
  answer: string;
  officialHref: string;
  officialLabel: string;
};

export const faqLastVerified = "2026-08-15";

export const faqs: FaqItem[] = [
  {
    question: "What is DeepSeek Harness? / deepseek harness 是什么",
    answer: "DeepSeek describes DeepSeek Harness (dsh) as an open-source agent harness in developer preview. Models, tools, skills, sessions, sandboxes, storage, loops, schedulers, and UI are composed as plugins through Cordis.",
    officialHref: "https://www.deepseek.com/harness/",
    officialLabel: "Read the official Harness overview",
  },
  {
    question: "What is the DeepSeek Harness agent? / deepseek harness agent",
    answer: "DeepSeek frames an agent as Model + Harness. The harness gives an agent the ability to understand its environment, use tools, and keep working in real-world scenarios; its standard mode includes tools, skills, plans, goals, sub-agents, and workflows.",
    officialHref: "https://www.deepseek.com/harness/",
    officialLabel: "See the official agent model",
  },
  {
    question: "What is the DeepSeek Harness product? / deepseek harness 产品",
    answer: "DeepSeek Harness is a developer-preview product with publicly available source code. DeepSeek's official quick-start command is npx @deepseek-ai/dsh web, which starts the Web UI after Node.js is installed.",
    officialHref: "https://github.com/deepseek-ai/deepseek-harness",
    officialLabel: "Open the official GitHub repository",
  },
  {
    question: "Where is the DeepSeek Harness GitHub? / deepseek harness github",
    answer: "The canonical repository is deepseek-ai/deepseek-harness. DeepSeek asks community plugin authors to use the dsh-plugin topic so their repositories can be discovered by plugin directories such as this one.",
    officialHref: "https://github.com/deepseek-ai/deepseek-harness",
    officialLabel: "Visit DeepSeek Harness on GitHub",
  },
  {
    question: "Is DeepSeek Harness in private beta? / deepseek harness 内测",
    answer: "DeepSeek's official wording is developer preview, open to Harness developers globally. The project is iterating rapidly, and the official README warns that compatibility-breaking changes will happen; no separate private-test enrollment is described on the official Harness page.",
    officialHref: "https://www.deepseek.com/harness/",
    officialLabel: "Check official preview status",
  },
  {
    question: "When will DeepSeek Harness be released? / deepseek harness 发布时间",
    answer: "The official Harness page and repository currently describe a developer preview, but do not publish a general-availability date or final-release schedule. Check the official project page and repository activity for the latest status.",
    officialHref: "https://github.com/deepseek-ai/deepseek-harness",
    officialLabel: "Check official project updates",
  },
  {
    question: "Who is on the DeepSeek Harness team? / deepseek harness 团队 · deepseek harness team",
    answer: "The official README says DeepSeek Harness is developed by DeepSeek AI. The official Harness materials do not publish a separate individual team roster, so this directory does not infer or list one.",
    officialHref: "https://github.com/deepseek-ai",
    officialLabel: "Visit the official DeepSeek GitHub organization",
  },
  {
    question: "Is DeepSeek Harness hiring? / deepseek harness 招聘",
    answer: "DeepSeek's official website links to its careers portal. Available positions and requirements can change, so use the official job listings rather than relying on community reposts or this directory for hiring information.",
    officialHref: "https://talent.deepseek.com/",
    officialLabel: "Browse official DeepSeek careers",
  },
  {
    question: "Are there DeepSeek Harness interview experiences? / deepseek harness 面经",
    answer: "The official Harness page and careers entry point do not publish a Harness-specific interview question bank or interview-experience guide. Use the official role description as the source of hiring requirements, and treat third-party interview posts as unofficial.",
    officialHref: "https://talent.deepseek.com/",
    officialLabel: "Check official role descriptions",
  },
  {
    question: "Where can I follow official DeepSeek Harness updates?",
    answer: "For product facts, start with the official Harness page and the DeepSeek GitHub repository. You can also follow DeepSeek's official X account for announcements; cross-check time-sensitive information against the official website or repository.",
    officialHref: "https://x.com/deepseek_ai",
    officialLabel: "Follow DeepSeek on X",
  },
];
