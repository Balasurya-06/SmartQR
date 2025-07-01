"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, Trash2, Eye } from "lucide-react"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    wifi: 0,
    contact: 0,
    url: 0,
    text: 0,
    today: 0,
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = () => {
    const data = JSON.parse(localStorage.getItem("qr-analytics") || "[]")
    setAnalytics(data.reverse()) // Show newest first

    // Calculate stats
    const today = new Date().toDateString()
    const todayCount = data.filter((item) => new Date(item.timestamp).toDateString() === today).length

    const typeCount = data.reduce((acc, item) => {
      acc[item.type.toLowerCase()] = (acc[item.type.toLowerCase()] || 0) + 1
      return acc
    }, {})

    setStats({
      total: data.length,
      wifi: typeCount.wifi || 0,
      contact: typeCount.contact || 0,
      url: typeCount.url || 0,
      text: typeCount.text || 0,
      today: todayCount,
    })
  }

  const clearAnalytics = () => {
    if (confirm("Are you sure you want to clear all analytics data?")) {
      localStorage.removeItem("qr-analytics")
      setAnalytics([])
      setStats({
        total: 0,
        wifi: 0,
        contact: 0,
        url: 0,
        text: 0,
        today: 0,
      })
    }
  }

  const deleteEntry = (id) => {
    const updatedAnalytics = analytics.filter((item) => item.id !== id)
    localStorage.setItem("qr-analytics", JSON.stringify(updatedAnalytics.reverse()))
    loadAnalytics()
  }

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "wifi":
        return "bg-blue-100 text-blue-800"
      case "contact":
        return "bg-green-100 text-green-800"
      case "url":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "wifi":
        return "📶"
      case "contact":
        return "👤"
      case "url":
        return "🔗"
      default:
        return "📝"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">QR Analytics</span>
              </div>
            </div>
            {analytics.length > 0 && (
              <Button variant="outline" onClick={clearAnalytics}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-600">Total QRs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.wifi}</div>
              <div className="text-sm text-slate-600">WiFi</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.contact}</div>
              <div className="text-sm text-slate-600">Contact</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.url}</div>
              <div className="text-sm text-slate-600">URLs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.text}</div>
              <div className="text-sm text-slate-600">Text</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.today}</div>
              <div className="text-sm text-slate-600">Today</div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics List */}
        {analytics.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Analytics Data</h3>
              <p className="text-slate-600 mb-6">Start generating QR codes to see your analytics here</p>
              <Button onClick={() => navigate("/")}>Generate Your First QR</Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Generated QR Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.map((item) => (
                  <div key={item.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getTypeIcon(item.type)}</span>
                        <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                        <span className="text-sm text-slate-500">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-900 font-medium mb-1">"{item.prompt}"</p>
                      <div className="text-sm text-slate-600 bg-white p-2 rounded border max-h-20 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-xs">{item.data}</pre>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
