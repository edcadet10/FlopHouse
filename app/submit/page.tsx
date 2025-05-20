"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sparkles, FileText, Zap, HelpCircle, SendHorizontal, Save, Check, AlertCircle } from "lucide-react"

// Form validation schema
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100, { message: "Title must be less than 100 characters" }),
  companyName: z.string().min(2, { message: "Company name is required" }),
  industry: z.string().min(1, { message: "Please select an industry" }),
  fundingAmount: z.string().optional(),
  failureReason: z.string().min(1, { message: "Please select a failure reason" }),
  story: z.string().min(50, { message: "Story must be at least 50 characters" }),
  lessons: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email" }).optional(),
  marketingConsent: z.boolean().optional()
});

type FormValues = z.infer<typeof formSchema>;

// Creating UI components for form
const Input = ({ label, placeholder, type = "text", register, name, error, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-zinc-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      {...register(name)}
      className={`w-full h-10 px-3 py-2 bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300`}
    />
    {error && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{error.message}</p>}
  </div>
)

const Textarea = ({ label, placeholder, register, name, rows = 4, error, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-zinc-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      placeholder={placeholder}
      {...register(name)}
      rows={rows}
      className={`w-full px-3 py-2 bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300`}
    />
    {error && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{error.message}</p>}
  </div>
)

const Select = ({ label, options, register, name, error, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-zinc-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      {...register(name)}
      className={`w-full h-10 px-3 py-2 bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{error.message}</p>}
  </div>
)

const Checkbox = ({ label, register, name, error }) => (
  <div className="mb-4 flex items-start">
    <input
      type="checkbox"
      {...register(name)}
      id={name}
      className="h-4 w-4 mt-1 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
    />
    <label htmlFor={name} className="ml-2 block text-sm text-zinc-300">
      {label}
    </label>
    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
)

// Progress steps component
const ProgressSteps = ({ currentStep, totalSteps }) => (
  <div className="w-full mb-8">
    <div className="flex items-center justify-between">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            i < currentStep 
              ? 'bg-cyan-500 text-white' 
              : i === currentStep 
                ? 'bg-cyan-500/80 text-white animate-pulse' 
                : 'bg-white/5 text-zinc-400'
          }`}>
            {i < currentStep ? (
              <Check className="h-4 w-4" />
            ) : (
              <span>{i + 1}</span>
            )}
          </div>
          {i < totalSteps - 1 && (
            <div className={`h-1 w-24 ${
              i < currentStep 
                ? 'bg-cyan-500' 
                : 'bg-white/5'
            }`} />
          )}
        </div>
      ))}
    </div>
    <div className="flex justify-between mt-2">
      <span className="text-xs text-zinc-400">Basic Info</span>
      <span className="text-xs text-zinc-400">What Happened</span>
      <span className="text-xs text-zinc-400">Lessons & Contact</span>
    </div>
  </div>
)

