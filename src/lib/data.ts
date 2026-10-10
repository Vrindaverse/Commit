import { Goal, Task, Project, LearningPath, Subject, Exam, Habit, Achievement, JournalEntry, AnalyticsData } from "@/types";

export const tasks: Task[] = [
  { id: "t1", title: "Design Homepage Wireframes", description: "Create wireframes for the new landing page", status: "in-progress", priority: "high", dueDate: "2026-06-05", time: "10:00", tags: ["design", "frontend"], projectId: "p1" },
  { id: "t2", title: "Implement Auth Flow", description: "Set up NextAuth with Google provider", status: "todo", priority: "urgent", dueDate: "2026-06-03", time: "14:00", tags: ["backend", "auth"], projectId: "p1" },
  { id: "t3", title: "Write API Documentation", description: "Document all REST endpoints", status: "done", priority: "medium", dueDate: "2026-05-30", tags: ["docs"], projectId: "p2" },
  { id: "t4", title: "Fix Navbar Responsive Bug", description: "Navbar overlaps on mobile devices — needs investigation on Safari and Chrome", status: "in-progress", priority: "high", dueDate: "2026-06-04", time: "09:30", tags: ["bug", "frontend"] },
  { id: "t5", title: "Database Schema Design", description: "Design the PostgreSQL schema for user profiles and preferences", status: "todo", priority: "high", dueDate: "2026-06-07", tags: ["backend", "database"], projectId: "p1" },
  { id: "t6", title: "Unit Tests for Utils", description: "Write unit tests for utility functions (formatDate, cn, etc.)", status: "todo", priority: "medium", dueDate: "2026-06-10", time: "11:00", tags: ["testing"] },
  { id: "t7", title: "Deploy to Staging", description: "Deploy latest build to staging server for QA review", status: "done", priority: "urgent", dueDate: "2026-05-28", tags: ["devops"] },
  { id: "t8", title: "Research ML Models", description: "Research transformer models for NLP — focus on BERT and GPT comparisons", status: "in-progress", priority: "medium", dueDate: "2026-06-15", time: "15:00", tags: ["ml", "research"], projectId: "p3" },
];

export const goals: Goal[] = [
  {
    id: "g1", title: "Become a Full-Stack Developer", description: "Master both frontend and backend development with modern tools", category: "long-term", deadline: "2027-06-01", progress: 45,
    milestones: [
      { id: "m1", title: "Complete React Mastery", completed: true },
      { id: "m2", title: "Build 3 Full-Stack Projects", completed: true },
      { id: "m3", title: "Learn Cloud Deployment", completed: false },
      { id: "m4", title: "Contribute to Open Source", completed: false },
      { id: "m5", title: "Get First Dev Job", completed: false },
    ], color: "#B8D8F8",
  },
  {
    id: "g2", title: "Read 30 Books This Year", description: "Expand knowledge across fiction and non-fiction", category: "long-term", deadline: "2026-12-31", progress: 33,
    milestones: [
      { id: "m6", title: "Read 10 Books", completed: true },
      { id: "m7", title: "Read 20 Books", completed: false },
      { id: "m8", title: "Read 30 Books", completed: false },
    ], color: "#CDEAC0",
  },
  {
    id: "g3", title: "Complete Portfolio Website", description: "Build and deploy personal portfolio", category: "short-term", deadline: "2026-07-01", progress: 70,
    milestones: [
      { id: "m9", title: "Design Mockup", completed: true },
      { id: "m10", title: "Build Frontend", completed: true },
      { id: "m11", title: "Add CMS", completed: false },
      { id: "m12", title: "Deploy", completed: false },
    ], color: "#F7E8A4",
  },
  {
    id: "g4", title: "Run a Marathon", description: "Train and complete a full marathon", category: "long-term", deadline: "2027-03-01", progress: 15,
    milestones: [
      { id: "m13", title: "Run 5K", completed: true },
      { id: "m14", title: "Run 10K", completed: false },
      { id: "m15", title: "Run Half Marathon", completed: false },
      { id: "m16", title: "Run Full Marathon", completed: false },
    ], color: "#F8C8C8",
  },
  {
    id: "g5", title: "Learn Machine Learning", description: "Complete ML specialization and build projects", category: "short-term", deadline: "2026-09-01", progress: 25,
    milestones: [
      { id: "m17", title: "Linear Algebra Refresher", completed: true },
      { id: "m18", title: "Supervised Learning", completed: true },
      { id: "m19", title: "Deep Learning", completed: false },
      { id: "m20", title: "ML Project", completed: false },
    ], color: "#DCCEF5",
  },
];

