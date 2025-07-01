"use client"

import { useRef, useEffect } from "react"
import QRCode from "qrcode"

export function QRGenerator({
  data,
  size = 256,
  foregroundColor = "#000000",
  backgroundColor = "#ffffff",
  logo = null,
  logoSize = 20,
  onGenerated,
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    generateQR()
  }, [data, size, foregroundColor, backgroundColor, logo, logoSize])

  const generateQR = async () => {
    if (!data || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set canvas size
    canvas.width = size
    canvas.height = size

    try {
      // Generate QR code with high error correction
      const qrCanvas = document.createElement("canvas")
      await QRCode.toCanvas(qrCanvas, data, {
        width: size,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        margin: 2,
        errorCorrectionLevel: "H", // 30% error correction
        type: "image/png",
        quality: 0.92,
      })

      // Clear canvas and draw QR
      ctx.clearRect(0, 0, size, size)
      ctx.drawImage(qrCanvas, 0, 0)

      // Add logo with proper masking
      if (logo) {
        await addLogoToQR(ctx, logo, size, logoSize, backgroundColor, foregroundColor)
      }

      // Callback with generated data URL
      if (onGenerated) {
        onGenerated(canvas.toDataURL("image/png", 0.92))
      }
    } catch (error) {
      console.error("QR Generation Error:", error)
    }
  }

  const addLogoToQR = (ctx, logoSrc, qrSize, logoSizePercent, bgColor, fgColor) => {
    return new Promise((resolve) => {
      const logoImg = new Image()
      logoImg.crossOrigin = "anonymous"

      logoImg.onload = () => {
        // Calculate logo dimensions (max 25% of QR size for optimal scanning)
        const maxLogoSize = qrSize * 0.25
        const logoSizePixels = Math.min((logoSizePercent / 100) * qrSize, maxLogoSize)
        const x = (qrSize - logoSizePixels) / 2
        const y = (qrSize - logoSizePixels) / 2

        // Save context
        ctx.save()

        // Create background circle (slightly larger than logo)
        const padding = 6
        const bgRadius = logoSizePixels / 2 + padding
        const centerX = qrSize / 2
        const centerY = qrSize / 2

        // Draw background circle
        ctx.beginPath()
        ctx.arc(centerX, centerY, bgRadius, 0, 2 * Math.PI)
        ctx.fillStyle = bgColor
        ctx.fill()

        // Add subtle border
        ctx.beginPath()
        ctx.arc(centerX, centerY, bgRadius, 0, 2 * Math.PI)
        ctx.strokeStyle = fgColor
        ctx.lineWidth = 1
        ctx.stroke()

        // Create circular clipping mask for logo
        ctx.beginPath()
        ctx.arc(centerX, centerY, logoSizePixels / 2, 0, 2 * Math.PI)
        ctx.clip()

        // Draw logo
        ctx.drawImage(logoImg, x, y, logoSizePixels, logoSizePixels)

        // Restore context
        ctx.restore()
        resolve()
      }

      logoImg.onerror = () => {
        console.error("Failed to load logo")
        resolve()
      }

      logoImg.src = logoSrc
    })
  }

  return <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg shadow-sm" />
}
