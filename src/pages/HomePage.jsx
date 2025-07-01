"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Sparkles, Wifi, User, Calendar, ArrowRight, Zap } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const recognitionRef = useRef(null)

  const examplePrompts = [
    "Create a QR for my WiFi named HomeNetwork with password mypassword123",
    "Generate a contact QR for John Doe, phone 555-0123, email john@example.com",
    "Make a QR for my LinkedIn profile linkedin.com/in/johndoe",
    "Create an event QR for Tech Conference on December 15, 2024",
  ]

  const templates = [
    {
      icon: Wifi,
      title: "WiFi QR",
      description: "Auto-connect guests to your WiFi",
      color: "bg-blue-500",
      path: "/templates/wifi-qr",
    },
    {
      icon: User,
      title: "Contact QR",
      description: "Share your contact details instantly",
      color: "bg-green-500",
      path: "/templates/contact-qr",
    },
    {
      icon: Calendar,
      title: "Event QR",
      description: "Create event passes and tickets",
      color: "bg-purple-500",
      path: "/templates/event-qr",
    },
  ]

  const startVoiceInput = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setPrompt(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.start()
    }
  }

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const generateQR = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Store the prompt in sessionStorage for the generate page
    sessionStorage.setItem("qr-prompt", prompt)

    // Navigate to generate page
    router.push("/generate")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SmartQR
              </span>
            </div>
            <Button variant="outline" onClick={() => router.push("/analytics")} className="hidden sm:flex">
              Analytics
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 bg-blue-50 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered QR Generation
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent leading-tight">
            Just describe.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI builds your QR.
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Generate smart QR codes using natural language. No forms, no complexity - just tell us what you need and
            we'll create it instantly.
          </p>

          {/* Main Input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="e.g. Create a QR for my WiFi named HomeNetwork with password 12345678"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="h-14 text-lg pr-24 border-2 border-slate-200 focus:border-blue-500 rounded-xl shadow-sm"
                onKeyPress={(e) => e.key === "Enter" && generateQR()}
              />
              <div className="absolute right-2 top-2 flex space-x-2">
                <Button
                  size="sm"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={isListening ? stopVoiceInput : startVoiceInput}
                  className="h-10 w-10 p-0"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              onClick={generateQR}
              disabled={!prompt.trim() || isGenerating}
              className="w-full mt-4 h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isGenerating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                <>
                  Generate QR Code
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Example Prompts */}
          <div className="mb-16">
            <p className="text-sm text-slate-500 mb-4">Try these examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-sm bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors duration-200 text-left max-w-xs"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Quick Templates</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Skip the typing with our pre-built templates for common QR code types
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {templates.map((template, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200"
              onClick={() => router.push(template.path)}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-12 h-12 ${template.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <template.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{template.title}</h3>
                <p className="text-slate-600 mb-4">{template.description}</p>
                <Button variant="outline" className="group-hover:bg-blue-50 group-hover:border-blue-300 bg-transparent">
                  Use Template
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose SmartQR?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { title: "AI-Powered", desc: "Natural language understanding", icon: "🧠" },
              { title: "No Login Required", desc: "Start generating immediately", icon: "🚀" },
              { title: "Fully Customizable", desc: "Colors, logos, and styles", icon: "🎨" },
              { title: "Multiple Formats", desc: "PNG, SVG downloads", icon: "📥" },
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">SmartQR</span>
          </div>
          <p className="text-slate-600 text-sm">Built with ❤️ for seamless QR code generation</p>
        </div>
      </footer>
    </div>
  )
}