export default function SubmitPage() {
  // Current step in the multi-step form
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // UseForm hook with validation
  const { register, handleSubmit, formState: { errors, isValid }, getValues, trigger } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange"
  });
  
  // Industry options
  const industries = [
    { value: "", label: "Select an industry" },
    { value: "saas", label: "SaaS" },
    { value: "ecommerce", label: "E-Commerce" },
    { value: "fintech", label: "FinTech" },
    { value: "healthtech", label: "HealthTech" },
    { value: "edtech", label: "EdTech" },
    { value: "consumer", label: "Consumer App" },
    { value: "marketplace", label: "Marketplace" },
    { value: "hardware", label: "Hardware" },
    { value: "other", label: "Other" },
  ]

  // Failure reasons
  const failureReasons = [
    { value: "", label: "Select the main reason" },
    { value: "product-market-fit", label: "Lack of Product-Market Fit" },
    { value: "funding", label: "Ran Out of Funding" },
    { value: "team", label: "Team Issues" },
    { value: "competition", label: "Competition" },
    { value: "business-model", label: "Flawed Business Model" },
    { value: "timing", label: "Market Timing" },
    { value: "technology", label: "Technical Challenges" },
    { value: "other", label: "Other" },
  ]

  // Move to next step after validation
  const handleNextStep = async () => {
    // Fields to validate based on current step
    const fieldsToValidate = 
      currentStep === 0 
        ? ['title', 'companyName', 'industry'] 
        : currentStep === 1 
          ? ['failureReason', 'story'] 
          : ['email'];
    
    // Trigger validation for the fields in the current step
    const isStepValid = await trigger(fieldsToValidate as any);
    
    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, 2));
    }
  }

  // Move to previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch("/.netlify/functions/story-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to submit story");
      }
      
      setSubmitSuccess(true);
      
      // Reset form and scroll to top after success
      window.scrollTo(0, 0);
    } catch (error: any) {
      setSubmitError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Render form based on current step
  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-semibold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-500">
              <FileText className="inline-block h-5 w-5 mr-2 text-cyan-500" />
              Startup Information
            </h2>
            <Input 
              label="Post Title"
              placeholder="E.g., 'Why Our AI Shopping Assistant Failed to Gain Traction'"
              name="title"
              register={register}
              error={errors.title}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Company Name"
                placeholder="What was your startup called?"
                name="companyName"
                register={register}
                error={errors.companyName}
                required
              />
              <Select 
                label="Industry"
                options={industries}
                name="industry"
                register={register}
                error={errors.industry}
                required
              />
            </div>
            <Input 
              label="Funding Raised"
              placeholder="E.g., Bootstrapped, $50K Angel, $1.2M Seed"
              name="fundingAmount"
              register={register}
              error={errors.fundingAmount}
            />
          </div>
        )
      case 1:
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-semibold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-500">
              <Zap className="inline-block h-5 w-5 mr-2 text-cyan-500" />
              What Happened?
            </h2>
            <Select 
              label="Primary Reason for Failure"
              options={failureReasons}
              name="failureReason"
              register={register}
              error={errors.failureReason}
              required
            />
            <Textarea 
              label="Your Story"
              placeholder="Share the journey of your startup and what led to its closure..."
              name="story"
              register={register}
              error={errors.story}
              rows={8}
              required
            />
          </div>
        )
      case 2:
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-semibold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-500">
              <Sparkles className="inline-block h-5 w-5 mr-2 text-cyan-500" />
              Lessons & Contact
            </h2>
            <Textarea 
              label="Key Takeaways"
              placeholder="What did you learn from this experience? What would you do differently?"
              name="lessons"
              register={register}
              error={errors.lessons}
              rows={6}
            />
            <div className="mt-8 mb-4">
              <h3 className="text-md font-semibold text-white mb-2">Your Contact Information</h3>
              <p className="text-sm text-zinc-400 mb-4">
                We respect your privacy and will never share your email without permission.
              </p>
            </div>
            <Input 
              label="Email"
              type="email"
              placeholder="your@email.com"
              name="email"
              register={register}
              error={errors.email}
            />
            <Checkbox 
              label="I agree to receive occasional updates about FlopHouse and startup insights."
              name="marketingConsent"
              register={register}
              error={errors.marketingConsent}
            />
          </div>
        )
      default:
        return null
    }
  }

  // Show success message after submission
  if (submitSuccess) {
    return (
      <main className="min-h-screen">
        <div className="container px-4 py-12 mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
              <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-zinc-300">Submit Your Story</span>
            </div>
          </div>

          <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg text-center">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-cyan-500/20 mb-6">
              <Check className="h-8 w-8 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Thank You For Sharing!</h2>
            <p className="text-zinc-300 mb-6 max-w-md mx-auto">
              Your story has been submitted successfully and will be reviewed shortly. 
              Your willingness to share helps other entrepreneurs learn from your experience.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/browse">
                  Browse Stories
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        {/* Header with breadcrumb - Applying Jakob's Law for familiar navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-300">Submit Your Story</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-cyan-500">
            Share Your Startup Failure
          </h1>
          <p className="text-zinc-400">
            Your transparency helps others learn. Fill out the form below to share your post-mortem.
          </p>
        </div>

        {/* Guidance Card - Applying Tesler's Law by providing smart defaults */}
        <Card className="mb-8 bg-muted/30 backdrop-blur-sm border-white/10 group hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="h-5 w-5 text-cyan-500 group-hover:animate-pulse" />
              <h2 className="text-xl font-semibold text-white">Tips for a Great Post-Mortem</h2>
            </div>
            <ul className="list-none pl-5 text-zinc-400 space-y-2">
              {[
                "Be honest and transparent about what went wrong",
                "Focus on lessons learned rather than blame",
                "Include specific examples and data points when possible",
                "Share what you would do differently next time"
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <span className="text-xs">{i+1}</span>
                  </div>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Error message */}
        {submitError && (
          <div className="mb-6 p-4 border border-red-500/20 rounded-md bg-muted/30 backdrop-blur-sm">
            <p className="text-red-500 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {submitError}
            </p>
          </div>
        )}

        {/* Progress Indicator */}
        <ProgressSteps currentStep={currentStep} totalSteps={3} />

        {/* Submission Form - Applying Miller's Law with grouped sections */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <input type="hidden" name="form-name" value="story-submission" />
          <div className="hidden">
            <label>Don't fill this out if you're human: <input name="bot-field" /></label>
          </div>
          {renderFormStep()}

          {/* Form Actions - Fitts's Law with clear, large buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
            <div>
              {currentStep > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevStep}
                  disabled={submitting}
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              {currentStep < 2 ? (
                <Button 
                  type="button" 
                  onClick={handleNextStep}
                  disabled={submitting}
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <SendHorizontal className="h-4 w-4 mr-2" />
                      Submit Post-Mortem
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}