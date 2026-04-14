# 1. Home (Project Overview)
**Page Name:** Home

- **Project Title:** Disha AI - Your Intelligent Career Coach
- **Team Members:** Dhruvi Jain (Replace with actual Roll No & [GitHub Link](https://github.com/dhruvi-git))
- **Guide / Faculty Name:** [Faculty Name Here]
- **Project Domain:** Artificial Intelligence / Career Tech / Web Development
- **Short Description:** Disha AI is a Full-Stack AI-powered career coach built to help students and professionals to optimize their resumes, prepare for interviews, and explore industry insights. It analyzes your profile and industry to deliver tailored, actionable advice using state-of-the-art open-source LLMs.
- **Problem Statement:** Job seekers often struggle to align their resumes and interview preparation with real-world industry demands. The lack of personalized, data-driven feedback leads to prolonged job searches and missed opportunities.
- **Objectives:** To bridge the gap between job seekers' qualifications and employer expectations through personalized, AI-driven guidance, including resume optimization, targeted interview prep, and real-time industry insights.
- **Key Features:** Industry Insights Dashboard, AI Resume Builder, Mock Interviews, Cover Letter Generator, and Background Automation for real-time market trends.

***

# 2. Introduction
**Page Name:** Introduction

### Background of the project
In the competitive job market, candidates face immense pressure to present optimized resumes and ace challenging interviews. Traditional methods of career guidance are manual, expensive, and not accessible to everyone.

### Motivation
With the advent of advanced Large Language Models (LLMs), it is now possible to provide scalable, highly personalized career coaching. Disha AI was motivated by the need to democratize expert career advice for every professional, regardless of their background.

### Existing System
Existing career platforms either focus solely on job postings (like LinkedIn, Indeed) or provide generic resume templates with limited or no AI analysis. Interview preparation tools are largely static and not tailored to an individual's specific skill set.

### Limitations of Existing Systems
- Generic feedback that does not adapt to individual profiles.
- Lack of data-driven industry insights (e.g., current salary ranges, trending skills).
- High costs associated with human career coaches.
- Disconnected tools for resume building, cover letters, and interview preparation.

### Proposed Solution
Disha AI integrates all essential career preparation elements into a single platform. It uses the `llama-3.3-70b-versatile` model to provide real-time, dynamic feedback, ensuring candidates are evaluated and guided based on current industry standards.

***

# 3. Objectives & Scope
**Page Name:** Objectives-and-Scope

### Project Objectives
- Build an intuitive platform to generate AI-tailored resumes and cover letters.
- Develop a dynamic mock interview module that adapts to the candidate's specific background.
- Integrate automated workflows to fetch and display current market trends and salary data.
- Securely manage user profiles and onboarding.

### Scope of the Project
Disha AI focuses on the preparation phase of the job search cycle. It encompasses document generation (Resumes, Cover Letters), assessment (Mock Interviews), and market analysis (Industry Insights), providing a holistic tool for job seekers.

### Applications / Use Cases
- **Recent Graduates:** Building their first professional resume and practicing interviews.
- **Career Changers:** Understanding the skills gap and receiving tailored cover letters for new industries.
- **Active Job Seekers:** Keeping up with current market trends and optimizing output for specific job descriptions.

### Expected Outcomes
A fully functional, deployed web application that users can sign into, build their professional profile, and instantly start receiving AI-generated career advice and assets.

***

# 4. Literature Survey / Related Work
**Page Name:** Literature-Survey

### Existing Tools/Technologies
- **ChatGPT / Claude:** General-purpose LLMs used for resume writing but lacking specialized workflows and structured UI.
- **Zety / Resume.io:** Template-driven resume builders with minimal AI integration.
- **Pramp / Interviewing.io:** Peer-to-peer or human-led interview practice, which can be intimidating and hard to schedule.

### Comparison Table

| Feature | Disha AI | Traditional Builders (Zety) | General AI (ChatGPT) |
| --- | --- | --- | --- |
| **Industry Insights** | Automated & Real-time | None | Manual Prompting |
| **Resume Builder** | AI-driven & Quantified | Template-based | Text-only output |
| **Mock Interviews** | Dynamic & Interactive | None | Conversational (Unstructured) |
| **Cost** | Accessible / Open Source | Subscriptions | Varies / Free |

***

# 5. System Architecture
**Page Name:** System-Architecture

*(Ensure you upload your architecture diagram to the wiki and embed it here!)*
`![System Architecture Diagram](link-to-your-image.png)`

### Explanation of Architecture
The application runs on a modern decoupled architecture using the **Next.js 15 App Router**. 
- The **Client-side** is rendered using React and Tailwind CSS. 
- The **Server Actions** communicate with the **PostgreSQL** database via **Prisma ORM**.
- **Clerk** handles user authentication and session management.
- External API calls are routed securely from the backend to the **Groq API** to retrieve AI inferences.
- **Inngest** operates in the background to handle asynchronous tasks like updating industry insights without blocking the main thread.

### Modules Description
1. **Auth & Onboarding Module:** Secure login/signup and initial profile creation.
2. **Dashboard Module:** Central hub displaying industry insights and navigation.
3. **Resume Builder Module:** Form-driven UI interfacing with AI to write and format skills/experiences, exporting via `html2pdf.js`.
4. **Interview Module:** Quiz generation engine evaluating user answers and providing feedback.
5. **Cover Letter Module:** Matching engine comparing user profile data against a provided job description.

***

# 6. Technologies Used
**Page Name:** Technologies-Used

### Programming Languages
- JavaScript / TypeScript
- SQL

### Frameworks / Libraries
- **Frontend/Backend:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS, Shadcn UI, Framer Motion, Tailwindcss-animate
- **State/Forms:** React Hook Form, Zod
- **Database ORM:** Prisma
- **AI SDK:** AI SDK React (`@ai-sdk/react`), Groq SDK
- **Utilities:** `html2pdf.js`, `pdf-parse`, `date-fns`, `lucide-react`

### Tools
- **Database:** PostgreSQL
- **Authentication:** Clerk
- **Background Jobs:** Inngest
- **AI Provider:** Groq (llama-3.3-70b-versatile)
- **Version Control:** Git & GitHub

***

# 7. Methodology / Working
**Page Name:** Methodology

### Step-by-Step Working of the System
1. **User Authentication:** User signs up via Clerk.
2. **Onboarding:** User selects their industry and provides basic background.
3. **Data Initialization:** An Inngest background job fetches initial insights for the selected industry.
4. **Interaction:** User inputs their career history into the AI Resume builder.
5. **AI Inference:** The backend formats a prompt and sends it to Groq API.
6. **Delivery:** The structured AI response is saved in the Postgres database and streamed back to the Next.js frontend to update the UI interactively.

### Data Flow Explanation
- **Client (Browser)** -> sends request/form data -> **Next.js Server Actions** 
- **Server Action** -> validates data via **Zod** -> queries DB using **Prisma** 
- **Server Action** -> calls **Groq LLM** with tailored system prompts -> receives parsed JSON or streamed text.
- Data flows back to the **Client** and is styled by **Tailwind & Shadcn**.

***

# 8. Implementation
**Page Name:** Implementation

### Project Setup Steps
```bash
git clone https://github.com/dhruvi-git/disha.ai.git
cd disha.ai
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Code Structure
```text
disha.ai/
├── app/             # Application routes, pages, and layout (App Router)
│   ├── api/         # Inngest and Webhook handlers
│   └── (main)/      # Protected dashboard, interview, and resume routes
├── components/      # Reusable React UI components (Shadcn)
├── lib/             # Utility functions, Prompts, and Schema definitions
└── prisma/          # Database connection and schema configuration
```

### Key Integration Details
- **Groq AI Integration:** Utilizes `@ai-sdk/groq` to interface asynchronously with high-speed models, reducing wait times for users generating complex resumes and quizzes.
- **Inngest Workflow:** Integrated for durable execution of background data fetching. Ensures that heavy API calls for market analysis do not interrupt the UX.

**Repository Link:** [https://github.com/dhruvi-git/disha.ai](https://github.com/dhruvi-git/disha.ai)

***

# 9. Results & Output
**Page Name:** Results

*(Note: Add screenshots to the wiki before publishing)*
- `![Dashboard Screenshot](link)`
- `![Resume Builder Screenshot](link)`
- `![Mock Interview Screenshot](link)`

### Observations
- The integration of the Groq API significantly decreased latency in AI responses compared to traditional providers.
- Users can generate a complete resume from baseline bullet points in under 5 seconds.
- The platform effectively scales UI rendering based on the complex nested JSON outputs dynamically returned by the LLM.

***

# 10. Challenges & Limitations
**Page Name:** Challenges

### Problems Faced During Development
- **Prompt Engineering:** Structuring the LLM prompts so they consistently returned valid JSON formats required extensive tweaking and robust error handling.
- **State Management:** Managing complex nested forms (like work experience arrays) and syncing them with AI generation was complex.
- **Deployment Build Errors:** Handling dependencies and environment variable mismatches during the production deployment phase on Vercel.

### Limitations of the System
- **Context Windows:** Very long work histories might push the limits of the token context window.
- **Hallucinations:** Like all LLMs, the AI might occasionally suggest skills or metrics that are slightly misaligned and require manual review by the user.

***

# 11. Future Scope
**Page Name:** Future-Scope

### Possible Improvements
- **LinkedIn Integration:** Allow users to automatically populate their profile via their LinkedIn URL.
- **Job Matching:** Implementing a feature that scrapes active job boards and scores the user's resume against live job listings.
- **Voice Interviews:** Extending the mock interview module to include speech-to-text integration for real-time verbal practice.
- **Peer Review:** Enabling the sharing of resumes internally with other users for peer feedback.

***

# 12. Conclusion
**Page Name:** Conclusion

### Summary of Work
The Disha AI project successfully demonstrates the integration of advanced generative AI models into a standard web application architecture to solve a real-world problem. By providing tools like an automated resume builder and a mock interview simulator, it acts as a comprehensive, accessible career coach. 

### Key Learnings
- Building complex full-stack applications with Next.js 15.
- Deep integration of AI via the Vercel AI SDK and Groq.
- Managing background tasks and workflows using Inngest.
- Designing responsive, beautiful UIs using Tailwind CSS and Component Libraries (Shadcn UI).

***

# 13. References
**Page Name:** References

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Clerk Authentication Docs](https://clerk.com/docs)
- [Prisma ORM Docs](https://www.prisma.io/docs)
- [Groq API Reference](https://console.groq.com/docs/quickstart)
- [Inngest Documentation](https://www.inngest.com/docs)

***

# 14. Demo
**Page Name:** Demo

- **Video Demo Link:** [Insert YouTube or Google Drive Link Here]

*(Ensure to include high-quality GIFs or screenshots in the wiki showing:*
- *The sign-in flow*
- *Generating a resume section*
- *Taking a mock interview quiz)*