export const projects: Project[] = [
  {
    id: "p1", title: "Safar", description: "Travel planning and itinerary management app with social features", progress: 60, color: "#B8D8F8",
    tasks: tasks.filter(t => t.projectId === "p1"),
    milestones: [
      { id: "pm1", title: "User Auth", completed: true },
      { id: "pm2", title: "Trip CRUD", completed: true },
      { id: "pm3", title: "Itinerary Builder", completed: true },
      { id: "pm4", title: "Social Features", completed: false },
      { id: "pm5", title: "Launch", completed: false },
    ],
  },
  {
    id: "p2", title: "Akshar", description: "Language learning platform with spaced repetition and gamification", progress: 35, color: "#CDEAC0",
    tasks: tasks.filter(t => t.projectId === "p2"),
    milestones: [
      { id: "pm6", title: "Flashcard System", completed: true },
      { id: "pm7", title: "Spaced Repetition Algorithm", completed: true },
      { id: "pm8", title: "User Dashboard", completed: false },
      { id: "pm9", title: "Mobile App", completed: false },
    ],
  },
  {
    id: "p3", title: "NeuralNetwork", description: "Research project exploring novel neural network architectures for NLP", progress: 20, color: "#DCCEF5",
    tasks: tasks.filter(t => t.projectId === "p3"),
    milestones: [
      { id: "pm10", title: "Literature Review", completed: true },
      { id: "pm11", title: "Baseline Implementation", completed: false },
      { id: "pm12", title: "Experiments", completed: false },
      { id: "pm13", title: "Paper Draft", completed: false },
    ],
  },
];

export const learningPaths: LearningPath[] = [
  { id: "l1", title: "React & Next.js", category: "Web Development", progress: 75, color: "#B8D8F8",
    modules: [
      { id: "lm1", name: "React Fundamentals", completed: true },
      { id: "lm2", name: "Hooks & State Management", completed: true },
      { id: "lm3", name: "Next.js App Router", completed: true },
      { id: "lm4", name: "Server Components", completed: false },
      { id: "lm5", name: "Deployment", completed: false },
    ],
  },
  { id: "l2", title: "Machine Learning", category: "AI & ML", progress: 30, color: "#DCCEF5",
    modules: [
      { id: "lm6", name: "Python for ML", completed: true },
      { id: "lm7", name: "NumPy & Pandas", completed: true },
      { id: "lm8", name: "Scikit-learn", completed: false },
      { id: "lm9", name: "TensorFlow Basics", completed: false },
      { id: "lm10", name: "Neural Networks", completed: false },
    ],
  },
  { id: "l3", title: "Cybersecurity Fundamentals", category: "Cyber Security", progress: 20, color: "#F8C8C8",
    modules: [
      { id: "lm11", name: "Network Basics", completed: true },
      { id: "lm12", name: "Cryptography", completed: false },
      { id: "lm13", name: "Web Security", completed: false },
      { id: "lm14", name: "Ethical Hacking", completed: false },
    ],
  },
  { id: "l4", title: "Linux Administration", category: "Linux", progress: 55, color: "#F7E8A4",
    modules: [
      { id: "lm15", name: "Command Line", completed: true },
      { id: "lm16", name: "Shell Scripting", completed: true },
      { id: "lm17", name: "System Administration", completed: true },
      { id: "lm18", name: "Networking", completed: false },
    ],
  },
  { id: "l5", title: "UI/UX Design", category: "UI/UX", progress: 60, color: "#FFD8BE",
    modules: [
      { id: "lm19", name: "Design Principles", completed: true },
      { id: "lm20", name: "Figma Mastery", completed: true },
      { id: "lm21", name: "User Research", completed: true },
      { id: "lm22", name: "Prototyping", completed: false },
    ],
  },
  { id: "l6", title: "Spanish", category: "Languages", progress: 15, color: "#CDEAC0",
    modules: [
      { id: "lm23", name: "Basic Vocabulary", completed: true },
      { id: "lm24", name: "Grammar Foundations", completed: false },
      { id: "lm25", name: "Conversation Practice", completed: false },
      { id: "lm26", name: "Advanced Fluency", completed: false },
    ],
  },
  { id: "l7", title: "Reading List 2026", category: "Books", progress: 40, color: "#F7E8A4",
    modules: [
      { id: "lm27", name: "Atomic Habits", completed: true },
      { id: "lm28", name: "Deep Work", completed: true },
      { id: "lm29", name: "Designing Data-Intensive Apps", completed: false },
      { id: "lm30", name: "The Pragmatic Programmer", completed: false },
    ],
  },
];

