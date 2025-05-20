"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import React, { useState } from "react"
import { Sparkles, FileText, Zap, HelpCircle, SendHorizontal, Save, Check, AlertCircle } from "lucide-react"

// Form state interface
interface FormState {
  title: string;
  companyName: string;
  industry: string;
  fundingAmount: string;
  failureReason: string;
  story: string;
  lessons: string;
  email: string;
  marketingConsent: boolean;
}

// Error state interface
interface FormErrors {
  [key: string]: string;
}

// Input component props
interface InputProps {
  label: string;
  placeholder: string;
  type?: string;
  name: keyof FormState;
  error?: string;
  required?: boolean;
}

// Textarea component props
interface TextareaProps {
  label: string;
  placeholder: string;
  name: keyof FormState;
  rows?: number;
  required?: boolean;
}

// Select component props
interface SelectProps {
  label: string;
  options: { value: string; label: string }[];
  name: keyof FormState;
  required?: boolean;
}

// Checkbox component props
interface CheckboxProps {
  label: string;
  name: keyof FormState;
}

// Progress steps component props
interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

export default function SubmitPage() {
  // Form state
  const [formState, setFormState] = useState<FormState>({
    title: '',
    companyName: '',
    industry: '',
    fundingAmount: '',
    failureReason: '',
    story: '',
    lessons: '',
    email: '',
    marketingConsent: false
  })
  
  // Current step in the multi-step form
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    // Use a functional update to ensure we're always working with the latest state
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? !!checked : value
    }));
    
    // Clear any existing error for this field when the user changes it
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }

  // Basic validation function
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}
    
    if (step === 0) {
      if (!formState.title) newErrors.title = "Title is required"
      else if (formState.title.length < 5) newErrors.title = "Title must be at least 5 characters"
      
      if (!formState.companyName) newErrors.companyName = "Company name is required"
      if (!formState.industry) newErrors.industry = "Please select an industry"
    }
    
    if (step === 1) {
      if (!formState.failureReason) newErrors.failureReason = "Please select a failure reason"
      if (!formState.story) newErrors.story = "Story is required"
      else if (formState.story.length < 50) newErrors.story = "Story must be at least 50 characters"
    }
    
    if (step === 2) {
      if (formState.email && !validateEmail(formState.email)) {
        newErrors.email = "Please enter a valid email"
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  // Move to next step after validation
  const handleNextStep = () => {
    const isValid = validateStep(currentStep)
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 2))
    }
  }

  // Move to previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateStep(currentStep);
    if (!isValid) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      console.log("Submitting form data:", formState);
      
      // Submit via API
      const response = await fetch("/.netlify/functions/story-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      
      console.log("Response status:", response.status);
      
      // Parse response JSON
      let result;
      try {
        result = await response.json();
        console.log("Response data:", result);
      } catch (jsonError) {
        console.error("Error parsing response:", jsonError);
        throw new Error("Invalid response from server");
      }
      
      // Check if response was successful
      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to submit story");
      }
      
      // If we get here, the submission was successful
      setSubmitSuccess(true);
      
      // Reset form and scroll to top after success
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(error.message || "Something went wrong. Please try again.");
      setSubmitSuccess(false);
    } finally {
      setSubmitting(false);
    }
  }

  // Creating UI components for form with React.memo to prevent unnecessary re-renders
  const Input = React.memo(({ label, placeholder, type = "text", name, required = false }: InputProps) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-zinc-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={formState[name] as string}
        onChange={handleChange}
        className={`w-full h-10 px-3 py-2 bg-white/5 border ${errors[name] ? 'border-red-500' : 'border-white/10'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300`}
        autoComplete="off"
      />
      {errors[name] && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors[name]}</p>}
    </div>
  ));

  const Textarea = React.memo(({ label, placeholder, name, rows = 4, required = false }: TextareaProps) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-zinc-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        placeholder={placeholder}
        name={name}
        value={formState[name] as string}
        onChange={handleChange}
        rows={rows}
        className={`w-full px-3 py-2 bg-white/5 border ${errors[name] ? 'border-red-500' : 'border-white/10'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300`}
      />
      {errors[name] && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors[name]}</p>}
    </div>
  ));

  const Select = React.memo(({ label, options, name, required = false }: SelectProps) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-zinc-300 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formState[name] as string}
        onChange={handleChange}
        className={`w-full h-10 px-3 py-2 bg-white/5 border ${errors[name] ? 'border-red-500' : 'border-white/10'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertCircle className="h-3 w-3 mr-1" />{errors[name]}</p>}
    </div>
  ));

  const Checkbox = React.memo(({ label, name }: CheckboxProps) => (
    <div className="mb-4 flex items-start">
      <input
        type="checkbox"
        name={name}
        checked={formState[name] as boolean}
        onChange={handleChange}
        id={name}
        className="h-4 w-4 mt-1 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500"
      />
      <label htmlFor={name} className="ml-2 block text-sm text-zinc-300">
        {label}
      </label>
      {errors[name] && <p className="mt-1 text-sm text-red-500">{errors[name]}</p>}
    </div>
  ));

  // Progress steps component
  const ProgressSteps = ({ currentStep, totalSteps }: {
    currentStep: number;
    totalSteps: number;
  }) => (
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
        <form onSubmit={handleSubmit} className="bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <input type="hidden" name="form-name" value="story-submission" />
          <div className="hidden">
            <label>Don't fill this out if you're human: <input name="bot-field" /></label>
          </div>
          
          {/* Step 1: Basic Info */}
          {currentStep === 0 && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-semibold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-500">
                <FileText className="inline-block h-5 w-5 mr-2 text-cyan-500" />
                Startup Information
              </h2>
              <Input 
                label="Post Title"
                placeholder="E.g., 'Why Our AI Shopping Assistant Failed to Gain Traction'"
                name="title"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Company Name"
                  placeholder="What was your startup called?"
                  name="companyName"
                  required
                />
                <Select 
                  label="Industry"
                  options={industries}
                  name="industry"
                  required
                />
              </div>
              <Input 
                label="Funding Raised"
                placeholder="E.g., Bootstrapped, $50K Angel, $1.2M Seed"
                name="fundingAmount"
              />
            </div>
          )}
          
          {/* Step 2: What Happened */}
          {currentStep === 1 && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-semibold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-500">
                <Zap className="inline-block h-5 w-5 mr-2 text-cyan-500" />
                What Happened?
              </h2>
              <Select 
                label="Primary Reason for Failure"
                options={failureReasons}
                name="failureReason"
                required
              />
              <Textarea 
                label="Your Story"
                placeholder="Share the journey of your startup and what led to its closure..."
                name="story"
                rows={8}
                required
              />
            </div>
          )}
          
          {/* Step 3: Lessons & Contact */}
          {currentStep === 2 && (
            <div className="animate-in fade-in duration-300">
              <h2 className="text-xl font-semibold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-500">
                <Sparkles className="inline-block h-5 w-5 mr-2 text-cyan-500" />
                Lessons & Contact
              </h2>
              <Textarea 
                label="Key Takeaways"
                placeholder="What did you learn from this experience? What would you do differently?"
                name="lessons"
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
              />
              <Checkbox 
                label="I agree to receive occasional updates about FlopHouse and startup insights."
                name="marketingConsent"
              />
            </div>
          )}

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