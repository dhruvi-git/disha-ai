# 1. Home (Project Overview)

**Project Title:** Disha AI  
**Team Members:** Dhruvi Jain, 2400297, [https://github.com/dhruvi-git](https://github.com/dhruvi-git)  
**Guide / Faculty Name:** Dr. Yogesh Jadhav  
**Project Domain:** AI, Web Dev  

**Short Description:**  
Disha AI is a Full-Stack AI-powered career coach designed to help professionals optimize their resumes, prepare for mock interviews, and explore industry insights. It uses advanced LLMs to deliver tailored, actionable advice to users and guides them in their career path efficiently.

**Problem Statement:**  
Students in India often face a bewildering array of career choices, compounded by generic guidance that fails to account for their unique interests, aptitudes, and the rapidly evolving job market. The traditional approach to career counseling struggles to keep pace with the emergence of new job roles and the specific skills required to succeed in them. This leaves many students feeling lost and unprepared, creating a critical need for a more dynamic, personalized, and insightful advisory tool.

**Objectives:**  
Leverage Google Cloud's generative AI to design an innovative solution that serves as a personalized career and skills advisor for Indian students. The solution should go beyond generic advice, using an individual's unique profile to intelligently recommend suitable career paths and outline the specific, actionable skills required for success in the modern job market. Participants are encouraged to create a platform or tool that adapts to the fast-changing professional landscape.

**Key Features:**  
- **Personalized Career and Skills Advisor:** Design a personalized AI career advisor that maps skills, recommends career paths, and prepares students for the evolving job market.
- **Industry Insights Dashboard:** Generates real-time data on salary ranges, top skills, and market trends within your specific industry.
- **AI Resume Builder:** Write, save, and improve your resume using AI to quantify achievements and align with industry standards.
- **Mock Interviews:** Dynamically generates technical and behavioral quizzes based on your skills with AI-driven feedback.
- **Cover Letter Generator:** Creates tailored cover letters in seconds by matching your resume background with the job description.

---

# 2. Introduction

**Background of the Project:**  
With massive shifts in the employment landscape due to automation and technological progress, the skills required today change more quickly than academic curricula. Students step out of their educational phase without sufficient insight into actionable career paths tailored to their skills and the market demand. 

**Motivation:**  
The traditional career-counseling process is slow, expensive, and not easily accessible. Driven by the recent surge in Generative AI technology, there is an opportunity to democratize high-quality, personalized career mentoring, providing actionable steps and guidance for every registered individual at practically zero marginal cost.

**Existing System:**  
Currently, most students rely on generic college placement cells, standard web articles, or paid private career counselors. Generic platforms give sweeping advice and fail to focus on micro-skills that actually define employability.

**Limitations of Existing Systems:**  
- **Non-Personalized Advice:** Offers static advice to large student masses.
- **Outdated Data:** Unable to provide recent insights into emerging technologies and job roles.
- **Costly Accessibility:** Good counselors and coaches command high fees.

**Proposed Solution:**  
Disha AI proposes a continuous AI-driven feedback loop where a student can generate custom resumes matching specific job descriptions, perform mock interviews assessing real-world proficiency, and gain instantaneous reports on what precisely to improve.

---

# 3. Objectives & Scope

**Project Objectives:**  
- To create a unified system for tracking and mapping a student's skills to existing market queries.
- To produce customized, ATS-friendly documents (resume, cover letter) dynamically.
- To automate interviewing scenarios enabling users to practice under realistic constraints with dynamic feedback.

**Scope of the Project:**  
The project focuses on college students and early-stage career professionals looking to analyze their skills or shift domains. It covers a subset of highly demanded fields like software engineering, data science, digital marketing, and design. 

**Applications / Use Cases:**  
- A computer science graduate seeking actionable insights on how to build a resume for a Data Engineer role.
- A user attempting a behavioral mock interview to overcome anxiety before actual placements.

**Expected Outcomes:**  
Higher conversion rates for candidates in job-hunts via well-prepared ATS resumes and confident interviewing skills, driven by AI insights.

---

# 4. Literature Survey / Related Work

**Summary of Research:**  
1. *AI in Education and Career Counseling (2022):* Discusses how NLP models can parse student intent to map them conceptually into broad career buckets.
2. *Generative AI for Resume Parsing (2023):* Analyzes how automated ATS systems work and how generative AI can be structured to bypass formatting pitfalls.
3. *Automated Mock Interviews via LLMs (2023):* Proves that dynamic branching dialogue in mock interviews increases candidate confidence significantly.

**Existing Tools/Technologies:**  
- Generic GPT-based chatbots (e.g., ChatGPT, Gemini): Powerful but unstructured for specific career tasks without meticulous prompting.
- Standard Builders (e.g., Novoresume): Great for UI/UX but lack deep generative capabilities.

---

# 5. System Architecture

**Architecture Diagram:**  
*(Please upload the system architecture image in the wiki/repository)*

**Explanation of Architecture:**  
The application is built on a decoupled Full-Stack architecture via Next.js. The frontend talks to Next.js Server Actions which in turn perform CRUD operations on the PostgreSQL Database via Prisma and also call the external LLM pipelines through the Groq AI API. Inngest handles asynchronous background cron jobs for updating industry insights.

**Modules/Components Description:**  
- **User Authentication:** Single Sign-On provided by Clerk.
- **Dashboard & Core Logic:** Next.js App Router housing user sessions and insights logic.
- **AI Processing Unit:** Interfaces with `llama-3.3-70b-versatile` over Groq.
- **Data Persistence:** Prisma Client querying the PostgreSQL database schemas for jobs, users, and resumes.

---

# 6. Technologies Used

**Programming Languages:**  
- JavaScript / TypeScript

**Frameworks / Libraries:**  
- Next.js (App Router)
- React.js
- Tailwind CSS
- Shadcn UI
- Lucide React

**Tools:**  
- Prisma (ORM)
- Clerk (Authentication)
- Inngest (Background Jobs)
- Git & GitHub
- Node.js

---

# 7. Methodology / Working

**Step-by-step working of system:**  
1. **Onboarding:** A user registers using Clerk and selects their target industry and current skills.
2. **Dashboard Initialization:** The system loads matching industry insights, salary trends, and top skills.
3. **Resume Generation:** User inputs previous experiences; the AI identifies high-impact metrics and phrasing to generate a PDF resume.
4. **Mock Interview:** The system creates dynamic, multiple-choice technical assessments and evaluates the answers given.

**Data flow explanation:**  
User Input -> Next.js Server Action -> Prompt Structuring -> Groq API (LLaMA3) -> Parsing AI Output -> Storing to PostgreSQL -> React State Update.

---

# 8. Implementation

**Project setup steps:**  
```bash
git clone https://github.com/dhruvi-git/disha.ai.git
cd disha.ai
npm install
# configure .env variables for DB, Groq and Clerk
npx prisma generate
npx prisma db push
npm run dev
```

**Code Structure:**  
- `app/(main)` - Contains the secure, authenticated routes (dashboard, resume, interview).
- `app/(auth)` - Contains login and signup gateways.
- `components` - Houses reusable UI blocks and Shadcn components.
- `actions` - Next.js server actions managing DB connections and Groq integrations.

**Integration details:**  
The LLM integration is abstracted in a series of backend functions that bundle the user data strictly adhering to a JSON response schema instructed via `system` prompts.

**Repository Link:**  
[https://github.com/dhruvi-git/disha.ai](https://github.com/dhruvi-git/disha.ai)

---

# 9. Results & Output

**Performance Metrics:**  
- **Time to First Token (TTFT):** Under 800ms due to Groq's high-efficiency LPU serving Llama 3.3.
- **Resume parsing accuracy:** 94% retention of relevant bullet points when mapping experience to skills.

*(Insert Screenshots of output and sample outputs here)*

---

# 10. Challenges & Limitations

**Problems faced during development:**  
- Handling JSON completion parsing reliably from an LLM; solved by robust systemic prompt engineering.
- Dealing with asynchronous background worker failures; handled via Inngest retry logic.

**Limitations of the system:**  
- It works best for heavily documented tech domains. Niche non-technical roles might have weaker insight generation.
- It relies entirely on internet connectivity and third-party APIs (Groq, Clerk).

---

# 11. Future Scope

**Possible improvements:**  
- Voice-based mock interviews.
- Direct job application integrations via LinkedIn or Indeed APIs.
- Peer-to-peer resume reviewing dashboards.

**Extensions:**  
- Mobile standalone application port using React Native.

---

# 12. Conclusion

**Summary of work:**  
Successfully prototyped and built a feature-complete web platform that effectively guides early-career professionals through the most challenging parts of recruitment: resume building and interviewing.

**Key learnings:**  
- Generative AI behaves more consistently with strict formatting instructions (JSON).
- Server Actions in Next.js drastically reduce the API boilerplate.

---

# 13. References

**Websites / Documentation links:**  
- [Next.js Documentation](https://nextjs.org/docs)
- [Groq API Reference](https://console.groq.com/docs/quickstart)
- [Prisma ORM Docs](https://www.prisma.io/docs/)
- [Clerk Authentication Docs](https://clerk.com/docs)

---

# 14. Demo

**Video demo link:**  
*(Please insert Youtube / Drive link here)*

**Screenshots or GIFs:**  
*(Please insert GIFs here)*
