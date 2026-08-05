/* ==========================================================================
   data.js — EVERYTHING PERSONAL LIVES HERE.
   Edit this file to update the site. You should never need to touch app.js.
   ========================================================================== */

const DATA = {

  /* ---- Identity -------------------------------------------------------- */
  brand: "SAURABH",              // shown in the intro animation + top-left logo
  fullName: "Saurabh Singh",
  location: "Lodz, Poland",
  email: "saurabhh318@gmail.com",
  phone: "+48 883 634 384",

  // The Resume button points here. Drop your PDF at assets/resume.pdf,
  // or replace this with a Google Drive / Dropbox link.
  resumeUrl: "assets/resume.pdf",

  // Master playback volume for the hero videos (0–1).
  // Any profile can override this with its own `volume`.
  volume: 0.5,

  links: {
    linkedin: "https://linkedin.com/in/saurabh318/",
    leetcode: "https://leetcode.com/u/saurabh348/",
    github:   "https://github.com/YOUR-GITHUB-USERNAME"   // <-- TODO: set this
  },

  /* ---- Profile gate ---------------------------------------------------- */
  /* Each profile gets its own hero video, headline copy and row ordering.  */
  profiles: [
    {
      id: "recruiter",
      name: "Recruiter",
      avatarClass: "av-recruiter",
      avatarImg: "assets/icons/recruiter_icon.jpeg",
      videoFile: "assets/video/recruiter_video.mp4",
      video: { id: "sqyde2jcLdQ", start: 0, end: 30 },
      startMuted: false,          // recruiter opens with sound

      title: "SAURABH SINGH",
      meta: ["98% Match", "2026", "ML Engineering", "4 Seasons", "HD"],
      badges: ["Machine Learning", "Deep Learning", "MLOps"],
      tagline: "Machine Learning Engineer",
      description:
        "Machine learning engineer with hands-on experience building and deploying deep " +
        "learning models for algorithmic trading. Proficient in PyTorch, TensorFlow and LLM " +
        "tooling (LangChain), with experience shipping end-to-end ML pipelines on AWS and " +
        "Kubernetes. Strong foundation in statistical modeling, time-series forecasting and " +
        "production ML systems.",
      rowTitle: "Today's Top Picks for Recruiter"
    },
    {
      id: "developer",
      name: "Developer",
      avatarClass: "av-developer",
      avatarImg: "assets/icons/developer_icon.jpg",
      videoFile: "assets/video/developer_video.mp4",
      video: { id: "IU-dnL1hJ1Q", start: 123, end: 153 },
      startMuted: false,          // opens with sound

      title: "SAURABH SINGH",
      meta: ["Python", "C++", "SQL", "PyTorch", "HD"],
      badges: ["PyTorch", "Kubernetes", "FastAPI"],
      tagline: "Builds models, then ships them",
      description:
        "I write MLPs from scratch before I reach for a framework, and I care about what " +
        "happens after the notebook. Hybrid deep-learning models for algorithmic trading, " +
        "SPC and time-series analytics over factory-floor data, and the AWS / Kubernetes / " +
        "FastAPI / PostgreSQL plumbing that takes them from research to production.",
      rowTitle: "Today's Top Picks for Developer"
    },
    {
      id: "stalker",
      name: "Stalker",
      avatarClass: "av-stalker",
      avatarImg: "assets/icons/stalker_icon.jpg",
      videoFile: "assets/video/stalker_video.mp4",
      video: { id: "A953td1sKS8", start: 50, end: 80 },
      startMuted: false,          // opens with sound

      title: "SAURABH SINGH",
      meta: ["Lodz, Poland", "Chess", "Rubik's Cube", "C1 English"],
      badges: ["Chess", "Rubik's Cube", "Volunteering"],
      tagline: "The off-screen footage",
      description:
        "Based in Lodz, Poland, finishing a BSc in Business and Technology. Off the clock: " +
        "chess, speedcubing, and volunteering with the No Hate Foundation — sorting clothes " +
        "for orphans and cooking for the homeless. Fluent enough in English to argue about " +
        "openings (IELTS C1). Currently accepting friend requests.",
      rowTitle: "Today's Top Picks for Stalker"
    }
  ],

  /* ---- Experience ------------------------------------------------------ */
  experience: [
    {
      role: "Machine Learning Engineering Intern",
      company: "Proceedit",
      location: "Barcelona, Spain",
      period: "Mar 2026 – Present",
      current: true,
      points: [
        "Developed, tested and deployed hybrid deep-learning models for algorithmic trading strategies.",
        "Optimized quantitative models through systematic hyperparameter tuning and feature engineering.",
        "Built end-to-end ML pipelines using AWS, Kubernetes, FastAPI and PostgreSQL, taking models from research through to production deployment."
      ],
      stack: ["PyTorch", "AWS", "Kubernetes", "FastAPI", "PostgreSQL"]
    },
    {
      role: "Statistical Data Science Intern",
      company: "Schaumaplast",
      location: "Lodz, Poland",
      period: "Nov 2025 – Feb 2026",
      current: false,
      points: [
        "Built an industrial data-analytics platform with predictive models for large-scale manufacturing production datasets.",
        "Implemented Statistical Process Control (SPC), regression and deviation-based analytics for real-time process monitoring and forecasting.",
        "Designed data preprocessing pipelines and improved throughput via down-sampling techniques."
      ],
      stack: ["Python", "SPC", "Time-Series", "Regression"]
    }
  ],

  /* ---- Projects -------------------------------------------------------- */
  projects: [
    {
      name: "Shallow Neural Network — Gaussian & MNIST Classifier",
      blurb:
        "A multilayer perceptron built entirely from scratch to classify handwritten digits " +
        "from MNIST — forward and backward propagation implemented by hand, with no deep " +
        "learning framework doing the work.",
      stack: ["Python", "NumPy", "MNIST"],
      url: "https://github.com/YOUR-GITHUB-USERNAME"   // <-- TODO: real repo link
    },
    {
      name: "Artificial Neuron — 2D Classification",
      blurb:
        "A single artificial neuron performing 2D binary classification across multiple " +
        "activation functions, with real-time visualisation of the decision boundary as it learns.",
      stack: ["Python", "NumPy", "Matplotlib"],
      url: "https://github.com/YOUR-GITHUB-USERNAME"   // <-- TODO: real repo link
    }
  ],

  /* ---- Skills ---------------------------------------------------------- */
  skills: [
    { group: "Machine Learning", items: ["Deep Learning", "LLMs & LangChain", "XGBoost", "Time-Series Forecasting", "Statistical Modeling"] },
    { group: "Frameworks",       items: ["PyTorch", "TensorFlow"] },
    { group: "Cloud & MLOps",    items: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD"] },
    { group: "Languages",        items: ["Python", "C++", "SQL"] },
    { group: "Backend & Tools",  items: ["FastAPI", "Flask", "PostgreSQL", "Git", "Jira"] }
  ],

  /* ---- Certifications -------------------------------------------------- */
  certificates: [
    { name: "LangChain & LangGraph",             issuer: "Packt" },
    { name: "Mathematics for Machine Learning",  issuer: "Imperial College London" },
    { name: "AWS Cloud Solutions Architect",     issuer: "Amazon Web Services" },
    { name: "IELTS C1",                          issuer: "The British Council" }
  ],

  /* ---- Education ------------------------------------------------------- */
  education: {
    school: "Lodz University of Technology",
    degree: "BSc in Business and Technology",
    location: "Lodz, Poland",
    period: "Oct 2022 – Oct 2026",
    thesis: "Deep Learning-Based Time-Series Modeling for Early Defect Detection in Manufacturing Systems",
    coursework: ["AI Fundamentals", "Information Technology I & II", "Data Analytics", "Mathematics I, II & III"]
  },

  /* ---- Recommendations -------------------------------------------------
     TODO: your CV had no written recommendations. Paste real quotes from
     LinkedIn here — replace the objects below. Until then the card shows
     your strengths instead.
     ---------------------------------------------------------------------- */
  recommendations: [
    // { quote: "…", author: "Name", role: "Title, Company" },
  ],

  strengths: [
    "Clear communication",
    "Analytical problem-solving",
    "Fast adaptability",
    "Collaboration",
    "Proactive"
  ],

  volunteering: [
    "Clothing Sorter for Orphans — No Hate Foundation",
    "Cook for the Homeless — No Hate Foundation"
  ],

  interests: ["Chess", "Rubik's Cube"]
};
