"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, MessageSquare, Check, AlertTriangle } from "lucide-react"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear any existing error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formState.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!formState.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    
    if (!formState.message.trim()) {
      newErrors.message = "Message is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSubmitting(true)
    setSubmitError(null)
    
    try {
      // This would normally send the form data to a server endpoint
      // For now, we'll simulate a successful submission after a brief delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reset form and show success message
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      setSubmitSuccess(true)
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitError("There was a problem submitting your message. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen">
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-300">Contact</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-cyan-500">
            Contact Us
          </h1>
          <p className="text-zinc-400">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <Card className="p-6 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg h-full">
              <h2 className="text-xl font-semibold text-white mb-4">Get In Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-md font-medium text-white mb-1">Email Us</h3>
                    <p className="text-sm text-zinc-400">
                      info@flop-house.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-md font-medium text-white mb-1">Message Us</h3>
                    <p className="text-sm text-zinc-400">
                      Fill out the form and we'll get back to you as soon as possible.
                    </p>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-white/10">
                  <h3 className="text-md font-medium text-white mb-3">Connect With Us</h3>
                  <div className="flex gap-3">
                    <a 
                      href="https://twitter.com/flophouse" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/5 hover:bg-cyan-500/20 transition-colors"
                    >
                      <svg className="h-5 w-5 text-cyan-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                    <a 
                      href="https://linkedin.com/company/flophouse" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/5 hover:bg-cyan-500/20 transition-colors"
                    >
                      <svg className="h-5 w-5 text-cyan-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            {submitSuccess ? (
              <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg text-center">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-cyan-500/20 mb-6">
                  <Check className="h-8 w-8 text-cyan-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Message Sent!</h2>
                <p className="text-zinc-300 mb-6 max-w-md mx-auto">
                  Thank you for reaching out. We've received your message and will get back to you as soon as possible.
                </p>
                <Button onClick={() => setSubmitSuccess(false)}>
                  Send Another Message
                </Button>
              </Card>
            ) : (
              <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Send a Message</h2>
                
                {submitError && (
                  <div className="mb-6 p-4 border border-red-500/20 rounded-md bg-red-500/10">
                    <p className="text-red-500 flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      {submitError}
                    </p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        className={`w-full h-10 px-3 py-2 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300`}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertTriangle className="h-3 w-3 mr-1" />{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        className={`w-full h-10 px-3 py-2 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertTriangle className="h-3 w-3 mr-1" />{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formState.subject}
                      onChange={handleChange}
                      className="w-full h-10 px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-3 py-2 bg-white/5 border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white transition-all duration-300`}
                    />
                    {errors.message && <p className="mt-1 text-sm text-red-500 flex items-center"><AlertTriangle className="h-3 w-3 mr-1" />{errors.message}</p>}
                  </div>
                  <div className="mt-2">
                    <div className="flex items-start gap-2 text-xs text-zinc-400">
                      <input 
                        type="checkbox" 
                        id="consent" 
                        required
                        className="mt-1"
                      />
                      <label htmlFor="consent">
                        I agree to the storage and handling of my data by FlopHouse as described in the <Link href="/privacy" className="text-cyan-500 hover:text-cyan-400 transition-colors">Privacy Policy</Link>.
                      </label>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full sm:w-auto"
                    >
                      {submitting ? (
                        <>
                          <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">How do I submit my startup story?</h3>
              <p className="text-zinc-300 text-sm">
                You can submit your startup story through our <Link href="/submit" className="text-cyan-500 hover:text-cyan-400 transition-colors">submission form</Link>. Fill out the required information about your startup experience, and our team will review it before publishing.
              </p>
            </Card>
            <Card className="p-6 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">Can I submit my story anonymously?</h3>
              <p className="text-zinc-300 text-sm">
                Yes, you can choose to have your story published without your name or any identifying information. Please indicate this preference in your submission.
              </p>
            </Card>
            <Card className="p-6 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">How long does the review process take?</h3>
              <p className="text-zinc-300 text-sm">
                We typically review submissions within 3-5 business days. Once approved, your story will be published on our platform and you'll receive a notification via email.
              </p>
            </Card>
            <Card className="p-6 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg">
              <h3 className="text-lg font-medium text-white mb-2">Can I edit my story after submission?</h3>
              <p className="text-zinc-300 text-sm">
                Yes, you can request edits to your published story by contacting us with your specific changes. Please include your story title and submission date in your message.
              </p>
            </Card>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex justify-center gap-6 text-sm text-zinc-400 mt-12">
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact Us</Link>
        </div>
      </div>
    </main>
  )
}
