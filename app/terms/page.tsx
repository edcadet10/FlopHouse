"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { FileText, Shield, AlertTriangle, Scale, Eye, Lock, Globe } from "lucide-react"

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-300">Terms of Service</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-cyan-500">
            Terms of Service
          </h1>
          <p className="text-zinc-400">
            Last Updated: May 20, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Introduction</h2>
              <p className="text-zinc-300 mb-4">
                Welcome to FlopHouse. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using FlopHouse, you agree to be bound by these Terms.
              </p>
              <p className="text-zinc-300">
                Please read these Terms carefully before using our platform. If you do not agree with any part of these Terms, you may not access or use our services.
              </p>
            </div>
          </div>
        </Card>

        {/* Definitions */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Definitions</h2>
              <p className="text-zinc-300 mb-4">
                In these Terms:
              </p>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">"FlopHouse", "we", "us", "our"</strong> refers to the FlopHouse platform and its operators.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">"User", "you", "your"</strong> refers to any individual or entity using our platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">"Content"</strong> refers to any information, text, graphics, or other materials submitted, uploaded, or displayed on FlopHouse.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">"Submission"</strong> refers to any story, post-mortem, or other content submitted by users through our platform.</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Account Registration */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Account Registration and User Information</h2>
              <p className="text-zinc-300 mb-4">
                You may be required to provide certain information (such as email address) when submitting content to our platform.
              </p>
              <p className="text-zinc-300 mb-4">
                You are responsible for:
              </p>
              <ul className="space-y-2 text-zinc-300 ml-4 list-disc">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the confidentiality of your account information</li>
                <li>All activities that occur under your account</li>
              </ul>
              <p className="text-zinc-300 mt-4">
                We reserve the right to refuse service, terminate accounts, or remove content at our discretion.
              </p>
            </div>
          </div>
        </Card>

        {/* User Content */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Eye className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">User Content and Submissions</h2>
              <p className="text-zinc-300 mb-4">
                By submitting content to FlopHouse, you:
              </p>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">Grant us a license:</strong> You grant FlopHouse a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content across our platform and promotional materials.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">Represent and warrant:</strong> You represent that you own or have the necessary rights to the content you submit, and that your submissions do not violate any third-party rights or applicable laws.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">Consent to review:</strong> You acknowledge that all submissions are subject to review and approval before being published on our platform.</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-300 text-sm">
                    <strong className="text-white">Important:</strong> By submitting a story, you grant us permission to publish it on our platform and to contact you via email regarding your submission. You may opt out of marketing communications at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Content Guidelines */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Content Guidelines</h2>
              <p className="text-zinc-300 mb-4">
                All content submitted to FlopHouse must comply with these guidelines. You agree not to submit content that:
              </p>
              <ul className="space-y-2 text-zinc-300 ml-4 list-disc">
                <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, or invasive of another's privacy</li>
                <li>Contains confidential information that you do not have the right to disclose</li>
                <li>Infringes on the intellectual property rights of others</li>
                <li>Contains software viruses or any other malicious code</li>
                <li>Is false, misleading, or deceptive</li>
                <li>Advertises or promotes products or services unrelated to startup experiences</li>
                <li>Violates any other applicable laws or regulations</li>
              </ul>
              <p className="text-zinc-300 mt-4">
                We reserve the right to remove any content that violates these guidelines or that we determine, in our sole discretion, is inappropriate for our platform.
              </p>
            </div>
          </div>
        </Card>

        {/* Intellectual Property */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Intellectual Property Rights</h2>
              <p className="text-zinc-300 mb-4">
                The FlopHouse platform, including its content, features, and functionality, is owned by us and protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-zinc-300 mb-4">
                You may access and use our platform for your personal, non-commercial use only. You may not:
              </p>
              <ul className="space-y-2 text-zinc-300 ml-4 list-disc">
                <li>Reproduce, distribute, modify, or create derivative works of our content</li>
                <li>Use any data mining, robots, or similar data gathering methods</li>
                <li>Remove any copyright, trademark, or other proprietary notices</li>
                <li>Use our platform in any manner that could damage or overburden our systems</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Disclaimer of Warranties */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Disclaimer of Warranties</h2>
              <p className="text-zinc-300 mb-4">
                FlopHouse is provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied.
              </p>
              <p className="text-zinc-300 mb-4">
                We do not warrant that:
              </p>
              <ul className="space-y-2 text-zinc-300 ml-4 list-disc">
                <li>Our platform will be uninterrupted, timely, secure, or error-free</li>
                <li>The results obtained from using our platform will be accurate or reliable</li>
                <li>The quality of any products, services, information, or other material obtained through our platform will meet your expectations</li>
              </ul>
              <p className="text-zinc-300 mt-4">
                You use FlopHouse at your own risk. We are not responsible for any damages resulting from your use of our platform.
              </p>
            </div>
          </div>
        </Card>

        {/* Limitation of Liability */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Scale className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h2>
              <p className="text-zinc-300 mb-4">
                To the maximum extent permitted by law, FlopHouse and its affiliates, officers, employees, agents, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, use, or goodwill, arising out of or in connection with:
              </p>
              <ul className="space-y-2 text-zinc-300 ml-4 list-disc">
                <li>Your use or inability to use our platform</li>
                <li>Any conduct or content of any third party on our platform</li>
                <li>Any content obtained from our platform</li>
                <li>Unauthorized access, use, or alteration of your content or submissions</li>
              </ul>
              <p className="text-zinc-300 mt-4">
                This limitation applies regardless of the legal theory or form of action and whether or not we have been advised of the possibility of such damages.
              </p>
            </div>
          </div>
        </Card>

        {/* Indemnification */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Indemnification</h2>
              <p className="text-zinc-300 mb-4">
                You agree to indemnify, defend, and hold harmless FlopHouse and its affiliates, officers, employees, agents, and partners from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="space-y-2 text-zinc-300 ml-4 list-disc">
                <li>Your violation of these Terms</li>
                <li>Your content or submissions</li>
                <li>Your violation of any rights of another</li>
                <li>Your use or misuse of our platform</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Governing Law */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Globe className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Governing Law and Jurisdiction</h2>
              <p className="text-zinc-300 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
              <p className="text-zinc-300">
                You agree to submit to the personal and exclusive jurisdiction of the courts located in the United States for the resolution of any disputes arising from these Terms or your use of our platform.
              </p>
            </div>
          </div>
        </Card>

        {/* Changes to Terms */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Changes to Terms</h2>
              <p className="text-zinc-300 mb-4">
                We reserve the right to modify or replace these Terms at any time. We will notify users of any material changes by posting the updated Terms on this page and updating the "Last Updated" date.
              </p>
              <p className="text-zinc-300">
                Your continued use of FlopHouse after any changes to the Terms constitutes your acceptance of the revised Terms. If you do not agree to the new terms, please stop using our platform.
              </p>
            </div>
          </div>
        </Card>

        {/* Termination */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Termination</h2>
              <p className="text-zinc-300 mb-4">
                We may terminate or suspend your access to FlopHouse immediately, without prior notice or liability, for any reason, including but not limited to a breach of these Terms.
              </p>
              <p className="text-zinc-300">
                Upon termination, your right to use our platform will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including but not limited to ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
              </p>
            </div>
          </div>
        </Card>

        {/* Privacy Policy */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Lock className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Privacy Policy</h2>
              <p className="text-zinc-300 mb-4">
                Our Privacy Policy, which is incorporated into these Terms by reference, describes how we collect, use, and share your personal information.
              </p>
              <p className="text-zinc-300">
                By using FlopHouse, you consent to our collection and use of your information as described in our Privacy Policy.
              </p>
              <div className="mt-4">
                <Link 
                  href="/privacy" 
                  className="text-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  Read our Privacy Policy →
                </Link>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Contact Information</h2>
              <p className="text-zinc-300 mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="bg-white/5 p-4 rounded-lg inline-block">
                <p className="text-zinc-300">Email: terms@flop-house.com</p>
              </div>
            </div>
          </div>
        </Card>

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
