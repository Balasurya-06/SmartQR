"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Wifi, ArrowRight } from "lucide-react"

export default function WiFiTemplate() {
  const [networkName, setNetworkName] = useState("")
  const [password, setPassword] = useState("")
  const [security, setSecurity] = useState("WPA")
  const [hidden, setHidden] = useState(false)
  const router = useRouter()

  const generateWiFiQR = () => {
    const prompt = `Create a WiFi QR code for network "${networkName}" with password "${password}" using ${security} security${hidden ? " (hidden network)" : ""}`

    sessionStorage.setItem("qr-prompt", prompt)
    router.push("/generate")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">WiFi QR Generator</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">WiFi QR Code</CardTitle>
              <p className="text-slate-600">Generate a QR code for automatic WiFi connection</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="network-name">Network Name (SSID) *</Label>
                <Input
                  id="network-name"
                  type="text"
                  placeholder="e.g. MyHomeWiFi"
                  value={networkName}
                  onChange={(e) => setNetworkName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter WiFi password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="security">Security Type</Label>
                <Select value={security} onValueChange={setSecurity}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">No Password</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hidden"
                  checked={hidden}
                  onChange={(e) => setHidden(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="hidden">Hidden Network</Label>
              </div>

              <Button
                onClick={generateWiFiQR}
                disabled={!networkName || !password}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Generate WiFi QR Code
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-center text-sm text-slate-500">
                <p>Users can scan this QR code to automatically connect to your WiFi network</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
