// G9 Chemistry Report Maker — comment bank and configuration
// British English. Observational teacher voice.

window.CATEGORIES = [
  {
    key: "starter",
    label: "Positive Starter",
    short: "Starter",
    blurb: "Punctuality, Do Now engagement, readiness to learn at the start of lessons."
  },
  {
    key: "mindset",
    label: "Mindset in Chemistry",
    short: "Mindset",
    blurb: "Curiosity, resilience with hard concepts, willingness to ask questions and learn from mistakes."
  },
  {
    key: "tests",
    label: "Test Results",
    short: "Tests",
    blurb: "Performance in end-of-topic tests and assessments across the year, IGCSE-style question formats."
  },
  {
    key: "ao3",
    label: "AO3: Practical-Based Questions",
    short: "AO3",
    blurb: "Exam technique on experimental design, data analysis, and evaluation questions in written papers."
  },
  {
    key: "readiness",
    label: "IGCSE Exam Readiness",
    short: "Readiness",
    blurb: "Subject knowledge, exam technique, revision habits and independent working for the IGCSE."
  }
];

window.LEVELS = [
  { key: "excellent",  label: "Excellent",              short: "Exc", tint: "#10b981", soft: "#d1fae5", ink: "#065f46" },
  { key: "above",      label: "Above Average",          short: "Above", tint: "#3f9c5a", soft: "#dcf2e0", ink: "#1f5f33" },
  { key: "average",    label: "Average",                short: "Avg", tint: "#3b82f6", soft: "#dbeafe", ink: "#1e40af" },
  { key: "below",      label: "Below Average",          short: "Below", tint: "#f59e0b", soft: "#fef3c7", ink: "#92400e" },
  { key: "disrupted",  label: "Behaviourally Disrupted", short: "Disrupt", tint: "#f43f5e", soft: "#ffe4e6", ink: "#9f1239" }
];

