"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { Sparkles, FileText, Zap, HelpCircle, SendHorizontal, Save, Check } from "lucide-react"

// Creating UI components for form
const Input = ({ label, placeholder, type = "text", value, onChange, name }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className="w-full h-10 px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300"
    />
  </div>
)

const Textarea = ({ label, placeholder, value, onChange, rows = 4, name }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      rows={rows}
      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300"
    />
  </div>
)

const Select = ({ label, options, value, onChange, name }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-zinc-300 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      name={name}
      className="w-full h-10 px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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
      <span className="text-xs text-zinc-400">Lessons</span>
    </div>
  </div>
)

export default function SubmitPage() {
  // Form state
  const [formState, setFormState] = useState({
    title: '',
    companyName: '',
    industry: '',
    fundingAmount: '',
    failureReason: '',
    story: '',
    lessons: '',
  })
  
  // Current step in the multi-step form
  const [currentStep, setCurrentStep] = useState(0)

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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Move to next step
  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 2))
  }

  // Move to previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formState)
    
    // Netlify Forms submission
    fetch("/.netlify/functions/story-submission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data);
        alert('Thank you for sharing your story! It will be reviewed and published soon.');
      })
      .catch((error) => {
        console.error("Error:", error);
        alert('There was an error submitting your story. Please try again.');
      });
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
              value={formState.title}
              onChange={handleChange}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Company Name"
                placeholder="What was your startup called?"
                name="companyName"
                value={formState.companyName}
                onChange={handleChange}
              />
              <Select 
                label="Industry"
                options={industries}
                name="industry"
                value={formState.industry}
                onChange={handleChange}
              />
            </div>
            <Input 
              label="Funding Raised (optional)"
              placeholder="E.g., Bootstrapped, $50K Angel, $1.2M Seed"
              name="fundingAmount"
              value={formState.fundingAmount}
              onChange={handleChange}
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
              options={[
                { value: "", label: "Select the main reason" },
                { value: "product-market-fit", label: "Lack of Product-Market Fit" },
                { value: "funding", label: "Ran Out of Funding" },
                { value: "team", label: "Team Issues" },
                { value: "competition", label: "Competition" },
                { value: "business-model", label: "Flawed Business Model" },
                { value: "timing", label: "Market Timing" },
                { value: "technology", label: "Technical Challenges" },
                { value: "other", label: "Other" },
              ]}
              name="failureReason"
              value={formState.failureReason}
              onChange={handleChange}
            />
            <Textarea 
              label="Your Story"
              placeholder="Share the journey of your startup and what led to its closure..."
              name="story"
              value={formState.story}
              onChange={handleChange}
              rows={8}
            />
          </div>
        )
      case 2:
        return (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-xl font-semibold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-500">
              <Sparkles className="inline-block h-5 w-5 mr-2 text-cyan-500" />
              Lessons Learned
            </h2>
            <Textarea 
              label="Key Takeaways"
              placeholder="What did you learn from this experience? What would you do differently?"
              name="lessons"
              value={formState.lessons}
              onChange={handleChange}
              rows={8}
            />
          </div>
        )
      default:
        return null
    }
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

        {/* Progress Indicator */}
        <ProgressSteps currentStep={currentStep} totalSteps={3} />

        {/* Submission Form - Applying Miller's Law with grouped sections */}
        <form 
          name="story-submission" 
          method="POST" 
          netlify="true"
          netlify-honeypot="bot-field"
          data-netlify="true"
          onSubmit={handleSubmit}
          className="bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
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
                >
                  Back
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline"
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              
              {currentStep < 2 ? (
                <Button 
                  type="button" 
                  onClick={handleNextStep}
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  type="submit"
                >
                  <SendHorizontal className="h-4 w-4 mr-2" />
                  Submit Post-Mortem
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