export const subjects: Subject[] = [
  { id: "s1", name: "Data Structures & Algorithms", code: "CS301", attendance: 85, color: "#B8D8F8", grade: "A",
    assignments: [
      { title: "Binary Search Tree Implementation", due: "2026-06-05", submitted: true },
      { title: "Graph Algorithms Report", due: "2026-06-12", submitted: false },
    ],
  },
  { id: "s2", name: "Database Management Systems", code: "CS302", attendance: 78, color: "#CDEAC0", grade: "B+",
    assignments: [
      { title: "ER Diagram Project", due: "2026-06-03", submitted: true },
      { title: "SQL Query Optimization", due: "2026-06-10", submitted: false },
    ],
  },
  { id: "s3", name: "Computer Networks", code: "CS303", attendance: 92, color: "#F7E8A4", grade: "A-",
    assignments: [
      { title: "Network Topology Simulation", due: "2026-06-08", submitted: true },
    ],
  },
  { id: "s4", name: "Operating Systems", code: "CS304", attendance: 70, color: "#F8C8C8", grade: "B",
    assignments: [
      { title: "Process Scheduling Simulator", due: "2026-06-15", submitted: false },
      { title: "Memory Management Report", due: "2026-06-20", submitted: false },
    ],
  },
  { id: "s5", name: "Software Engineering", code: "CS305", attendance: 88, color: "#DCCEF5", grade: "A",
    assignments: [
      { title: "SRS Document", due: "2026-06-02", submitted: true },
      { title: "Design Patterns Implementation", due: "2026-06-18", submitted: false },
    ],
  },
];

export const exams: Exam[] = [
  { id: "e1", subject: "Data Structures & Algorithms", date: "2026-06-20", time: "10:00 AM", color: "#B8D8F8",
    syllabus: ["Trees", "Graphs", "Dynamic Programming", "Sorting Algorithms"],
  },
  { id: "e2", subject: "Database Management Systems", date: "2026-06-22", time: "2:00 PM", color: "#CDEAC0",
    syllabus: ["Normalization", "SQL", "Transaction Management", "NoSQL"],
  },
  { id: "e3", subject: "Computer Networks", date: "2026-06-25", time: "10:00 AM", color: "#F7E8A4",
    syllabus: ["OSI Model", "TCP/IP", "Routing", "Network Security"],
  },
  { id: "e4", subject: "Operating Systems", date: "2026-06-28", time: "2:00 PM", color: "#F8C8C8",
    syllabus: ["Process Management", "Memory Management", "File Systems", "Concurrency"],
  },
];

export const habits: Habit[] = [
  { id: "h1", name: "Coding", color: "#B8D8F8", streak: 12,
    logs: generateHabitLogs(90, 0.7),
  },
  { id: "h2", name: "Reading", color: "#CDEAC0", streak: 8,
    logs: generateHabitLogs(90, 0.5),
  },
  { id: "h3", name: "Workout", color: "#F8C8C8", streak: 5,
    logs: generateHabitLogs(90, 0.4),
  },
  { id: "h4", name: "Meditation", color: "#DCCEF5", streak: 3,
    logs: generateHabitLogs(90, 0.3),
  },
  { id: "h5", name: "Water Intake", color: "#B8D8F8", streak: 7,
    logs: generateHabitLogs(90, 0.6),
  },
];

function generateHabitLogs(days: number, probability: number) {
  const logs: { date: string; count: number }[] = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    logs.push({
      date: date.toISOString().split('T')[0],
      count: Math.random() < probability ? 1 : 0,
    });
  }
  return logs;
}