window.COMMENT_BANK = {
  starter: {
    excellent: [
      "arrives promptly and is consistently one of the first to engage with the Do Now task, setting a productive tone for the lesson",
      "is always ready to learn from the moment the lesson begins, with equipment out and full attention on the starter activity",
      "uses the opening minutes of every lesson efficiently, often extending the Do Now task with additional thinking",
      "models excellent lesson-start behaviour and frequently helps settle those around them by quietly getting on with the task",
      "has an impeccable track record of punctuality and immediate engagement with the starter, wasting no learning time"
    ],
    above: [
      "is usually quick to settle and engages well with the Do Now task in most lessons",
      "arrives on time and generally gets started without needing a prompt",
      "makes a good start to lessons and is typically focused during the opening activity",
      "settles into lessons well and tends to complete the Do Now task thoroughly",
      "is reliably punctual and rarely needs reminding to begin the starter activity"
    ],
    average: [
      "takes a little time to settle at the start of some lessons but usually completes the Do Now task once focused",
      "is generally punctual but sometimes needs a prompt to begin the starter activity",
      "engages with Do Now tasks at a steady pace, though could push for quicker starts",
      "has an acceptable start to most lessons but occasionally loses a few minutes to slow settling",
      "completes starter activities when reminded, but does not always begin independently"
    ],
    below: [
      "is frequently slow to settle and often needs several reminders before engaging with the Do Now task",
      "regularly wastes the opening minutes of lessons and misses key instructions as a result",
      "arrives without equipment ready and takes too long to start working at the beginning of lessons",
      "has a pattern of lateness or slow starts that is reducing the amount of learning time in each lesson",
      "often needs individual attention to begin the starter task, which is affecting overall progress"
    ],
    disrupted: [
      "regularly disrupts the start of lessons, preventing both themselves and others from accessing the Do Now task",
      "is frequently late and, once seated, resists engaging with the starter activity despite repeated support",
      "has not developed the basic routine of arriving, settling, and starting work, and this is a significant barrier to learning",
      "uses the start of lessons to socialise or distract others, showing little regard for the learning environment",
      "needs to completely rebuild their approach to lesson starts if they are to make progress in IGCSE Chemistry"
    ]
  },

  mindset: {
    excellent: [
      "shows genuine curiosity about chemistry concepts and regularly asks perceptive questions that deepen their understanding",
      "approaches challenging topics such as bonding or stoichiometry with real determination and a willingness to persevere",
      "treats mistakes as learning opportunities and actively seeks to understand where their reasoning went wrong",
      "has a mature, resilient mindset and does not become discouraged when encountering difficult IGCSE content",
      "demonstrates excellent intellectual curiosity, often reading ahead or researching chemistry topics beyond the specification"
    ],
    above: [
      "shows a positive attitude in chemistry and is usually willing to tackle difficult questions",
      "copes well with challenging content and asks sensible questions when unsure",
      "has a good level of resilience and generally bounces back after a difficult test or topic",
      "is open to feedback and makes a genuine effort to improve when corrections are suggested",
      "maintains a solid work ethic in lessons and rarely avoids tasks, even when they are demanding"
    ],
    average: [
      "has a reasonable attitude to chemistry but sometimes loses motivation when topics become more abstract",
      "will attempt challenging questions when supported but can be reluctant to try independently first",
      "responds to feedback when given directly but does not always seek it out",
      "shows adequate resilience in most lessons, though sometimes gives up too quickly on harder problems",
      "has a steady mindset but would benefit from greater willingness to engage with unfamiliar content"
    ],
    below: [
      "tends to disengage when chemistry content becomes challenging and avoids asking for help",
      "shows limited resilience and often leaves difficult questions blank rather than attempting them",
      "can become frustrated quickly when concepts are not immediately clear, which slows progress",
      "does not consistently act on feedback and repeats the same errors across different topics",
      "needs to develop a more proactive approach to learning, rather than waiting to be told what to do"
    ],
    disrupted: [
      "frequently opts out of learning when content is challenging and can become disruptive as a result",
      "shows very little willingness to engage with chemistry and resists support when it is offered",
      "has a fixed mindset that is preventing any meaningful progress in the subject",
      "responds to difficulty with off-task behaviour, which undermines their own learning and that of others",
      "needs significant intervention to develop a productive attitude to learning chemistry"
    ]
  },

  tests: {
    excellent: [
      "has achieved consistently high marks across end-of-topic tests, demonstrating strong command of IGCSE Chemistry content",
      "performs exceptionally well under timed conditions and produces detailed, well-structured answers in assessments",
      "has an impressive assessment record this year, with marks that place them well on track for a top IGCSE grade",
      "retains knowledge effectively between topics and applies it accurately in cumulative test conditions",
      "has shown outstanding test performance, particularly on higher-demand questions requiring extended reasoning"
    ],
    above: [
      "has performed well in most end-of-topic tests, with marks that suggest a solid trajectory for IGCSE",
      "produces good results in assessments, though there is room to strengthen answers on higher-mark questions",
      "shows a good level of knowledge retention and generally performs above the class average in tests",
      "scores well in tests and is beginning to access the higher-tier question styles with increasing confidence",
      "has a positive assessment profile this year and is building a strong foundation for the IGCSE examination"
    ],
    average: [
      "has achieved mixed results in end-of-topic tests, with some solid scores alongside weaker performances",
      "performs adequately in assessments but tends to lose marks on questions requiring detailed explanations",
      "has test results that are broadly in line with expectations but could be improved with more consistent revision",
      "shows reasonable recall in tests on recently taught content but struggles with topics from earlier in the year",
      "produces average assessment results and would benefit from practising IGCSE-style questions more regularly"
    ],
    below: [
      "has underperformed in several end-of-topic tests, with gaps in knowledge that need urgent attention",
      "often scores below the expected standard in assessments, particularly on recall and application questions",
      "test results suggest that content is not being revised or retained between lessons",
      "has a weak assessment record this year and is at risk of falling behind the pace needed for IGCSE",
      "struggles significantly in timed test conditions and frequently leaves questions unanswered"
    ],
    disrupted: [
      "has not engaged meaningfully with assessments this year and test data is therefore very limited",
      "refuses to attempt tests on occasion or submits work that does not reflect any genuine effort",
      "has an extremely poor assessment record, largely due to lack of engagement rather than lack of ability",
      "test results are well below the expected standard and reflect the ongoing behavioural difficulties in lessons",
      "needs to take assessments seriously and use them as a tool for improvement, not a source of avoidance"
    ]
  },

  ao3: {
    excellent: [
      "answers AO3 questions with precision, clearly describing experimental methods, identifying variables, and evaluating data",
      "excels at interpreting graphs, tables, and experimental results in exam-style questions, often with textbook-quality reasoning",
      "can design experiments on paper to a high standard, including appropriate control variables and methods of data collection",
      "shows a strong understanding of accuracy, precision, and reliability when answering practical-based exam questions",
      "consistently scores highly on AO3 items, demonstrating the ability to think like a scientist when analysing unfamiliar data"
    ],
    above: [
      "handles most AO3 questions well, with clear descriptions of method and sensible identification of variables",
      "is becoming confident at evaluating experimental data and suggesting improvements to methods",
      "answers practical-based questions with good structure, though occasionally misses a control variable or evaluation point",
      "can read and interpret data from graphs and tables effectively and usually draws correct conclusions",
      "shows a solid grasp of experimental design in written answers and is developing good IGCSE exam technique in this area"
    ],
    average: [
      "can answer straightforward AO3 questions but struggles when asked to evaluate or suggest improvements to a method",
      "identifies variables correctly in familiar contexts but finds it harder with unfamiliar experimental scenarios",
      "shows a basic understanding of practical-based questions but needs to develop more detailed written responses",
      "can plot and read graphs at a simple level but sometimes misinterprets data or draws incomplete conclusions",
      "would benefit from more practice on IGCSE-style AO3 questions, particularly those requiring extended writing"
    ],
    below: [
      "finds AO3 questions difficult and often confuses independent, dependent, and control variables",
      "struggles to structure answers to practical-based questions and frequently omits key details",
      "has difficulty interpreting experimental data and rarely offers evaluations or improvements in written responses",
      "does not yet write with enough scientific detail to access marks on AO3 exam questions",
      "needs focused support on experimental design and data analysis skills before the IGCSE examination"
    ],
    disrupted: [
      "does not attempt AO3 questions in assessments and has no current evidence of competence in this area",
      "refuses to engage with practical-based questions in lessons and exams, despite support being available",
      "has significant gaps in understanding how to approach AO3 questions, compounded by lack of engagement",
      "cannot currently answer practical-based exam questions at the expected standard due to persistent avoidance of this work",
      "must urgently begin practising AO3-style questions if they are to access marks in this section of the IGCSE paper"
    ]
  },

  readiness: {
    excellent: [
      "is already operating at a confident IGCSE standard, with secure chemical vocabulary, strong exam technique, and independent revision habits",
      "has the knowledge, discipline, and scientific literacy to perform very well in the IGCSE Chemistry examination",
      "is exceptionally well prepared for the IGCSE, regularly producing answers that would score full marks at this stage",
      "has developed excellent independent study skills and approaches IGCSE content with the maturity expected of a top-grade candidate",
      "is one of the strongest candidates in the cohort and, with continued effort, is capable of achieving a very high IGCSE grade"
    ],
    above: [
      "has the work ethic and core chemistry knowledge to make a confident start to IGCSE exam preparation",
      "is well placed for the IGCSE and has shown the ability to apply knowledge across different question styles",
      "has built solid IGCSE foundations this year and, with consistent revision, should achieve a pleasing grade",
      "demonstrates good readiness for the IGCSE examination, with only minor areas of knowledge or technique to refine",
      "is developing the independent revision habits and exam technique that will serve them well in the IGCSE"
    ],
    average: [
      "has the foundations in place for IGCSE Chemistry but will need to step up the pace and consistency of revision",
      "is reasonably prepared for the IGCSE but has areas of the specification that require further consolidation",
      "needs to move from passive learning to active revision strategies if they are to meet their IGCSE target grade",
      "has an adequate level of readiness but must commit to regular, structured exam practice over the coming months",
      "is at a crossroads: with increased effort and focus, a good IGCSE grade is achievable, but complacency will cost marks"
    ],
    below: [
      "has noticeable gaps in core chemistry knowledge that must be closed before the IGCSE examination",
      "is not yet working at the standard required for a secure IGCSE pass and needs urgent intervention",
      "has fallen behind the expected pace and will need significant additional revision to catch up before the exam",
      "lacks the independent study habits and content knowledge needed to feel confident going into the IGCSE",
      "needs to treat the remaining time before the IGCSE as a serious revision window, with structured support"
    ],
    disrupted: [
      "is not yet ready for the demands of the IGCSE examination and needs to rebuild basic learning habits as a matter of urgency",
      "has made very limited progress this year due to behavioural choices and is at serious risk of underperformance in the IGCSE",
      "cannot currently access IGCSE Chemistry content at the required level and needs a complete reset in approach",
      "will not achieve a meaningful IGCSE grade without a fundamental change in engagement and behaviour",
      "needs intensive support and a significant shift in attitude if they are to sit the IGCSE examination with any confidence"
    ]
  }
};

window.TARGET_TYPES = [
  {
    key: "recall",
    label: "Recall & Knowledge Retention",
    short: "Recall",
    blurb: "Closing gaps in core chemistry content across the IGCSE specification."
  },
  {
    key: "ao3target",
    label: "AO3: Practical Exam Questions",
    short: "AO3 Qs",
    blurb: "Improving answers on experimental design, data analysis and evaluation."
  },
  {
    key: "extended",
    label: "Extended Writing & 6-Mark Answers",
    short: "Extended writing",
    blurb: "Structuring longer explanations with correct chemical vocabulary."
  },
  {
    key: "maths",
    label: "Maths in Chemistry",
    short: "Maths",
    blurb: "Moles, concentration, Mr, rearranging formulae, sig figs, graphs."
  },
  {
    key: "revision",
    label: "Independent Revision Habits",
    short: "Revision",
    blurb: "Flashcards, spaced practice, past papers, active recall."
  },
  {
    key: "behaviour",
    label: "Classroom Behaviour & Focus",
    short: "Behaviour",
    blurb: "Sustained attention and appropriate conduct in lessons."
  }
];
