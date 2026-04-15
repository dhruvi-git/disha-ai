# 1. Home (Project Overview)

**Project Title:** Disha AI  
**Team Members:** Dhruvi Jain, 2400297, [https://github.com/dhruvi-git](https://github.com/dhruvi-git)  
**Guide / Faculty Name:** Dr. Yogesh Jadhav  
**Project Domain:** AI, Web Dev  

**Short Description:**  
Disha AI is a comprehensive Full-Stack AI-powered career coach designed to help students as well as professionals logically optimize their resumes, rigorously prepare for mock interviews, and dynamically explore real-time industry insights. It strategically uses advanced LLMs (via the Groq API) coupled with background workload processors (Inngest) to deliver extremely fast, real-time responses, seamlessly integrated, actionable advice to users.

**Problem Statement:**  
Modern job seekers face an overwhelmingly convoluted array of career choices, heavily compounded by generic guidance systems that fail to account for unique technical aptitudes and aggressively shifting job markets. Traditional programmatic career counselors struggle to keep pace with micro-skills required in the modern tech landscape. This gap creates a critical need for a dynamic, highly personalized, low-latency advisory execution tool.

**Objectives:**  
Leverage advanced Generative AI and event-driven background processing to design an innovative solution acting as a hyper-personalized career and skills advisor. The platform must circumvent generic advice by mathematically aligning a user's bespoke profile to relevant market benchmarks, offering detailed remediation, interview validation, and direct chatbot assistance natively on the web.

**Key Features:**  
- **Industry Insights Dashboard:** Generates robust, asynchronous, real-time data on salary bands, high-demand skills, and market mobility within specific industries using Inngest background jobs.
- **AI Resume Tailor & Builder:** Upload a resume along with a target job description to instantly receive an ATS score, personalized refinement recommendations, and an AI-tailored resume uniquely aligned to the job description.
- **Interview Progress & Analytics Dashboard:** Dynamically constructs adaptive multiple-choice quizzes encompassing technical/behavioral domains based exactly on user competency. Users track their progress, question accuracy, and history in a visually rich analytical dashboard.
- **Personalized Disha Chatbot:** A built-in, 1-on-1 virtual assistant that offers tailored advice. Users can discuss their career roadmap, interview strategy, or general profession queries, and receive context-aware responses based on their skills and background.
- **Smart Cover Letter Generator:** Synthesizes context-aware cover letters mapping background experience to JD prerequisites instantly.

---

# 2. Introduction

**Background of the Project:**  
With exponential shifts in global employment vectors specifically driven by automation, static academic curriculums consistently lag. Students enter the workforce lacking localized insights into what skills practically yield employability.

**Motivation:**  
Driven by the democratization of robust Language Models (LLMs), there exists a massive opportunity to provide 1-on-1 equivalent career mentoring at zero marginal cost.

**Existing System:**  
Candidates traditionally rely on collegiate placement cells, non-specific internet articles, or cost-prohibitive private consultants. Standard portfolio platforms only aid in formatting, lacking strategic generation capabilities.

**Limitations of Existing Systems:**  
1. **Static Responses:** Unresponsive to micro-trends in emerging tech.
2. **Synchronous Bottlenecks:** Web applications freeze while generating heavy reports.
3. **Impersonal Feedback:** Rubric-based assessments fail to explain *why* an interview answer was poor.

**Proposed Solution:**  
Disha AI implements an event-driven AI architecture. It offers a continuous feedback loop: assessing a user's skills via mock interviews, formatting their experiences into tailored resumes, answering ongoing questions via the chatbot, and orchestrating extensive industry analysis workflows silently in the background (using Inngest).

---

# 3. Objectives & Scope

**Project Objectives:**  
- Synthesize an integrated platform aligning student capabilities to real-world market demands via LLM evaluation.
- Construct native document builders explicitly targeting ATS compliance and job-tailoring.
- Architect an automated, stress-tested interviewing loop generating deterministic feedback with visual analytics.

**Scope of the Project:**  
Focuses prominently on college students and professionals aiming for software engineering, data science, digital marketing, and UI/UX disciplines, but scales universally across industries.

**Applications / Use Cases:**  
- A backend engineering aspirant utilizing the Mock Interview module to drill system design paradigms, and tracking their accuracy over time.
- A career switcher navigating to a new role by chatting with the personalized AI assistant about their bespoke skill conversion roadmap.

---

# 4. Literature Survey / Related Work

**Summary of Research:**  
1. *Contextual AI in Education:* Focuses on using System prompting to narrow broad foundational models to specialized advisory roles.
2. *Event-Driven Architectures for AI Data:* Analyzes utilizing message queues and serverless brokers (Inngest) to manage asynchronous computations.
3. *Automated Resume Parsing & ATS Metrics:* Evaluating traditional regex-based parsers versus modern semantic LLM parsers.

**Existing Tools/Technologies:**  
- **ChatGPT / Claude via Web:** Highly powerful, but lacks integrated workflows, persistent databases, or visual progression dashboards for repeated iteration.
- **Novoresume / Zety:** Exceptional visual builders but missing generative contextualization against specific job descriptions.

---

# 5. System Architecture

**Architecture Diagram:**  

```mermaid
graph TD
    subgraph Frontend "Frontend (React 19 / Next.js 15)"
      UI[Client UI & Dashboards]
    end

    subgraph Backend "Backend Services"
      API[Next.js Server Actions]
      Auth[Clerk Authentication]
      DB[(PostgreSQL Database)]
      ORM[Prisma ORM]
    end

    subgraph AI_Engine "AI Engine"
      Groq[Groq API - Llama 3]
    end
    
    subgraph Background_Workers "Background Jobs"
      Inngest[Inngest Worker]
    end

    UI -->|API Calls & Form Data| API
    UI -->|SSO| Auth
    API -->|Prompt & Params| Groq
    API -->|Read/Write Queries| ORM
    ORM --> DB
    API <-->|Trigger Events & Retries| Inngest
    Inngest -->|Async Data Inserts| ORM
    
    style Frontend fill:#E1F5FE,stroke:#01579B,stroke-width:2px,color:#000
    style Backend fill:#F3E5F5,stroke:#4A148C,stroke-width:2px,color:#000
    style AI_Engine fill:#E8F5E9,stroke:#1B5E20,stroke-width:2px,color:#000
    style Background_Workers fill:#FFF3E0,stroke:#E65100,stroke-width:2px,color:#000
```

**Explanation of Architecture:**  
The application utilizes Next.js 15 Server Components and Server Actions leveraging a React 19 frontend. Core mutations connect securely to a PostgreSQL database via Prisma ORM. Crucially, the platform routes all LLM generations—like realtime Chatbot streaming, Resume Tailoring, or Mock Interviews—to the high-speed Groq API running Llama 3. Asynchronous heavy lifting (like weekly industry insight aggregations) is decoupled and delegated to Inngest for fault-tolerant background execution, deployed fully on Vercel.

---

# 6. Technologies Used

**Frontend & Framework:**  
- Next.js 15 (App Router)
- React 19
- Tailwind CSS & Shadcn UI
- Framer Motion (Micro-animations)
- Recharts (for Analytics Dashboard)

**Backend & Data Services:**  
- Next.js Server Actions (Internal API)
- Prisma (Type-safe ORM)
- PostgreSQL (Primary Datastore)
- Clerk (Authentication Provider)

**AI & Background Infrastructure:**  
- Groq API (`llama-3.3-70b-versatile` - Sub-second LPU inference)
- Inngest (Serverless queues and CRON workflows)

**Deployment:**
- Vercel (Edge-ready, scalable cloud hosting)

---

# 7. Methodology / Working

**Step-by-step working of system:**  
1. **Secure Onboarding:** Clerk manages SSO. Users supply an initial skill vector and target industry.
2. **Data Orchestration:** Upon onboarding, Inngest workers quietly aggregate complex industry data in the background and insert it into Prisma, keeping the UX fluid.
3. **Resume Formulation / Tailoring:** Utilizing `pdf-parse`, existing resumes can be introspected. When users input a target Job Description, the server prompts the Groq API to formulate an ATS score and dynamically tailor a new resume version specifically optimizing for those keywords.
4. **Interview & Tracking Loop:** When testing initiates, the server dynamically prompts for questions. User responses are saved in PostgreSQL to populate the Analytical Dashboard over time.
5. **Chatbot Session:** A stateless or memory-backed route queries the Groq API infused with the user's localized database profile, yielding deeply personalized career advice natively in the application.

---

# 8. Implementation

**Project setup steps:**  
```bash
git clone https://github.com/dhruvi-git/disha.ai.git
cd disha.ai
npm install
# configure .env variables
npx prisma generate
npx prisma db push
# Terminal 1 - App Server
npm run dev
# Terminal 2 - Start Inngest local relayer
npx inngest-cli@latest dev
# Terminal 3 - Database Studio GUI
npx prisma studio
```

**Code Structure:**  
- `/app` - Route Segment definitions, UI layouts, page boundaries.
- `/actions` - Server-side RPC methods executing direct database/AI logic.
- `/components` - Modular visual atoms.
- `/lib` - Core utility instantiations (Prisma client, Inngest client).
- `/app/api/inngest` - Hosted Inngest worker endpoint for background orchestration.

---

# 9. Results & Output

**Performance Metrics:**  
- **Time to First Token (TTFT):** Exceptionally low (< 600ms) by targeting Groq's Llama 3 models. Perfect for Chatbot reactivity.
- **Worker Reliability:** Inngest achieves robust execution guarantees for critical data refreshes with native exponential backoff behavior.

*(Insert Screenshots of Analytical Dashboard / PDF Renders Here)*

---

# 10. Challenges & Limitations

**Problems faced during development:**  
- **Context Window Management:** Parsing large user Resumes combined with extensive Job Descriptions requires careful systemic prompt engineering to avoid truncation.
- **Stateful Background Jobs:** Initial serverless timeouts occurred on Vercel when attempting to run heavy insight generation synchronously. Refactored architecture to adopt **Inngest** for detached async execution resolves this.

**Limitations of the system:**  
- Reliance heavily on prompt stability from Groq. 

---

# 11. Future Scope

**Possible improvements:**  
- Native WebRTC Voice integrations directly streaming to speech-to-text models for verbal mock interviews.
- Integrated networking—suggesting open source projects or live peer connections based on similar roadblocks tracked in roadmaps.

**Extensions:**  
- Constructing a native mobile client via Expo fetching from the shared Next.js Server Components.

---

# 12. Conclusion

**Summary of work:**  
Disha AI successfully integrates high-speed generative AI, robust relational tracking, and asynchronous event-driven worker tasks into a single, cohesive user experience aimed at fundamentally solving programmatic career guidance.

**Key learnings:**  
- The Groq API drastically minimizes perceived latency when implementing chatbot and heavy LLM task workflows compared to standard providers.
- Adopting Inngest early significantly avoids operational dread associated with managing custom Redis task queues on serverless platforms like Vercel.

---

# 13. References

**Documentation Links:**  
- [Inngest Background Jobs](https://www.inngest.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Groq AI Reference](https://console.groq.com/docs/)
- [Prisma ORM Docs](https://www.prisma.io/docs/)
- [Clerk Navigation](https://clerk.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

# 14. Demo

**Video demo link:**  
*(Please insert Youtube / Drive link here)*

**Screenshots or GIFs:**  
*(Please insert Visuals of Chatbot, Tailor Feature, and Dashboard here)*
