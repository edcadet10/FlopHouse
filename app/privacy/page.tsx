"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Shield, Lock, Mail, Eye, FileText, AlertTriangle, Globe } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-300">Privacy Policy</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-cyan-500">
            Privacy Policy
          </h1>
          <p className="text-zinc-400">
            Last Updated: May 20, 2025
          </p>
        </div>

        {/* Introduction */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Introduction</h2>
              <p className="text-zinc-300 mb-4">
                At FlopHouse ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>
              <p className="text-zinc-300">
                By using FlopHouse, you agree to the collection and use of information in accordance with this policy. We collect information to improve our platform, provide services, and comply with legal obligations.
              </p>
            </div>
          </div>
        </Card>

        {/* Information We Collect */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
              <p className="text-zinc-300 mb-4">
                When you use FlopHouse, we collect several types of information:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Story Submissions</h3>
                  <p className="text-zinc-300">
                    When you submit a story, we collect the information you provide in the form, including:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 mt-2 ml-4 space-y-1">
                    <li>Story title and company name</li>
                    <li>Industry and funding information</li>
                    <li>Failure reasons and lessons learned</li>
                    <li>Your email address (if provided)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Usage Data</h3>
                  <p className="text-zinc-300">
                    We automatically collect usage data when you interact with our platform, including:
                  </p>
                  <ul className="list-disc list-inside text-zinc-300 mt-2 ml-4 space-y-1">
                    <li>IP address</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent</li>
                    <li>Referring website addresses</li>
                    <li>Device information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Cookies and Similar Technologies</h3>
                  <p className="text-zinc-300">
                    We use cookies and similar tracking technologies to improve user experience and collect usage information. You can control cookies through your browser settings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* How We Use Your Information */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Eye className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h2>
              <p className="text-zinc-300 mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">To provide and maintain our platform:</strong> Including publishing submitted stories, managing user accounts, and improving the user experience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">To communicate with you:</strong> We may use your email address to send notifications about your submissions, respond to inquiries, or provide updates about our platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">To analyze usage patterns:</strong> We analyze how users interact with our platform to improve functionality and content.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">To comply with legal obligations:</strong> We may process your information to comply with applicable laws and regulations.</span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-zinc-300 text-sm">
                    <strong className="text-white">Important:</strong> By submitting a story through our platform, you grant us the right to publish and share your submission on our website. You also consent to receive emails from us regarding your submission and platform updates. You can opt-out of marketing communications at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Legal Basis for Processing */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Lock className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Legal Basis for Processing</h2>
              <p className="text-zinc-300 mb-4">
                We process your personal data based on the following legal grounds:
              </p>
              <ul className="space-y-4 text-zinc-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">Consent:</strong> When you submit a story or provide your email address, you consent to our processing of that information for the specified purposes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">Legitimate Interests:</strong> We process certain information based on our legitimate interests, such as improving our platform, ensuring security, and analyzing usage patterns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span><strong className="text-white">Legal Obligations:</strong> We may process your information to comply with legal requirements.</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Data Retention */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Lock className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Data Retention</h2>
              <p className="text-zinc-300 mb-4">
                We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including:
              </p>
              <ul className="space-y-2 text-zinc-300 ml-4 list-disc">
                <li>For as long as your story is published on our platform</li>
                <li>To comply with our legal obligations</li>
                <li>To resolve disputes</li>
                <li>To enforce our agreements</li>
              </ul>
              <p className="text-zinc-300 mt-4">
                If you request deletion of your personal information, we will delete or anonymize it unless we are required to retain certain information for legitimate business or legal purposes.
              </p>
            </div>
          </div>
        </Card>

        {/* Your Rights */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Shield className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Your Privacy Rights</h2>
              <p className="text-zinc-300 mb-4">
                Depending on your location, you may have certain rights regarding your personal information. These may include:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Access</h3>
                  <p className="text-zinc-300 text-sm">
                    The right to request access to your personal information.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Correction</h3>
                  <p className="text-zinc-300 text-sm">
                    The right to request correction of inaccurate personal information.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Deletion</h3>
                  <p className="text-zinc-300 text-sm">
                    The right to request deletion of your personal information.
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white mb-2">Opt-Out</h3>
                  <p className="text-zinc-300 text-sm">
                    The right to opt-out of certain data uses, including marketing communications.
                  </p>
                </div>
              </div>
              <p className="text-zinc-300 mt-4">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section.
              </p>
            </div>
          </div>
        </Card>

        {/* International Data Transfers */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Globe className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">International Data Transfers</h2>
              <p className="text-zinc-300 mb-4">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws than those in your country.
              </p>
              <p className="text-zinc-300">
                We take appropriate measures to ensure that your personal information remains protected in accordance with this Privacy Policy, regardless of where it is processed.
              </p>
            </div>
          </div>
        </Card>

        {/* Data Security */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Lock className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Data Security</h2>
              <p className="text-zinc-300 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
              </p>
              <p className="text-zinc-300">
                However, no internet-based service can guarantee absolute security. We encourage you to use caution when sharing sensitive information online.
              </p>
            </div>
          </div>
        </Card>

        {/* Children's Privacy */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Children's Privacy</h2>
              <p className="text-zinc-300 mb-4">
                Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children.
              </p>
              <p className="text-zinc-300">
                If you are a parent or guardian and believe that your child has provided us with personal information, please contact us so that we can take appropriate action.
              </p>
            </div>
          </div>
        </Card>

        {/* Changes to Policy */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Changes to This Privacy Policy</h2>
              <p className="text-zinc-300 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p className="text-zinc-300">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact Us */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex items-start gap-4">
            <Mail className="h-8 w-8 text-cyan-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
              <p className="text-zinc-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-white/5 p-4 rounded-lg inline-block">
                <p className="text-zinc-300">Email: privacy@flop-house.com</p>
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
