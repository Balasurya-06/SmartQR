"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react"

export default function EventTemplate() {
  const [formData, setFormData] = useState({
    eventName: "",
    date: "",
    time: "",
    location: "",
    description: "",
    organizer: "",
    ticketId: "",
  })

  const navigate = useNavigate()

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateEventQR = () => {
    const { eventName, date, time, location, description, organizer, ticketId } = formData

    let prompt = `Create an event QR code for "${eventName}"`
    if (date) prompt += ` on ${date}`
    if (time) prompt += ` at ${time}`
    if (location) prompt += ` located at ${location}`
    if (organizer) prompt += ` organized by ${organizer}`
    if (ticketId) prompt += ` with ticket ID ${ticketId}`
    if (description) prompt += `. Description: ${description}`

    sessionStorage.setItem("qr-prompt", prompt)
    navigate("/generate")
  }

  const isFormValid = formData.eventName && formData.date

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Event QR Generator</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Event QR Code</CardTitle>
              <p className="text-slate-600">Generate QR codes for event tickets and passes</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="eventName">Event Name *</Label>
                <Input
                  id="eventName"
                  type="text"
                  placeholder="Tech Conference 2024"
                  value={formData.eventName}
                  onChange={(e) => handleInputChange("eventName", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Convention Center, 123 Main St"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  type="text"
                  placeholder="Event Company Inc."
                  value={formData.organizer}
                  onChange={(e) => handleInputChange("organizer", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="ticketId">Ticket/Pass ID</Label>
                <Input
                  id="ticketId"
                  type="text"
                  placeholder="TC2024-001"
                  value={formData.ticketId}
                  onChange={(e) => handleInputChange("ticketId", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional event details or instructions..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Button
                onClick={generateEventQR}
                disabled={!isFormValid}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Generate Event QR Code
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-center text-sm text-slate-500">
                <p>* Event name and date are required</p>
                <p className="mt-1">Perfect for event tickets, passes, and check-ins</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
