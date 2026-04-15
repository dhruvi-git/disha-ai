# 🚀 Disha AI - Intelligent Career Coach

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![Inngest](https://img.shields.io/badge/Inngest-Background%20Jobs-E56B4E?style=for-the-badge)
![Groq](https://img.shields.io/badge/AI-Groq%20API-000000?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

Disha AI is an AI powered career coach which is designed to help students as well as professionals optimize their resumes, prepare for interviews, and explore industry insights. By leveraging the high-speed **Groq API** with the **Llama 3 model**, Disha provides tailored and actionable advice. The platform features an intelligent chatbot, personalized roadmaps, and background automation via **Inngest** to ensure data processing scales effortlessly.

---

## ✨ Comprehensive Features

### 📊 Industry Insights & Analytics
- Provides real-time data on salary ranges, trending skills, and job market trends for your chosen industry.
- The data is kept consistently updated through **Inngest** background cron jobs.

### 📄 AI Resume Tailor & Builder
- **Resume Tailoring**: Upload your resume, input a target job description, and instantly receive an **ATS Score**, tailored recommendations, and a fully customized resume aligned specifically with that role.
- Write, refine, and save ATS-friendly base resumes. Auto-formats and exports cleanly to **PDF**.
- Get AI suggestions to quantify your professional achievements effectively.

### 🎤 Interview Progress & Analytics Dashboard
- **Mock Interviews**: The application generates adaptive technical and behavioral multiple-choice questions tailored to your skills.
- **Analytical Dashboard**: Visually track your interview progress over time. See how many questions you attempted, your accuracy rates, and pinpoint exact technical areas that need improvement.

### 💬 Personalized Career Chatbot
- Have a 1-on-1 conversation with the **Disha AI Chatbot**.
- Ask questions regarding your career roadmap, interview strategies, or general guidance. Responses are deeply personalized based on your individual profile, industry, and skills.

### ✉️ Smart Cover Letter Generator
- Instantly constructs tailored cover letters.
- Contextually matches your accumulated resume experience with the requirements of a specified job description.

---

## 🛠 Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend/UI** | React 19, Next.js 15 | React framework for robust UI and Server-Side Rendering (App Router) |
| **Styling** | Tailwind CSS, Shadcn UI | Utility-first CSS and pre-built accessible components |
| **Authentication** | Clerk | Secure login, signup, and session management |
| **Database & ORM** | PostgreSQL & Prisma | Relational database modeling and type-safe querying |
| **AI Engine** | Groq API (Llama 3) | Extremely low-latency inference for the chatbot and generation features |
| **Task Queue** | Inngest | Fault-tolerant event-driven background jobs and CRON tasks |
| **Deployment** | Vercel | Scalable, zero-configuration cloud hosting |

---

## 📐 System Architecture

This architecture outlines how the React client interacts seamlessly with Next.js Server Actions, the database, and the external AI Engine.

```mermaid
graph TD
    subgraph Frontend "Frontend (React / Next.js)"
      UI[Client UI & Dashboard]
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

    UI -->|API Calls & Forms| API
    UI -->|SSO| Auth
    API -->|Prompt & Profiles| Groq
    API -->|Read/Write Queries| ORM
    ORM --> DB
    API <-->|Trigger Events & Retries| Inngest
    Inngest -->|Async Data Inserts| ORM
    
    style Frontend fill:#E1F5FE,stroke:#01579B,stroke-width:2px,color:#000
    style Backend fill:#F3E5F5,stroke:#4A148C,stroke-width:2px,color:#000
    style AI_Engine fill:#E8F5E9,stroke:#1B5E20,stroke-width:2px,color:#000
    style Background_Workers fill:#FFF3E0,stroke:#E65100,stroke-width:2px,color:#000
```

---

## 🗄️ Database Design

The application's relational data model ensuring data integrity across user records, assessments, generated documents, and background industry insights. 

```mermaid
erDiagram
    User {
        String id PK
        String clerkUserId UK
        String email UK
        String name
        String imageUrl
        String industry FK
        String bio
        Int experience
        String[] skills
        DateTime createdAt
        DateTime updatedAt
    }
    Assessment {
        String id PK
        String userId FK
        Float quizScore
        Json[] questions
        String category
        String improvementTip
        DateTime createdAt
        DateTime updatedAt
    }
    Resume {
        String id PK
        String userId FK
        String content
        Float atsScore
        String feedback
        DateTime createdAt
        DateTime updatedAt
    }
    CoverLetter {
        String id PK
        String userId FK
        String content
        String jobDescription
        String companyName
        String jobTitle
        String status
        DateTime createdAt
        DateTime updatedAt
    }
    IndustryInsight {
        String id PK
        String industry UK
        Json[] salaryRanges
        Float growthRate
        String demandLevel
        String[] topSkills
        String marketOutlook
        String[] keyTrends
        String[] recommendedSkills
        DateTime lastUpdated
        DateTime nextUpdate
    }
    RoadmapItem {
        String id PK
        String userId FK
        String title
        String description
        String link
        String status
        Int progress
        DateTime createdAt
        DateTime updatedAt
    }

    User ||--o{ Assessment : "completes"
    User ||--o{ CoverLetter : "generates"
    User ||--o| Resume : "manages"
    User ||--o{ RoadmapItem : "tracks"
    IndustryInsight ||--o{ User : "associates to"
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Local PostgreSQL server installed and running
- API Keys for Clerk, Groq, and (optionally) Inngest.

### 1. Clone & Install
```bash
git clone https://github.com/dhruvi-git/disha.ai.git
cd disha.ai
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<your_database>"

# Groq AI
GROQ_API_KEY="your_groq_api_key"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 3. Initialize the Database
Push the Prisma schema to your local database instance:
```bash
npx prisma generate
npx prisma db push
```

### 4. Run the Dev Servers
**Terminal 1 (Next.js Application):**
```bash
npm run dev
```

**Terminal 2 (Inngest Worker):**
To ensure background features operate dynamically:
```bash
npx inngest-cli@latest dev
```

The application is now hosted locally at [http://localhost:3000](http://localhost:3000).

---

## 🔍 Viewing the Database

Disha AI uses **Prisma Studio**, a convenient GUI to view your tables, manage records, and inspect entries:
```bash
npx prisma studio
```
This will launch at `http://localhost:5555`, allowing you to visually explore the schema.

---

## 📄 License
This project is for educational and portfolio purposes.


# 🚀 Disha AI - Intelligent Career Coach

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![Inngest](https://img.shields.io/badge/Inngest-Background%20Jobs-E56B4E?style=for-the-badge)
![Groq](https://img.shields.io/badge/AI-Groq%20API-000000?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

Disha AI is an AI-powered career coach designed to help students and professionals optimize their resumes, prepare for interviews, and explore industry insights. By leveraging the high-speed **Groq API** with the **Llama 3 model**, Disha provides tailored and actionable advice. The platform features an intelligent chatbot, personalized roadmaps, and background automation via **Inngest** to ensure data processing scales effortlessly.

---

## ✨ Features

### 📊 Industry Insights & Analytics
Real-time data on salary ranges, trending skills, and job market trends for your chosen industry. Data is kept consistently updated through **Inngest** background cron jobs.

### 📄 AI Resume Tailor & Builder
- **Resume Tailoring** — Upload your resume, input a target job description, and instantly receive an **ATS Score**, tailored recommendations, and a fully customized resume aligned with that role.
- Write, refine, and save ATS-friendly base resumes. Auto-formats and exports cleanly to **PDF**.
- Get AI suggestions to quantify your professional achievements effectively.

### 🎤 Interview Progress & Analytics Dashboard
- **Mock Interviews** — Adaptive technical and behavioral multiple-choice questions tailored to your skills.
- **Analytics Dashboard** — Visually track interview progress over time: questions attempted, accuracy rates, and areas needing improvement.

### 💬 Personalized Career Chatbot
One-on-one conversations with Disha AI, deeply personalized based on your individual profile, industry, and skills — for career roadmaps, interview strategies, or general guidance.

### ✉️ Smart Cover Letter Generator
Instantly constructs tailored cover letters by contextually matching your resume experience with the requirements of a specified job description.

---

## 🛠 Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend / UI** | React 19, Next.js 15 | React framework for robust UI and Server-Side Rendering (App Router) |
| **Styling** | Tailwind CSS, Shadcn UI | Utility-first CSS and pre-built accessible components |
| **Backend** | Next.js Server Actions | Type-safe server-side logic and API layer without a separate REST server |
| **Authentication** | Clerk | Secure login, signup, and session management |
| **Database & ORM** | PostgreSQL & Prisma | Relational database modeling and type-safe querying |
| **AI Engine** | Groq API (Llama 3) | Extremely low-latency inference for the chatbot and generation features |
| **Task Queue** | Inngest | Fault-tolerant event-driven background jobs and CRON tasks |
| **Deployment** | Vercel | Scalable, zero-configuration cloud hosting |

---

## 📐 System Architecture

This architecture outlines how the React client interacts with Next.js Server Actions, the database, and the external AI engine.

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React / Next.js)                │
│                    Client UI & Dashboard                     │
└──────────────────────┬──────────────────┬───────────────────┘
                       │ API Calls        │ SSO
                       ▼                  ▼
┌──────────────────────────┐   ┌──────────────────────┐
│  Next.js Server Actions  │   │  Clerk Authentication │
│      (Backend Layer)     │   └──────────────────────┘
└────┬──────────┬──────────┘
     │          │
     ▼          ▼
┌─────────┐  ┌──────────────────────────┐
│  Groq   │  │       Prisma ORM         │
│  API    │  └──────────┬───────────────┘
│ Llama 3 │             │
└─────────┘             ▼
                ┌───────────────┐
                │  PostgreSQL   │
                │   Database    │
                └───────────────┘
                       ▲
                       │ Async Data Inserts
              ┌────────┴────────┐
              │  Inngest Worker │
              │ (Background Jobs│
              │  & CRON Tasks)  │
              └─────────────────┘
```

> **Data Flow:** The UI calls Server Actions → Server Actions query Groq for AI responses and Prisma for data → Inngest workers run scheduled jobs (e.g. refreshing industry insights) asynchronously and write back to the database via Prisma.

---

## 🗄️ Database Design

The application's relational data model ensures data integrity across user records, assessments, generated documents, and background industry insights.

```mermaid
erDiagram
    User {
        String id PK
        String clerkUserId UK
        String email UK
        String name
        String imageUrl
        String industry FK
        String bio
        Int experience
        String[] skills
        DateTime createdAt
        DateTime updatedAt
    }
    Assessment {
        String id PK
        String userId FK
        Float quizScore
        Json[] questions
        String category
        String improvementTip
        DateTime createdAt
        DateTime updatedAt
    }
    Resume {
        String id PK
        String userId FK
        String content
        Float atsScore
        String feedback
        DateTime createdAt
        DateTime updatedAt
    }
    CoverLetter {
        String id PK
        String userId FK
        String content
        String jobDescription
        String companyName
        String jobTitle
        String status
        DateTime createdAt
        DateTime updatedAt
    }
    IndustryInsight {
        String id PK
        String industry UK
        Json[] salaryRanges
        Float growthRate
        String demandLevel
        String[] topSkills
        String marketOutlook
        String[] keyTrends
        String[] recommendedSkills
        DateTime lastUpdated
        DateTime nextUpdate
    }
    RoadmapItem {
        String id PK
        String userId FK
        String title
        String description
        String link
        String status
        Int progress
        DateTime createdAt
        DateTime updatedAt
    }

    User ||--o{ Assessment : "completes"
    User ||--o{ CoverLetter : "generates"
    User ||--o| Resume : "manages"
    User ||--o{ RoadmapItem : "tracks"
    IndustryInsight ||--o{ User : "associates to"
```

---


## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- Local PostgreSQL server installed and running
- API keys for Clerk, Groq, and Inngest

### 1. Clone & Install
```bash
git clone https://github.com/dhruvi-git/disha.ai.git
cd disha.ai
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# ─── Database ──────────────────────────────────────────────
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<your_database>"

# ─── Groq AI ───────────────────────────────────────────────
GROQ_API_KEY="your_groq_api_key"

# ─── Clerk Authentication ──────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# ─── Inngest (Background Jobs) ─────────────────────────────
INNGEST_SIGNING_KEY="your_inngest_signing_key"
INNGEST_EVENT_KEY="your_inngest_event_key"
```

> **Where to get these keys:**
> - **Groq** → [console.groq.com](https://console.groq.com)
> - **Clerk** → [dashboard.clerk.com](https://dashboard.clerk.com)
> - **Inngest** → [app.inngest.com](https://app.inngest.com) → your app → **Manage → Keys**

### 3. Initialize the Database

Push the Prisma schema to your local database:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the Development Servers

**Terminal 1 — Next.js Application:**
```bash
npm run dev
```

**Terminal 2 — Inngest Worker:**
```bash
npx inngest-cli@latest dev
```

The application is now running at [http://localhost:3000](http://localhost:3000).

---

## 🔍 Inspecting the Database

Disha AI uses **Prisma Studio** to visually explore tables, manage records, and inspect entries:

```bash
npx prisma studio
```

Launches at [http://localhost:5555](http://localhost:5555).

---

## 📄 License

This project is for educational and portfolio purposes.