export const achievements: Achievement[] = [
  { id: "a1", title: "Early Bird", description: "Completed 10 tasks before 9 AM", date: "2026-05-15", category: "productivity", unlocked: true },
  { id: "a2", title: "Code Warrior", description: "Coded for 30 consecutive days", date: "2026-05-01", category: "coding", unlocked: true },
  { id: "a3", title: "Bookworm", description: "Finished 5 books in a month", date: "2026-04-20", category: "reading", unlocked: true },
  { id: "a4", title: "Streak Master", description: "Maintained a 30-day streak", date: "2026-05-10", category: "habits", unlocked: true },
  { id: "a5", title: "Goal Crusher", description: "Completed 3 goals ahead of schedule", date: "2026-04-28", category: "goals", unlocked: true },
  { id: "a6", title: "Night Owl", description: "Completed 15 tasks after midnight", date: "2026-03-15", category: "productivity", unlocked: false },
  { id: "a7", title: "Project Pioneer", description: "Shipped first project to production", date: "2026-06-01", category: "projects", unlocked: false },
  { id: "a8", title: "Mindful Meditator", description: "Meditated for 7 days straight", date: "2026-05-25", category: "wellness", unlocked: false },
  { id: "a9", title: "Polyglot", description: "Learned basics of 3 new languages", date: "2026-04-10", category: "learning", unlocked: true },
  { id: "a10", title: "Open Source Hero", description: "Merged 10 PRs in open source", date: "2026-06-05", category: "coding", unlocked: false },
  { id: "a11", title: "Journal Keeper", description: "Written 30 journal entries", date: "2026-05-30", category: "journal", unlocked: true },
  { id: "a12", title: "Perfect Attendance", description: "100% attendance for a month", date: "2026-04-01", category: "academics", unlocked: true },
];

export const journalEntries: JournalEntry[] = [
  { id: "j1", date: "2026-05-31", title: "A Productive Sunday", content: "Today was incredibly productive. I managed to finish the wireframes for the Safar project and went for a run in the evening. Feeling accomplished and motivated for the week ahead. The weather was beautiful and I spent some time reading in the park.", mood: "great", tags: ["productive", "weekend"] },
  { id: "j2", date: "2026-05-30", title: "Struggling with Focus", content: "Had a hard time concentrating today. Too many distractions. Need to implement better focus techniques. Maybe try the Pomodoro method again. On the bright side, I had a great conversation with a friend about career goals.", mood: "okay", tags: ["struggles", "focus"] },
  { id: "j3", date: "2026-05-29", title: "ML Breakthrough", content: "Finally understood backpropagation! It took me a while but things are clicking now. The neural network project is making progress. I trained my first model today and it actually worked. Such a satisfying feeling.", mood: "great", tags: ["learning", "ml", "achievement"] },
  { id: "j4", date: "2026-05-28", title: "Rainy Day Reflection", content: "It's been raining all day. Perfect weather for staying in and coding. Made good progress on the portfolio website. Also started reading 'Designing Data-Intensive Applications' - it's dense but fascinating.", mood: "good", tags: ["coding", "reading", "rainy"] },
  { id: "j5", date: "2026-05-27", title: "Exam Prep Begins", content: "Started preparing for finals. The syllabus is huge but I have a plan. Created a study schedule for the next month. Feeling slightly anxious but organized. Need to focus on DSA and OS this week.", mood: "okay", tags: ["academics", "exams"] },
];

export const analyticsData: AnalyticsData = {
  productivityTrend: [
    { day: "Mon", hours: 6 },
    { day: "Tue", hours: 5.5 },
    { day: "Wed", hours: 7 },
    { day: "Thu", hours: 4 },
    { day: "Fri", hours: 6.5 },
    { day: "Sat", hours: 8 },
    { day: "Sun", hours: 5 },
  ],
  learningHours: [
    { month: "Jan", hours: 25 },
    { month: "Feb", hours: 30 },
    { month: "Mar", hours: 45 },
    { month: "Apr", hours: 55 },
    { month: "May", hours: 70 },
    { month: "Jun", hours: 40 },
  ],
  goalCompletion: [
    { month: "Jan", completed: 2, total: 5 },
    { month: "Feb", completed: 1, total: 4 },
    { month: "Mar", completed: 3, total: 5 },
    { month: "Apr", completed: 2, total: 4 },
    { month: "May", completed: 4, total: 6 },
    { month: "Jun", completed: 1, total: 3 },
  ],
  habitStreaks: [
    { habit: "Coding", streak: 12 },
    { habit: "Reading", streak: 8 },
    { habit: "Workout", streak: 5 },
    { habit: "Meditation", streak: 3 },
    { habit: "Water", streak: 7 },
  ],
  weeklyDistribution: [
    { day: "Mon", tasks: 8, completed: 6 },
    { day: "Tue", tasks: 6, completed: 4 },
    { day: "Wed", tasks: 10, completed: 8 },
    { day: "Thu", tasks: 5, completed: 3 },
    { day: "Fri", tasks: 7, completed: 5 },
    { day: "Sat", tasks: 4, completed: 4 },
    { day: "Sun", tasks: 3, completed: 2 },
  ],
};

export const motivationalQuotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
];

export const weeklyOverview = {
  totalTasks: 15,
  completedTasks: 10,
  totalFocusHours: 42,
  goalsHit: 3,
  habitsMaintained: 4,
};
