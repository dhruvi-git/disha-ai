"use client";



import { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {

  AlertTriangle,

  Download,

  Edit,

  Loader2,

  Monitor,

  Save,

  Sparkles,

  Upload,

  FileText,

  CheckCircle2,

  XCircle

} from "lucide-react";

import { toast } from "sonner";

import MDEditor from "@uiw/react-md-editor";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { saveResume, tailorResumeWithAI } from "@/actions/resume";

import { EntryForm } from "./entry-form";

import useFetch from "@/hooks/use-fetch";

import { useUser } from "@clerk/nextjs";

import { entriesToMarkdown } from "@/app/lib/helper";

import { resumeSchema } from "@/app/lib/schema";

import html2pdf from "html2pdf.js/dist/html2pdf.min.js";



export default function ResumeBuilder({ initialContent }) {

  const [activeTab, setActiveTab] = useState("edit");

  const [previewContent, setPreviewContent] = useState(initialContent);

  const { user } = useUser();

  const [resumeMode, setResumeMode] = useState("preview");



  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [isTailoring, setIsTailoring] = useState(false);

  const [tailorResult, setTailorResult] = useState(null);



  const {

    control,

    register,

    handleSubmit,

    watch,

    formState: { errors },

  } = useForm({

    resolver: zodResolver(resumeSchema),

    defaultValues: {

      contactInfo: {},

      summary: "",

      skills: "",

      experience: [],

      education: [],

      projects: [],

    },

  });



  const {

    loading: isSaving,

    fn: saveResumeFn,

    data: saveResult,

    error: saveError,

  } = useFetch(saveResume);



  const formValues = watch();



  useEffect(() => {

    if (initialContent) setActiveTab("preview");

  }, [initialContent]);



  useEffect(() => {

    if (activeTab === "edit") {

      const newContent = getCombinedContent();

      setPreviewContent(newContent ? newContent : initialContent);

    }

  }, [formValues, activeTab]);



  useEffect(() => {

    if (saveResult && !isSaving) {

      toast.success("Resume saved successfully!");

    }

    if (saveError) {

      toast.error(saveError.message || "Failed to save resume");

    }

  }, [saveResult, saveError, isSaving]);



  const getContactMarkdown = () => {

    const { contactInfo } = formValues;

    const parts = [];

    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);

    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);

    if (contactInfo.linkedin)

      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);

    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);



    return parts.length > 0

      ? `## <div align="center">${user.fullName}</div>

        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>`

      : "";

  };



  const getCombinedContent = () => {

    const { summary, skills, experience, education, projects } = formValues;

    return [

      getContactMarkdown(),

      summary && `## Professional Summary\n\n${summary}`,

      skills && `## Skills\n\n${skills}`,

      entriesToMarkdown(experience, "Work Experience"),

      entriesToMarkdown(education, "Education"),

      entriesToMarkdown(projects, "Projects"),

    ]

      .filter(Boolean)

      .join("\n\n");

  };



  const [isGenerating, setIsGenerating] = useState(false);



  const generatePDF = async () => {

    setIsGenerating(true);

    try {

      const element = document.getElementById("resume-pdf");

      const opt = {

        margin: [15, 15],

        filename: "resume.pdf",

        image: { type: "jpeg", quality: 0.98 },

        html2canvas: { scale: 2 },

        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },

      };



      await html2pdf().set(opt).from(element).save();

    } catch (error) {

      console.error("PDF generation error:", error);

    } finally {

      setIsGenerating(false);

    }

  };



  const onSubmit = async (data) => {

    try {

      const formattedContent = previewContent

        .replace(/\n/g, "\n") // Normalize newlines

        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines

        .trim();



      console.log(previewContent, formattedContent);

      await saveResumeFn(previewContent);

    } catch (error) {

      console.error("Save error:", error);

    }

  };



  // --- AI TAILOR HANDLER ---

  const handleTailorResume = async () => {

    if (!file || !jobDescription) {

      toast.error("Please upload a resume and paste a job description.");

      return;

    }



    setIsTailoring(true);

    try {

      const formData = new FormData();

      formData.append("file", file);

      formData.append("jobDescription", jobDescription);



      const result = await tailorResumeWithAI(formData);

      setTailorResult(result);
      toast.success("Resume tailored successfully!");
      setIsTailoring(false);



    } catch (error) {

      console.error(error);

      toast.error("Failed to tailor resume.");

      setIsTailoring(false);

    }

  };



  return (

    <div data-color-mode="light" className="space-y-4">

      <div className="flex flex-col md:flex-row justify-between items-center gap-2">

        <h1 className="font-bold gradient-title text-5xl md:text-6xl">

          Resume Builder

        </h1>

        <div className="space-x-2">

          <Button

            variant="destructive"

            onClick={handleSubmit(onSubmit)}

            disabled={isSaving}

          >

            {isSaving ? (

              <>

                <Loader2 className="mr-2 h-4 w-4 animate-spin" />

                Saving...

              </>

            ) : (

              <>

                <Save className="h-4 w-4" />

                Save

              </>

            )}

          </Button>

          <Button onClick={generatePDF} disabled={isGenerating}>

            {isGenerating ? (

              <>

                <Loader2 className="h-4 w-4 animate-spin" />

                Generating PDF...

              </>

            ) : (

              <>

                <Download className="h-4 w-4" />

                Download PDF

              </>

            )}

          </Button>

        </div>

      </div>



      <Tabs value={activeTab} onValueChange={setActiveTab}>

        <TabsList className="w-full md:w-auto justify-start overflow-x-auto">

          <TabsTrigger value="edit">Form</TabsTrigger>

          <TabsTrigger value="preview">Markdown</TabsTrigger>

          <TabsTrigger value="tailor" className="bg-purple-500/10 text-purple-600 dark:text-purple-400">

            <Sparkles className="h-4 w-4 mr-2" />

            AI Tailor

          </TabsTrigger>

        </TabsList>



        <TabsContent value="edit">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* Contact Information */}

            <div className="space-y-4">

              <h3 className="text-lg font-medium">Contact Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">

                <div className="space-y-2">

                  <label className="text-sm font-medium">Email</label>

                  <Input

                    {...register("contactInfo.email")}

                    type="email"

                    placeholder="your@email.com"

                    error={errors.contactInfo?.email}

                  />

                  {errors.contactInfo?.email && (

                    <p className="text-sm text-red-500">

                      {errors.contactInfo.email.message}

                    </p>

                  )}

                </div>

                <div className="space-y-2">

                  <label className="text-sm font-medium">Mobile Number</label>

                  <Input

                    {...register("contactInfo.mobile")}

                    type="tel"

                    placeholder="+1 234 567 8900"

                  />

                  {errors.contactInfo?.mobile && (

                    <p className="text-sm text-red-500">

                      {errors.contactInfo.mobile.message}

                    </p>

                  )}

                </div>

                <div className="space-y-2">

                  <label className="text-sm font-medium">LinkedIn URL</label>

                  <Input

                    {...register("contactInfo.linkedin")}

                    type="url"

                    placeholder="https://linkedin.com/in/your-profile"

                  />

                  {errors.contactInfo?.linkedin && (

                    <p className="text-sm text-red-500">

                      {errors.contactInfo.linkedin.message}

                    </p>

                  )}

                </div>

                <div className="space-y-2">

                  <label className="text-sm font-medium">

                    Twitter/X Profile

                  </label>

                  <Input

                    {...register("contactInfo.twitter")}

                    type="url"

                    placeholder="https://twitter.com/your-handle"

                  />

                  {errors.contactInfo?.twitter && (

                    <p className="text-sm text-red-500">

                      {errors.contactInfo.twitter.message}

                    </p>

                  )}

                </div>

              </div>

            </div>



            {/* Summary */}

            <div className="space-y-4">

              <h3 className="text-lg font-medium">Professional Summary</h3>

              <Controller

                name="summary"

                control={control}

                render={({ field }) => (

                  <Textarea

                    {...field}

                    className="h-32"

                    placeholder="Write a compelling professional summary..."

                    error={errors.summary}

                  />

                )}

              />

              {errors.summary && (

                <p className="text-sm text-red-500">{errors.summary.message}</p>

              )}

            </div>



            {/* Skills */}

            <div className="space-y-4">

              <h3 className="text-lg font-medium">Skills</h3>

              <Controller

                name="skills"

                control={control}

                render={({ field }) => (

                  <Textarea

                    {...field}

                    className="h-32"

                    placeholder="List your key skills..."

                    error={errors.skills}

                  />

                )}

              />

              {errors.skills && (

                <p className="text-sm text-red-500">{errors.skills.message}</p>

              )}

            </div>



            {/* Experience */}

            <div className="space-y-4">

              <h3 className="text-lg font-medium">Work Experience</h3>

              <Controller

                name="experience"

                control={control}

                render={({ field }) => (

                  <EntryForm

                    type="Experience"

                    entries={field.value}

                    onChange={field.onChange}

                  />

                )}

              />

              {errors.experience && (

                <p className="text-sm text-red-500">

                  {errors.experience.message}

                </p>

              )}

            </div>



            {/* Education */}

            <div className="space-y-4">

              <h3 className="text-lg font-medium">Education</h3>

              <Controller

                name="education"

                control={control}

                render={({ field }) => (

                  <EntryForm

                    type="Education"

                    entries={field.value}

                    onChange={field.onChange}

                  />

                )}

              />

              {errors.education && (

                <p className="text-sm text-red-500">

                  {errors.education.message}

                </p>

              )}

            </div>



            {/* Projects */}

            <div className="space-y-4">

              <h3 className="text-lg font-medium">Projects</h3>

              <Controller

                name="projects"

                control={control}

                render={({ field }) => (

                  <EntryForm

                    type="Project"

                    entries={field.value}

                    onChange={field.onChange}

                  />

                )}

              />

              {errors.projects && (

                <p className="text-sm text-red-500">

                  {errors.projects.message}

                </p>

              )}

            </div>

          </form>

        </TabsContent>



        <TabsContent value="preview">

          {activeTab === "preview" && (

            <Button

              variant="link"

              type="button"

              className="mb-2"

              onClick={() =>

                setResumeMode(resumeMode === "preview" ? "edit" : "preview")

              }

            >

              {resumeMode === "preview" ? (

                <>

                  <Edit className="h-4 w-4 mr-2" />

                  Edit Resume

                </>

              ) : (

                <>

                  <Monitor className="h-4 w-4 mr-2" />

                  Show Preview

                </>

              )}

            </Button>

          )}



          {activeTab === "preview" && resumeMode !== "preview" && (

            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">

              <AlertTriangle className="h-5 w-5" />

              <span className="text-sm">

                You will lose edited markdown if you update the form data.

              </span>

            </div>

          )}

          <div className="border rounded-lg">

            <MDEditor

              value={previewContent}

              onChange={setPreviewContent}

              height={800}

              preview={resumeMode}

            />

          </div>

          <div className="hidden">

            <div id="resume-pdf">

              <MDEditor.Markdown

                source={previewContent}

                style={{

                  background: "white",

                  color: "black",

                }}

              />

            </div>

          </div>

        </TabsContent>



        {/* --- NEW AI TAILOR TAB --- */}

        <TabsContent value="tailor" className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

            

            {/* Input Zone */}

            <Card>

              <CardHeader>

                <CardTitle className="flex items-center gap-2">

                  <FileText className="h-5 w-5 text-purple-500" />

                  Target Your Resume

                </CardTitle>

                <CardDescription>

                  Upload your base resume and paste the job description you want to apply for.

                </CardDescription>

              </CardHeader>

              <CardContent className="space-y-4">

                <div className="space-y-2">

                  <label className="text-sm font-medium">1. Upload Current Resume (PDF/Word)</label>

                  <Input 

                    type="file" 

                    accept=".pdf,.doc,.docx" 

                    onChange={(e) => setFile(e.target.files[0])}

                    className="cursor-pointer"

                  />

                </div>

                

                <div className="space-y-2">

                  <label className="text-sm font-medium">2. Paste Target Job Description</label>

                  <Textarea 

                    placeholder="Paste the requirements, responsibilities, and qualifications here..."

                    className="h-48"

                    value={jobDescription}

                    onChange={(e) => setJobDescription(e.target.value)}

                  />

                </div>



                <Button 

                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={handleTailorResume}
                  disabled={isTailoring || !file || !jobDescription}
                >
                  {isTailoring ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing & Tailoring...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Optimize for this Job
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Zone */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle>AI Optimization Results</CardTitle>
                <CardDescription>
                  Review the feedback and apply the tailored changes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!tailorResult && !isTailoring && (
                  <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border-2 border-dashed rounded-lg p-6">
                    <Sparkles className="h-10 w-10 mb-4 text-muted-foreground/50" />
                    <p>Upload a resume and job description to see AI-powered suggestions and ATS analysis.</p>
                  </div>
                )}
                
                {isTailoring && (
                  <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                    <p className="text-sm text-muted-foreground animate-pulse">
                      Parsing resume against job requirements...
                    </p>
                  </div>
                )}

                {tailorResult && !isTailoring && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-5 w-5 text-blue-500" />
                        <span className="font-semibold">Expected ATS Score</span>
                      </div>
                      <div className={`text-2xl font-bold ${
                        tailorResult.atsScore >= 80 ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {tailorResult.atsScore}%
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Key Improvements & Feedback
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {tailorResult.feedback.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => {
                        setPreviewContent(tailorResult.optimizedContent);
                        setActiveTab("preview");
                        toast.success("Applied tailored content to preview!");
                      }}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Apply Changes to Preview
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

