# Disha AI - Your Intelligent Career Coach 🚀

Disha AI (formerly SensAI) is a Full-Stack AI-powered career coach built to help professionals optimize their resumes, prepare for interviews, and explore industry insights. 
It analyzes your profile and industry to deliver tailored, actionable advice using state-of-the-art open-source LLMs.

## 🌟 Key Features

- **Industry Insights Dashboard:** Generates real-time data on salary ranges, top skills, and market trends within your specific industry.
- **AI Resume Builder:** Write, save, and improve your resume using AI to quantify achievements and align with industry standards. Exports directly to PDF.
- **Mock Interviews:** Dynamically generates technical and behavioral multiple-choice quizzes based on your skills. Receive AI-driven feedback on wrong answers.
- **Cover Letter Generator:** Creates tailored cover letters in seconds by matching your resume background with the provided job description.
- **Background Automation:** Powered by Inngest, industry insights are refreshed asynchronously to keep your dashboard up-to-date.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling & UI:** Tailwind CSS, Shadcn UI, Lucide React
- **Authentication:** [Clerk](https://clerk.com/)
- **Database & ORM:** PostgreSQL accessed via [Prisma](https://www.prisma.io/)
- **AI Provider:** [Groq API](https://groq.com/) using the `llama-3.3-70b-versatile` model
- **Background Jobs:** [Inngest](https://www.inngest.com/)

---

## 📂 Repository Structure

```text
disha.ai/
├── app/             # Next.js App Router (UI, Routes, Server Actions)
├── components/      # React Components (UI, Layout)
├── prisma/          # Database Schema
└── public/          # Static Assets
```

The core application is a complete Next.js Full-Stack application, utilizing server actions to talk to the database and Groq.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Local PostgreSQL server installed and running
- API Keys for Clerk and Groq

### 1. Clone & Install
```bash
git clone https://github.com/dhruvi-git/disha.ai.git
cd disha.ai
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<your_database>"

# Groq AI
GROQ_API_KEY="your_groq_api_key_here"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

### 3. Initialize the Database
Push the Prisma schema to your local PostgreSQL instance:
```bash
npx prisma generate
npx prisma db push
```

### 4. Run the Application
Start the Next.js development server:
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

*(Optional) Start the Inngest Dev Server to test background jobs:*
Open a new terminal, navigate to the project root, and run:
```bash
npx inngest-cli@latest dev
```
