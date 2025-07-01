import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import GeneratePage from "./pages/GeneratePage"
import AnalyticsPage from "./pages/AnalyticsPage"
import WiFiTemplate from "./pages/templates/WiFiTemplate"
import ContactTemplate from "./pages/templates/ContactTemplate"
import EventTemplate from "./pages/templates/EventTemplate"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/generate" element={<GeneratePage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/templates/wifi-qr" element={<WiFiTemplate />} />
      <Route path="/templates/contact-qr" element={<ContactTemplate />} />
      <Route path="/templates/event-qr" element={<EventTemplate />} />
    </Routes>
  )
}

export default App
